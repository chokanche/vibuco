#!/usr/bin/env python3
"""Validate the Vibuco specification package without mutating the repository."""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "docs/review/00-executive-audit.md",
    "docs/review/01-product-audit.md",
    "docs/review/02-ux-ui-audit.md",
    "docs/review/03-technical-audit.md",
    "docs/review/04-seo-performance-accessibility-audit.md",
    "docs/review/05-risk-and-debt-register.md",
    *[f"docs/specs/{name}" for name in [
        "00-product-charter.md",
        "01-functional-requirements.md",
        "02-information-architecture.md",
        "03-ux-ui-content.md",
        "04-domain-data-model.md",
        "05-system-architecture.md",
        "06-api-contracts.md",
        "07-search-and-ranking.md",
        "08-seo-content-analytics.md",
        "09-trust-security-privacy.md",
        "10-testing-quality-observability.md",
        "11-migration-and-redesign-plan.md",
        "12-acceptance-test-matrix.md",
        "13-architecture-decisions.md",
        "14-product-requirements-document.md",
        "15-design-system-interaction.md",
        "16-admin-content-operations.md",
        "17-observability-reliability.md",
        "18-delivery-cicd-environments.md",
        "19-content-ingestion-and-automation.md",
        "20-system-flows-diagrams.md",
        "21-non-functional-requirements-slos.md",
    ]],
    "docs/api/openapi.yaml",
    "docs/data/reference-schema.prisma",
    "docs/data/data-dictionary.md",
    "docs/backlog/implementation-work-items.yaml",
    "docs/implementation/MASTER_IMPLEMENTATION_PLAN.md",
    "docs/operations/production-access-ownership.md",
    "requirements-specs.txt",
    "scripts/validate-specs.sh",
]

REQUIRED_DIAGRAMS = [
    "current-system-context.mmd",
    "target-system-context.mmd",
    "target-container-architecture.mmd",
    "core-component-architecture.mmd",
    "primary-user-journey.mmd",
    "main-request-sequence.mmd",
    "data-model-overview.mmd",
    "content-ingestion-flow.mmd",
    "authentication-authorization-flow.mmd",
    "admin-publication-flow.mmd",
    "observability-flow.mmd",
    "deployment-topology.mmd",
    "incident-response.mmd",
    "migration-flow.mmd",
]

WORK_ITEM_KEYS = {
    "id",
    "epic",
    "title",
    "purpose",
    "specification_references",
    "dependencies",
    "likely_files",
    "acceptance_criteria",
    "testing_requirements",
    "observability_requirements",
    "security_requirements",
    "accessibility_requirements",
    "complexity",
    "estimated_effort",
    "suggested_owner",
    "branch_name",
    "commit_prefix",
    "milestone",
    "status",
}


class Validation:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.checks: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def ok(self, message: str) -> None:
        self.checks.append(message)


def validate_required_files(result: Validation) -> None:
    missing = [path for path in REQUIRED_FILES if not (ROOT / path).is_file()]
    missing += [
        f"docs/diagrams/{name}"
        for name in REQUIRED_DIAGRAMS
        if not (ROOT / "docs/diagrams" / name).is_file()
    ]
    if missing:
        result.error(f"Missing required files: {', '.join(missing)}")
    else:
        result.ok(f"required files ({len(REQUIRED_FILES) + len(REQUIRED_DIAGRAMS)})")


def validate_markdown_links(result: Validation) -> None:
    broken: list[str] = []
    link_pattern = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
    for path in [ROOT / "README.md", ROOT / "AGENTS.md", *ROOT.glob("docs/**/*.md")]:
        text = path.read_text(encoding="utf-8")
        for raw_target in link_pattern.findall(text):
            target = raw_target.strip().split()[0].strip("<>")
            if (
                not target
                or target.startswith(("#", "http://", "https://", "mailto:"))
            ):
                continue
            target = target.split("#", 1)[0]
            resolved = (path.parent / target).resolve()
            if not resolved.exists():
                broken.append(f"{path.relative_to(ROOT)} -> {raw_target}")
    if broken:
        result.error("Broken relative links: " + "; ".join(broken))
    else:
        result.ok("relative Markdown links")


def validate_requirement_ids(result: Validation) -> None:
    definition_pattern = re.compile(
        r"^\|\s*((?:PRD|FR|UX|DATA|API|SEC|SEO|OBS|NFR|MIG|OPS)-\d{3})\s*\|",
        re.MULTILINE,
    )
    definitions: list[str] = []
    for path in ROOT.glob("docs/**/*.md"):
        definitions.extend(definition_pattern.findall(path.read_text(encoding="utf-8")))
    counts = Counter(definitions)
    duplicates = sorted(identifier for identifier, count in counts.items() if count > 1)
    if duplicates:
        result.error("Duplicate requirement definitions: " + ", ".join(duplicates))
    if not definitions:
        result.error("No requirement definitions found")
    matrix = (ROOT / "docs/specs/12-acceptance-test-matrix.md").read_text(
        encoding="utf-8"
    )
    missing_prd = sorted(
        identifier
        for identifier in definitions
        if identifier.startswith("PRD-") and identifier not in matrix
    )
    if missing_prd:
        result.error(
            "Product requirements missing from acceptance matrix: "
            + ", ".join(missing_prd)
        )
    if not duplicates and definitions and not missing_prd:
        result.ok(f"unique requirement definitions ({len(definitions)})")


def validate_yaml_and_work_items(result: Validation) -> None:
    backlog_path = ROOT / "docs/backlog/implementation-work-items.yaml"
    try:
        backlog = yaml.safe_load(backlog_path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        result.error(f"Backlog YAML parse failed: {exc}")
        return

    items = backlog.get("items", []) if isinstance(backlog, dict) else []
    declared_statuses = set(backlog.get("statuses", [])) if isinstance(backlog, dict) else set()
    expected_statuses = {"planned", "ready", "in_progress", "blocked", "done"}
    if declared_statuses != expected_statuses:
        result.error(
            "Backlog statuses must be exactly: " + ", ".join(sorted(expected_statuses))
        )
    ids = [item.get("id") for item in items if isinstance(item, dict)]
    duplicates = sorted(identifier for identifier, count in Counter(ids).items() if count > 1)
    if duplicates:
        result.error("Duplicate work-item IDs: " + ", ".join(duplicates))
    id_set = set(ids)
    branches: list[str] = []
    for item in items:
        missing = WORK_ITEM_KEYS - set(item)
        if missing:
            result.error(f"{item.get('id')} missing fields: {sorted(missing)}")
        for dependency in item.get("dependencies", []):
            if dependency not in id_set:
                result.error(f"{item.get('id')} has unknown dependency {dependency}")
        for reference in item.get("specification_references", []):
            if not (ROOT / reference).is_file():
                result.error(f"{item.get('id')} has missing specification {reference}")
        status = item.get("status")
        if status not in expected_statuses:
            result.error(f"{item.get('id')} has invalid status {status!r}")
        branch = item.get("branch_name")
        if branch:
            branches.append(branch)
        if status == "ready":
            incomplete_dependencies = [
                dependency
                for dependency in item.get("dependencies", [])
                if next(
                    (
                        candidate.get("status")
                        for candidate in items
                        if candidate.get("id") == dependency
                    ),
                    None,
                )
                != "done"
            ]
            if incomplete_dependencies:
                result.error(
                    f"{item.get('id')} is ready with incomplete dependencies: "
                    + ", ".join(incomplete_dependencies)
                )

    duplicate_branches = sorted(
        branch for branch, count in Counter(branches).items() if count > 1
    )
    if duplicate_branches:
        result.error("Duplicate work-item branches: " + ", ".join(duplicate_branches))

    unfinished = [item for item in items if item.get("status") != "done"]
    executable = [
        item
        for item in unfinished
        if item.get("status") in {"ready", "in_progress"}
    ]
    if unfinished and not executable:
        result.error(
            "Unfinished backlog has no ready or in_progress work item"
        )

    visiting: set[str] = set()
    visited: set[str] = set()
    graph = {item["id"]: item.get("dependencies", []) for item in items}

    def visit(identifier: str, stack: list[str]) -> None:
        if identifier in visiting:
            result.error("Circular work-item dependency: " + " -> ".join(stack + [identifier]))
            return
        if identifier in visited:
            return
        visiting.add(identifier)
        for dependency in graph.get(identifier, []):
            visit(dependency, stack + [identifier])
        visiting.remove(identifier)
        visited.add(identifier)

    for identifier in graph:
        visit(identifier, [])

    if not duplicates and len(ids) == len(id_set) and not any(
        "work-item" in error.lower() or "dependency" in error.lower()
        for error in result.errors
    ):
        result.ok(
            f"work items, readiness, references, and acyclic dependencies ({len(items)})"
        )

    openapi_path = ROOT / "docs/api/openapi.yaml"
    try:
        openapi = yaml.safe_load(openapi_path.read_text(encoding="utf-8"))
        if not str(openapi.get("openapi", "")).startswith("3.1"):
            result.error("OpenAPI document is not version 3.1")
        elif not openapi.get("paths") or not openapi.get("components"):
            result.error("OpenAPI document lacks paths or components")
        else:
            result.ok("OpenAPI YAML parse and top-level structure")
    except (yaml.YAMLError, AttributeError) as exc:
        result.error(f"OpenAPI YAML parse failed: {exc}")


def validate_prisma(result: Validation) -> None:
    path = ROOT / "docs/data/reference-schema.prisma"
    text = path.read_text(encoding="utf-8")
    models = re.findall(r"^model\s+(\w+)\s*\{", text, re.MULTILINE)
    enums = re.findall(r"^enum\s+(\w+)\s*\{", text, re.MULTILINE)
    duplicate_models = sorted(name for name, count in Counter(models).items() if count > 1)
    if text.count("{") != text.count("}"):
        result.error("Prisma schema has unbalanced braces")
    elif duplicate_models or not models:
        result.error("Prisma schema has missing/duplicate models: " + ", ".join(duplicate_models))
    else:
        result.ok(f"Prisma structural consistency ({len(models)} models, {len(enums)} enums)")


def validate_mermaid(result: Validation) -> None:
    allowed = ("flowchart", "sequenceDiagram", "erDiagram", "stateDiagram", "graph")
    failures: list[str] = []
    for name in REQUIRED_DIAGRAMS:
        path = ROOT / "docs/diagrams" / name
        text = path.read_text(encoding="utf-8").strip()
        first = text.splitlines()[0] if text else ""
        if not first.startswith(allowed):
            failures.append(f"{name}: unsupported/missing diagram declaration")
        if first.startswith(("flowchart", "graph")):
            subgraphs = len(re.findall(r"^\s*subgraph\b", text, re.MULTILINE))
            ends = len(re.findall(r"^\s*end\s*$", text, re.MULTILINE))
            if subgraphs != ends:
                failures.append(f"{name}: subgraph/end mismatch")
    if failures:
        result.error("Mermaid plausibility failed: " + "; ".join(failures))
    else:
        result.ok(f"Mermaid source plausibility ({len(REQUIRED_DIAGRAMS)})")


def validate_style(result: Validation) -> None:
    paths = [ROOT / "README.md", ROOT / "AGENTS.md", *ROOT.glob("docs/**/*")]
    offenders = []
    for path in paths:
        if path.is_file() and path.suffix in {".md", ".yaml", ".yml", ".mmd"}:
            if "\u2014" in path.read_text(encoding="utf-8"):
                offenders.append(str(path.relative_to(ROOT)))
    if offenders:
        result.error("Em dash found in: " + ", ".join(offenders))
    else:
        result.ok("report style constraint (no em dash)")


def main() -> int:
    result = Validation()
    validate_required_files(result)
    validate_markdown_links(result)
    validate_requirement_ids(result)
    validate_yaml_and_work_items(result)
    validate_prisma(result)
    validate_mermaid(result)
    validate_style(result)

    for check in result.checks:
        print(f"PASS: {check}")
    for error in result.errors:
        print(f"FAIL: {error}", file=sys.stderr)
    print(f"{len(result.checks)} checks passed; {len(result.errors)} failed")
    return 1 if result.errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
