import { z } from "zod";

const vitalsSchema = z
  .object({
    bmi: z.number().finite().nonnegative().optional(),
    bp: z.string().trim().min(1).optional(),
    glucose: z.number().finite().nonnegative().optional(),
  })
  .strict();

export const diagnosticRequestSchema = z
  .object({
    age: z.number().finite().nonnegative(),
    gender: z.enum(["male", "female", "other"]),
    symptoms: z.array(z.string().trim().min(1)),
    duration: z.string().trim().min(1),
    vitals: vitalsSchema.optional(),
  })
  .strict();

export const diagnosticResponseSchema = z
  .object({
    summary: z.string(),
    severity: z.enum(["low", "moderate", "high", "emergency"]),
    recommendedAction: z.string(),
    icd11Code: z.string(),
    disclaimers: z.array(z.string()),
    emergencyEscalation: z.boolean(),
  })
  .strict();

export type DiagnosticRequestPayload = z.infer<typeof diagnosticRequestSchema>;
export type DiagnosticResponsePayload = z.infer<typeof diagnosticResponseSchema>;
