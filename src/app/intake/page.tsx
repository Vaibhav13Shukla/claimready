"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { Scheme } from "../../core/taxonomy/taxonomy.schema";
import { COMMON_ERROR_OPTIONS } from "../../ai/fallback";

const CLAIM_TYPES: { id: Scheme; icon: string; key: string }[] = [
  { id: "FINAL_SETTLEMENT", icon: "🧾", key: "claim_final" },
  { id: "PF_ADVANCE", icon: "🏥", key: "claim_advance" },
  { id: "PENSION_EPS", icon: "👵", key: "claim_pension" },
];

export interface GoldenCase {
  id: string;
  scheme: Scheme;
  text: string;
  badge: string;
}

// Exported (not just used locally) so tests/unit/golden-cases-consistency.test.ts
// can catch drift against tests/fixtures/golden-cases.json and
// tests/unit/classifier.test.ts's own goldenCases array — these demo cases are
// necessarily duplicated across three shapes (UI demo buttons, the golden-case
// gate, a JSON fixture), and a test enforcing consistency beats a comment
// asking future edits to remember to update all three by hand.
export const GOLDEN_CASES: GoldenCase[] = [
  {
    id: "GC-01",
    scheme: "FINAL_SETTLEMENT",
    text: "Claim rejected: Name mismatch as per Aadhaar",
    badge: "RC01 · Name",
  },
  {
    id: "GC-02",
    scheme: "PF_ADVANCE",
    text: "Rejected: Name mismatch between UAN and bank KYC",
    badge: "RC01 · Name",
  },
  {
    id: "GC-03",
    scheme: "FINAL_SETTLEMENT",
    text: "Claim rejected: Date of Birth not matching Aadhaar",
    badge: "RC02 · DOB",
  },
  {
    id: "GC-04",
    scheme: "PF_ADVANCE",
    text: "Rejected: Bank KYC not verified / account inactive",
    badge: "RC03 · Bank",
  },
  {
    id: "GC-05",
    scheme: "FINAL_SETTLEMENT",
    text: "Rejected: Date of Exit not updated by employer",
    badge: "RC04 · Exit date",
  },
  {
    id: "GC-06",
    scheme: "PENSION_EPS",
    text: "Claim rejected: IFSC mismatch, payment returned by bank",
    badge: "RC03 · Bank",
  },
  {
    id: "GC-07",
    scheme: "FINAL_SETTLEMENT",
    text: "Claim rejected: Multiple UAN found, previous PF account not transferred",
    badge: "RC05 · Multiple UAN",
  },
];

function IntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  // useSearchParams already returns the parsed URL state synchronously, so
  // the initial tab/scheme can be derived directly in the lazy initializer —
  // no effect needed, no flash of the wrong tab on first paint.
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
    // Simulated OCR — deterministic demo text by claim type.
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
    { id: "samples", label: `✨ ${t("intake_tab_samples")}` },
    { id: "paste", label: `✍️ ${t("intake_tab_paste")}` },
    { id: "upload", label: `📷 ${t("intake_tab_upload")}` },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
      <div className="cr-badge fade-up" style={{ ["--d" as string]: "0s" }}>
        <span className="cr-tick" />
        <span>{lang === "hi" ? "चरण 1 / 4 · दावा इनपुट" : "Step 1 / 4 · Claim intake"}</span>
      </div>
      <h1
        className="fade-up mt-5 text-3xl sm:text-4xl font-semibold tracking-[-0.03em]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {lang === "hi" ? "अपने दावे की जांच करें" : "Check your claim"}
      </h1>
      <p className="fade-up mt-2 text-sm text-neutral-600" style={{ ["--d" as string]: "0.1s" }}>
        {lang === "hi"
          ? "दावा प्रकार चुनें, फिर डेमो केस आज़माएं या अपनी अस्वीकृति टिप्पणी पेस्ट करें।"
          : "Pick your claim type, then try a demo case or paste your own rejection remark."}
      </p>

      {/* Claim type */}
      <fieldset className="fade-up mt-7 border-0 p-0 m-0" style={{ ["--d" as string]: "0.15s" }}>
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          {t("select_scheme")}
        </legend>
        <div
          className="grid grid-cols-3 gap-px bg-black/[0.08] mt-2 border border-black/10"
          role="radiogroup"
          aria-label={t("select_scheme")}
        >
          {CLAIM_TYPES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={scheme === c.id}
              onClick={() => setScheme(c.id)}
              className={`p-3 text-left transition-colors cursor-pointer ${
                scheme === c.id
                  ? "bg-[#006cd2] text-white"
                  : "bg-white text-neutral-700 hover:bg-[#006cd2]/[0.06]"
              }`}
            >
              <span className="text-lg">{c.icon}</span>
              <span className="block text-xs font-semibold mt-1">{t(c.key as never)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Tabs */}
      <div
        className="fade-up mt-7 flex gap-6 border-b border-black/10"
        style={{ ["--d" as string]: "0.2s" }}
        role="tablist"
      >
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={activeTab === tb.id}
            onClick={() => setActiveTab(tb.id)}
            className={`pb-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === tb.id
                ? "border-[#006cd2] text-[#006cd2]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Samples */}
      {activeTab === "samples" && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/[0.08] border border-black/10">
          {GOLDEN_CASES.map((gc) => (
            <button
              key={gc.id}
              onClick={() => handleGolden(gc)}
              className="bg-white p-4 text-left hover:bg-[#006cd2]/[0.05] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-neutral-100 text-[#006cd2] border border-black/10">
                  {gc.id}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">{gc.badge}</span>
              </div>
              <p className="text-sm font-medium text-[#0a0a0a] group-hover:text-[#0053a3]">
                &ldquo;{gc.text}&rdquo;
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#006cd2]">
                {lang === "hi" ? "जांचें" : "Diagnose"} →
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Paste */}
      {activeTab === "paste" && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <textarea
            rows={4}
            value={errorText}
            onChange={(e) => setErrorText(e.target.value)}
            placeholder={t("intake_paste_placeholder")}
            aria-label={t("intake_tab_paste")}
            className="w-full cr-card p-3.5 text-sm text-[#0a0a0a] placeholder:text-neutral-500 transition-colors"
            required
          />
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ERROR_OPTIONS.slice(0, 5).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setErrorText(opt.phrase_en);
                  setScheme(opt.scheme);
                }}
                className="text-[11px] px-2.5 py-1 bg-white border border-black/10 text-neutral-600 hover:border-[#006cd2] hover:text-[#006cd2] cursor-pointer"
              >
                {opt.phrase_en}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !errorText.trim()}
            className="cr-btn cr-btn--primary w-full"
          >
            <span>{isSubmitting ? t("analyzing_step") : `${t("diagnose_button")} →`}</span>
          </button>
        </form>
      )}

      {/* Upload */}
      {activeTab === "upload" && (
        <div className="mt-5 space-y-4">
          <label className="block border-2 border-dashed border-black/15 hover:border-[#006cd2]/50 p-8 text-center cursor-pointer transition-colors bg-[#006cd2]/[0.02]">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <div className="text-2xl">📁</div>
            <p className="mt-2 text-sm font-medium text-neutral-700">
              {fileName || t("intake_upload_label")}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {lang === "hi" ? "सिम्युलेटेड OCR — डेमो" : "Simulated OCR — demo only"}
            </p>
          </label>
          {errorText && (
            <div className="cr-card p-3.5 flex items-center justify-between gap-3">
              <p className="text-xs text-neutral-700 line-clamp-1">
                <span className="font-semibold text-[#006cd2]">
                  {lang === "hi" ? "पढ़ा गया: " : "Read: "}
                </span>
                {errorText}
              </p>
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="cr-btn cr-btn--primary !min-h-[38px] !px-4 !text-[13px]"
              >
                <span>{isSubmitting ? "..." : lang === "hi" ? "आगे →" : "Proceed →"}</span>
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
