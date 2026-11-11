import { NextResponse } from "next/server";

import {
  diagnosticRequestSchema,
  diagnosticResponseSchema,
  type DiagnosticResponsePayload,
} from "@/lib/schemas";

const emergencyPattern =
  /\b(chest pain|chest pressure|heart attack|face droop|facial droop|arm weakness|leg weakness|speech difficulty|slurred speech|sudden confusion|sudden numbness|severe sudden headache)\b/i;

const emergencyResponse: DiagnosticResponsePayload = {
  summary: "These symptoms may indicate a medical emergency.",
  severity: "emergency",
  recommendedAction:
    "Call emergency services now or go to the nearest emergency department. Do not drive yourself.",
  icd11Code: "MG26.0",
  disclaimers: [
    "This is an emergency safety escalation, not a diagnosis.",
    "Do not delay emergency care while waiting for further guidance.",
  ],
  emergencyEscalation: true,
};

function isEmergencyRequest(
  symptoms: readonly string[],
  duration: string,
): boolean {
  return emergencyPattern.test(`${symptoms.join(" ")} ${duration}`);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsedRequest = diagnosticRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: "Invalid diagnostic request.",
        issues: parsedRequest.error.issues,
      },
      { status: 400 },
    );
  }

  const response = isEmergencyRequest(
    parsedRequest.data.symptoms,
    parsedRequest.data.duration,
  )
    ? emergencyResponse
    : {
        summary: "Further clinical assessment is needed to interpret these symptoms.",
        severity: "moderate" as const,
        recommendedAction:
          "Arrange an appointment with a qualified healthcare professional.",
        icd11Code: "RA01.0",
        disclaimers: [
          "This tool does not provide a diagnosis or replace professional medical advice.",
        ],
        emergencyEscalation: false,
      };

  return NextResponse.json(diagnosticResponseSchema.parse(response), {
    status: 200,
  });
}
