"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { Scheme } from "../../core/taxonomy/taxonomy.schema";
import { COMMON_ERROR_OPTIONS } from "../../ai/fallback";

const CLAIM_LABEL: Record<Scheme, { en: string; hi: string; icon: string }> = {
  FINAL_SETTLEMENT: { en: "Final Settlement", hi: "अंतिम भुगतान", icon: "🧾" },
  PF_ADVANCE: { en: "PF Advance", hi: "पीएफ एडवांस", icon: "🏥" },
  PENSION_EPS: { en: "Pension / EPS", hi: "पेंशन / ईपीएस", icon: "👵" },
};

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();

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
      }).toString()}`
    );
  };

  const claim = CLAIM_LABEL[scheme];

  return (
    <div className="max-w-xl mx-auto px-6 sm:px-8 py-10">
      <div className="cr-badge fade-up">
        <span className="cr-tick" />
        <span>{lang === "hi" ? "चरण 2 / 4 · पुष्टि" : "Step 2 / 4 · Verify"}</span>
      </div>
      <h1 className="fade-up mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]" style={{ ["--d" as string]: "0.05s" }}>
        {lang === "hi" ? "निकाले गए केस की पुष्टि करें" : "Confirm the extracted case"}
      </h1>
      <p className="fade-up mt-2 text-sm text-neutral-600" style={{ ["--d" as string]: "0.1s" }}>
        {lang === "hi"
          ? "नियम-इंजन द्वारा कारण वर्गीकृत करने से पहले जांचें कि हमने सही पढ़ा है।"
          : "Review what we read before the deterministic rules engine classifies the cause."}
      </p>

      <div className="fade-up cr-card mt-6 p-6 space-y-5" style={{ ["--d" as string]: "0.15s" }}>
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <span className="text-xs font-semibold text-neutral-500">
            {source === "ai_assisted"
              ? lang === "hi" ? "एआई निष्कर्षण विश्वसनीयता" : "AI extraction confidence"
              : lang === "hi" ? "मिलान विश्वसनीयता" : "Match confidence"}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 border ${
              confidence >= 0.8
                ? "bg-[#067a54]/10 text-[#067a54] border-[#067a54]/30"
                : confidence >= 0.6
                ? "bg-[#b45309]/10 text-[#b45309] border-[#b45309]/30"
                : "bg-[#d21f3c]/10 text-[#d21f3c] border-[#d21f3c]/30"
            }`}
          >
            {Math.round(confidence * 100)}% {source === "ai_assisted" ? "AI" : "match"}
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            {lang === "hi" ? "दावा प्रकार" : "Claim type"}
          </span>
          {isEditing ? (
            <select
              value={scheme}
              onChange={(e) => setScheme(e.target.value as Scheme)}
              aria-label={lang === "hi" ? "दावा प्रकार" : "Claim type"}
              className="w-full cr-card p-2.5 text-sm"
            >
              {(Object.keys(CLAIM_LABEL) as Scheme[]).map((s) => (
                <option key={s} value={s}>
                  {lang === "hi" ? CLAIM_LABEL[s].hi : CLAIM_LABEL[s].en}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2 cr-card p-3">
              <span className="text-lg">{claim.icon}</span>
              <span className="text-sm font-semibold">{lang === "hi" ? claim.hi : claim.en}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            {lang === "hi" ? "पढ़ी गई अस्वीकृति टिप्पणी" : "Extracted rejection remark"}
          </span>
          {isEditing ? (
            <textarea
              rows={3}
              value={errorText}
              onChange={(e) => setErrorText(e.target.value)}
              aria-label={lang === "hi" ? "पढ़ी गई अस्वीकृति टिप्पणी" : "Extracted rejection remark"}
              className="w-full cr-card p-3 text-sm"
            />
          ) : (
            <div className="cr-card p-3.5 text-sm font-medium text-[#0053a3]">
              &ldquo;{errorText}&rdquo;
            </div>
          )}
        </div>

        {isLow && (
          <div className="p-4 bg-[#b45309]/[0.06] border border-[#b45309]/25 space-y-2">
            <div className="text-xs font-bold text-[#b45309]">
              ⚠️ {lang === "hi" ? "कम विश्वसनीयता — निकटतम कारण चुनें" : "Low confidence — pick the matching remark"}
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
                  className="text-left text-xs p-2 bg-white border border-black/10 hover:border-[#006cd2] hover:text-[#006cd2] transition-colors"
                >
                  {opt.phrase_en}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button onClick={proceed} className="cr-btn cr-btn--primary flex-1">
            <span>{lang === "hi" ? "हाँ, निदान चलाएं →" : "Yes, run the diagnosis →"}</span>
          </button>
          <button
            onClick={() => setIsEditing((v) => !v)}
            aria-pressed={isEditing}
            className="cr-btn cr-btn--ghost !min-h-[52px]"
          >
            <span>
              {isEditing
                ? lang === "hi" ? "हो गया" : "Done"
                : lang === "hi" ? "संपादित करें" : "Edit"}
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
