# PakMed 2.0 — Software Verification & Test Plan

**Document ID:** DOC-04 · **Version:** 1.0 · **Status:** Draft

## 1. Purpose
Define verification for functional requirements, architecture, security, usability and safety. Passing tests demonstrate tested behaviour, not clinical efficacy or regulatory approval.

## 2. Test levels
| Level | Scope |
|---|---|
| Unit | Pure functions and utilities |
| Integration | Module and service boundaries |
| End-to-end | Complete user workflows |
| Manual | Visual, accessibility and real-device behaviour |
| Security/safety review | Threats, data flows and clinical hazards |

## 3. Environment
Use isolated test data and mocked external services where practical. Never commit provider credentials or use real patient information in fixtures. Record browser, OS, runtime and dependency versions.

### 3.1 Current automated baseline
`npm test` runs the repository's focused Vitest suite. It covers current valid-input boundary behaviour for the pure vitals utilities and request-validation/failure responses from the placeholder diagnosis route. It does not validate clinical references, thresholds, emergency rules, clinical safety, or regulatory suitability.

The existing vitals utilities normalize invalid inputs instead of exposing a documented rejection result. Invalid/non-finite vitals tests are therefore deliberately deferred pending an approved input-validation contract; passing valid-boundary tests must not be read as acceptance of that behavior.

## 4. Unit test suites

### Vitals
BMI: typical values, all category boundaries, values immediately below/above boundaries, invalid/non-finite values and rounding-sensitive cases. Verify classification uses intended unrounded values.

Blood pressure: normal/elevated/stage boundaries, exact boundary values, systolic/diastolic disagreement, invalid readings and severe-reading handling.

Glucose: fasting and post-meal contexts, low/normal/high ranges, supported units/conversion, unknown context and boundary values.

Heart rate: supported resting adult ranges, boundaries, missing/non-finite values and documented scope.

Expected values must come from the approved clinical reference register.

### Storage
Test initial state, valid persistence, reload restoration, malformed JSON, missing fields, old schema version, migration, timestamp update, subscription notifications, reset scope and server-rendering safety.

### Pharmacy
Test exact/partial brand search, generic search, case normalization, empty query, no matches, prescription flags, missing/approximate price and WhatsApp URL encoding.

### Directory
Test coordinate validation, valid/empty/malformed response, duplicates, missing properties, timeout, abort, local fallback and source labels.

## 5. Integration tests
| ID | Workflow | Expected result |
|---|---|---|
| IT-001 | Vitals → calculation → persistence | Correct result stored |
| IT-002 | Reload → restore session | Supported values restored |
| IT-003 | Medicine query → result | Matching local entries |
| IT-004 | Vendor → inquiry | Correct encoded link |
| IT-005 | Location → Overpass → map | Valid results rendered |
| IT-006 | Overpass failure → fallback | Local data with source label |
| IT-007 | Diagnosis form → API | Validated response rendered |
| IT-008 | Invalid AI response | Rejected; no success state |
| IT-009 | Session reset | Defined local data cleared |

## 6. End-to-end scenarios
- E2E-001: Enter height/weight and view BMI.
- E2E-002: Enter BP and view classification.
- E2E-003: Reload and confirm session restoration.
- E2E-004: Search a medicine by generic name.
- E2E-005: Generate vendor inquiry without implying an order.
- E2E-006: Discover facilities with permission.
- E2E-007: Deny location and use alternative.
- E2E-008: Simulate geographic outage and observe fallback.
- E2E-009: Submit a valid diagnosis request.
- E2E-010: Simulate invalid provider output and confirm safe failure.
- E2E-011: Reset session and verify documented scope.

## 7. Non-functional tests
**Performance:** measure load, local calculations, catalog search, map rendering, API latency and timeout behaviour on representative mobile and desktop devices. Initial targets, not yet measured: calculations <100 ms; catalog search <200 ms.

**Accessibility:** keyboard operation, focus, semantic labels, screen-reader announcements, contrast, errors and non-colour severity cues. Target WCAG 2.2 AA.

**Security:** client-bundle secret inspection, input validation, rate limits, error redaction, dependency audit, storage inspection, security headers and external data transmission.

**Compatibility:** test supported Chrome, Firefox, Safari and Edge versions plus representative Android/iOS browsers. Test geolocation and speech separately.

**Offline/degraded:** test cached shell, local calculations, catalog search, unavailable maps, unavailable AI and service-worker updates. Do not infer full offline capability from service-worker registration.

## 8. Defect severity
- Critical: credible risk of serious harm, sensitive-data exposure or system compromise.
- High: unsafe guidance, major incorrect behaviour or core workflow failure.
- Medium: significant degradation with workaround.
- Low: cosmetic/minor issue.

Clinical and security defects may block release even when functional tests pass.

## 9. Release exit criteria
Mandatory release requirements have passing evidence; no unresolved critical defects; high-severity defects are resolved or explicitly accepted with rationale; clinical thresholds and emergency behaviour have reference review; production build and smoke tests pass; privacy/security disclosures match actual data flows; documentation matches implementation.

## 10. Evidence
Retain test command, environment, date, result, relevant logs and linked requirement IDs. Avoid real user health data in test artifacts.

## 11. Phase 2 verification — Planned

Do not mark these tests complete until the corresponding feature exists.

- Longitudinal record schema, version migration, correction, export and deletion.
- Timestamp/timezone, unit, measurement-context, duplicate and out-of-order handling.
- Trend calculations for sparse, irregular, missing and contradictory readings; minimum sample rules and insufficient-data states.
- Rounding-sensitive calculations and reference-version traceability.
- Medication/lifestyle context edits, confirmation dates and stale-context handling.
- AI prompt injection, invented fields, invalid JSON/schema, timeout and provider-not-configured cases.
- ICD-11 candidate provenance, taxonomy version and unverified/verified state.
- User review/approval before export; assert no automatic sharing occurs.
- Encryption, key recovery/loss, authorization, sync conflicts and deletion propagation if those capabilities are implemented.
- Emergency scenarios proving AI cannot suppress or delay deterministic escalation.
- Facility matching with verified, unverified and missing specialty/schedule metadata.

See [Phase 2 specification](./PHASE_2_LONGITUDINAL_CONTEXT.md) for acceptance boundaries and release gates.
