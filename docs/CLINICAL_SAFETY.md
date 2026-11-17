# PakMed 2.0 — Clinical Safety & Risk Register

**Document ID:** DOC-06 · **Version:** 1.0 · **Status:** Draft for qualified review

> This document does not establish clinical validation, regulatory approval or medical-device status.

## 1. Purpose and intended use
PakMed may influence how users interpret health information or seek care. It is intended to calculate selected indicators, organize symptom information, provide bounded AI-assisted informational responses, support medicine discovery and help users discover facilities.

It is not intended to diagnose definitively, prescribe, determine treatment, replace professional assessment, guarantee stock or facility services, or confirm appointments without authoritative provider integration.

## 2. Safety principles
- **CS-001 AI is assistive:** describe output as informational and uncertain, not a definitive diagnosis.
- **CS-002 Independent emergency escalation:** critical guidance must not rely solely on an LLM.
- **CS-003 Deterministic calculations:** categories must come from documented code and verified thresholds.
- **CS-004 Traceable references:** each clinical rule identifies source, version, population and review date.
- **CS-005 Population scope:** adult thresholds must not silently apply to children or other populations.
- **CS-006 No autonomous prescribing:** do not initiate, stop or change medication.
- **CS-007 No false reassurance:** low-risk labels do not rule out serious illness.
- **CS-008 Visible uncertainty:** acknowledge missing context; do not fabricate it.
- **CS-009 External data is not verification:** a map marker/catalog entry does not prove current status.

## 3. Preliminary hazard register
| ID | Hazard | Initial severity | Required controls |
|---|---|---|---|
| H-001 | Incorrect AI interpretation | Critical | Contract validation, safety policy, cautious wording, clinical review |
| H-002 | Emergency symptoms not escalated | Critical | Independent triggers, conservative escalation, scenario tests |
| H-003 | Incorrect measurement classification | High | Verified references and boundary tests |
| H-004 | User mistakes output for diagnosis | High | Clear disclaimer and careful language |
| H-005 | Incorrect medicine information | High | Data provenance, review and prescription caveats |
| H-006 | Approximate price mistaken for live price | Medium | Explicit approximate label |
| H-007 | Stale/incomplete facility data | High | Source/freshness metadata and qualification |
| H-008 | Demo booking mistaken for real booking | High | Persistent demo disclosure |
| H-009 | Health/location data exposure | High | Minimization and security controls |
| H-010 | External service outage | Medium | Timeouts, fallbacks and unavailable states |
| H-011 | Invalid provider output displayed as valid | High | Runtime response validation and fail-closed handling |
| H-012 | Threshold used for wrong population/context | High | Explicit scope, context and clinical review |

Severity is a preliminary engineering assessment. Qualified review must refine likelihood, severity, mitigations and residual risk.

## 4. Clinical reference register
| Domain | Reference basis | Verification required |
|---|---|---|
| BMI | WHO Asian BMI guidance | Exact source, population and thresholds |
| Blood pressure | AHA/ACC guidance | Edition, categories and precedence |
| Glucose | ADA guidance | Context, units and thresholds |
| Heart rate | Authoritative clinical reference | Age group, resting context and boundaries |
| Disease taxonomy | WHO ICD-11 | Verify code and description against official taxonomy |

Record source organization, document/version/date, population, exact rule, review date and reviewer. Do not hardcode a threshold without linking it to this register.

## 5. Emergency handling
Emergency logic should use explicit, reviewed rules and conservative wording. It must not depend solely on model severity, must not delay urgent care while collecting more details, must not invent local emergency contact details and must be tested for false positives and false negatives. The exact trigger set and wording require qualified clinical review before release.

## 6. Clinical release gate
Before public AI-assisted functionality:
1. Approve the clinical reference register.
2. Review thresholds and population assumptions.
3. Review emergency logic with qualified clinical input.
4. Evaluate representative and edge-case symptom scenarios.
5. Review prompts, model constraints and failure modes.
6. Verify ICD-11 mappings against the official source.
7. Review disclaimers and user-facing language.
8. Confirm invalid/unavailable responses fail safely.
9. Document residual risks and limitations.
10. Obtain explicit release approval.

## 7. Change control
Changes to thresholds, clinical copy, emergency triggers, prompts, response schemas or medicine information require impact assessment and regression tests. Record source and rationale for every clinical change.

### Vitals input validation
The deterministic vitals helpers reject measurements that are not finite numbers greater than zero. They do not add upper/lower clinical plausibility limits; no such bounds are approved in this reference register. The UI withholds the classification and displays validation feedback until all required measurements are valid. Existing positive-value rounding and categories remain as implemented and still require the clinical reference review above.

## 8. Phase 2 hazards and controls — Proposed

| ID | Hazard | Required control |
|---|---|---|
| H-013 | Incorrect or misleading longitudinal trend | Deterministic, reviewed rules; source readings; explicit windows/sample requirements; insufficient-data state |
| H-014 | Incorrect or stale patient history | Timestamped provenance, patient review/correction and confirmation dates |
| H-015 | AI invents or misstates clinical context | Bounded drafting from validated fields; schema validation; user approval |
| H-016 | Incorrect ICD-11 candidate treated as diagnosis | Authoritative taxonomy verification, version/provenance and visible uncertainty |
| H-017 | Sensitive longitudinal record exposed | Consent, encryption/key management, authorization, minimization and deletion controls |
| H-018 | Facility specialty/availability inferred incorrectly | Use only verified, maintained metadata; otherwise do not claim a match |
| H-019 | Brief shared without informed approval | Explicit user review and action; no automatic sharing |

Trend significance, clinical thresholds and emergency escalation must remain independent of AI and require qualified clinical review. A generated brief is a patient-reviewed information summary, not a diagnosis or clinician-reviewed record. The detailed Phase 2 safety and release requirements are in [Phase 2 specification](./PHASE_2_LONGITUDINAL_CONTEXT.md).
