"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { Scheme } from "../../core/taxonomy/taxonomy.schema";
import { COMMON_ERROR_OPTIONS } from "../../ai/fallback";

const CLAIM_TYPES: { id: Scheme; key: string }[] = [
  { id: "FINAL_SETTLEMENT", key: "claim_final" },
  { id: "PF_ADVANCE", key: "claim_advance" },
  { id: "PENSION_EPS", key: "claim_pension" },
];

export interface GoldenCase {
  id: string;
  scheme: Scheme;
  text: string;
  badge: string;
}

export const GOLDEN_CASES: GoldenCase[] = [
  {
    id: "GC-01",
    scheme: "FINAL_SETTLEMENT",
    text: "Claim rejected: Name mismatch as per Aadhaar",
    badge: "RC01: Name",
  },
  {
    id: "GC-02",
    scheme: "PF_ADVANCE",
    text: "Rejected: Name mismatch between UAN and bank KYC",
    badge: "RC01: Name",
  },
  {
    id: "GC-03",
    scheme: "FINAL_SETTLEMENT",
    text: "Claim rejected: Date of Birth not matching Aadhaar",
    badge: "RC02: DOB",
  },
  {
    id: "GC-04",
    scheme: "PF_ADVANCE",
    text: "Rejected: Bank KYC not verified / account inactive",
    badge: "RC03: Bank",
  },
  {
    id: "GC-05",
    scheme: "FINAL_SETTLEMENT",
    text: "Rejected: Date of Exit not updated by employer",
    badge: "RC04: Exit date",
  },
  {
    id: "GC-06",
    scheme: "PENSION_EPS",
    text: "Claim rejected: IFSC mismatch, payment returned by bank",
    badge: "RC03: Bank",
  },
  {
    id: "GC-07",
    scheme: "FINAL_SETTLEMENT",
    text: "Claim rejected: Multiple UAN found, previous PF account not transferred",
    badge: "RC05: Multiple UAN",
  },
];

function IntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();
  const hi = lang === "hi";

  const [scheme, setScheme] = useState<Scheme>(() => {
    const s = searchParams.get("scheme") as Scheme;
    return s && CLAIM_TYPES.some((c) => c.id === s) ? s : "FINAL_SETTLEMENT";
  });
  const [activeTab, setActiveTab] = useState<"samples" | "paste" | "upload">(() => {
    const tab = searchParams.get("tab");
    return tab === "paste" || tab === "upload" || tab === "samples" ? tab : "samples";
  });
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const goToConfirm = (params: Record<string, string>) => {
    router.push(`/confirm?${new URLSearchParams(params).toString()}`);
  };

  const handleGolden = (gc: GoldenCase) => {
    goToConfirm({
      scheme: gc.scheme,
      raw_error_text: gc.text,
      confidence: "0.95",
      golden_id: gc.id,
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const demo =
      scheme === "PF_ADVANCE"
        ? "Rejected: Bank KYC not verified / account inactive"
        : scheme === "PENSION_EPS"
          ? "Claim rejected: IFSC mismatch, payment returned by bank"
          : "Claim rejected: Name mismatch as per Aadhaar";
    setErrorText(demo);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!errorText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: errorText, schemeHint: scheme }),
      });
      const data = await res.json();
      const extracted = data.data || { scheme, raw_error_text: errorText, confidence: 0.85 };
      goToConfirm({
        scheme: extracted.scheme || scheme,
        raw_error_text: extracted.raw_error_text || errorText,
        confidence: String(extracted.confidence ?? 0.85),
        source: data.source || "fixture_rules",
      });
    } catch {
      goToConfirm({ scheme, raw_error_text: errorText, confidence: "0.8" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: "samples", label: t("intake_tab_samples") },
    { id: "paste", label: t("intake_tab_paste") },
    { id: "upload", label: t("intake_tab_upload") },
  ];

  return (
    <div className="max-w-[880px] mx-auto px-6 sm:px-8 py-10">
      {/* Step Badge */}
      <div className="cr-badge fade-up" style={{ ["--d" as string]: "0s" }}>
        <span>{hi ? "चरण 1 / 4: दावा इनपुट" : "Step 1 of 4: Claim Intake"}</span>
      </div>

      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {hi ? "अपने दावे की जांच करें" : "Check Your Claim"}
      </h1>
      <p
        className="fade-up mt-1.5 text-[15px] text-[#6e6e6e] max-w-[640px]"
        style={{ ["--d" as string]: "0.1s" }}
      >
        {hi
          ? "दावा प्रकार चुनें, फिर डेमो केस आज़माएं या अपनी अस्वीकृति टिप्पणी दर्ज करें।"
          : "Select your claim type, then test a common rejection scenario or paste your actual EPFO error remark."}
      </p>

      {/* Claim Type Selector */}
      <fieldset className="fade-up mt-7 border-0 p-0 m-0" style={{ ["--d" as string]: "0.15s" }}>
        <legend className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6e6e6e] mb-2.5">
          {t("select_scheme")}
        </legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          role="radiogroup"
          aria-label={t("select_scheme")}
        >
          {CLAIM_TYPES.map((c) => {
            const isSelected = scheme === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setScheme(c.id)}
                className={`p-4 rounded-[16px] text-left transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#5196fe] text-white border-[#5196fe] shadow-sm"
                    : "bg-[#f2f1ec] text-[#1b1d20] border-[#e1dfd8] hover:bg-[#e8e6df]"
                }`}
              >
                <div className="text-[15px] font-semibold leading-tight">{t(c.key as never)}</div>
                <div className={`text-[12px] mt-1.5 leading-snug ${isSelected ? "text-white/80" : "text-[#6e6e6e]"}`}>
                  {c.id === "FINAL_SETTLEMENT"
                    ? (hi ? "नौकरी छोड़ने के बाद पूरा सेटलमेंट (Form 19 / 10C)" : "Full PF withdrawal (Form 19 / 10C)")
                    : c.id === "PF_ADVANCE"
                      ? (hi ? "आंशिक निकासी: चिकित्सा, आवास (Form 31)" : "Partial advance (Form 31)")
                      : (hi ? "पेंशन व स्कीम सर्टिफिकेट (Form 10D)" : "EPS pension (Form 10D)")}
                </div>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Mode Selection Tabs. flex-nowrap + overflow-x-auto rather than
          flex-wrap: a 9999px-radius pill wrapping its own content onto a
          second line renders as a broken stadium shape (verified on a
          375px viewport) — scrolling horizontally keeps the pill intact,
          which is the more common mobile tab-bar pattern anyway. */}
      <div
        className="fade-up mt-7 flex flex-nowrap gap-2 p-1.5 rounded-[9999px] bg-[#f2f1ec] border border-[#e1dfd8] w-fit max-w-full overflow-x-auto"
        style={{ ["--d" as string]: "0.2s" }}
        role="tablist"
      >
        {tabs.map((tb) => {
          const isActive = activeTab === tb.id;
          return (
            <button
              key={tb.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tb.id)}
              className={`shrink-0 px-4 py-1.5 rounded-[9999px] text-[13px] sm:text-[14px] font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-[#1b1d20] shadow-sm font-semibold"
                  : "text-[#6e6e6e] hover:text-[#1b1d20]"
              }`}
            >
              {tb.label}
            </button>
          );
        })}
      </div>

      {/* 1. Samples Grid */}
      {activeTab === "samples" && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {GOLDEN_CASES.map((gc) => (
            <button
              key={gc.id}
              onClick={() => handleGolden(gc)}
              className="cr-card p-5 text-left bg-white hover:border-[#5196fe] hover:bg-[#f2f1ec]/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-[9999px] bg-[#5196fe]/10 text-[#3f75c6]">
                    {gc.id}
                  </span>
                  <span className="text-[11px] text-[#6e6e6e] font-medium">{gc.badge}</span>
                </div>
                <p className="text-[14px] font-medium text-[#1b1d20] group-hover:text-[#3f75c6] leading-relaxed">
                  &ldquo;{gc.text}&rdquo;
                </p>
              </div>
              <div className="mt-3.5 pt-3 border-t border-[#e1dfd8] flex items-center justify-between text-[12px] font-semibold text-[#5196fe]">
                <span>{hi ? "निदान चलाएं" : "Diagnose this case"}</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 2. Paste Rejection Remark */}
      {activeTab === "paste" && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="cr-card p-6 bg-white space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
              {hi ? "अस्वीकृति टिप्पणी दर्ज करें" : "Paste Rejection Remark"}
            </label>
            <textarea
              rows={4}
              value={errorText}
              onChange={(e) => setErrorText(e.target.value)}
              placeholder={t("intake_paste_placeholder")}
              aria-label={t("intake_tab_paste")}
              className="w-full p-3.5 text-[15px] text-[#1b1d20] placeholder:text-[#797876] rounded-[12.8px] border border-[#a3a3a3] focus:border-[#5196fe] transition-all bg-white"
              required
            />

            <div>
              <span className="text-[12px] font-semibold text-[#6e6e6e] block mb-2">
                {hi ? "सामान्य त्रुटि उदाहरण:" : "Common error quick select:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {COMMON_ERROR_OPTIONS.slice(0, 5).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setErrorText(opt.phrase_en);
                      setScheme(opt.scheme);
                    }}
                    className="text-[12px] px-3 py-1.5 rounded-[9999px] bg-[#f2f1ec] border border-[#e1dfd8] text-[#1b1d20] hover:border-[#5196fe] hover:text-[#5196fe] cursor-pointer transition-colors"
                  >
                    {opt.phrase_en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !errorText.trim()}
            className="cr-btn cr-btn--primary w-full !min-h-[48px] !text-[15px]"
          >
            <span>{isSubmitting ? t("analyzing_step") : `${t("diagnose_button")} →`}</span>
          </button>
        </form>
      )}

      {/* 3. Upload Screenshot */}
      {activeTab === "upload" && (
        <div className="mt-6 space-y-4">
          <label className="cr-card p-8 block text-center cursor-pointer transition-all hover:border-[#5196fe] bg-[#f2f1ec]/40 border-2 border-dashed border-[#e1dfd8]">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <p className="text-[15px] font-semibold text-[#1b1d20]">
              {fileName || t("intake_upload_label")}
            </p>
            <p className="text-xs text-[#6e6e6e] mt-1">
              {hi ? "सिम्युलेटेड OCR: डेमो हेतु" : "Simulated OCR: instant demo extraction"}
            </p>
          </label>

          {errorText && (
            <div className="cr-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#1b1d20]">
                <span className="font-semibold text-[#5196fe] mr-1">
                  {hi ? "पढ़ा गया: " : "Extracted: "}
                </span>
                <span className="font-mono bg-[#f2f1ec] px-2 py-0.5 rounded text-[#1b1d20]">
                  {errorText}
                </span>
              </div>
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="cr-btn cr-btn--primary !min-h-[38px] !px-4 !text-[13px] w-full sm:w-auto"
              >
                <span>{isSubmitting ? "..." : hi ? "आगे बढ़ें →" : "Proceed →"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-neutral-500">Loading…</div>}>
      <IntakeContent />
    </Suspense>
  );
}
