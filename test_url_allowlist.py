"""Self-check: credentials must never be sent to a non-Autotask host."""
from autotask_mcp import _check_url


def test_allowlist():
    assert _check_url("https://webservices16.autotask.net/ATServicesRest/v1.0/Tickets") is None
    assert _check_url("https://evil.com/Tickets") is not None
    # lookalike host must not pass the suffix check
    assert _check_url("https://autotask.net.evil.com/Tickets") is not None
    assert _check_url("http://webservices16.autotask.net/Tickets") is not None


if __name__ == "__main__":
    test_allowlist()
    print("ok")
