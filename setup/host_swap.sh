#!/usr/bin/env bash
#
# host_swap.sh - give the production host a swap file, as a safety net under Elasticsearch.
#
# This is a HOST change, not a container one. Nothing in docker-compose.yml can create
# swap, so of the three fixes in research/elasticsearch-production-stability.md this is
# the one that cannot live in the stack definition. Run it once, as root, on the VM.
#
# Why:
#   The production host is a 3.8GiB VM with zero swap. Between Jun 14 and Jun 21 2026
#   Elasticsearch was killed 11 times with no Java OutOfMemoryError, no heap dump and no
#   shutdown sequence — what a kernel OOM kill looks like from inside the victim. With no
#   swap the kernel has no relief valve: it goes from "memory is tight" straight to
#   killing the largest process on the box.
#
#   Capping the heap is the actual fix, and it is already in docker-compose.yml
#   (ES_JAVA_OPTS plus mem_limit). This is insurance for the case where that cap turns
#   out not to be low enough, and for everything else sharing the host.
#
# On swappiness:
#   Orthodox Elasticsearch guidance is to run without swap at all, and it is right when
#   the host has headroom, because a swapping node is a slow node. This sets
#   vm.swappiness=1 so the kernel treats swap as a genuine last resort rather than
#   routine paging. The goal is to survive a spike, not to live in swap.
#
# Usage:
#   sudo bash setup/host_swap.sh status              # report swap and swappiness, change nothing
#   sudo bash setup/host_swap.sh install             # create and enable a 2GiB swap file
#   sudo bash setup/host_swap.sh install --dry-run   # print what install would do
#
# Options:
#   --size N      swap file size in GiB (default 2)
#   --dry-run     print the commands instead of running them
#
# Safe to re-run. `install` refuses if swap is already active or the swap file already
# exists, and it appends to /etc/fstab only when no entry for the file is present, after
# taking a timestamped backup of the file.

set -euo pipefail

SWAPFILE="/swapfile"
SIZE_GIB=2
DRY_RUN=0
SYSCTL_FILE="/etc/sysctl.d/60-joyce-swappiness.conf"
SWAPPINESS=1

die() { echo "host_swap: $*" >&2; exit 1; }
note() { echo "  $*"; }

run() {
	if [ "$DRY_RUN" -eq 1 ]; then
		echo "  would run: $*"
	else
		"$@"
	fi
}

require_linux() {
	[ "$(uname -s)" = "Linux" ] || die "this configures Linux swap; run it on the VM, not on a workstation"
}

require_root() {
	[ "$(id -u)" -eq 0 ] || die "must run as root (sudo bash setup/host_swap.sh ...)"
}

show_status() {
	echo "swap devices:"
	if swapon --show --noheadings 2>/dev/null | grep -q .; then
		swapon --show | sed 's/^/  /'
	else
		note "(none)"
	fi
	echo "memory:"
	free -h | sed 's/^/  /'
	echo "swappiness:"
	note "vm.swappiness = $(cat /proc/sys/vm/swappiness)"
	echo "fstab entry:"
	if grep -qs "^${SWAPFILE}[[:space:]]" /etc/fstab; then
		grep "^${SWAPFILE}[[:space:]]" /etc/fstab | sed 's/^/  /'
	else
		note "(none)"
	fi
}

install_swap() {
	if swapon --show --noheadings 2>/dev/null | grep -q .; then
		echo "Swap is already active. Nothing to do:"
		swapon --show | sed 's/^/  /'
		return 0
	fi

	[ -e "$SWAPFILE" ] && die "$SWAPFILE already exists but is not enabled; inspect it by hand"

	local available_gib
	available_gib=$(df -BG --output=avail / | tail -1 | tr -dc '0-9')
	if [ "$available_gib" -lt $((SIZE_GIB + 5)) ]; then
		die "only ${available_gib}GiB free on /; want ${SIZE_GIB}GiB for swap plus 5GiB headroom"
	fi
	note "${available_gib}GiB free on /, allocating ${SIZE_GIB}GiB"

	if command -v fallocate >/dev/null 2>&1; then
		run fallocate -l "${SIZE_GIB}G" "$SWAPFILE"
	else
		run dd if=/dev/zero of="$SWAPFILE" bs=1M count=$((SIZE_GIB * 1024)) status=progress
	fi
	# 0600 before mkswap: a world-readable swap file exposes whatever the kernel pages out.
	run chmod 600 "$SWAPFILE"
	run mkswap "$SWAPFILE"
	run swapon "$SWAPFILE"

	if grep -qs "^${SWAPFILE}[[:space:]]" /etc/fstab; then
		note "/etc/fstab already references $SWAPFILE, leaving it alone"
	else
		run cp /etc/fstab "/etc/fstab.bak.$(date +%Y%m%d%H%M%S)"
		if [ "$DRY_RUN" -eq 1 ]; then
			echo "  would append to /etc/fstab: ${SWAPFILE} none swap sw,nofail 0 0"
		else
			printf '%s none swap sw,nofail 0 0\n' "$SWAPFILE" >> /etc/fstab
		fi
		note "persisted in /etc/fstab (nofail, so a missing swap file cannot block boot)"
	fi

	if [ "$DRY_RUN" -eq 1 ]; then
		echo "  would write $SYSCTL_FILE: vm.swappiness=${SWAPPINESS}"
	else
		printf '# Swap is a safety net for Elasticsearch, not routine paging.\n# See setup/host_swap.sh and research/elasticsearch-production-stability.md\nvm.swappiness=%s\n' \
			"$SWAPPINESS" > "$SYSCTL_FILE"
	fi
	run sysctl -q -w "vm.swappiness=${SWAPPINESS}"
	note "vm.swappiness set to ${SWAPPINESS}, persisted in $SYSCTL_FILE"

	echo
	echo "Done. Current state:"
	[ "$DRY_RUN" -eq 1 ] || show_status
}

COMMAND="${1:-status}"
shift || true
while [ $# -gt 0 ]; do
	case "$1" in
		--dry-run) DRY_RUN=1 ;;
		--size) shift; SIZE_GIB="${1:?--size needs a value in GiB}" ;;
		*) die "unknown option: $1" ;;
	esac
	shift
done

case "$COMMAND" in
	status)  require_linux; show_status ;;
	install) require_linux; require_root; install_swap ;;
	*)       die "unknown command: $COMMAND (expected: status, install)" ;;
esac
