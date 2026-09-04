#!/usr/bin/env bash
#
# prod_snapshot.sh - replicate the production backups onto this machine for local testing.
#
# Production is backed up daily to two S3 buckets:
#   s3://joyce-snapshot  - the Elasticsearch snapshot repository, written by Kibana's
#                          Snapshot feature.
#   s3://joyceimages     - the uploaded media files, written by an `aws s3 sync` cron job.
#
# This script pulls both down and loads them into the local stack.
#
# It never writes to S3. Every AWS call it makes goes through s3_read() below, which
# builds its own argument list: the bucket is only ever named as a source, the
# destination is asserted to be a local path, and no write verb (cp to a bucket, rm, mv,
# rb, --delete) appears anywhere in this file. The local Elasticsearch is likewise never
# pointed at the bucket - it restores from the downloaded copy, through a repository
# registered `readonly`, so there is no path by which a local restore, a stray Kibana
# click, or a bug in this script can reach a production backup.
#
# Usage:
#   sh setup/prod_snapshot.sh all             # pull, then restore both into the local stack
#   sh setup/prod_snapshot.sh pull            # download only (no local changes)
#   sh setup/prod_snapshot.sh list            # show the snapshots in the local mirror
#   sh setup/prod_snapshot.sh restore-es      # load a snapshot into local Elasticsearch
#   sh setup/prod_snapshot.sh restore-media   # copy media files into ./static
#
# Options:
#   --dry-run            show what would be transferred, change nothing
#   --snapshot NAME      restore a specific snapshot instead of the most recent
#   --yes                skip the confirmation prompt before replacing local indices

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

ES_BUCKET="joyce-snapshot"
MEDIA_BUCKET="joyceimages"
AWS_REGION="${AWS_DEFAULT_REGION:-us-east-2}"

SNAPSHOT_MIRROR="$REPO_ROOT/backups/elasticsearch"
MEDIA_MIRROR="$REPO_ROOT/backups/static"

# Where docker-compose.yml mounts SNAPSHOT_MIRROR inside the elasticsearch container.
CONTAINER_REPO_PATH="/mnt/snapshots"
ES_REPO_NAME="prod_mirror"

# The six document-type indices the app uses. Restoring by name keeps Kibana's own
# system indices, and production's security state, out of the local cluster.
INDICES="chapters,notes,info,tags,editions,media"

# The media bucket mirrors the whole of production's ./static, which includes its
# webpack output. Locally, static/js belongs to `npm run watch` / `npm run build` -
# templates/joyce.html reads the manifest.json there - so it is never overwritten.
MEDIA_EXCLUDES=(js .DS_Store)

DRY_RUN=0
ASSUME_YES=0
SNAPSHOT_NAME=""

log()  { printf '\033[1m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[33mwarning:\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31merror:\033[0m %s\n' "$*" >&2; exit 1; }

require_cmd() {
	for cmd in "$@"; do
		command -v "$cmd" >/dev/null 2>&1 || die "$cmd is not installed or not on PATH"
	done
}

load_env() {
	[ -f "$REPO_ROOT/.env" ] || die "no .env in $REPO_ROOT"
	set -a
	# shellcheck disable=SC1091
	. "$REPO_ROOT/.env"
	set +a
	for var in "$@"; do
		eval "value=\${$var:-}"
		[ -n "$value" ] || die "$var is not set in .env"
	done
}

confirm() {
	[ "$ASSUME_YES" -eq 1 ] && return 0
	[ -t 0 ] || die "$1 (re-run with --yes to confirm non-interactively)"
	printf '%s [y/N] ' "$1"
	read -r reply
	case "$reply" in
		[yY]|[yY][eE][sS]) return 0 ;;
		*) die "aborted" ;;
	esac
}

# --- S3 ----------------------------------------------------------------------------
#
# The only place this script invokes `aws`. Callers pass a bucket, a local destination
# and a key pair; they cannot pass flags or reverse the direction of transfer.

assert_read_only() {
	local bucket="$1" dest="$2"
	case "$bucket" in
		"$ES_BUCKET"|"$MEDIA_BUCKET") ;;
		*) die "refusing to touch a bucket this script does not know: $bucket" ;;
	esac
	case "$dest" in
		s3://*) die "refusing to use an S3 URI as a destination: $dest" ;;
		"$REPO_ROOT"/*) ;;
		*) die "refusing to write outside the repository: $dest" ;;
	esac
}

s3_read() {
	local verb="$1" bucket="$2" dest="$3" access_key="$4" secret_key="$5"
	assert_read_only "$bucket" "$dest"

	local -a args
	case "$verb" in
		# `ls` proves the credentials work before a long transfer starts.
		ls)   args=(s3 ls "s3://$bucket/" --page-size 1) ;;
		# Bucket first, local path second: downloads, always. --exact-timestamps
		# re-fetches any file whose timestamp differs at all, rather than only when
		# the remote copy is larger or newer. The repository's index.latest is a
		# fixed 8 bytes that changes content on every snapshot, which is precisely
		# the file the default comparison can decide to skip.
		sync) args=(s3 sync "s3://$bucket/" "$dest/" --no-progress --exact-timestamps) ;;
		# A single object, by key, into a local file.
		cp)   args=(s3 cp "s3://$bucket/$6" "$dest" --no-progress) ;;
		*)    die "internal: unknown s3 verb $verb" ;;
	esac
	if [ "$DRY_RUN" -eq 1 ] && [ "$verb" != "ls" ]; then
		args+=(--dryrun)
	fi

	AWS_ACCESS_KEY_ID="$access_key" \
	AWS_SECRET_ACCESS_KEY="$secret_key" \
	AWS_SESSION_TOKEN="" \
	AWS_DEFAULT_REGION="$AWS_REGION" \
	aws "${args[@]}"
}

# --- pull --------------------------------------------------------------------------

# `aws s3 sync` writes each object to a temporary file inside its target directory, so
# a single directory owned by another user aborts the entire sync with Errno 13 - after
# it has already transferred everything else, and with the cause buried under a hundred
# lines of per-object output. An earlier run of backups/joyce_backup.sh under root left
# exactly that behind. Check it up front and say how to fix it.
require_writable_mirror() {
	local dir="$1"
	[ -d "$dir" ] || return 0

	local blocked
	blocked="$(find "$dir" -type d ! -user "$(id -un)" 2>/dev/null | while IFS= read -r d; do
		[ -w "$d" ] || printf '%s\n' "$d"
	done)"
	[ -n "$blocked" ] || return 0

	warn "$(printf '%s\n' "$blocked" | wc -l | tr -d ' ') directories in the mirror are not writable by $(id -un):"
	printf '%s\n' "$blocked" | sed 's/^/    /' >&2
	die "fix with:  sudo chown -R $(id -un):staff $dir"
}

pull_snapshots() {
	log "Mirroring s3://$ES_BUCKET -> backups/elasticsearch"
	mkdir -p "$SNAPSHOT_MIRROR"
	require_writable_mirror "$SNAPSHOT_MIRROR"
	s3_read ls   "$ES_BUCKET" "$SNAPSHOT_MIRROR" "$ES_S3_ACCESS_KEY" "$ES_S3_SECRET_KEY" >/dev/null \
		|| die "could not read s3://$ES_BUCKET - check ES_S3_ACCESS_KEY/ES_S3_SECRET_KEY"
	s3_read sync "$ES_BUCKET" "$SNAPSHOT_MIRROR" "$ES_S3_ACCESS_KEY" "$ES_S3_SECRET_KEY"

	# Re-fetch the generation pointer unconditionally, after the sync. index.latest is
	# a fixed 8 bytes whose contents change on every snapshot, so `aws s3 sync` can
	# decide it is unchanged and skip it - backups/elasticsearch has been sitting on a
	# February 2025 pointer over October 2025 data. Elasticsearch recovers from that on
	# its own (it scans the index-N blobs and takes the highest generation), so this is
	# belt and braces rather than the thing standing between you and a stale restore.
	if [ "$DRY_RUN" -eq 0 ]; then
		log "Refreshing the repository generation pointer"
		s3_read cp "$ES_BUCKET" "$SNAPSHOT_MIRROR/index.latest" \
			"$ES_S3_ACCESS_KEY" "$ES_S3_SECRET_KEY" index.latest
		check_mirror_generation
	fi
}

# index.latest holds the current repository generation as an 8-byte big-endian integer,
# and should name the highest index-N file in the mirror - `aws s3 sync` never deletes,
# so superseded generations pile up beside it. A disagreement is worth reporting but is
# not fatal: Elasticsearch falls back to scanning the index-N blobs, which is how the
# mirror restored correctly while its pointer read generation 4 next to index-238.
check_mirror_generation() {
	local pointer="$SNAPSHOT_MIRROR/index.latest"
	[ -f "$pointer" ] || die "no index.latest in $SNAPSHOT_MIRROR - the mirror is incomplete"

	local hex generation highest
	hex="$(od -An -tx1 -N8 "$pointer" | tr -d ' \n')"
	generation="$((16#$hex))"
	highest="$(ls "$SNAPSHOT_MIRROR"/index-* 2>/dev/null | sed 's/.*index-//' | sort -n | tail -1)"

	if [ -n "$highest" ] && [ "$generation" -lt "$highest" ]; then
		warn "index.latest points at generation $generation while index-$highest is present."
		warn "Elasticsearch will use $highest anyway; run 'pull' to refresh the pointer."
		generation="$highest"
	fi
	log "Repository generation $generation"
}

pull_media() {
	log "Mirroring s3://$MEDIA_BUCKET -> backups/static"
	mkdir -p "$MEDIA_MIRROR"
	require_writable_mirror "$MEDIA_MIRROR"
	s3_read ls   "$MEDIA_BUCKET" "$MEDIA_MIRROR" "$IMAGE_S3_ACCESS_KEY" "$IMAGE_S3_SECRET_KEY" >/dev/null \
		|| die "could not read s3://$MEDIA_BUCKET - check IMAGE_S3_ACCESS_KEY/IMAGE_S3_SECRET_KEY"
	s3_read sync "$MEDIA_BUCKET" "$MEDIA_MIRROR" "$IMAGE_S3_ACCESS_KEY" "$IMAGE_S3_SECRET_KEY"
}

# --- local Elasticsearch -----------------------------------------------------------

es_curl() {
	docker compose exec -T elasticsearch \
		curl -sS -u "elastic:${ELASTIC_USER_PASSWORD}" \
		-H 'Content-Type: application/json' "$@"
}

es_check_response() {
	case "$1" in
		*'"error"'*) die "Elasticsearch rejected the request: $1" ;;
	esac
}

require_local_es() {
	docker compose ps --services --filter status=running 2>/dev/null | grep -qx elasticsearch \
		|| die "the elasticsearch service is not running - start it with 'docker compose up -d'"
	docker compose exec -T elasticsearch test -f "$CONTAINER_REPO_PATH/index.latest" 2>/dev/null \
		|| die "$CONTAINER_REPO_PATH is empty inside the container. docker-compose.yml mounts backups/elasticsearch there; run 'docker compose up -d elasticsearch' to pick up the mount, and 'pull' first if the mirror is empty."
}

register_repository() {
	# readonly:true is what makes this safe to point at a copy of the production
	# repository: Elasticsearch will serve restores from it and refuse to create or
	# delete a snapshot in it. The mount is :ro as well.
	local response
	response="$(es_curl -X PUT "localhost:9200/_snapshot/$ES_REPO_NAME" -d "{
		\"type\": \"fs\",
		\"settings\": {
			\"location\": \"$CONTAINER_REPO_PATH\",
			\"readonly\": true
		}
	}")"
	es_check_response "$response"
}

latest_snapshot() {
	es_curl "localhost:9200/_cat/snapshots/$ES_REPO_NAME?h=id,status,end_epoch&s=end_epoch" \
		| awk '$2 == "SUCCESS" { name = $1 } END { print name }'
}

list_snapshots() {
	require_local_es
	register_repository
	log "Snapshots in the local mirror (oldest first)"
	es_curl "localhost:9200/_cat/snapshots/$ES_REPO_NAME?h=id,status,end_time,indices&s=end_epoch&v"
}

restore_es() {
	require_local_es
	register_repository

	local snapshot="$SNAPSHOT_NAME"
	if [ -z "$snapshot" ]; then
		snapshot="$(latest_snapshot)"
		[ -n "$snapshot" ] || die "no successful snapshot found in the mirror - run 'pull' first"
	fi
	log "Restoring snapshot: $snapshot"

	if [ "$DRY_RUN" -eq 1 ]; then
		log "(dry run) would replace local indices $INDICES from $snapshot"
		return 0
	fi

	confirm "This deletes the local $INDICES indices and replaces them with production data. Continue?"

	# A snapshot cannot be restored over an open index, and these are local test
	# indices - production is untouched by anything below.
	local response
	response="$(es_curl -X DELETE "localhost:9200/$INDICES?ignore_unavailable=true")"
	es_check_response "$response"

	# include_global_state:false keeps production's cluster settings, templates and
	# security realm out of the local cluster. number_of_replicas:0 matches
	# setup/es_config.py and keeps a single-node cluster green.
	response="$(es_curl -X POST "localhost:9200/_snapshot/$ES_REPO_NAME/$snapshot/_restore?wait_for_completion=true" -d "{
		\"indices\": \"$INDICES\",
		\"ignore_unavailable\": true,
		\"include_global_state\": false,
		\"include_aliases\": false,
		\"index_settings\": { \"index.number_of_replicas\": 0 }
	}")"
	es_check_response "$response"

	log "Restored. Local document counts:"
	es_curl "localhost:9200/_cat/indices/$INDICES?h=index,docs.count,store.size&v"
}

# --- local media -------------------------------------------------------------------

restore_media() {
	[ -d "$MEDIA_MIRROR" ] || die "no media mirror at $MEDIA_MIRROR - run 'pull' first"

	# --stats rather than --info=stats1: macOS still ships rsync 2.6.9.
	local -a flags=(-a --stats)
	for excluded in "${MEDIA_EXCLUDES[@]}"; do
		flags+=(--exclude "$excluded")
	done
	# No --delete: additive, so media uploaded through the local editor survives.
	[ "$DRY_RUN" -eq 1 ] && flags+=(--dry-run)

	log "Copying media into ./static (excluding ${MEDIA_EXCLUDES[*]})"
	rsync "${flags[@]}" "$MEDIA_MIRROR/" "$REPO_ROOT/static/"
}

# --- entry point -------------------------------------------------------------------

usage() {
	sed -n '3,26p' "$0" | sed 's/^# \{0,1\}//'
	exit "${1:-0}"
}

COMMAND=""
while [ $# -gt 0 ]; do
	case "$1" in
		pull|list|restore-es|restore-media|all) COMMAND="$1"; shift ;;
		--dry-run) DRY_RUN=1; shift ;;
		--yes|-y)  ASSUME_YES=1; shift ;;
		--snapshot) SNAPSHOT_NAME="${2:-}"; [ -n "$SNAPSHOT_NAME" ] || die "--snapshot needs a name"; shift 2 ;;
		-h|--help) usage 0 ;;
		*) die "unknown argument: $1 (try --help)" ;;
	esac
done

case "$COMMAND" in
	pull)
		require_cmd aws
		load_env ES_S3_ACCESS_KEY ES_S3_SECRET_KEY IMAGE_S3_ACCESS_KEY IMAGE_S3_SECRET_KEY
		pull_snapshots
		pull_media
		;;
	list)
		require_cmd docker
		load_env ELASTIC_USER_PASSWORD
		list_snapshots
		;;
	restore-es)
		require_cmd docker
		load_env ELASTIC_USER_PASSWORD
		check_mirror_generation
		restore_es
		;;
	restore-media)
		require_cmd rsync
		restore_media
		;;
	all)
		require_cmd aws docker rsync
		load_env ES_S3_ACCESS_KEY ES_S3_SECRET_KEY IMAGE_S3_ACCESS_KEY IMAGE_S3_SECRET_KEY ELASTIC_USER_PASSWORD
		pull_snapshots
		pull_media
		restore_es
		restore_media
		;;
	*)
		usage 1
		;;
esac
