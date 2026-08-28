"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { Scheme } from "../../core/taxonomy/taxonomy.schema";
import { COMMON_ERROR_OPTIONS } from "../../ai/fallback";

const CLAIM_LABEL: Record<Scheme, { en: string; hi: string }> = {
  FINAL_SETTLEMENT: { en: "Final Settlement", hi: "अंतिम भुगतान" },
  PF_ADVANCE: { en: "PF Advance", hi: "पीएफ एडवांस" },
  PENSION_EPS: { en: "Pension / EPS", hi: "पेंशन / ईपीएस" },
};

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const hi = lang === "hi";

  const initialScheme = (searchParams.get("scheme") as Scheme) || "FINAL_SETTLEMENT";
  const initialText = searchParams.get("raw_error_text") || "";
  const confidence = parseFloat(searchParams.get("confidence") || "0.85");
  const goldenId = searchParams.get("golden_id");
  const source = searchParams.get("source");

  const [scheme, setScheme] = useState<Scheme>(initialScheme);
  const [errorText, setErrorText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const isLow = confidence < 0.6;

  const proceed = () => {
    router.push(
      `/diagnosis?${new URLSearchParams({
        scheme,
        raw_error_text: errorText,
        confidence: String(confidence),
        ...(goldenId ? { golden_id: goldenId } : {}),
      }).toString()}`,
    );
  };

  const claim = CLAIM_LABEL[scheme];

  return (
    <div className="max-w-[640px] mx-auto px-6 sm:px-8 py-10">
      {/* Step Badge */}
      <div className="cr-badge fade-up">
        <span>{hi ? "चरण 2 / 4: पुष्टि" : "Step 2 of 4: Verify Case"}</span>
      </div>

      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {hi ? "केस विवरण की पुष्टि करें" : "Confirm the Extracted Case"}
      </h1>
      <p className="fade-up mt-1.5 text-[15px] text-[#6e6e6e]" style={{ ["--d" as string]: "0.1s" }}>
        {hi
          ? "नियम-इंजन द्वारा कारण वर्गीकृत करने से पहले जांचें कि विवरण सही है।"
          : "Review the claim remark before our deterministic rules engine maps the root cause and remedy."}
      </p>

      <div className="fade-up cr-card mt-6 p-6 sm:p-7 bg-white space-y-5" style={{ ["--d" as string]: "0.15s" }}>
        {/* Confidence Row */}
        <div className="flex items-center justify-between border-b border-[#e1dfd8] pb-3.5">
          <span className="text-[13px] font-semibold text-[#6e6e6e]">
            {source === "ai_assisted"
              ? hi
                ? "निष्कर्षण विश्वसनीयता"
                : "Extraction Confidence"
              : hi
                ? "मिलान विश्वसनीयता"
                : "Match Confidence"}
          </span>
          <span
            className={`text-[12px] font-bold px-3 py-1 rounded-[9999px] border ${
              confidence >= 0.8
                ? "bg-[#067a54]/10 text-[#067a54] border-[#067a54]/25"
                : confidence >= 0.6
                  ? "bg-[#b45309]/10 text-[#b45309] border-[#b45309]/25"
                  : "bg-[#d21f3c]/10 text-[#d21f3c] border-[#d21f3c]/25"
            }`}
          >
            {Math.round(confidence * 100)}% {source === "ai_assisted" ? "AI" : "Match"}
          </span>
        </div>

        {/* Claim Type */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
            {hi ? "दावा प्रकार" : "Claim Type"}
          </span>
          {isEditing ? (
            <select
              value={scheme}
              onChange={(e) => setScheme(e.target.value as Scheme)}
              aria-label={hi ? "दावा प्रकार" : "Claim type"}
              className="w-full p-3 text-sm rounded-[12.8px] border border-[#a3a3a3] bg-white text-[#1b1d20]"
            >
              {(Object.keys(CLAIM_LABEL) as Scheme[]).map((s) => (
                <option key={s} value={s}>
                  {hi ? CLAIM_LABEL[s].hi : CLAIM_LABEL[s].en}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 rounded-[12.8px] bg-[#f2f1ec] border border-[#e1dfd8] text-[14px] font-semibold text-[#1b1d20]">
              {hi ? claim.hi : claim.en}
            </div>
          )}
        </div>

        {/* Extracted Remark */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
            {hi ? "पढ़ी गई अस्वीकृति टिप्पणी" : "Extracted Rejection Remark"}
          </span>
          {isEditing ? (
            <textarea
              rows={3}
              value={errorText}
              onChange={(e) => setErrorText(e.target.value)}
              aria-label={hi ? "पढ़ी गई अस्वीकृति टिप्पणी" : "Extracted rejection remark"}
              className="w-full p-3 text-sm rounded-[12.8px] border border-[#a3a3a3] bg-white text-[#1b1d20]"
            />
          ) : (
            <div className="p-3.5 rounded-[12.8px] bg-[#5196fe]/[0.06] border border-[#5196fe]/20 text-[14px] font-medium text-[#1b5bb5]">
              &ldquo;{errorText}&rdquo;
            </div>
          )}
        </div>

        {/* Low confidence helper */}
        {isLow && (
          <div className="p-4 rounded-[12.8px] bg-[#b45309]/[0.06] border border-[#b45309]/25 space-y-2">
            <div className="text-xs font-bold text-[#b45309]">
              {hi
                ? "कम विश्वसनीयता: कृपया नीचे से सही कारण चुनें"
                : "Low confidence: select the closest matching reason"}
            </div>
            <div className="grid gap-1.5">
              {COMMON_ERROR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setErrorText(opt.phrase_en);
                    setScheme(opt.scheme);
                  }}
                  className="text-left text-xs p-2.5 rounded-[8px] bg-white border border-[#e1dfd8] hover:border-[#5196fe] hover:text-[#5196fe] transition-colors"
                >
                  {opt.phrase_en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button onClick={proceed} className="cr-btn cr-btn--primary flex-1 !min-h-[46px] !text-[14px]">
            <span>{hi ? "हाँ, निदान चलाएं →" : "Yes, Run Diagnosis →"}</span>
          </button>
          <button
            onClick={() => setIsEditing((v) => !v)}
            aria-pressed={isEditing}
            className="cr-btn cr-btn--ghost !min-h-[46px] !px-5 !text-[14px]"
          >
            <span>
              {isEditing
                ? hi
                  ? "पूर्ण"
                  : "Done"
                : hi
                  ? "संपादित करें"
                  : "Edit"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-neutral-500">Loading…</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
