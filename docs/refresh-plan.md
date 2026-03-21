# Vibuco refresh plan

This document captures a practical cleanup-first modernization plan for the current Vibuco codebase.

## Current baseline

### Framework and build
- The app is built on Next.js 9, React 16, and a Webpack 4-era plugin stack.
- The build relies on legacy plugins such as `@zeit/next-css`, `next-images`, `next-svgr`, and `next-compose-plugins`.
- Asset handling is customized in `next.config.js` with overlapping SVG and file loader rules.

### App architecture
- The app uses the Next.js pages router and consists mostly of marketing pages plus a more dynamic `cards` experience.
- Authentication is initialized globally in `_app.js` with Amplify/Auth configuration sourced from runtime config.
- The cards flow combines auth-aware data fetching, image transformation, localization toggles, and gallery interactions in one page component.

### Documentation and developer experience
- Authentication setup is documented, but the main README does not yet provide full local setup, build, or troubleshooting instructions.
- There is no visible test, lint, or CI setup in the repository root.

## Phase 1: cleanup and stabilization

Goal: reduce noise before any dependency or framework changes.

### Tasks
1. Remove unused imports, props, and dead code from top-level pages and shared components.
2. Audit the repository for unused packages, especially packages that look suspicious in a Next.js app such as `react-router-dom`.
3. Normalize small code-quality issues such as no-op handlers, unused variables, and duplicated inline content.
4. Inventory environment variables, auth assumptions, and AWS integration points before changing runtime behavior.
5. Add a lightweight checklist for manual smoke testing of the homepage, login flow, cards page, and authenticated image flow.

### Expected output
- Smaller diffs for later work.
- Clearer ownership of which files are safe to refactor.
- A dependency list split into keep / replace / remove / upgrade later.

## Phase 2: dependency audit and upgrade map

Goal: decide what to upgrade directly and what to replace.

### Tasks
1. Review every dependency in `package.json` and classify it by purpose and current usage.
2. Prioritize upgrades for framework-critical packages:
   - `next`
   - `react`
   - `react-dom`
   - `styled-components`
   - `twin.macro`
3. Identify deprecated or legacy packages that should be removed or replaced:
   - `@zeit/next-css`
   - `next-images`
   - `next-svgr`
   - `next-compose-plugins`
4. Review AWS-related packages and decide whether auth can stay on the current stack or needs a dedicated migration.
5. Produce a compatibility matrix showing which packages block a Next.js upgrade.

### Expected output
- A package-by-package upgrade matrix.
- A recommended upgrade order with risk notes.

## Phase 3: build and configuration refresh

Goal: simplify the build before attempting a major framework jump.

### Tasks
1. Replace or remove legacy Next.js plugins where built-in support now exists.
2. Simplify `next.config.js` and remove overlapping asset loader behavior.
3. Revisit how environment variables are exposed to the client.
4. Confirm image, SVG, CSS, and font handling still work after config simplification.
5. Add a repeatable install/build verification path for the repository.

### Expected output
- A smaller config surface.
- Fewer build-time surprises during framework upgrades.

## Phase 4: auth and data-flow hardening

Goal: isolate the most sensitive behavior before broader UI refactors.

### Tasks
1. Extract Amplify/Auth configuration concerns from page shell code where possible.
2. Document every required runtime variable and redirect assumption.
3. Review whether public runtime config is exposing more than needed.
4. Separate the cards page into clearer data-fetching, transformation, and rendering layers.
5. Reduce in-place mutation of image data and centralize image normalization helpers.

### Expected output
- Lower regression risk in auth and cards behavior.
- Easier testing of the app’s business-critical flows.

## Phase 5: framework modernization

Goal: move to a supported, maintainable Next.js/React baseline.

### Tasks
1. Upgrade Next.js and React in controlled steps rather than one giant jump.
2. Re-test every route after each upgrade milestone.
3. Replace or refactor code that depends on legacy Next.js behavior.
4. Validate SSR/CSR assumptions, static assets, SEO metadata, and authentication redirects.
5. Remove compatibility shims that were only needed for older framework versions.

### Expected output
- A supported framework baseline.
- Better long-term maintainability and access to newer platform features.

## Phase 6: quality, performance, and documentation

Goal: make the project easier to maintain after the upgrade work lands.

### Tasks
1. Add linting and formatting automation.
2. Add smoke tests and targeted tests around cards/auth logic.
3. Document local setup, required env vars, build commands, and deployment notes in the README.
4. Review bundle size and trim overlapping UI/animation libraries where practical.
5. Optimize heavy pages by splitting concerns and lazy-loading non-critical UI.

### Expected output
- Better onboarding and lower maintenance cost.
- Safer future changes.

## Suggested execution order

1. Cleanup and stabilization
2. Dependency audit and upgrade map
3. Build/config refresh
4. Auth and cards hardening
5. Framework modernization
6. Quality/performance/documentation pass

## Immediate next deliverables

The next two concrete deliverables after this plan should be:

1. A dependency inventory with keep / replace / remove / blocked classifications.
2. A cleanup PR series focused on dead code, suspicious dependencies, and config simplification candidates.
