# PakMed 2.0 — Deployment & Operations Guide

**Document ID:** DOC-07 · **Version:** 1.0 · **Status:** Draft  
**Target:** Cloudflare Pages / Workers, subject to compatibility verification.

## 1. Purpose
Define intended environments, build checks, deployment validation and operational expectations.

## 2. Environments
- **Development:** local development and mocked integrations.
- **Preview/staging:** integration and release-candidate verification.
- **Production:** approved public deployment.

Do not use real personal health information in development or test fixtures.

## 3. Runtime and deployment target
Current baseline: Next.js 16.1.6, React 19, TypeScript 5 strict, Tailwind CSS 4 and Zod. Cloudflare Pages/Workers is the target. Verify framework adapter, rendering mode, API route runtime, supported Node APIs, dependencies, service-worker behaviour and secret handling before declaring production support.

## 4. Environment configuration
Illustrative variable names; align with the actual provider adapter:
```env
AI_PROVIDER_API_KEY=
AI_PROVIDER_BASE_URL=
AI_PROVIDER_MODEL=
```
Configure secrets through the hosting platform. Never commit real values, expose them through public-prefixed variables or include them in client bundles. Use separate preview and production credentials.

## 4.1 CI/CD status and deployment authorization
The repository's pull-request workflow is documented in [CI/CD](./CI_CD.md).
It performs only locked dependency installation, linting and a production build;
it has no deployment credentials or write permissions. This does not constitute
deployment or release evidence.

Do not add automated preview or production deployment until the Cloudflare
project, account, adapter, build/output configuration, environment separation,
least-privilege credential model, release owner and rollback process have been
verified and explicitly approved. Production deployment must use a protected
GitHub environment with required reviewers.

## 5. Pre-deployment checklist
- [ ] Install dependencies from the committed lockfile.
- [ ] Run TypeScript checks.
- [ ] Run linting.
- [ ] Run unit tests.
- [ ] Run integration tests.
- [ ] Run production build.
- [ ] Verify API runtime compatibility.
- [ ] Confirm environment variables are configured.
- [ ] Inspect client output for secrets.
- [ ] Review dependency/security findings.
- [ ] Confirm applicable clinical and privacy release gates.
- [ ] Confirm rollback target is available.

Use actual scripts from package.json; do not assume script names.

## 6. Post-deployment smoke tests
Verify app load/navigation; Vitals calculations and persistence; Pharmacy search and inquiry; facility discovery success/failure; Diagnosis endpoint configuration and safe failure; no client-side secrets; service-worker caching; mobile layout and accessibility-critical controls.

## 7. Operations and monitoring
Monitor availability, API errors, provider failures, timeouts, geographic-service failures, client errors and deployment status. Avoid capturing symptom text, vitals, precise coordinates, prompts or other sensitive data unnecessarily. Define retention and access controls for operational records.

## 8. Rollback
Maintain a previously verified release. Roll back for critical defects, clinical safety issues, sensitive-data exposure, broken core workflows or deployment incompatibility. Preserve non-sensitive evidence and document corrective actions.

## 9. Offline and degraded operation
Service-worker caching does not establish complete offline functionality. Test each module:
- Vitals calculations should remain local.
- Catalog search should work when catalog assets are available.
- Diagnosis requires a configured remote provider unless a separately documented local model exists.
- Live map tiles and Overpass require network access; local facility references may be available if cached.
- Speech and geolocation depend on browser support and permission.

The UI must communicate unavailable functions rather than imply full offline capability.

## 10. Release record
For every production release record version/commit, date, environment, build/test results, known limitations, approvals, deployment outcome and rollback reference.

## 11. Phase 2 deployment considerations — Planned

Phase 2 may introduce new storage, encryption, identity, taxonomy and AI-provider dependencies. Do not provision or expose these services until the architecture and data flows are approved.

For every external service, document its purpose, environment-specific endpoint, authentication method, secret name, quota, timeout, failure mode, data sent, retention/processing terms and monitoring. Keep credentials in hosting-platform secrets and separate preview/production credentials. Never put secrets in public-prefixed variables or client bundles.

If cloud records are introduced, deployment must include authenticated access controls, database migrations, backups, restore testing, deletion propagation, audit controls and incident response. If encrypted local records are selected, document browser support, key lifecycle and recovery limitations. Validate Cloudflare runtime compatibility for every new dependency and API route.

Do not enable production health-data transmission until privacy, security and clinical release gates are satisfied. See [Phase 2 specification](./PHASE_2_LONGITUDINAL_CONTEXT.md).
