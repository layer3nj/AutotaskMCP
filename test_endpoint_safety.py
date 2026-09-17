"""Tool arguments must never be able to steer a credentialed request."""
from autotask_mcp import _build_endpoint, _safe_entity, _check_url, _ENDPOINT_RE


def test_valid():
    assert _build_endpoint("Tickets") == "Tickets"
    assert _build_endpoint("Tickets", 123) == "Tickets/123"
    assert _build_endpoint("Companies", suffix="query") == "Companies/query"
    assert _build_endpoint("Tickets", suffix="entityInformation/fields") == "Tickets/entityInformation/fields"


def test_rejects_hostile_entity():
    for bad in ["https://evil.example", "../../x", "Tickets/../../y", "Tickets?x=1",
                "", "  ", "Tickets/query", "evil.example/x", "Tickets\nX"]:
        try:
            _build_endpoint(bad)
        except ValueError:
            continue
        raise AssertionError(f"accepted hostile entity: {bad!r}")


def test_rejects_non_numeric_id():
    for bad in ["1/../x", "abc", "1 OR 1=1"]:
        try:
            _build_endpoint("Tickets", bad)
        except (ValueError, TypeError):
            continue
        raise AssertionError(f"accepted hostile id: {bad!r}")


def test_endpoint_regex_matches_only_built_paths():
    assert _ENDPOINT_RE.match("Tickets/123")
    assert not _ENDPOINT_RE.match("https://evil.example")
    assert not _ENDPOINT_RE.match("Tickets/../x")


def test_host_pinning():
    assert _check_url("https://webservices16.autotask.net/v1.0/Tickets") is None
    assert _check_url("https://autotask.net.evil.com/x") is not None
    assert _check_url("http://webservices16.autotask.net/x") is not None


if __name__ == "__main__":
    for fn in [test_valid, test_rejects_hostile_entity, test_rejects_non_numeric_id,
               test_endpoint_regex_matches_only_built_paths, test_host_pinning]:
        fn()
    print("all endpoint safety checks passed")
