"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { RootCauseCode, RemedyType, DiagnosisResult } from "../../core/taxonomy/taxonomy.schema";
import { calculateTimeline } from "../../core/timeline";
import { generateRemedy } from "../../core/remedy";
import { generateBankLetter } from "../../documents/bank-letter";
import { generateGrievanceLetter } from "../../documents/grievance-letter";
import { BASE_WALKTHROUGH_FLOWS } from "../../documents/base-walkthrough";

function ActionContent() {
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";

  const rc = (searchParams.get("rc") as RootCauseCode) || "UNKNOWN";
  const remedyType = (searchParams.get("remedy") as RemedyType) || "epfigms_grievance";

  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const timeline = useMemo(() => calculateTimeline(rc), [rc]);
  const remedy = useMemo(
    () =>
      generateRemedy({
        remedy_type: remedyType,
        estimated_timeline_days: `${timeline.min_days}-${timeline.max_days}`,
      } as DiagnosisResult),
    [remedyType, timeline],
  );

  const bankLetter = useMemo(
    () => generateBankLetter({ language: isHindi ? "hi" : "en" }),
    [isHindi],
  );
  const employerLetter = useMemo(
    () => generateGrievanceLetter({ language: isHindi ? "hi" : "en" }),
    [isHindi],
  );
  const walkthrough = rc === "RC01" || rc === "RC02" ? BASE_WALKTHROUGH_FLOWS[rc] : null;

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const whatsapp = (text: string) =>
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex items-center justify-between fade-up">
        <div className="cr-badge">
          <span className="cr-tick" />
          <span>{isHindi ? "चरण 4 / 4 · समाधान प्लान" : "Step 4 / 4 · Resolution plan"}</span>
        </div>
        <span className="text-xs font-mono font-bold text-neutral-500">{rc}</span>
      </div>

      <h1
        className="fade-up mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {isHindi ? remedy.title_hi : remedy.title_en}
      </h1>
      <p className="fade-up mt-2 text-sm text-neutral-600" style={{ ["--d" as string]: "0.1s" }}>
        {isHindi ? remedy.summary_hi : remedy.summary_en}
      </p>

      {/* Interactive portal walkthrough for name / DOB */}
      {walkthrough && (
        <div className="fade-up cr-card mt-6 p-6 space-y-5" style={{ ["--d" as string]: "0.15s" }}>
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#1f6fe5]/10 text-[#14449e] border border-[#1f6fe5]/20">
              {isHindi ? "ईपीएफओ पोर्टल — सिम्युलेटेड" : "EPFO PORTAL — SIMULATED"}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#b45309]/10 text-[#b45309] border border-[#b45309]/20">
              🛡 {isHindi ? "डेमो · लाइव नहीं" : "DEMO · NOT LIVE"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {walkthrough.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                aria-current={i === activeStep ? "step" : undefined}
                className={`flex-1 h-1.5 transition-colors cursor-pointer ${
                  i <= activeStep ? "bg-[#1f6fe5]" : "bg-black/10"
                }`}
                aria-label={`${isHindi ? "चरण" : "Step"} ${i + 1} ${isHindi ? "में से" : "of"} ${
                  walkthrough.steps.length
                }${i === activeStep ? `, ${isHindi ? "वर्तमान" : "current"}` : i < activeStep ? `, ${isHindi ? "पूर्ण" : "completed"}` : ""}`}
              />
            ))}
          </div>

          {walkthrough.steps[activeStep] && (
            <div className="bg-[#1f6fe5]/[0.03] border border-[#1f6fe5]/12 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1f6fe5]">
                    {walkthrough.steps[activeStep].screenName}
                  </span>
                  <h2 className="text-base font-semibold mt-0.5">
                    {isHindi
                      ? walkthrough.steps[activeStep].title_hi
                      : walkthrough.steps[activeStep].title_en}
                  </h2>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-white border border-black/10 text-neutral-600 shrink-0">
                  {activeStep + 1} / {walkthrough.steps.length}
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {isHindi
                  ? walkthrough.steps[activeStep].description_hi
                  : walkthrough.steps[activeStep].description_en}
              </p>
              <div className="bg-white border border-black/10 p-3 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-neutral-500 border-b border-black/10 pb-1">
                  <span>📱 member.epfindia.gov.in</span>
                  <span>🔒 SIMULATED</span>
                </div>
                <div className="text-neutral-800">
                  <span className="text-[#1f6fe5] font-bold">
                    {isHindi ? "करें: " : "Action: "}
                  </span>
                  {isHindi
                    ? walkthrough.steps[activeStep].simulatedAction_hi
                    : walkthrough.steps[activeStep].simulatedAction_en}
                </div>
                <div className="text-[11px] text-[#b45309] flex items-start gap-1.5">
                  <span>💡</span>
                  <span>
                    {isHindi
                      ? walkthrough.steps[activeStep].tip_hi
                      : walkthrough.steps[activeStep].tip_en}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 bg-white border border-black/10 text-xs font-bold text-neutral-700 disabled:opacity-30 cursor-pointer"
                >
                  ← {isHindi ? "पिछला" : "Previous"}
                </button>
                {activeStep < walkthrough.steps.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="cr-btn cr-btn--primary !min-h-[38px] !px-4 !text-[13px]"
                  >
                    <span>{isHindi ? "अगला →" : "Next →"}</span>
                  </button>
                ) : (
                  <Link
                    href="/tracker"
                    className="cr-btn cr-btn--primary !min-h-[38px] !px-4 !text-[13px]"
                  >
                    <span>{t("view_tracker")} →</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Letter for bank / employer */}
      {(rc === "RC03" || rc === "RC04") &&
        (() => {
          const letter = rc === "RC03" ? bankLetter : employerLetter;
          return (
            <div
              className="fade-up cr-card mt-6 p-6 space-y-4"
              style={{ ["--d" as string]: "0.15s" }}
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-[#1f6fe5]/10 text-[#14449e] border border-[#1f6fe5]/20">
                  {rc === "RC03"
                    ? isHindi
                      ? "बैंक अनुरोध पत्र"
                      : "BANK REQUEST LETTER"
                    : isHindi
                      ? "नियोक्ता अनुरोध पत्र"
                      : "EMPLOYER REQUEST LETTER"}
                </span>
                <button
                  onClick={() => copy(letter.printableText)}
                  className="px-3 py-1.5 bg-white border border-black/10 text-xs font-bold text-[#1f6fe5] cursor-pointer"
                >
                  {copied
                    ? `✓ ${isHindi ? "कॉपी हुआ" : "Copied"}`
                    : `📋 ${isHindi ? "कॉपी करें" : "Copy"}`}
                </button>
              </div>
              <pre className="bg-neutral-50 border border-black/10 p-4 text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-mono">
                {letter.printableText}
              </pre>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.print()}
                  className="cr-btn cr-btn--ghost !min-h-[44px] !text-[13px]"
                >
                  <span>🖨 {t("print_download")}</span>
                </button>
                <button
                  onClick={() => whatsapp(letter.whatsappText)}
                  className="cr-btn cr-btn--ghost !min-h-[44px] !text-[13px]"
                >
                  <span>💬 {t("whatsapp_share")}</span>
                </button>
              </div>
            </div>
          );
        })()}

      {/* Resolution steps (all cases) */}
      <div className="fade-up cr-card mt-6 p-6 space-y-4" style={{ ["--d" as string]: "0.2s" }}>
        <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-neutral-500">
          {isHindi ? "समाधान के कदम" : "Steps to resolve"}
        </h2>
        <ol className="space-y-3">
          {remedy.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-[#1f6fe5] text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1b1d20]">
                  {isHindi ? s.action_hi : s.action}
                </p>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  {isHindi ? s.details_hi : s.details}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {isHindi ? "आवश्यक दस्तावेज़" : "Documents you'll need"}
            </span>
            <ul className="mt-1.5 space-y-1">
              {(isHindi ? remedy.required_documents_hi : remedy.required_documents).map((d, i) => (
                <li key={i} className="text-xs text-neutral-700 flex gap-1.5">
                  <span className="text-[#1f6fe5]">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {isHindi ? "समयरेखा व escalation" : "Timeline & escalation"}
            </span>
            <p className="mt-1.5 text-sm font-semibold text-[#b45309]">
              ⏱ {isHindi ? timeline.display_hi : timeline.display_en}
            </p>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              {isHindi ? remedy.escalation_contact_hi : remedy.escalation_contact}
            </p>
          </div>
        </div>
      </div>

      <div
        className="fade-up flex items-center justify-between text-xs text-neutral-500 mt-6"
        style={{ ["--d" as string]: "0.25s" }}
      >
        <Link href="/intake" className="inline-block py-2 hover:text-[#1f6fe5]">
          ← {t("start_over")}
        </Link>
        <Link href="/tracker" className="inline-block py-2 hover:text-[#1f6fe5]">
          {t("view_tracker")} →
        </Link>
      </div>
    </div>
  );
}

export default function ActionPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-neutral-500">Loading plan…</div>}>
      <ActionContent />
    </Suspense>
  );
}
