import { z } from "zod";
import { Scheme } from "../core/taxonomy/taxonomy.schema";
import { EXTRACTION_SYSTEM_PROMPT } from "./prompts";

export const ExtractionOutputSchema = z.object({
  scheme: Scheme.nullable(),
  raw_error_text: z.string().nullable(),
  visible_date: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;

export interface ExtractionInput {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
  schemeHint?: Scheme;
}

// Deterministic fallback: heuristic pattern scanning when offline or without an API key.
export function heuristicExtract(input: ExtractionInput): ExtractionOutput {
  const content = (input.text || "").toLowerCase();

  let detectedScheme: Scheme | null = input.schemeHint ?? null;
  if (!detectedScheme) {
    if (
      content.includes("form 19") ||
      content.includes("final settlement") ||
      content.includes("full withdrawal") ||
      content.includes("leaving")
    ) {
      detectedScheme = "FINAL_SETTLEMENT";
    } else if (
      content.includes("form 31") ||
      content.includes("advance") ||
      content.includes("medical") ||
      content.includes("housing") ||
      content.includes("education")
    ) {
      detectedScheme = "PF_ADVANCE";
    } else if (
      content.includes("pension") ||
      content.includes("eps") ||
      content.includes("form 10c") ||
      content.includes("form 10d")
    ) {
      detectedScheme = "PENSION_EPS";
    }
  }

  const phrases = [
    "name mismatch",
    "name does not match aadhaar",
    "date of birth mismatch",
    "dob mismatch",
    "bank kyc not verified",
    "bank account not verified",
    "bank account inactive",
    "ifsc mismatch",
    "date of exit not updated",
    "exit date not marked",
    "employer has not updated date of exit",
    "kyc pending",
  ];

  let raw_error_text: string | null = null;
  let confidence = 0.5;

  for (const phrase of phrases) {
    if (content.includes(phrase)) {
      raw_error_text = input.text ? input.text.trim() : phrase;
      confidence = 0.92;
      break;
    }
  }

  if (!raw_error_text && input.text && input.text.trim().length > 3) {
    raw_error_text = input.text.trim();
    confidence = 0.7;
  }

  return {
    scheme: detectedScheme,
    raw_error_text,
    visible_date: null,
    confidence: raw_error_text ? confidence : 0.1,
  };
}

// Genuine OpenAI-powered extraction. Falls back to the deterministic heuristic
// when no API key is configured or the model call fails — so the demo never breaks.
export async function aiExtract(
  input: ExtractionInput,
): Promise<{ result: ExtractionOutput; source: "ai_assisted" | "fixture_rules" }> {
  // Only compute the heuristic fallback where it's actually needed (no key,
  // or the AI call didn't pan out) instead of unconditionally on every call
  // — on the common AI-configured-and-successful path, that work was
  // previously always wasted.
  if (!process.env.OPENAI_API_KEY || !input.text || input.text.trim().length < 3) {
    return { result: heuristicExtract(input), source: "fixture_rules" };
  }

  try {
    const { generateObject } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const { object } = await generateObject({
      model: openai(model),
      schema: ExtractionOutputSchema,
      system: EXTRACTION_SYSTEM_PROMPT,
      prompt: `EPFO claim status / rejection text from the member:\n"""\n${input.text}\n"""\n${
        input.schemeHint ? `The member indicated claim type: ${input.schemeHint}.` : ""
      }`,
    });

    const parsed = ExtractionOutputSchema.safeParse(object);
    if (!parsed.success) return { result: heuristicExtract(input), source: "fixture_rules" };

    // Prefer the member's explicit claim-type hint if the model returned null.
    const merged: ExtractionOutput = {
      ...parsed.data,
      scheme: parsed.data.scheme ?? input.schemeHint ?? null,
      raw_error_text: parsed.data.raw_error_text ?? heuristicExtract(input).raw_error_text,
    };
    return { result: merged, source: "ai_assisted" };
  } catch {
    return { result: heuristicExtract(input), source: "fixture_rules" };
  }
}
