import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePlainExplanation } from "../../../ai/explain";
import { RootCauseCode, Owner, Scheme } from "../../../core/taxonomy/taxonomy.schema";
import { getTaxonomy } from "../../../core/classifier";
import { isRateLimited, clientKeyFromRequest } from "../../../lib/rate-limit";

// Human-readable claim-type labels the model prompt is allowed to see. Kept
// as a closed map keyed by the validated Scheme enum — never pass a client
// string straight through — so this can never become an injection vector.
const SCHEME_LABEL: Record<Scheme, string> = {
  FINAL_SETTLEMENT: "Final Settlement",
  PF_ADVANCE: "PF Advance",
  PENSION_EPS: "Pension / EPS",
};

const ExplainRequestSchema = z.object({
  root_cause_code: RootCauseCode,
  owner: Owner,
  language: z.enum(["hi", "en"]).optional(),
  scheme: Scheme.optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(clientKeyFromRequest(req))) {
      return NextResponse.json({ error: "Too many requests, please slow down" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = ExplainRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { root_cause_code, owner, language, scheme } = parsed.data;
    const resolvedLanguage = language === "hi" ? "hi" : "en";

    // The label hint is derived server-side from the validated root cause —
    // never taken from the client — so nothing free-text from the request
    // reaches the OpenAI prompt.
    const labelHint = getTaxonomy()[root_cause_code]?.label_en;

    const { explanation, source } = await generatePlainExplanation({
      root_cause_code,
      owner,
      language: resolvedLanguage,
      schemeName: scheme ? SCHEME_LABEL[scheme] : undefined,
      labelHint,
    });

    return NextResponse.json({ success: true, explanation, source, language: resolvedLanguage });
  } catch {
    // Never leak internal error details to the client; server logs carry the detail.
    return NextResponse.json({ error: "Failed to generate plain-language explanation" }, { status: 500 });
  }
}
