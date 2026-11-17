import { describe, expect, it } from "vitest";

import {
  calculateAsianBmi,
  centimetresToFeetInches,
  classifyBloodPressure,
  classifyGlucose,
  classifyHeartRate,
  feetInchesToCentimetres,
} from "@/lib/vitals";

describe("vitals utilities", () => {
  describe("height unit conversion", () => {
    it("converts feet and inches using the exact inch-to-centimetre factor", () => {
      expect(feetInchesToCentimetres(5, 8)).toBeCloseTo(172.72, 10);
    });

    it("preserves the physical height when switching units and back", () => {
      const centimetres = 170.25;
      const imperial = centimetresToFeetInches(centimetres);

      expect(feetInchesToCentimetres(imperial.feet, imperial.inches)).toBeCloseTo(centimetres, 10);
    });

    it.each([-1, 12, Number.NaN, Number.POSITIVE_INFINITY])(
      "rejects inches outside [0, 12): %s",
      (inches) => expect(() => feetInchesToCentimetres(5, inches)).toThrow(RangeError),
    );

    it("rejects non-integer feet and zero total height", () => {
      expect(() => feetInchesToCentimetres(5.5, 0)).toThrow(RangeError);
      expect(() => feetInchesToCentimetres(0, 0)).toThrow(RangeError);
    });
  });

  const invalidMeasurements = [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

  it.each(invalidMeasurements)("rejects invalid BMI weight %s", (weight) => {
    expect(() => calculateAsianBmi(weight, 170)).toThrow(RangeError);
  });

  it.each(invalidMeasurements)("rejects invalid BMI height %s", (height) => {
    expect(() => calculateAsianBmi(70, height)).toThrow(RangeError);
  });

  it.each(invalidMeasurements)("rejects invalid systolic pressure %s", (value) => {
    expect(() => classifyBloodPressure(value, 80)).toThrow(RangeError);
  });

  it.each(invalidMeasurements)("rejects invalid diastolic pressure %s", (value) => {
    expect(() => classifyBloodPressure(120, value)).toThrow(RangeError);
  });

  it.each(invalidMeasurements)("rejects invalid glucose %s", (value) => {
    expect(() => classifyGlucose(value)).toThrow(RangeError);
  });

  it.each(invalidMeasurements)("rejects invalid heart rate %s", (value) => {
    expect(() => classifyHeartRate(value)).toThrow(RangeError);
  });

  describe("calculateAsianBmi", () => {
    it("preserves the current adult BMI category boundaries", () => {
      const cases = [
        [18.4, "Underweight"],
        [18.5, "Normal"],
        [22.9, "Normal"],
        [23, "Overweight"],
        [27.4, "Overweight"],
        [27.5, "Obese"],
      ] as const;

      for (const [weightKg, category] of cases) {
        expect(calculateAsianBmi(weightKg, 100).category).toBe(category);
      }
    });

    it("formats BMI independently from its returned numeric value", () => {
      const result = calculateAsianBmi(70, 175);

      expect(result.bmi).toBe(22.9);
      expect(result.formatted).toBe("22.9");
    });

    it("rejects finite measurements whose BMI arithmetic underflows or overflows", () => {
      expect(() => calculateAsianBmi(70, Number.MIN_VALUE)).toThrow(RangeError);
      expect(() => calculateAsianBmi(Number.MAX_VALUE, 100)).toThrow(RangeError);
    });
  });

  describe("classifyBloodPressure", () => {
    it("uses the current stage precedence at documented boundaries", () => {
      const cases = [
        [[119, 79], "Normal"],
        [[120, 79], "Elevated"],
        [[129, 79], "Elevated"],
        [[130, 79], "Stage 1"],
        [[139, 79], "Stage 1"],
        [[140, 79], "Stage 2"],
        [[181, 79], "Hypertensive Crisis"],
        [[120, 80], "Stage 1"],
      ] as const;

      for (const [[systolic, diastolic], stage] of cases) {
        expect(classifyBloodPressure(systolic, diastolic).stage).toBe(stage);
      }
    });
  });

  describe("classifyGlucose", () => {
    it("preserves fasting category boundaries", () => {
      const cases = [[69, "Low"], [70, "Normal"], [99, "Normal"], [100, "Elevated"], [125, "Elevated"], [126, "High"]] as const;

      for (const [value, category] of cases) {
        expect(classifyGlucose(value, "fasting").category).toBe(category);
      }
    });

    it("preserves postprandial category boundaries", () => {
      const cases = [[69, "Low"], [70, "Normal"], [139, "Normal"], [140, "Elevated"], [199, "Elevated"], [200, "High"]] as const;

      for (const [value, category] of cases) {
        expect(classifyGlucose(value, "postprandial").category).toBe(category);
      }
    });
  });

  describe("classifyHeartRate", () => {
    it("preserves the current resting heart-rate boundaries", () => {
      expect(classifyHeartRate(59).category).toBe("Low");
      expect(classifyHeartRate(60).category).toBe("Normal");
      expect(classifyHeartRate(100).category).toBe("Normal");
      expect(classifyHeartRate(101).category).toBe("Elevated");
    });
  });
});
