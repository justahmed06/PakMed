# PakMed 2.0 — API & Data Contract Specification

**Document ID:** DOC-03 · **Version:** 1.0 · **Status:** Proposed contract

> Align examples and constraints with the authoritative schemas in lib/schemas.ts before implementation. This document does not establish that the route currently exists.

## 1. Scope
Defines the intended server boundary for AI-assisted Diagnosis.

## 2. Endpoint
| Property | Value |
|---|---|
| Method | POST |
| Path | /api/diagnose |
| Content type | application/json |
| Authentication | TBD; do not assume an authenticated-user system exists |
| Provider credentials | Server-side only |

## 3. Request model
Illustrative payload:
```json
{
  "age": 25,
  "gender": "unspecified",
  "symptoms": "Headache and mild fever",
  "duration": "2 days",
  "vitals": {
    "bmi": 22.4,
    "bloodPressure": "120/80",
    "glucose": 105
  }
}
```
The canonical Zod schema must define required/optional fields, accepted enum values, numeric boundaries, string limits, unknown-field policy and supported units. This example is not the source of truth.

## 4. Response model
Illustrative payload:
```json
{
  "summary": "The reported symptoms can have multiple explanations.",
  "severity": "moderate",
  "recommendedAction": "Consider professional medical advice, especially if symptoms persist or worsen.",
  "icd11Code": null,
  "disclaimers": ["This information is not a medical diagnosis."],
  "emergencyEscalation": false
}
```
Conceptual fields: summary, severity, recommendedAction, icd11Code, disclaimers and emergencyEscalation. Severity values are low, moderate, high and emergency unless the canonical schema specifies otherwise. Verify any ICD-11 mapping against the authoritative taxonomy; a model-generated code-shaped string is not verification.

## 5. Processing requirements
The route must safely parse JSON, enforce size/field limits, validate with Zod, apply rate controls, call the configured provider through a server adapter, enforce timeout, treat provider output as unknown, validate response, apply independent safety checks, return normalized output and avoid logging sensitive health details.

## 6. Provider abstraction
```ts
export interface DiagnosisProvider {
  generateResponse(request: DiagnosisRequest): Promise<unknown>;
}
```
Derive request/response types from canonical Zod schemas where possible. Do not maintain drifting duplicate definitions.

## 7. HTTP status and error contract
| Status | Meaning |
|---|---|
| 200 | Valid response returned |
| 400 | Invalid request |
| 413 | Payload too large |
| 429 | Rate limit exceeded |
| 500 | Unexpected internal error |
| 502 | Invalid or failed upstream response |
| 503 | Service unavailable or not configured |
| 504 | Upstream timeout |

Suggested error body:
```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "The diagnostic service is temporarily unavailable."
  }
}
```
Do not forward internal exceptions or provider response bodies verbatim.

## 8. Security and privacy
Keep credentials in deployment secrets; minimize data sent to providers; avoid persisting raw symptom text by default; enforce size, length, rate and timeout limits; validate external output; review provider retention and data-processing terms. Zod validation is not clinical validation.

## 9. Contract tests
Test valid request/response, missing fields, invalid enums, out-of-range values, oversized payload, unknown fields, provider unconfigured, timeout, malformed JSON, schema-invalid output, emergency indicators and rate limiting.

## 10. Versioning
The initial route is internal. If external consumers are introduced, define explicit versioning and backward-compatibility rules before publishing it.
