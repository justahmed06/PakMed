// ---------------------------------------------------------------------------
// types/medical.ts – Strict TypeScript interfaces for the PakMed domain
// Zero `any` types. All models are plain data (no class instances, no DOM refs).
// ---------------------------------------------------------------------------

/** ISO-8601 date string (YYYY-MM-DD) */
export type ISODateString = string;

/** ISO-8601 datetime string */
export type ISODateTimeString = string;

/** WGS-84 coordinate pair [latitude, longitude] */
export type LatLng = readonly [lat: number, lng: number];

// ── Vitals ──────────────────────────────────────────────────────────────────

/** Possible clinical assessment of a vital reading. */
export type VitalStatus =
  | "NORMAL"
  | "OPTIMAL"
  | "ELEVATED"
  | "LOW"
  | "CRITICAL"
  | "RESTING";

export interface VitalReading {
  /** Human-readable label, e.g. "BMI", "BP", "HR" */
  readonly label: string;
  /** Display value, e.g. "120/80" or "72" */
  readonly value: string;
  /** Clinical status tag */
  readonly status: VitalStatus;
  /** CSS-compatible colour for UI rendering */
  readonly color: string;
}

// ── Diagnosis ───────────────────────────────────────────────────────────────

export type DiagnosisSeverity = "low" | "moderate" | "high" | "critical";

export interface DiagnosisRecord {
  /** Unique identifier */
  readonly id: string;
  /** ICD-10 or WHO code, e.g. "8A80" */
  readonly code: string;
  /** Human-readable condition name */
  readonly name: string;
  /** Severity level */
  readonly severity: DiagnosisSeverity;
  /** ISO date when the diagnosis was recorded */
  readonly dateRecorded: ISODateString;
  /** Free-text clinical notes */
  readonly notes: string;
}

// ── Facilities (Hospitals & Clinics) ────────────────────────────────────────

export type FacilityType = "Hospital" | "Clinic";

export interface Facility {
  /** Display name */
  readonly name: string;
  /** WGS-84 coordinates */
  readonly coords: LatLng;
  /** Whether this is a hospital or a clinic */
  readonly type: FacilityType;
  /** Distance from a reference point in kilometres (computed at runtime) */
  readonly distanceKm: number;
}

// ── Appointments ────────────────────────────────────────────────────────────

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface AppointmentSlot {
  /** Display label, e.g. "10:00 AM" */
  readonly label: string;
  /** ISO datetime for the start of the slot */
  readonly start: ISODateTimeString;
}

export interface Appointment {
  readonly id: string;
  /** Token number assigned by the facility */
  readonly tokenNumber: number;
  /** The facility where the appointment takes place */
  readonly facilityName: string;
  /** Coordinates of the facility (for map display) */
  readonly facilityCoords: LatLng;
  /** Selected time slot */
  readonly slot: AppointmentSlot;
  readonly status: AppointmentStatus;
  /** ISO date of booking */
  readonly bookedAt: ISODateTimeString;
}

// ── Pharmacy / Vendor ───────────────────────────────────────────────────────

export interface PharmacyVendor {
  /** Display name, e.g. "DVAGO" */
  readonly name: string;
  /** WhatsApp-compatible phone number (digits only, with country code) */
  readonly phoneNumber: string;
  /** Brand colour (CSS-compatible) */
  readonly color: string;
}

export interface PrescriptionInquiry {
  /** Medicine name */
  readonly medicineName: string;
  /** Requested quantity (must be ≥ 1) */
  readonly quantity: number;
  /** Target vendor for this inquiry */
  readonly vendor: PharmacyVendor;
}

// ── Map / Sector ────────────────────────────────────────────────────────────

export interface MapSector {
  /** Human-readable sector name, e.g. "DHA Phase 6" */
  readonly name: string;
  /** Centre coordinates of the sector */
  readonly coords: LatLng;
}

// ── Settings / History ──────────────────────────────────────────────────────

export type ThemeName = "Deep Space" | "Clinical Ice";

export interface HistoryEntry {
  /** Short date label, e.g. "Feb 12" */
  readonly date: string;
  /** Event description */
  readonly event: string;
  /** Outcome or code */
  readonly status: string;
}

export interface UserSettings {
  readonly theme: ThemeName;
  readonly history: readonly HistoryEntry[];
}
