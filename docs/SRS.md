# PakMed 2.0 — Software Requirements Specification

**Document ID:** DOC-01 · **Version:** 1.0 · **Status:** Draft for review  
**Guidance:** ISO/IEC/IEEE 29148-style structure; no claim of certification.

## 1. Purpose and scope
This SRS defines functional and non-functional requirements for PakMed 2.0. PakMed is a healthcare information and navigation web application for Pakistan with Diagnosis, Vitals, Pharmacy, Appointments/Facility Discovery and Settings modules. It does not replace medical professionals or provide autonomous clinical decisions.

## 2. Technology and operating context
Current baseline: Next.js 16.1.6, React 19, TypeScript 5 strict, Tailwind CSS 4 and Zod. Browser capabilities include localStorage, geolocation, service workers and optional speech recognition. Mapping uses Leaflet with OpenStreetMap/Overpass. Cloudflare Pages/Workers is the deployment target, subject to compatibility validation.

## 3. Normative language and status
**MUST** is mandatory; **SHOULD** is recommended; **MAY** is optional. Implemented means observed in the reviewed baseline; Partial means incomplete; Planned means not verified; TBD means unresolved.

## 4. Functional requirements

### 4.1 Diagnosis
| ID | Requirement | Priority | Baseline |
|---|---|---|---|
| FR-DIA-001 | Allow free-text symptom entry. | Must | Partial |
| FR-DIA-002 | Support age and gender context where applicable. | Must | Partial |
| FR-DIA-003 | Support symptom duration. | Must | Partial |
| FR-DIA-004 | Allow relevant optional vitals in the request. | Should | Partial |
| FR-DIA-005 | Validate requests against canonical Zod schemas server-side. | Must | Partial |
| FR-DIA-006 | Keep AI-provider calls and credentials server-side. | Must | Planned |
| FR-DIA-007 | Validate provider output before display. | Must | Schema foundation |
| FR-DIA-008 | Support low, moderate, high and emergency severity labels. | Must | Schema foundation |
| FR-DIA-009 | Implement emergency escalation independent of the LLM. | Must | Planned |
| FR-DIA-010 | Disclose that generated information is not a diagnosis. | Must | Verify |
| FR-DIA-011 | Handle timeout, provider failure and invalid output safely. | Must | Planned |
| FR-DIA-012 | Support browser speech input where available, with text fallback. | Could | Experimental |
| FR-DIA-013 | Validate attachment type, size and handling if attachments are enabled. | Must if enabled | Partial UI |

The intended endpoint is POST /api/diagnose. A complete endpoint was not established in the reviewed baseline.

### 4.2 Vitals
| ID | Requirement | Priority | Baseline |
|---|---|---|---|
| FR-VIT-001 | Calculate BMI as kilograms divided by height in metres squared. | Must | Implemented |
| FR-VIT-002 | Use documented adult Asian BMI thresholds and scope. | Must | Implemented; review |
| FR-VIT-003 | Capture systolic and diastolic BP independently. | Must | Verify UI |
| FR-VIT-004 | Use documented BP reference and explicit boundary precedence. | Must | Implemented; review |
| FR-VIT-005 | Account for glucose units and measurement context. | Must | Review |
| FR-VIT-006 | Document heart-rate population and resting assumptions. | Must | Review |
| FR-VIT-007 | Reject or safely handle invalid/non-finite inputs. | Must | Verify |
| FR-VIT-008 | Keep calculations deterministic and network-independent. | Must | Implemented |
| FR-VIT-009 | Persist supported measurements locally. | Must | Implemented |
| FR-VIT-010 | Timestamp stored measurements. | Must | Implemented |
| FR-VIT-011 | Recover safely from malformed or missing storage. | Must | Implemented; test |
| FR-VIT-012 | Allow explicit reset of supported local data. | Must | Implemented; verify |

Adult Asian BMI thresholds currently specified: underweight <18.5; normal 18.5–22.9; overweight 23.0–27.4; obese ≥27.5. Confirm the authoritative source and population before release. Do not apply adult thresholds to children.

### 4.3 Pharmacy
| ID | Requirement | Priority | Baseline |
|---|---|---|---|
| FR-PHA-001 | Provide a normalized local medicine catalog. | Must | Implemented |
| FR-PHA-002 | Search brand and generic names. | Must | Implemented |
| FR-PHA-003 | Display form, strength, indication, prescription flag and approximate PKR price where available. | Should | Implemented; review data |
| FR-PHA-004 | Display prescription status without implying individual suitability. | Must | Verify |
| FR-PHA-005 | Allow vendor selection. | Could | Implemented |
| FR-PHA-006 | Generate an external WhatsApp inquiry. | Could | Implemented |
| FR-PHA-007 | Never present approximate prices as live quotations. | Must | Verify |
| FR-PHA-008 | Disclose that stock and final price require vendor confirmation. | Must | Verify |
| FR-PHA-009 | Keep catalog search available offline when catalog assets are available. | Should | By design |

The current catalog contains example entries. It is not a verified national drug database or live stock integration.

### 4.4 Appointments and facility discovery
| ID | Requirement | Priority | Baseline |
|---|---|---|---|
| FR-APP-001 | Discover nearby facilities through a configured geographic source. | Should | Partial |
| FR-APP-002 | Render geographic results on a map. | Should | Partial |
| FR-APP-003 | Request location permission and provide a manual-area alternative where practical. | Must | Verify |
| FR-APP-004 | Display only facility details actually available from the source. | Must | Partial |
| FR-APP-005 | Bound Overpass requests with a timeout (initial target 5 seconds). | Must | Planned |
| FR-APP-006 | Cancel expired or unnecessary requests. | Must | Planned |
| FR-APP-007 | Fall back to local facility data on live failure. | Should | Partial |
| FR-APP-008 | Distinguish live results from local reference facilities. | Must | Planned |
| FR-APP-009 | Allow a demo slot-selection flow. | Could | Demo implemented |
| FR-APP-010 | Ensure demo confirmation is not represented as a real booking. | Must | Verify |
| FR-APP-011 | Require verified provider integration for real booking. | Must if introduced | Not implemented |

### 4.5 Settings
| ID | Requirement | Priority | Baseline |
|---|---|---|---|
| FR-SET-001 | Allow theme selection. | Should | Partial |
| FR-SET-002 | Display session information from actual stored data. | Should | Partial |
| FR-SET-003 | Provide explicit reset of supported local data. | Must | Verify |
| FR-SET-004 | Explain local storage and external data transmission. | Must | Planned |
| FR-SET-005 | Persist preferences that are described as persistent. | Must | Verify |

## 5. External interface requirements
- UI: responsive layouts, accessible labels, focus states and explicit loading/error/offline states.
- AI: server-side provider adapter with validated JSON contracts.
- Maps: Leaflet and configured OSM/Overpass endpoints; tolerate incomplete or unavailable results.
- Browser: localStorage, geolocation, service worker and optional speech recognition with capability checks.

## 6. Non-functional requirements
| ID | Requirement |
|---|---|
| NFR-001 | External-service failure MUST NOT crash unrelated local modules. |
| NFR-002 | Local calculations SHOULD complete under 100 ms and current-catalog search under 200 ms on representative devices; measure rather than assume. |
| NFR-003 | Business logic SHOULD be isolated from UI and unit-testable. |
| NFR-004 | TypeScript strict mode SHOULD remain enabled. |
| NFR-005 | Persisted and external data MUST be validated before use. |
| NFR-006 | Personal and health data collection/transmission SHOULD be minimized. |
| NFR-007 | Target WCAG 2.2 AA, subject to testing. |
| NFR-008 | Local functionality MUST remain independent of external APIs. |
| NFR-009 | Secrets MUST remain server-side; inputs and external responses are untrusted. |
| NFR-010 | Browser support claims MUST be based on tested combinations. |
| NFR-011 | Target deployment runtime MUST be proven compatible. |
| NFR-012 | Operational logs SHOULD avoid unnecessary sensitive health data. |

## 7. Constraints and assumptions
localStorage is not encrypted medical-record storage. AI and geographic services have no guaranteed availability. Pharmacy prices and facility records may become stale. Service-worker caching does not imply full offline operation. Adult thresholds require explicit population scope. Cloudflare compatibility remains unverified until tested.

## 8. Acceptance criteria
A requirement is complete only when implementation and verification evidence exist. Release evidence must include deterministic boundary tests, rejected invalid API input/output, controlled external failures, verified persistence/reset, clear price and booking disclosures, and resolution of critical security and clinical-safety findings.

## 9. Traceability
Use requirement IDs in test-case names or metadata. See [SDS](./SDS.md), [API Specification](./API_SPECIFICATION.md), [Test Plan](./TEST_PLAN.md) and [Clinical Safety](./CLINICAL_SAFETY.md).

## 10. Phase 2 requirements — Planned, not implemented

The following requirements are proposed and must not be treated as current acceptance claims.

| ID | Requirement | Priority |
|---|---|---|
| FR-LON-001 | Maintain a separate, versioned longitudinal record model; do not repurpose `pakmed_session_v1`. | Must |
| FR-LON-002 | Store selected readings with value, unit, context, timestamp, source and rule version. | Must |
| FR-LON-003 | Allow explicit opt-in, review, correction, export and deletion of longitudinal data. | Must |
| FR-LON-004 | Calculate trends deterministically with documented windows, sample requirements and insufficient-data states. | Must |
| FR-LON-005 | Keep clinical significance thresholds and emergency escalation independent of AI. | Must |
| FR-LON-006 | Collect patient-confirmed medication and lifestyle context with review dates. | Must |
| FR-LON-007 | Generate a schema-validated draft pre-visit brief from selected, validated data. | Must |
| FR-LON-008 | Require user review and approval before export or sharing; never share automatically. | Must |
| FR-LON-009 | Treat ICD-11 suggestions as unverified until checked against the authoritative, versioned taxonomy. | Must |
| FR-LON-010 | Provide secure persistence with documented encryption, key management, retention and deletion. | Must |
| FR-LON-011 | Match facilities to specialties/schedules only from verified, maintained metadata. | Must if matching is offered |

The existing `POST /api/diagnose` route exists but currently returns hardcoded placeholder responses; it is not a production AI integration. The clinical-brief endpoint is proposed and does not currently exist. See [Phase 2 specification](./PHASE_2_LONGITUDINAL_CONTEXT.md).

## 11. API/provider integration approach

Provider selection is intentionally open. Implement server-side provider adapters behind stable application interfaces. Keep credentials in deployment secrets, validate requests and responses, apply timeouts/rate limits, and review provider data retention and processing terms before sending health information. The application must degrade safely when no provider is configured.
