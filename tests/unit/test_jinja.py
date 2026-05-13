from pathlib import Path

import pytest
from jinja2 import Environment


def idfn() -> list[str]:
    return [str(x) for x in Path("template").rglob("*.jinja")]


@pytest.mark.parametrize("jinja_template", Path("template").rglob("*.jinja"), ids=idfn())
def test_jinja_templates_are_valid(jinja_template: Path):
    env = Environment(autoescape=True)
    with jinja_template.open("r") as template:
        try:
            _ = env.parse(template.read())
        except Exception as e:
            raise AssertionError(f"Error in template {jinja_template}") from e
