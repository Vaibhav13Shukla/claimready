import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { aiExtract, ExtractionOutputSchema } from "../../../ai/extract";
import { Scheme } from "../../../core/taxonomy/taxonomy.schema";
import { isRateLimited, clientKeyFromRequest } from "../../../lib/rate-limit";

// Cap the free-text field before it ever reaches the OpenAI prompt — a real
// EPFO rejection remark is a short line, not a multi-KB payload.
const ExtractRequestSchema = z.object({
  text: z.string().max(2000).optional(),
  imageBase64: z.string().max(6_000_000).optional(), // ~4.5MB decoded, generous for a demo screenshot
  schemeHint: Scheme.optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(clientKeyFromRequest(req))) {
      return NextResponse.json({ error: "Too many requests, please slow down" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = ExtractRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { text, imageBase64, schemeHint } = parsed.data;

    const { result, source } = await aiExtract({ text, imageBase64, schemeHint });

    const validated = ExtractionOutputSchema.safeParse(result);
    if (!validated.success) {
      return NextResponse.json({ error: "Extraction validation failed" }, { status: 422 });
    }

    return NextResponse.json({ success: true, data: validated.data, source });
  } catch {
    // Never leak internal error details to the client; server logs carry the detail.
    return NextResponse.json({ error: "Failed to process extraction request" }, { status: 500 });
  }
}
