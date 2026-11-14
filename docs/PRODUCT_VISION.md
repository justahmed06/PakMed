# PakMed 2.0 — Product Vision

**Document ID:** DOC-00 · **Version:** 1.0 · **Status:** Draft

## 1. Executive summary
PakMed 2.0 is a modular healthcare information and navigation platform focused on the practical needs of users in Pakistan. It brings together basic health-measurement interpretation, AI-assisted symptom information, medicine discovery and healthcare-facility navigation.

PakMed is not an autonomous doctor, prescription engine, online pharmacy or hospital booking network. It helps users organize health information and navigate toward appropriate resources while making uncertainty and limitations visible.

## 2. Problem and opportunity
Healthcare information and services are fragmented across separate websites, directories, pharmacies and providers. Users may need to interpret basic measurements, organize symptoms, discover medicine information or locate a facility. PakMed aims to reduce this fragmentation without implying that convenience replaces professional medical assessment.

## 3. Vision
Build a reliable, privacy-conscious and locally relevant digital health companion that makes selected healthcare information easier to understand and healthcare resources easier to discover.

## 4. Product objectives
1. Provide deterministic calculations for supported health measurements.
2. Offer bounded AI-assisted organization and interpretation of symptom information.
3. Make a local medicine reference catalog searchable.
4. Support geographic discovery of healthcare facilities.
5. Preserve selected functionality locally and degrade gracefully during network failures.
6. Communicate sources, uncertainty, limitations and appropriate next steps.

## 5. Product modules
### Diagnosis
A structured symptom-information workflow using planned server-side AI integration, strict request/response validation, safety checks and disclaimers. It must not present model output as a definitive diagnosis.

### Vitals
A deterministic TypeScript module for BMI, blood pressure, glucose and heart-rate indicators. Rules must be tied to documented clinical references, populations and measurement contexts.

### Pharmacy
A searchable local medicine catalog with normalized information and vendor inquiry support. Prices are approximate unless independently verified. The module does not currently establish live stock or fulfil orders.

### Appointments and facility discovery
A map-based facility discovery experience using OpenStreetMap/Overpass and local reference data. Results do not verify opening hours, services, availability or appointment acceptance. A demo slot flow is not a real booking.

### Settings
Application preferences, session controls and transparent local-data management. Demonstration content must not be represented as genuine user activity.

## 6. Product principles
- Human-centered and understandable.
- Deterministic where possible.
- AI with explicit boundaries and independent safety controls.
- Pakistan-relevant data where responsibly maintainable.
- Privacy-conscious collection and retention.
- Resilient local functionality.
- Honest distinction between prototype, reference data and verified live services.

## 7. Intended users
Primary users are individuals seeking basic health information and help navigating healthcare resources. Secondary users include maintainers, developers, testers and future qualified clinical-content reviewers. The current baseline does not define authenticated clinician, hospital-administrator or pharmacy-operator workflows.

## 8. Scope boundaries
**In scope:** supported health calculations; bounded symptom-information workflow; static medicine catalog search; facility discovery; local session persistence; offline/degraded states for local functions.

**Out of scope unless separately approved:** definitive diagnosis; prescribing or treatment decisions; verified real-time pharmacy inventory or purchases; real appointment booking without provider integration; centralized electronic medical records; claims of regulatory approval or complete offline operation without evidence.

## 9. Success criteria
Measure correctness of deterministic logic, validated service contracts, safe failure behaviour, useful local discovery, usability, privacy controls and maintainability—not the number of AI features.

## 10. Related documents
See [SRS](./SRS.md), [SDS](./SDS.md), [API Specification](./API_SPECIFICATION.md), [Test Plan](./TEST_PLAN.md), [Security & Privacy](./SECURITY_PRIVACY.md), [Clinical Safety](./CLINICAL_SAFETY.md) and [Deployment](./DEPLOYMENT.md).
