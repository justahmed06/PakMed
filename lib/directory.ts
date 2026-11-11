// ---------------------------------------------------------------------------
// lib/directory.ts – Pure helper functions for the PakMed directory
//
// ✅ Edge-runtime compatible (Cloudflare Pages / Vercel Edge):
//   • No Node.js built-ins (fs, path, crypto, etc.)
//   • No DOM / window / navigator references
//   • No `any` types
//   • Deterministic, side-effect-free exports
// ---------------------------------------------------------------------------

import type {
  Facility,
  FacilityType,
  LatLng,
  MapSector,
  PharmacyVendor,
  PrescriptionInquiry,
} from "@/types/medical";

// ── Geo helpers ─────────────────────────────────────────────────────────────

/** Mean radius of the Earth in kilometres (WGS-84 approximation). */
const EARTH_RADIUS_KM = 6_371;

/** Convert degrees to radians. */
function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate the great-circle distance between two WGS-84 points using the
 * Haversine formula. Returns the distance in **kilometres**.
 *
 * Pure function – no side effects, safe for edge runtimes.
 */
export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const dLat = degToRad(b[0] - a[0]);
  const dLon = degToRad(b[1] - a[1]);

  const halfChordLengthSq =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degToRad(a[0])) *
      Math.cos(degToRad(b[0])) *
      Math.sin(dLon / 2) ** 2;

  const angularDistance =
    2 * Math.atan2(Math.sqrt(halfChordLengthSq), Math.sqrt(1 - halfChordLengthSq));

  return EARTH_RADIUS_KM * angularDistance;
}

// ── Facility helpers ────────────────────────────────────────────────────────

/**
 * Attach computed `distanceKm` to every facility, measuring from `origin`.
 * Returns a **new** array (does not mutate the input).
 */
export function withDistances(
  facilities: readonly Facility[],
  origin: LatLng,
): Facility[] {
  return facilities.map((f) => ({
    ...f,
    distanceKm: haversineDistanceKm(origin, f.coords),
  }));
}

/**
 * Return facilities sorted by ascending distance from `origin`, limited to
 * `maxResults`. Each returned facility carries a freshly computed `distanceKm`.
 */
export function nearestFacilities(
  facilities: readonly Facility[],
  origin: LatLng,
  maxResults: number,
): Facility[] {
  return withDistances(facilities, origin)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, maxResults);
}

/**
 * Filter facilities by type ("Hospital" or "Clinic").
 */
export function filterByType(
  facilities: readonly Facility[],
  type: FacilityType,
): Facility[] {
  return facilities.filter((f) => f.type === type);
}

/**
 * Case-insensitive search of facilities whose name contains `term`.
 */
export function searchFacilities(
  facilities: readonly Facility[],
  term: string,
): Facility[] {
  const lowerTerm = term.toLowerCase();
  return facilities.filter((f) => f.name.toLowerCase().includes(lowerTerm));
}

// ── Sector helpers ──────────────────────────────────────────────────────────

/**
 * Find a `MapSector` by exact name match. Returns `undefined` when not found.
 */
export function findSectorByName(
  sectors: readonly MapSector[],
  name: string,
): MapSector | undefined {
  return sectors.find((s) => s.name === name);
}

// ── Pharmacy helpers ────────────────────────────────────────────────────────

/**
 * Build the WhatsApp deep-link URL for a prescription inquiry.
 * Pure string computation – no network call.
 */
export function buildWhatsAppUrl(inquiry: PrescriptionInquiry): string {
  const message = [
    "Inquiry:",
    "",
    `💊 Medicine: ${inquiry.medicineName}`,
    `🔢 Quantity: ${inquiry.quantity}`,
    "",
    "❓ Requesting Price & Availability.",
  ].join("\n");

  return `https://wa.me/${inquiry.vendor.phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Find a vendor by exact name. Returns `undefined` when not found.
 */
export function findVendorByName(
  vendors: readonly PharmacyVendor[],
  name: string,
): PharmacyVendor | undefined {
  return vendors.find((v) => v.name === name);
}

// ── Formatting helpers ──────────────────────────────────────────────────────

/**
 * Format a distance in km to a human-readable string (1 decimal place).
 */
export function formatDistanceKm(km: number): string {
  return `${km.toFixed(1)} km`;
}
