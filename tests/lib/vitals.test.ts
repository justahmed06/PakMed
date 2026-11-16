import { describe, expect, it } from "vitest";

import {
  calculateAsianBmi,
  classifyBloodPressure,
  classifyGlucose,
  classifyHeartRate,
} from "@/lib/vitals";

describe("vitals utilities", () => {
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
