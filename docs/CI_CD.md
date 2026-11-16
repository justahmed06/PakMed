# PakMed CI/CD

**Status:** CI implemented; deployment intentionally not enabled.

## Current pull-request checks

`.github/workflows/ci.yml` runs for pull requests targeting `main` and uses
only the scripts verified in `package.json`:

- `npm ci` installs the committed lockfile.
- `npm run lint` runs ESLint.
- `npm run build` verifies the production Next.js build.

The workflow has read-only `contents` permission, uses no secrets and does not
upload artifacts, publish packages, modify pull requests or deploy. Superseded
runs for the same pull request are cancelled. Actions are pinned to immutable
commit SHAs; update those pins deliberately as part of dependency maintenance.

There is currently no `test`, type-check, integration-test or end-to-end-test
script. CI must not represent the test-plan scenarios as automated evidence
until the corresponding tooling and scripts exist.

## One-time GitHub setup

After the workflow is merged, a repository administrator should configure a
branch protection or ruleset for `main` that requires the `Lint and build`
check before merging. Require at least one independent review and prevent
force-pushes as appropriate for the repository. These settings are not changed
by this repository change and require administrator approval.

Do not enable GitHub Actions write permissions globally for this workflow. PRs
from forks must continue to run without deployment secrets.

## Deployment decision gate

Cloudflare Pages/Workers is documented only as a target pending compatibility
verification. No `wrangler` configuration, Cloudflare project name/account ID,
adapter, production branch, preview policy or release owner is present in this
repository. Before adding a deployment workflow, explicitly approve and record:

1. The Cloudflare product and project/account identifiers, plus the Next.js
   adapter and validated build/output commands.
2. Preview and production branch/release rules, including the rollback process.
3. Separate Cloudflare credentials with the minimum deployment scope, stored as
   GitHub environment secrets (not repository files or public variables).
4. GitHub `preview` and `production` environments, with required production
   reviewers and any applicable clinical, privacy and security release gates.
5. Runtime compatibility for route handlers, dependencies, service-worker
   behaviour and server-side secret handling, followed by smoke-test evidence.

Use an environment-protected production deployment after merge only when those
items are complete and explicitly approved. Do not use `pull_request_target`
for this repository's CI or deployment.
