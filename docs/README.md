# PakMed 2.0 — Engineering Documentation

**Version:** 1.0 · **Status:** Draft for review

This directory contains the product and software-engineering baseline for PakMed 2.0.

| Document | Purpose |
|---|---|
| [Product Vision](./PRODUCT_VISION.md) | Product purpose, users, principles and scope |
| [SRS](./SRS.md) | What the system must do |
| [SDS](./SDS.md) | How the system is designed |
| [API Specification](./API_SPECIFICATION.md) | Service contracts and data boundaries |
| [Test Plan](./TEST_PLAN.md) | Verification strategy and release evidence |
| [Security & Privacy](./SECURITY_PRIVACY.md) | Data handling and security controls |
| [Clinical Safety](./CLINICAL_SAFETY.md) | Intended use, hazards and safety gates |
| [Deployment](./DEPLOYMENT.md) | Environments, release and operations |

## Status vocabulary
- **Implemented:** observed in the reviewed repository baseline.
- **Partial:** some supporting implementation exists, but the full requirement is not satisfied.
- **Planned:** intended but not verified as implemented.
- **TBD:** decision or evidence remains outstanding.

Documentation is not proof of implementation. Recheck status against source code before each release. Update affected documents when scope, requirements, architecture, contracts, clinical rules, security or deployment change.

## Project principles
- Deterministic health calculations remain separate from LLM interpretation.
- AI output is untrusted until validated and safety-checked.
- External services must fail gracefully.
- localStorage is not encrypted medical-record storage.
- Geographic discovery is not provider verification.
- A demonstration booking is not a real appointment.
- A successful build is not proof of clinical safety.

## Phase roadmap

| Phase | Scope | Status |
|---|---|---|
| Phase 1 | Current-session vitals, symptom-information prototype, sample pharmacy catalog, facility discovery and demo appointment flow | Existing baseline; verify each capability against code |
| Phase 2 | Opt-in longitudinal context and user-reviewed pre-visit clinical brief | Proposed; not implemented |

See [Phase 2: Longitudinal Context & Pre-Visit Clinical Brief](./PHASE_2_LONGITUDINAL_CONTEXT.md) for scope, architecture, API boundaries, prerequisites and release gates.

The current `/api/diagnose` route is a basic placeholder with hardcoded responses and emergency-keyword matching. It is not a connected AI-provider integration. A clinical-brief API route has not been implemented. API credentials and provider choices are future configuration decisions, not prerequisites for documenting provider-neutral interfaces.
