import argparse
import json
import subprocess
from pathlib import Path


def extract_version(path: Path | str = "package.json") -> str:
    with Path(path).open() as f:
        return json.load(f)["version"]


def ensure_tag_not_present(tag: str, remote: str) -> None:
    try:
        _ = subprocess.run(  # noqa: S603 # trusted input — our own arguments
            ["git", "ls-remote", "--exit-code", "--tags", remote, f"refs/tags/{tag}"],  # noqa: S607 # git must be in PATH
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        raise Exception(f"Error: tag '{tag}' exists on remote '{remote}'")  # noqa: TRY002,TRY003 # not worth a custom exception
    except subprocess.CalledProcessError:
        return


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Extract the version from a package.json file, "
            "confirm that git tag v<version> is not present, or "
            "create and push the tag to a remote."
        )
    )
    _ = parser.add_argument(
        "file",
        nargs="?",
        default="package.json",
        help="Path to package.json (default: package.json)",
    )
    _ = parser.add_argument(
        "--confirm-tag-not-present",
        action="store_true",
        help="Check that git tag v<version> is NOT present on the remote. Exit with error if it exists.",
    )
    _ = parser.add_argument(
        "--push-tag-to-remote",
        action="store_true",
        help="Create git tag v<version> locally and push it to the remote.",
    )
    _ = parser.add_argument(
        "--remote",
        default="origin",
        help="Name of git remote to query/push (default: origin)",
    )
    args = parser.parse_args()

    ver = extract_version(args.file)
    tag = f"v{ver}"

    if args.push_tag_to_remote:
        ensure_tag_not_present(tag, args.remote)
        _ = subprocess.run(["git", "tag", tag], check=True)  # noqa: S603,S607
        _ = subprocess.run(["git", "push", args.remote, tag], check=True)  # noqa: S603,S607
        return

    if args.confirm_tag_not_present:
        ensure_tag_not_present(tag, args.remote)
        return

    print(ver)  # noqa: T201 # stdout consumed by CI pipelines


if __name__ == "__main__":
    main()
