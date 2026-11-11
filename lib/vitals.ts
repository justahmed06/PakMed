// ---------------------------------------------------------------------------
// lib/vitals.ts – Pure mathematical calculations and clinical classifications
// for the PakMed Vitals Matrix Engine.
//
// Complies with:
//  • WHO Western Pacific / Asian Adult BMI classifications
//  • AHA / ACC Blood Pressure Staging guidelines
//  • ADA (American Diabetes Association) Glucose thresholds
// ---------------------------------------------------------------------------

// ── Types ───────────────────────────────────────────────────────────────────

export type AsianBmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese";

export interface BmiResult {
  readonly bmi: number;
  readonly category: AsianBmiCategory;
  readonly status: string;
  readonly color: string;
  readonly formatted: string;
}

export type BpStage =
  | "Normal"
  | "Elevated"
  | "Stage 1"
  | "Stage 2"
  | "Hypertensive Crisis";

export interface BpResult {
  readonly systolic: number;
  readonly diastolic: number;
  readonly stage: BpStage;
  readonly status: string;
  readonly color: string;
  readonly formatted: string;
}

export type GlucoseContext = "fasting" | "postprandial";
export type GlucoseCategory = "Low" | "Normal" | "Elevated" | "High";

export interface GlucoseResult {
  readonly value: number;
  readonly context: GlucoseContext;
  readonly category: GlucoseCategory;
  readonly status: string;
  readonly color: string;
  readonly formatted: string;
}

export type HrCategory = "Low" | "Normal" | "Elevated";

export interface HrResult {
  readonly bpm: number;
  readonly category: HrCategory;
  readonly status: string;
  readonly color: string;
  readonly formatted: string;
}

// ── Pure Clinical Calculations ──────────────────────────────────────────────

/**
 * Adult Asian BMI Calculation & Classification
 *
 * Criteria (WHO Asian cut-offs):
 *  • Underweight: < 18.5 kg/m²
 *  • Normal:      18.5 – 22.9 kg/m²
 *  • Overweight:  23.0 – 27.4 kg/m²
 *  • Obese:       ≥ 27.5 kg/m²
 *
 * @param weightKg Patient weight in kilograms (> 0)
 * @param heightCm Patient height in centimetres (> 0)
 */
export function calculateAsianBmi(weightKg: number, heightCm: number): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) {
    return {
      bmi: 0,
      category: "Normal",
      status: "NORMAL",
      color: "#00E5FF",
      formatted: "0.0",
    };
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  if (bmi < 18.5) {
    return {
      bmi,
      category: "Underweight",
      status: "UNDERWEIGHT",
      color: "#42A5F5",
      formatted: bmi.toFixed(1),
    };
  }

  if (bmi <= 22.9) {
    return {
      bmi,
      category: "Normal",
      status: "NORMAL",
      color: "#00E5FF",
      formatted: bmi.toFixed(1),
    };
  }

  if (bmi <= 27.4) {
    return {
      bmi,
      category: "Overweight",
      status: "OVERWEIGHT",
      color: "#FFD600",
      formatted: bmi.toFixed(1),
    };
  }

  return {
    bmi,
    category: "Obese",
    status: "OBESE",
    color: "#FF1744",
    formatted: bmi.toFixed(1),
  };
}

/**
 * Blood Pressure Staging (AHA/ACC 2017 Clinical Practice Guidelines)
 *
 * Staging criteria:
 *  • Hypertensive Crisis: SYS > 180 and/or DIA > 120 mmHg
 *  • Stage 2:             SYS ≥ 140 or DIA ≥ 90 mmHg
 *  • Stage 1:             SYS 130–139 or DIA 80–89 mmHg
 *  • Elevated:            SYS 120–129 and DIA < 80 mmHg
 *  • Normal:              SYS < 120 and DIA < 80 mmHg
 */
export function classifyBloodPressure(
  systolic: number,
  diastolic: number,
): BpResult {
  const safeSys = Math.max(0, Math.round(systolic));
  const safeDia = Math.max(0, Math.round(diastolic));
  const formatted = `${safeSys}/${safeDia}`;

  if (safeSys > 180 || safeDia > 120) {
    return {
      systolic: safeSys,
      diastolic: safeDia,
      stage: "Hypertensive Crisis",
      status: "CRITICAL",
      color: "#FF1744",
      formatted,
    };
  }

  if (safeSys >= 140 || safeDia >= 90) {
    return {
      systolic: safeSys,
      diastolic: safeDia,
      stage: "Stage 2",
      status: "STAGE 2",
      color: "#FF5252",
      formatted,
    };
  }

  if (safeSys >= 130 || safeDia >= 80) {
    return {
      systolic: safeSys,
      diastolic: safeDia,
      stage: "Stage 1",
      status: "STAGE 1",
      color: "#FFA726",
      formatted,
    };
  }

  if (safeSys >= 120 && safeDia < 80) {
    return {
      systolic: safeSys,
      diastolic: safeDia,
      stage: "Elevated",
      status: "ELEVATED",
      color: "#FFD600",
      formatted,
    };
  }

  return {
    systolic: safeSys,
    diastolic: safeDia,
    stage: "Normal",
    status: "OPTIMAL",
    color: "#00E5FF",
    formatted,
  };
}

/**
 * Blood Glucose Level Classification (ADA Guidelines)
 *
 * Fasting criteria (FPG, ≥ 8 hrs fast):
 *  • Low:                  < 70 mg/dL
 *  • Normal:               70 – 99 mg/dL
 *  • Elevated (Prediabetes): 100 – 125 mg/dL
 *  • High (Diabetes range): ≥ 126 mg/dL
 *
 * Postprandial criteria (2 hours post-meal / random):
 *  • Low:                  < 70 mg/dL
 *  • Normal:               70 – 139 mg/dL
 *  • Elevated (Impaired):  140 – 199 mg/dL
 *  • High (Diabetes range): ≥ 200 mg/dL
 */
export function classifyGlucose(
  value: number,
  context: GlucoseContext = "postprandial",
): GlucoseResult {
  const safeVal = Math.max(0, Math.round(value));
  const formatted = `${safeVal}`;

  if (context === "fasting") {
    if (safeVal < 70) {
      return {
        value: safeVal,
        context,
        category: "Low",
        status: "LOW",
        color: "#42A5F5",
        formatted,
      };
    }
    if (safeVal <= 99) {
      return {
        value: safeVal,
        context,
        category: "Normal",
        status: "NORMAL",
        color: "#00E5FF",
        formatted,
      };
    }
    if (safeVal <= 125) {
      return {
        value: safeVal,
        context,
        category: "Elevated",
        status: "ELEVATED",
        color: "#FFD600",
        formatted,
      };
    }
    return {
      value: safeVal,
      context,
      category: "High",
      status: "CRITICAL",
      color: "#FF1744",
      formatted,
    };
  }

  // Postprandial / Random
  if (safeVal < 70) {
    return {
      value: safeVal,
      context,
      category: "Low",
      status: "LOW",
      color: "#42A5F5",
      formatted,
    };
  }
  if (safeVal <= 139) {
    return {
      value: safeVal,
      context,
      category: "Normal",
      status: "OPTIMAL",
      color: "#00E5FF",
      formatted,
    };
  }
  if (safeVal <= 199) {
    return {
      value: safeVal,
      context,
      category: "Elevated",
      status: "ELEVATED",
      color: "#FFD600",
      formatted,
    };
  }
  return {
    value: safeVal,
    context,
    category: "High",
    status: "CRITICAL",
    color: "#FF1744",
    formatted,
  };
}

/**
 * Resting Heart Rate Classification
 *  • Low (Bradycardia):  < 60 bpm
 *  • Normal:             60 – 100 bpm
 *  • Elevated (Tachycardia): > 100 bpm
 */
export function classifyHeartRate(bpm: number): HrResult {
  const safeBpm = Math.max(0, Math.round(bpm));
  const formatted = `${safeBpm}`;

  if (safeBpm < 60) {
    return {
      bpm: safeBpm,
      category: "Low",
      status: "LOW",
      color: "#42A5F5",
      formatted,
    };
  }
  if (safeBpm <= 100) {
    return {
      bpm: safeBpm,
      category: "Normal",
      status: "RESTING",
      color: "#00E5FF",
      formatted,
    };
  }
  return {
    bpm: safeBpm,
    category: "Elevated",
    status: "ELEVATED",
    color: "#FF1744",
    formatted,
  };
}
