# Vibuco

Vibuco is a visual coaching workspace for coaches, trainers, and facilitators. It combines curated photography with professional prompts to help people reflect, unblock a conversation, and shift perspective.

The repository currently contains a legacy Next.js 9 application and an approved target-state specification package for its incremental redesign. Production implementation must follow the specifications rather than infer requirements from the legacy code.

## Documentation map

- [Executive audit](docs/review/00-executive-audit.md)
- [Product charter](docs/specs/00-product-charter.md)
- [Product requirements document](docs/specs/14-product-requirements-document.md)
- [System architecture](docs/specs/05-system-architecture.md)
- [Migration plan](docs/specs/11-migration-and-redesign-plan.md)
- [Master implementation plan](docs/implementation/MASTER_IMPLEMENTATION_PLAN.md)
- [Machine-readable work items](docs/backlog/implementation-work-items.yaml)
- [OpenAPI contract](docs/api/openapi.yaml)
- [Reference data model](docs/data/reference-schema.prisma)

The historical AWS notes in `docs/authentication.md`, `docs/dynamodb.md`, and `docs/s3.md` describe the current implementation only. They are not target-state requirements.

The first executable work item is `VIB-STAB-001`. It is intentionally limited to
read-only diagnosis and production-topology documentation. Missing Netlify, DNS,
or AWS access does not prevent that task from starting.

## Source-of-truth hierarchy

When documents conflict, use this order:

1. Explicit functional and non-functional requirements
2. Domain invariants
3. API and data contracts
4. Information architecture and page contracts
5. Architecture decisions
6. Implementation plan
7. Current implementation

Open decisions marked `HUMAN-DECISION` require product-owner approval before implementation.

## Current application

The existing application uses Next.js 9, React 16, JavaScript, Tailwind CSS 1, styled-components, AWS Cognito, DynamoDB, and S3.

```bash
npm install
npm run dev
npm run build
```

There is no committed lockfile. The existing build requires a modern Node.js runtime with the repository's OpenSSL compatibility wrapper. Authentication and protected content require the environment variables documented in [authentication.md](docs/authentication.md). A build without those variables is supported for repository inspection, but authenticated flows will be unavailable.

## Target implementation

The target is a TypeScript modular monolith on the Next.js App Router. It keeps Cognito and S3 during migration, moves all privileged AWS and data access to the server, introduces a canonical PostgreSQL model, and adds an accessible session workspace plus controlled content administration.

Do not begin feature work from this README alone. Read [AGENTS.md](AGENTS.md), claim one work item, and follow its specification references and acceptance criteria.

## Validation

Run:

```bash
bash scripts/validate-specs.sh
npx prisma format --schema docs/data/reference-schema.prisma
npm run build
```

The first command creates an isolated Python environment on first use, installs
the pinned specification dependency, and validates required files, links, IDs,
work-item readiness and dependencies, OpenAPI/YAML syntax, and Mermaid sources.
