# PakMed 2.0 — Phase 2: Longitudinal Context & Pre-Visit Clinical Brief

**Document ID:** DOC-08 · **Version:** 1.0 · **Status:** Proposed / Not implemented

> This document records an approved direction for technical planning only. It does not claim that longitudinal records, AI follow-up, ICD-11 mapping, encrypted persistence or clinical briefs currently exist. It is not clinical validation or regulatory approval.

## 1. Purpose

Phase 2 extends PakMed from a current-session health-information tool into an opt-in personal health-context workflow. A returning user may organize measurements and patient-reported context over time, review changes, and prepare a concise brief to share with a qualified clinician before a visit.

The feature is intended to improve the completeness and organization of information presented to a clinician. It must not diagnose, prescribe, recommend medication changes or replace professional assessment.

## 2. Scope and boundaries

### In scope
- A separate, versioned longitudinal record model for user-approved health readings.
- Timestamped measurements with units, context, source and provenance.
- Patient-reported medication and lifestyle context, with review dates.
- Deterministic trend calculations and transparent trend windows.
- Contextual follow-up questions to clarify missing or changed information.
- Structured, schema-validated pre-visit brief generation.
- Optional ICD-11 terminology suggestions, explicitly marked as unverified until checked against the authoritative taxonomy.
- User review, correction and approval before export or sharing.
- Opt-in persistence with a documented encryption, key-management, retention and deletion design.

### Out of scope
- Autonomous diagnosis, prognosis, prescribing or treatment recommendations.
- LLM-controlled clinical thresholds, emergency decisions or trend significance.
- Silent background collection or automatic sharing with clinicians.
- Treating AI-generated ICD-11 codes as authoritative.
- Inferring a facility's specialties, availability or schedule from its name or map location.
- Reusing the current session snapshot as a longitudinal medical-record database.

## 3. Current baseline and prerequisites

The reviewed Phase 1 repository has a local session snapshot under `pakmed_session_v1`, deterministic vitals helpers, a basic diagnosis API route with hardcoded placeholder responses, a static sample pharmacy catalog and geographic facility discovery. It does not currently provide longitudinal readings, a clinical-brief API route, verified facility-specialty metadata or an authenticated patient-record service.

The current diagnosis route is not a production AI integration. The Phase 2 brief endpoint and related services are proposed only.

Before implementation, resolve:
1. A patient-owned persistence model and explicit opt-in/consent flow.
2. Encryption at rest and in transit, key creation, recovery, rotation and loss behaviour.
3. Whether records remain device-local or support authenticated cross-device sync.
4. A clinically reviewed reference register and deterministic trend rules.
5. An authoritative, versioned ICD-11 terminology lookup and verification process.
6. Verified facility specialty and schedule data, or clearly disclose that matching is unavailable.
7. Privacy, retention, export, deletion and third-party data-processing requirements.
8. Qualified clinical review and release approval.

## 4. Data model principles

Keep `pakmed_session_v1` for its existing session purpose. Do not migrate it silently or overload it with longitudinal history.

Introduce a separate versioned domain, for example `LongitudinalHealthRecord`, only after schema and migration design are approved. Each reading should preserve:
- Stable record identifier.
- Measurement type and raw numeric value.
- Unit and measurement context (for example fasting/post-meal, resting/non-resting, or seated where relevant).
- Measured-at timestamp and timezone/offset where available.
- Entry source (user-entered, device-imported, or other explicitly defined source).
- Validation status and any correction history.
- Applicable rule/reference version used for classification.

Medication and lifestyle context must be explicitly patient-reported, timestamped, editable and reviewable. Do not infer adherence, medication use or behavioural causes.

A trend is not a raw measurement. Preserve source readings and derive trends from them; never replace original values with averages or classifications.

## 5. Deterministic trend engine

All calculations and threshold-based flags must run in deterministic, unit-tested TypeScript code. The engine must:
- Validate units, ranges, timestamps and measurement context.
- Avoid comparing incompatible units or contexts.
- Define minimum sample counts and time windows for every trend.
- Handle missing, irregular, duplicate and out-of-order readings.
- Show the actual readings and period behind each calculated change.
- Use unrounded values for classification and calculations; round only for display.
- Return an explicit insufficient-data state rather than inventing a trend.
- Identify the reference/rule version used.
- Never label a trend as a diagnosis or make treatment decisions.

Clinical significance and alert thresholds require qualified review. The LLM must not create or change these thresholds.

## 6. Bounded AI workflow

AI may assist only with:
- Asking neutral follow-up questions when required context is missing or a deterministic rule has flagged a change for clarification.
- Organizing patient-provided answers into structured fields.
- Suggesting possible ICD-11 terminology candidates for review.
- Drafting a concise summary from validated readings and user-confirmed context.

AI must not:
- Determine whether a trend is clinically significant.
- calculate or alter vitals classifications.
- Decide whether emergency escalation is required.
- Invent medication, lifestyle, symptoms, measurements or dates.
- Convert uncertain terminology into a confirmed diagnosis.
- Recommend starting, stopping or changing medication.

Treat provider output as untrusted. Validate it with Zod, reject unsupported claims and fail closed when the provider is unavailable or output is invalid. Provider selection must remain configurable through server-side adapters; credentials belong in deployment secrets and must never be exposed to the browser.

## 7. Pre-visit brief contract

A brief should contain, at minimum:
- Brief creation time and covered date range.
- Patient-confirmed reason for visit and stated concerns.
- Selected measurements with values, units, timestamps and contexts.
- Deterministic summaries/trends with calculation and reference version.
- Patient-confirmed medication list and last-confirmed date.
- Patient-reported relevant lifestyle/context notes and dates.
- Missing or uncertain information clearly identified.
- Optional ICD-11 terminology candidates with source/version and verification state.
- A clear statement that this is a patient-reviewed information summary, not a diagnosis.

The user must be able to inspect, edit and approve the complete brief before export or sharing. Do not automatically send it to a provider. A clinician-facing layout must not imply that a clinician has reviewed it.

## 8. Proposed API boundaries

These are proposed internal contracts, not existing endpoints:
- `POST /api/clinical-brief/follow-up`: accepts a minimal, user-approved context snapshot and returns schema-validated clarification questions.
- `POST /api/clinical-brief`: accepts validated readings, confirmed context and deterministic trend output; returns a draft brief for user review.
- An ICD-11 terminology adapter may be introduced separately after the authoritative API/source, licensing and verification requirements are confirmed.

Do not transmit the entire health record when a smaller selected date range and relevant fields are sufficient. Enforce request limits, authentication/authorization if cloud records are introduced, rate limits, timeouts, audit controls and sanitized errors. Never log raw health data by default.

## 9. Persistence, encryption and synchronization

Device-local persistence and cloud synchronization are separate product decisions.

For local storage, evaluate encrypted IndexedDB using Web Crypto only with a complete key-management design. Encryption is not meaningful if the key is stored beside ciphertext in an equally accessible form. Address device loss, browser data clearing, backup/export, key recovery, rotation and XSS exposure.

For cross-device synchronization, require authenticated identity, authorization per record, encrypted transport, server-side access controls, secure key recovery, conflict resolution, deletion propagation, backup policy and incident response. Do not describe a system as end-to-end encrypted unless the design and implementation actually provide that property.

The user must explicitly opt in before longitudinal health data is persisted or transmitted. Define export, correction, deletion and retention behaviour before release.

## 10. Facility matching

Facility matching may use a specialty or schedule only when that information comes from a verified, maintained source with provenance and a last-verified timestamp. OSM tags or AI inference alone do not establish that a provider offers a specialty, accepts patients or has an available appointment.

If verified data is unavailable, show general geographic discovery and state that specialty/service availability must be confirmed directly.

## 11. Safety and failure behaviour

- Emergency escalation remains deterministic, conservative, clinically reviewed and independent of AI.
- The system must not delay urgent care while gathering follow-up answers or generating a brief.
- Missing history, uncertain dates or unverified terminology must remain visibly uncertain.
- Invalid AI output, provider outages or unavailable taxonomy services must not produce a fabricated successful brief.
- The brief must preserve source values and distinguish patient-entered facts from calculated summaries and AI-drafted text.
- No low-risk classification may imply that serious illness has been ruled out.

## 12. Phase 2 verification

Required tests include:
- Record schema validation, version migration, export, correction and deletion.
- Timestamp/timezone, unit, context, duplicate and out-of-order handling.
- Trend calculations with sparse, irregular, missing and contradictory readings.
- Threshold boundary and rounding-sensitive cases using approved references.
- Medication/lifestyle context edits and stale-confirmation warnings.
- Prompt injection, hallucinated fields, invalid JSON and provider outage.
- ICD-11 candidate uncertainty and authoritative verification status.
- User review/approval and proof that no brief is shared automatically.
- Encryption, key loss/recovery, authorization, sync conflict and deletion propagation where applicable.
- Emergency scenarios proving AI cannot suppress or delay escalation.
- Facility matching with verified/unverified/missing specialty and schedule data.

## 13. Release gates

Phase 2 must not be represented as production-ready until:
1. Data model and consent flows are approved.
2. Security architecture and key management are reviewed.
3. Clinical rules and trend interpretation are approved by qualified reviewers.
4. ICD-11 source and mapping verification are operational.
5. Facility metadata provenance is defined for any specialty matching.
6. API contracts, authorization and provider data-processing terms are reviewed.
7. Automated and manual tests pass.
8. User-facing privacy, uncertainty and safety disclosures match actual behaviour.
9. Critical/high safety and security findings are resolved or formally dispositioned.
10. A documented release approval is recorded.

## 14. Related documents

See [Product Vision](./PRODUCT_VISION.md), [SRS](./SRS.md), [SDS](./SDS.md), [API Specification](./API_SPECIFICATION.md), [Test Plan](./TEST_PLAN.md), [Security & Privacy](./SECURITY_PRIVACY.md), [Clinical Safety](./CLINICAL_SAFETY.md) and [Deployment](./DEPLOYMENT.md).
