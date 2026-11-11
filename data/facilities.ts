// ---------------------------------------------------------------------------
// data/facilities.ts – Static facility and vendor seed data for PakMed
// All values satisfy the strict interfaces in types/medical.ts.
// ---------------------------------------------------------------------------

import type {
  Facility,
  MapSector,
  PharmacyVendor,
  VitalReading,
} from "@/types/medical";

// ── Map Sectors (Karachi) ───────────────────────────────────────────────────

export const SECTORS: readonly MapSector[] = [
  { name: "Bahadurabad (Central)", coords: [24.8825, 67.0694] },
  { name: "Gulistan-e-Johar (Block 20)", coords: [24.9176, 67.1197] },
  { name: "DHA Phase 6", coords: [24.808, 67.048] },
  { name: "North Nazimabad", coords: [24.9372, 67.0422] },
] as const;

/** Default map anchor point – Bahadurabad, Karachi */
export const ANCHOR_BAHADURABAD: readonly [number, number] = [24.8825, 67.0694];

// ── Pharmacy Vendors ────────────────────────────────────────────────────────

export const VENDORS: readonly PharmacyVendor[] = [
  { name: "DVAGO", phoneNumber: "9221111138246", color: "#EF5350" },
  { name: "Dawaai.pk", phoneNumber: "923171719452", color: "#42A5F5" },
  { name: "MedsOne (Johar)", phoneNumber: "923304900900", color: "#66BB6A" },
  { name: "MedsOne (Gulshan)", phoneNumber: "923273594035", color: "#66BB6A" },
  { name: "Seven86 Medicos", phoneNumber: "922134010647", color: "#AB47BC" },
  { name: "Time Medico (Stdm)", phoneNumber: "923170584113", color: "#FFA726" },
  { name: "Time Medico (Clftn)", phoneNumber: "923353935622", color: "#FFA726" },
] as const;

// ── Default Vitals (used as initial dashboard readings) ─────────────────────

export const DEFAULT_VITALS: readonly VitalReading[] = [
  { label: "BMI", value: "22.9", status: "NORMAL", color: "#00E5FF" },
  { label: "BP", value: "120/80", status: "OPTIMAL", color: "#00E5FF" },
  { label: "GLUCOSE", value: "140", status: "ELEVATED", color: "#FFD600" },
  { label: "HR", value: "72", status: "RESTING", color: "#FF1744" },
] as const;

// ── Seed Facilities (offline fallback) ──────────────────────────────────────

export const SEED_FACILITIES: readonly Facility[] = [
  {
    name: "Aga Khan University Hospital",
    coords: [24.8918, 67.074],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "Liaquat National Hospital",
    coords: [24.8794, 67.0685],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "Jinnah Postgraduate Medical Centre",
    coords: [24.8677, 67.0461],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "Ziauddin Hospital (Clifton)",
    coords: [24.8208, 67.0303],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "South City Hospital",
    coords: [24.8546, 67.0271],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "Patel Hospital",
    coords: [24.8713, 67.0491],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "Indus Hospital (Korangi)",
    coords: [24.8306, 67.1201],
    type: "Hospital",
    distanceKm: 0,
  },
  {
    name: "Darul Sehat Hospital",
    coords: [24.9127, 67.0901],
    type: "Hospital",
    distanceKm: 0,
  },
] as const;
