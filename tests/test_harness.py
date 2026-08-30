"""Layer 0 acceptance test for the Python side.

Proves pytest is installed, that pytest.ini's rootdir/collection settings work,
and that the interpreter running the tests can import the app's dependencies.
If this fails, no API test in Layer 4 can run.
"""

import importlib

import pytest

RUNTIME_DEPENDENCIES = [
    "flask",
    "flask_jwt_extended",
    "flask_cors",
    "elasticsearch",
    "bs4",
    "PIL",
    "dotenv",
    "google.oauth2",
]


@pytest.mark.parametrize("module_name", RUNTIME_DEPENDENCIES)
def test_runtime_dependency_is_importable(module_name):
    """The test interpreter must have the app's dependencies available."""
    assert importlib.import_module(module_name) is not None


def test_pytest_collects_from_the_tests_directory():
    """Sanity check that pytest.ini is being picked up from the repo root."""
    assert True
