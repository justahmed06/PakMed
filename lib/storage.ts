// ---------------------------------------------------------------------------
// lib/storage.ts – Synchronous client-side ledger persistence layer for PakMed
// Key: 'pakmed_session_v1'
// Fully guarded with `typeof window !== 'undefined'` for SSR / Edge safety.
// Compatible with React 19 useSyncExternalStore for zero cascading renders.
// ---------------------------------------------------------------------------

import type { GlucoseContext } from "./vitals";

export const STORAGE_KEY = "pakmed_session_v1" as const;

export interface BmiInputs {
  readonly weightKg: number;
  readonly heightCm: number;
}

export interface BpInputs {
  readonly systolic: number;
  readonly diastolic: number;
}

export interface GlucoseInputs {
  readonly value: number;
  readonly context: GlucoseContext;
}

export interface HrInputs {
  readonly bpm: number;
}

export interface VitalsInputState {
  readonly bmi: BmiInputs;
  readonly bp: BpInputs;
  readonly glucose: GlucoseInputs;
  readonly hr: HrInputs;
}

export interface PakMedSessionData {
  readonly version: 1;
  readonly lastUpdated: string;
  readonly vitals: VitalsInputState;
}

/** Default clinical state mirroring default initial dashboard vitals */
export const DEFAULT_VITALS_INPUTS: VitalsInputState = {
  bmi: {
    weightKg: 66.2,
    heightCm: 170,
  },
  bp: {
    systolic: 120,
    diastolic: 80,
  },
  glucose: {
    value: 140,
    context: "postprandial",
  },
  hr: {
    bpm: 72,
  },
};

export const DEFAULT_SESSION: PakMedSessionData = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  vitals: DEFAULT_VITALS_INPUTS,
};

// In-memory cache for reference stability in useSyncExternalStore
let cachedSession: PakMedSessionData | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Guarded check for browser environment with available localStorage.
 */
export function isBrowser(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined" &&
      window.localStorage !== null
    );
  } catch {
    return false;
  }
}

/**
 * Validate and safely merge incoming payload with fallback defaults.
 */
function sanitizeSession(raw: unknown): PakMedSessionData {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_SESSION;
  }

  const obj = raw as Record<string, unknown>;
  const vitalsObj = (obj.vitals as Record<string, unknown>) ?? {};

  const bmiRaw = (vitalsObj.bmi as Record<string, unknown>) ?? {};
  const bpRaw = (vitalsObj.bp as Record<string, unknown>) ?? {};
  const glucoseRaw = (vitalsObj.glucose as Record<string, unknown>) ?? {};
  const hrRaw = (vitalsObj.hr as Record<string, unknown>) ?? {};

  const weightKg = typeof bmiRaw.weightKg === "number" && bmiRaw.weightKg > 0
    ? bmiRaw.weightKg
    : DEFAULT_VITALS_INPUTS.bmi.weightKg;

  const heightCm = typeof bmiRaw.heightCm === "number" && bmiRaw.heightCm > 0
    ? bmiRaw.heightCm
    : DEFAULT_VITALS_INPUTS.bmi.heightCm;

  const systolic = typeof bpRaw.systolic === "number" && bpRaw.systolic > 0
    ? bpRaw.systolic
    : DEFAULT_VITALS_INPUTS.bp.systolic;

  const diastolic = typeof bpRaw.diastolic === "number" && bpRaw.diastolic > 0
    ? bpRaw.diastolic
    : DEFAULT_VITALS_INPUTS.bp.diastolic;

  const glucoseValue = typeof glucoseRaw.value === "number" && glucoseRaw.value > 0
    ? glucoseRaw.value
    : DEFAULT_VITALS_INPUTS.glucose.value;

  const context: GlucoseContext =
    glucoseRaw.context === "fasting" || glucoseRaw.context === "postprandial"
      ? glucoseRaw.context
      : DEFAULT_VITALS_INPUTS.glucose.context;

  const bpm = typeof hrRaw.bpm === "number" && hrRaw.bpm > 0
    ? hrRaw.bpm
    : DEFAULT_VITALS_INPUTS.hr.bpm;

  return {
    version: 1,
    lastUpdated: typeof obj.lastUpdated === "string" ? obj.lastUpdated : new Date().toISOString(),
    vitals: {
      bmi: { weightKg, heightCm },
      bp: { systolic, diastolic },
      glucose: { value: glucoseValue, context },
      hr: { bpm },
    },
  };
}

/**
 * Synchronous, SSR-safe getter for the PakMed session.
 */
export function getSession(): PakMedSessionData {
  if (!isBrowser()) {
    return DEFAULT_SESSION;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SESSION;
    }
    return sanitizeSession(JSON.parse(raw));
  } catch {
    return DEFAULT_SESSION;
  }
}

/**
 * Synchronous, SSR-safe setter for the PakMed session.
 */
export function saveSession(session: PakMedSessionData): boolean {
  cachedSession = session;
  notify();

  if (!isBrowser()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(session);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convenience getter for vitals inputs slice.
 */
export function getVitalsInputs(): VitalsInputState {
  return getSession().vitals;
}

/**
 * Convenience setter for vitals inputs slice.
 * Automatically updates lastUpdated timestamp.
 */
export function saveVitalsInputs(vitals: VitalsInputState): boolean {
  const current = getSessionSnapshot();
  const nextSession: PakMedSessionData = {
    ...current,
    lastUpdated: new Date().toISOString(),
    vitals,
  };
  return saveSession(nextSession);
}

/**
 * Update a single vital metric slice immutably and persist synchronously.
 */
export function updateVitalInput<K extends keyof VitalsInputState>(
  key: K,
  data: VitalsInputState[K],
): VitalsInputState {
  const current = getSessionSnapshot().vitals;
  const nextVitals: VitalsInputState = {
    ...current,
    [key]: data,
  };
  saveVitalsInputs(nextVitals);
  return nextVitals;
}

/**
 * Reset session ledger back to initial clinical defaults.
 */
export function resetSession(): PakMedSessionData {
  const resetData: PakMedSessionData = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    vitals: DEFAULT_VITALS_INPUTS,
  };
  saveSession(resetData);
  return resetData;
}

// ── React 18/19 External Store Subscription API ─────────────────────────────

export function getSessionSnapshot(): PakMedSessionData {
  if (!isBrowser()) {
    return DEFAULT_SESSION;
  }
  if (!cachedSession) {
    cachedSession = getSession();
  }
  return cachedSession;
}

export function getServerSessionSnapshot(): PakMedSessionData {
  return DEFAULT_SESSION;
}

export function subscribeSession(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedSession = getSession();
      onStoreChange();
    }
  };

  if (isBrowser()) {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(onStoreChange);
    if (isBrowser()) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}
