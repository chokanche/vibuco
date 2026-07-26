# System flows and diagrams

Standalone Mermaid sources are authoritative for system topology and sequence. Markdown specifications provide the requirements behind them.

| Diagram | Purpose |
| --- | --- |
| [Current system context](../diagrams/current-system-context.mmd) | Legacy browser-to-AWS boundary |
| [Target system context](../diagrams/target-system-context.mmd) | Actors and target systems |
| [Target container architecture](../diagrams/target-container-architecture.mmd) | Deployable/runtime containers |
| [Core component architecture](../diagrams/core-component-architecture.mmd) | Module dependencies |
| [Primary user journey](../diagrams/primary-user-journey.mmd) | Visitor to completed session |
| [Main request sequence](../diagrams/main-request-sequence.mmd) | Authenticated deck load |
| [Data model overview](../diagrams/data-model-overview.mmd) | Core relational model |
| [Content ingestion flow](../diagrams/content-ingestion-flow.mmd) | Asset quarantine to eligibility |
| [Authentication flow](../diagrams/authentication-authorization-flow.mmd) | Cognito code flow and entitlement |
| [Admin publication flow](../diagrams/admin-publication-flow.mmd) | Review, publish, cache, rollback |
| [Observability flow](../diagrams/observability-flow.mmd) | Signal generation and response |
| [Deployment topology](../diagrams/deployment-topology.mmd) | Edge, runtime, data, external systems |
| [Incident response](../diagrams/incident-response.mmd) | Detect to learn |
| [Migration flow](../diagrams/migration-flow.mmd) | Legacy to target with rollback |

## Diagram rules

- Diagrams show target boundaries, not unapproved provider branding, unless describing current evidence.
- Data classified as sensitive uses server-only paths.
- A changed architecture boundary requires updating its diagram and relevant ADR in the same pull request.
- Mermaid syntax is validated for balanced blocks and reviewed in a renderer before launch.
