import { NextRequest, NextResponse } from "next/server";
import { generatePlainExplanation } from "../../../ai/explain";
import type { RootCauseCode, Owner } from "../../../core/taxonomy/taxonomy.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { root_cause_code, owner, language = "en", schemeName, labelHint } = body ?? {};

    if (!root_cause_code || !owner) {
      return NextResponse.json(
        { error: "Missing required fields: root_cause_code and owner are required" },
        { status: 400 }
      );
    }

    const { explanation, source } = await generatePlainExplanation({
      root_cause_code: root_cause_code as RootCauseCode,
      owner: owner as Owner,
      language: language === "hi" ? "hi" : "en",
      schemeName,
      labelHint,
    });

    return NextResponse.json({ success: true, explanation, source, language });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Failed to generate plain-language explanation",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
