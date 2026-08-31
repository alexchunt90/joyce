"""Google sign-in: who is allowed to hold an editor token.

This is the app's one real security boundary. There is no self-serve account
creation — a Google identity is accepted only if its email appears in
config.ADMIN_EMAIL_ADDRESSES. The rest of the API trusts the resulting JWT, and the
other API tests mint one directly, so this file is the only place that boundary is
exercised.

Google's own verification is mocked throughout. What is being tested is what the app
does with a verified identity, not Google's signature checking.
"""

from unittest.mock import ANY, patch

import pytest

import config
from blueprints import google_auth

ADMIN_EMAIL = 'editor@example.com'
STRANGER_EMAIL = 'stranger@example.com'
DOC_ID = 'AWNM3N3mxgFi4og697un'


def idinfo(email, given_name='Alex'):
    """The payload Google returns for a verified ID token."""
    return {'email': email, 'sub': '1234567890', 'given_name': given_name}


def verified_as(email, given_name='Alex'):
    return patch.object(
        google_auth.id_token, 'verify_oauth2_token', return_value=idinfo(email, given_name)
    )


def set_cookies(response):
    """The Set-Cookie headers, keyed by cookie name."""
    return {
        header.split('=', 1)[0]: header
        for key, header in response.headers if key == 'Set-Cookie'
    }


class TestAdminAllowlist:
    def test_an_allowlisted_email_is_issued_a_session(self, client):
        with verified_as(ADMIN_EMAIL):
            response = client.post('/auth/token/', json={'credential': 'google-token'})
        assert response.status_code == 201
        assert response.get_json() == {'user_name': 'Alex'}

    def test_an_email_not_on_the_allowlist_is_refused(self, client):
        with verified_as(STRANGER_EMAIL):
            response = client.post('/auth/token/', json={'credential': 'google-token'})
        assert response.status_code == 401
        assert response.get_data(as_text=True) == 'Unauthorized User'

    def test_a_refused_identity_is_issued_no_cookies(self, client):
        # The important half: a rejected sign-in must not leave a usable token behind.
        with verified_as(STRANGER_EMAIL):
            response = client.post('/auth/token/', json={'credential': 'google-token'})
        assert set_cookies(response) == {}

    def test_every_allowlisted_address_is_accepted(self, client):
        # ADMIN_EMAIL_ADDRESSES is a list; a parsing change that kept only the first
        # entry would lock out every other editor.
        for email in config.ADMIN_EMAIL_ADDRESSES:
            with verified_as(email):
                response = client.post('/auth/token/', json={'credential': 'google-token'})
            assert response.status_code == 201, email

    # Sharp edge, pinned rather than fixed. `google_email in ADMIN_EMAIL_ADDRESSES` is
    # an exact string match, so capitalisation matters. Google returns addresses
    # lowercased, so this does not bite in practice — but an entry typed with any
    # capital in the ADMIN_EMAIL_ADDRESSES env var silently locks that editor out,
    # with no error anywhere explaining why. See plans/hygiene.md.
    def test_the_allowlist_match_is_case_sensitive(self, client):
        with verified_as(ADMIN_EMAIL.upper()):
            response = client.post('/auth/token/', json={'credential': 'google-token'})
        assert response.status_code == 401


class TestTokenVerification:
    def test_the_credential_is_verified_against_the_configured_client_id(self, client):
        # Without pinning the audience, a token minted for a *different* Google app
        # would verify successfully, and any Google user could present one. This is
        # the check that makes the allowlist meaningful.
        with patch.object(
            google_auth.id_token, 'verify_oauth2_token', return_value=idinfo(ADMIN_EMAIL)
        ) as verify:
            client.post('/auth/token/', json={'credential': 'google-token'})

        verify.assert_called_once_with('google-token', ANY, config.GOOGLE_AUTH_CLIENT_ID)

    def test_a_rejected_google_token_never_reaches_the_allowlist_check(self, client):
        # google-auth raises ValueError for an expired, forged or wrong-audience token.
        # The route has no handler, so it propagates — see TestErrorHandling.
        with patch.object(
            google_auth.id_token, 'verify_oauth2_token', side_effect=ValueError('Token expired')
        ):
            with pytest.raises(ValueError):
                client.post('/auth/token/', json={'credential': 'expired-token'})


class TestSessionCookies:
    @pytest.fixture
    def signed_in(self, client):
        with verified_as(ADMIN_EMAIL):
            return client.post('/auth/token/', json={'credential': 'google-token'})

    def test_all_three_session_cookies_are_set(self, signed_in):
        assert set(set_cookies(signed_in)) == {
            'user_name', 'access_token_cookie', 'refresh_token_cookie',
        }

    @pytest.mark.parametrize('cookie', ['access_token_cookie', 'refresh_token_cookie'])
    def test_jwt_cookies_are_httponly(self, signed_in, cookie):
        # Scripts must not be able to read the tokens themselves.
        assert 'HttpOnly' in set_cookies(signed_in)[cookie]

    def test_the_user_name_cookie_is_readable_by_scripts(self, signed_in):
        # Deliberate: src/joyce.js reads document.cookie for user_name to restore the
        # editor's session on load. It carries a display name, not a credential.
        assert 'HttpOnly' not in set_cookies(signed_in)['user_name']

    def test_the_user_name_cookie_carries_the_google_given_name(self, client):
        with verified_as(ADMIN_EMAIL, given_name='Alexander'):
            response = client.post('/auth/token/', json={'credential': 'google-token'})
        assert 'user_name=Alexander' in set_cookies(response)['user_name']

    @pytest.mark.parametrize('cookie', ['access_token_cookie', 'refresh_token_cookie'])
    def test_jwt_cookies_are_samesite_lax(self, signed_in, cookie):
        assert 'SameSite=Lax' in set_cookies(signed_in)[cookie]


class TestLogout:
    def test_logout_succeeds_without_a_session(self, client):
        assert client.post('/auth/logout/').status_code == 200

    def test_logout_clears_every_session_cookie(self, client):
        cookies = set_cookies(client.post('/auth/logout/'))
        assert set(cookies) == {'user_name', 'access_token_cookie', 'refresh_token_cookie'}
        for header in cookies.values():
            assert 'Expires=Thu, 01 Jan 1970' in header


class TestTheIssuedTokenWorks:
    """End to end: the token this route issues must actually open the write routes."""

    def test_signing_in_grants_access_to_a_write_route(self, app):
        signed_in_client = app.test_client()
        with verified_as(ADMIN_EMAIL):
            response = signed_in_client.post('/auth/token/', json={'credential': 'google-token'})
        assert response.status_code == 201

        # The test client keeps the cookies from that response.
        assert signed_in_client.put('/api/notes/', json={'title': 'New note'}).status_code == 200

    def test_a_refused_sign_in_grants_nothing(self, app):
        refused_client = app.test_client()
        with verified_as(STRANGER_EMAIL):
            refused_client.post('/auth/token/', json={'credential': 'google-token'})

        assert refused_client.put('/api/notes/', json={'title': 'New note'}).status_code == 401


class TestErrorHandling:
    """Malformed sign-in requests crash rather than returning a client error.

    Neither case is a security hole — no token is issued either way — but both surface
    as a 500 rather than a 400 or 401, which is misleading to the client and noisy in
    the logs. Pinned as current behaviour; see plans/hygiene.md.
    """

    def test_a_body_without_a_credential_raises(self, client):
        with pytest.raises(KeyError):
            client.post('/auth/token/', json={'not_a_credential': 'x'})

    def test_a_body_that_is_not_json_raises(self, client):
        with pytest.raises(Exception):
            client.post('/auth/token/', data='not json at all')

    def test_a_verified_identity_missing_given_name_raises(self, client):
        # given_name is optional in a Google ID token; the route indexes it directly.
        with patch.object(
            google_auth.id_token, 'verify_oauth2_token',
            return_value={'email': ADMIN_EMAIL, 'sub': '123'},
        ):
            with pytest.raises(KeyError):
                client.post('/auth/token/', json={'credential': 'google-token'})
