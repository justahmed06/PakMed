// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import Vitals from "@/app/components/Vitals";
import { DEFAULT_VITALS_INPUTS, resetSession, saveVitalsInputs } from "@/lib/storage";

function openBmiEditor() {
  const title = screen.getByText("BMI (ASIAN CRITERIA)");
  const card = title.closest(".card-container");
  if (!card) throw new Error("BMI card was not rendered");
  fireEvent.click(card);
}

function bmiStatus() {
  const title = screen.getByText("BMI (ASIAN CRITERIA)");
  return title.closest(".card-container")?.querySelector(".stat")?.textContent ?? "";
}

function bmiValue() {
  const title = screen.getByText("BMI (ASIAN CRITERIA)");
  return title.closest(".card-container")?.querySelector(".v-value")?.textContent ?? "";
}

function bmiFeedback() {
  const title = screen.getByText("BMI (ASIAN CRITERIA)");
  return title.closest(".card-container")?.querySelector(".calc-preview[role='status']")?.textContent ?? "";
}

describe("Vitals BMI input component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetSession();
    saveVitalsInputs(DEFAULT_VITALS_INPUTS);
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    resetSession();
  });

  it("withholds BMI and shows feedback when metric inputs overflow or underflow the calculation", () => {
    render(<Vitals />);
    openBmiEditor();

    const height = screen.getByLabelText("HEIGHT (CM)");
    fireEvent.change(height, { target: { value: "1e-300" } });

    expect(bmiValue()).toBe("—");
    expect(bmiStatus()).toContain("INVALID INPUT");
    expect(bmiFeedback()).toContain("cannot produce a finite positive BMI");

    fireEvent.change(screen.getByLabelText("HEIGHT (CM)"), { target: { value: "170" } });
    fireEvent.change(screen.getByLabelText("WEIGHT (KG)"), { target: { value: "1e308" } });
    expect(bmiValue()).toBe("—");
    expect(bmiStatus()).toContain("INVALID INPUT");
    expect(bmiFeedback()).toContain("cannot produce a finite positive BMI");
  });

  it("handles imperial conversion overflow with feedback and no stale classification", () => {
    render(<Vitals />);
    openBmiEditor();
    fireEvent.click(screen.getByRole("button", { name: "FEET & INCHES" }));
    fireEvent.change(screen.getByLabelText("HEIGHT (FEET)"), { target: { value: "1e308" } });

    expect(bmiValue()).toBe("—");
    expect(bmiStatus()).toContain("INVALID INPUT");
    expect(bmiFeedback()).toContain("cannot convert to a finite positive centimetre height");
  });

  it("preserves an invalid imperial draft when switching to centimetres and requires explicit discard", () => {
    render(<Vitals />);
    openBmiEditor();
    fireEvent.click(screen.getByRole("button", { name: "FEET & INCHES" }));
    const inches = screen.getByLabelText("HEIGHT (INCHES, 0–<12)");
    fireEvent.change(inches, { target: { value: "" } });
    expect(bmiValue()).toBe("—");
    expect(bmiStatus()).toContain("INVALID INPUT");

    fireEvent.click(screen.getByRole("button", { name: "CENTIMETRES" }));
    expect(bmiValue()).toBe("—");
    expect(bmiStatus()).toContain("INVALID INPUT");
    expect(screen.getByRole("alert").textContent).toContain("unfinished feet-and-inches height is still invalid");

    fireEvent.click(screen.getByRole("button", { name: "FEET & INCHES" }));
    expect((screen.getByLabelText("HEIGHT (INCHES, 0–<12)") as HTMLInputElement).value).toBe("");
    fireEvent.change(screen.getByLabelText("HEIGHT (INCHES, 0–<12)"), { target: { value: "7" } });

    expect(bmiStatus()).not.toContain("INVALID INPUT");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("allows explicitly discarding an invalid imperial draft to use the last valid centimetre value", () => {
    render(<Vitals />);
    openBmiEditor();
    fireEvent.click(screen.getByRole("button", { name: "FEET & INCHES" }));
    fireEvent.change(screen.getByLabelText("HEIGHT (INCHES, 0–<12)"), { target: { value: "12" } });
    fireEvent.click(screen.getByRole("button", { name: "CENTIMETRES" }));
    fireEvent.click(screen.getByRole("button", { name: "DISCARD FEET & INCHES DRAFT" }));

    expect(bmiStatus()).not.toContain("INVALID INPUT");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("recovers after correcting a zero-total imperial height", () => {
    render(<Vitals />);
    openBmiEditor();
    fireEvent.click(screen.getByRole("button", { name: "FEET & INCHES" }));
    fireEvent.change(screen.getByLabelText("HEIGHT (FEET)"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("HEIGHT (INCHES, 0–<12)"), { target: { value: "0" } });

    expect(bmiStatus()).toContain("INVALID INPUT");
    fireEvent.change(screen.getByLabelText("HEIGHT (INCHES, 0–<12)"), { target: { value: "1" } });
    expect(bmiStatus()).not.toContain("INVALID INPUT");
  });
});
