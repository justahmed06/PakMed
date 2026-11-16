import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/diagnose/route";
import { diagnosticRequestSchema } from "@/lib/schemas";

const validRequest = {
  age: 30,
  gender: "other",
  symptoms: ["persistent cough"],
  duration: "two days",
};

describe("diagnosis request validation", () => {
  it("rejects invalid and unexpected request fields", () => {
    expect(diagnosticRequestSchema.safeParse({ ...validRequest, age: -1 }).success).toBe(false);
    expect(diagnosticRequestSchema.safeParse({ ...validRequest, unexpected: true }).success).toBe(false);
  });

  it("returns a controlled 400 response for malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/diagnose", { method: "POST", body: "not json" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Request body must be valid JSON." });
  });

  it("returns a controlled 400 response for an invalid payload", async () => {
    const response = await POST(new Request("http://localhost/api/diagnose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...validRequest, symptoms: [""] }),
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "Invalid diagnostic request." });
  });

  it("returns the current bounded placeholder response for a valid payload", async () => {
    const response = await POST(new Request("http://localhost/api/diagnose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest),
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ severity: "moderate", emergencyEscalation: false });
  });
});
