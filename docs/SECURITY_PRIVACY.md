# PakMed 2.0 — Security & Privacy Specification

**Document ID:** DOC-05 · **Version:** 1.0 · **Status:** Draft

> Engineering baseline only; not a security certification or legal-compliance opinion.

## 1. Purpose
Define data-handling expectations, security controls and principal threats.

## 2. Data classification
| Data | Sensitivity | Handling |
|---|---|---|
| Symptoms | Sensitive health information | Minimize, validate and disclose external transmission |
| Vitals | Sensitive health information | Prefer local deterministic processing |
| Age/gender context | Personal data | Send only when required |
| Medicine searches | Potentially sensitive | Avoid unnecessary logging |
| Geographic coordinates | Location data | Permission-based and purpose-limited |
| Theme preference | Low | Local preference storage |
| Provider credentials | Secret | Server-side secret manager only |

## 3. Privacy requirements
- Collect only information required for the feature.
- Explain when health information is sent to an external AI provider.
- Never describe localStorage as encrypted medical-record storage.
- Avoid persisting raw symptoms by default.
- Avoid logging raw health information without a justified, disclosed and protected need.
- Request geolocation only when needed; provide a manual alternative where practical.
- Explain exactly what local reset does and does not delete.
- Review third-party retention, processing and training terms before production integration.

## 4. Security controls

### Server/API
Keep provider keys in deployment secrets. Validate inputs at runtime. Limit request size and field length. Implement rate limiting or equivalent edge controls. Bound upstream calls with timeouts. Validate provider output. Sanitize errors. Never expose stack traces, prompts, secrets or upstream bodies.

### Browser
Render untrusted text safely. Use HTTPS in deployment. Apply a suitable Content Security Policy where compatible. Review third-party scripts and permissions. Do not store secrets or authentication tokens in localStorage. Keep dependencies patched.

### Local storage
localStorage is accessible to same-origin JavaScript; XSS may expose its contents. Store no secrets, minimize health data, validate retrieved state, define migration/reset behaviour and make no encryption-at-rest claim.

### External services
Review data flows to AI providers, OpenStreetMap tile services, Overpass, WhatsApp links and browser speech-recognition services. PakMed cannot guarantee third-party privacy practices or availability.

## 5. Threat model
| Threat | Impact | Controls |
|---|---|---|
| Prompt injection/malicious symptom text | Manipulated or unsafe output | Treat input as untrusted; constrained prompts; schemas; safety checks |
| Incorrect AI content | Misleading health information | Validation, cautious language, independent escalation, clinical review |
| Provider secret exposure | Unauthorized use/cost | Server-only secrets; client-bundle inspection |
| XSS | Local data exposure/actions | Safe rendering, CSP, dependency review |
| API abuse | Cost/service disruption | Rate limits, quotas, size limits, timeouts |
| Storage corruption | Incorrect restored state | Runtime validation and safe defaults |
| Stale catalog/facility data | Misleading availability | Source, freshness and verification labels |
| External outage | Feature unavailable | Graceful degradation and local fallback |

## 6. Security review checklist
- [ ] No provider secret in source, logs or client bundle.
- [ ] API inputs validated and bounded.
- [ ] Rate limiting and upstream timeout configured.
- [ ] Errors sanitized.
- [ ] External response treated as untrusted.
- [ ] No unnecessary health data in logs.
- [ ] localStorage contents and reset scope reviewed.
- [ ] Dependencies audited.
- [ ] HTTPS and security headers reviewed.
- [ ] Third-party data flows documented.

## 7. Production governance
Prepare a privacy notice, data inventory, retention/deletion policy, third-party disclosure, incident-response procedure and review of applicable Pakistani legal/regulatory requirements. Do not claim compliance until assessed by qualified counsel or the relevant authority.

## 8. Phase 2 data protection requirements — Planned

Longitudinal health records materially increase sensitivity and must not be added to the current local session snapshot without a separate approved design.

Before implementation, define explicit opt-in consent, data inventory, purpose limitation, minimization, retention, correction, export and deletion. Decide whether records are device-local or synchronized to an authenticated service. These are separate architectures.

If encrypted local persistence is selected, use a reviewed Web Crypto/IndexedDB design with key creation, storage, recovery, rotation and loss behaviour. Do not store a decryption key beside ciphertext in a way that defeats the protection, and do not claim end-to-end encryption unless the implemented protocol provides it. Address XSS and compromised-device risks.

If cloud sync is selected, require authenticated identity, per-record authorization, encrypted transport, access controls, conflict handling, deletion propagation, backup policy and incident response. Review each AI/taxonomy provider's retention, processing, region and training terms before transmitting health information. Provider keys remain server-side.

A pre-visit brief must not be transmitted to a clinician or other third party without explicit user action and clear disclosure. See [Phase 2 specification](./PHASE_2_LONGITUDINAL_CONTEXT.md).
