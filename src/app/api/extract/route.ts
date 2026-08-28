import { NextRequest, NextResponse } from "next/server";
import { aiExtract, ExtractionOutputSchema } from "../../../ai/extract";
import type { Scheme } from "../../../core/taxonomy/taxonomy.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, imageBase64, schemeHint } = body ?? {};

    const { result, source } = await aiExtract({
      text,
      imageBase64,
      schemeHint: schemeHint as Scheme | undefined,
    });

    const parsed = ExtractionOutputSchema.safeParse(result);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Extraction validation failed", details: parsed.error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: parsed.data, source });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Failed to process extraction request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
