"""config.py must import cleanly whatever the environment looks like.

Every blueprint imports config at module load, and application.py builds the Flask app
at import time, so anything config raises makes the whole app unimportable — including
for tests and for the one-off scripts under setup/. It previously raised
AttributeError when ADMIN_EMAIL_ADDRESSES was unset, and left UPLOAD_FOLDER and
COOKIE_DOMAIN undefined for any unrecognised HOST_ENVIRONMENT.
"""

import importlib

import pytest

import config as config_module


@pytest.fixture
def reloaded_config(monkeypatch):
    """Reload config under a given environment, then restore it.

    load_dotenv() does not override variables already set, so monkeypatch.setenv wins
    over the repo's .env.
    """
    def load(**env):
        for key, value in env.items():
            if value is None:
                monkeypatch.delenv(key, raising=False)
            else:
                monkeypatch.setenv(key, value)
        return importlib.reload(config_module)

    yield load
    monkeypatch.undo()
    importlib.reload(config_module)


class TestEnvironmentSelection:
    @pytest.mark.parametrize('environment,upload,cookie', [
        ('docker', '/usr/joyce/static', '.joyceproject.com'),
        ('staging', '/joyce/static', '.joyce-staging.net'),
        ('production', '/joyce/static', '.joyceproject.com'),
    ])
    def test_each_environment_keeps_its_paths(self, reloaded_config, environment, upload, cookie):
        config = reloaded_config(HOST_ENVIRONMENT=environment)
        assert config.ENVIRONMENT == environment
        assert config.UPLOAD_FOLDER == upload
        assert config.COOKIE_DOMAIN == cookie

    def test_local_uploads_land_under_the_working_directory(self, reloaded_config):
        config = reloaded_config(HOST_ENVIRONMENT='local')
        assert config.UPLOAD_FOLDER.endswith('static')
        assert config.COOKIE_DOMAIN == '.localhost'

    @pytest.mark.parametrize('value', [None, '', 'nonsense'])
    def test_an_unset_or_unknown_environment_still_defines_the_paths(self, reloaded_config, value):
        # The failure this prevents is not an import error but a much later
        # AttributeError, wherever UPLOAD_FOLDER or COOKIE_DOMAIN happened to be read.
        config = reloaded_config(HOST_ENVIRONMENT=value)
        assert config.UPLOAD_FOLDER
        assert config.COOKIE_DOMAIN

    @pytest.mark.parametrize('value', [None, ''])
    def test_a_missing_environment_falls_back_to_local(self, reloaded_config, value):
        assert reloaded_config(HOST_ENVIRONMENT=value).ENVIRONMENT == 'local'


class TestAdminEmailParsing:
    @pytest.mark.parametrize('raw,expected', [
        ('one@example.com, two@example.com', ['one@example.com', 'two@example.com']),
        ('one@example.com,two@example.com', ['one@example.com', 'two@example.com']),
        ('  one@example.com  ,  two@example.com  ', ['one@example.com', 'two@example.com']),
        ('one@example.com', ['one@example.com']),
    ])
    def test_admins_are_split_on_commas_with_or_without_spaces(self, reloaded_config, raw, expected):
        assert reloaded_config(ADMIN_EMAIL_ADDRESSES=raw).ADMIN_EMAIL_ADDRESSES == expected

    @pytest.mark.parametrize('raw', ['', '   ', ',', ' , , '])
    def test_a_blank_setting_yields_no_admins_rather_than_raising(self, reloaded_config, raw):
        # Importing config used to raise AttributeError here, taking the whole app with
        # it. An empty list means nobody can authenticate as an editor, which is the
        # safe failure for a misconfigured deployment.
        assert reloaded_config(ADMIN_EMAIL_ADDRESSES=raw).ADMIN_EMAIL_ADDRESSES == []

    def test_an_unset_variable_yields_no_admins(self, reloaded_config, monkeypatch):
        # load_dotenv would otherwise repopulate this from the repo's .env.
        monkeypatch.setattr('dotenv.load_dotenv', lambda *a, **k: False)
        assert reloaded_config(ADMIN_EMAIL_ADDRESSES=None).ADMIN_EMAIL_ADDRESSES == []


class TestUploadPolicy:
    def test_allowed_extensions_cover_images_video_and_audio(self):
        assert config_module.ALLOWED_EXTENSIONS == {
            'png', 'jpg', 'jpeg', 'gif', 'mov', 'mp4', 'mp3', 'wav',
        }

    def test_the_client_allowlist_is_narrower_than_this(self):
        # src/modules/validation.js accepts only image/jpeg and image/png, so gif, mov,
        # mp4, mp3 and wav are rejected in the editor UI despite the backend storing
        # them happily. See plans/hygiene.md.
        client_side = {'jpg', 'jpeg', 'png'}
        assert client_side < config_module.ALLOWED_EXTENSIONS
