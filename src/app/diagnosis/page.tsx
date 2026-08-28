"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { diagnose } from "../../core/classifier";
import { routeRemedy } from "../../core/remedy-router";
import { calculateTimeline } from "../../core/timeline";
import { Scheme, Owner, RemedyType } from "../../core/taxonomy/taxonomy.schema";
import { ClaimXray } from "../../components/ClaimXray";

const OWNER_LABEL: Record<Owner, { en: string; hi: string }> = {
  MEMBER_SELF: { en: "You (self-service on the UAN portal)", hi: "आप स्वयं (यूएएन पोर्टल पर)" },
  BANK: { en: "Your bank branch", hi: "आपकी बैंक शाखा" },
  EMPLOYER: { en: "Your previous employer", hi: "आपका पिछला नियोक्ता" },
  EPFO_OFFICE: { en: "EPFO field office (via EPFiGMS)", hi: "ईपीएफओ फील्ड ऑफिस (EPFiGMS)" },
};

const REMEDY_LABEL: Record<RemedyType, { en: string; hi: string }> = {
  member_correction: {
    en: "Member correction (Joint Declaration)",
    hi: "सदस्य सुधार (जॉइंट डिक्लेरेशन)",
  },
  bank_fix: { en: "Bank KYC / account fix", hi: "बैंक केवाईसी / खाता सुधार" },
  employer_request: { en: "Employer Date-of-Exit request", hi: "नियोक्ता निकास-तिथि अनुरोध" },
  uan_transfer_merge: { en: "UAN transfer / merge request", hi: "यूएएन ट्रांसफर / मर्ज अनुरोध" },
  epfigms_grievance: { en: "EPFiGMS grievance", hi: "EPFiGMS शिकायत" },
};

function DiagnosisContent() {
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";

  const scheme = (searchParams.get("scheme") as Scheme) || "FINAL_SETTLEMENT";
  const rawErrorText = searchParams.get("raw_error_text") || "";
  const goldenId = searchParams.get("golden_id");

  const diagnosis = useMemo(() => diagnose({ rawErrorText, scheme }), [rawErrorText, scheme]);
  const route = useMemo(() => routeRemedy(diagnosis.root_cause_code), [diagnosis.root_cause_code]);
  const timeline = useMemo(
    () => calculateTimeline(diagnosis.root_cause_code),
    [diagnosis.root_cause_code],
  );

  const deterministicExplanation = isHindi ? diagnosis.explanation_hi : diagnosis.explanation_en;
  const requestKey = `${diagnosis.root_cause_code}|${lang}|${scheme}`;

  const [aiState, setAiState] = useState<{
    key: string;
    explanation: string;
    source: "ai_assisted" | "deterministic";
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            root_cause_code: diagnosis.root_cause_code,
            owner: diagnosis.owner,
            language: lang,
            scheme,
          }),
        });
        const data = await res.json();
        if (!cancelled && data?.explanation) {
          setAiState({
            key: requestKey,
            explanation: data.explanation,
            source: data.source === "ai_assisted" ? "ai_assisted" : "deterministic",
          });
        }
      } catch {
        /* keep deterministic explanation */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diagnosis, lang, scheme, requestKey]);

  const isFresh = aiState?.key === requestKey;
  const explanation = isFresh ? aiState.explanation : deterministicExplanation;
  const aiSource = isFresh ? aiState.source : "deterministic";
  const isUnknown = diagnosis.root_cause_code === "UNKNOWN";

  return (
    <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-10">
      {/* Step Badge */}
      <div className="flex items-center justify-between fade-up">
        <div className="cr-badge">
          <span>{isHindi ? "चरण 3 / 4: निदान" : "Step 3 of 4: Diagnosis"}</span>
        </div>
        {goldenId && (
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-[9999px] bg-[#5196fe]/10 text-[#3f75c6] border border-[#5196fe]/25">
            {goldenId}
          </span>
        )}
      </div>

      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {isHindi ? "मूल कारण और समाधान मार्ग" : "Root Cause and Remedy Path"}
      </h1>

      <div className="fade-up cr-card mt-6 p-6 sm:p-7 bg-white space-y-5" style={{ ["--d" as string]: "0.12s" }}>
        {/* Root cause header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e1dfd8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-[4px] bg-[#5196fe] text-white">
                {diagnosis.root_cause_code}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
                {isHindi ? "वर्गीकृत मूल कारण" : "Classified Cause"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mt-1.5 tracking-tight text-[#1b1d20]">
              {isHindi ? diagnosis.label_hi : diagnosis.label_en}
            </h2>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-[9999px] border self-start ${
              isUnknown
                ? "bg-[#b45309]/10 text-[#b45309] border-[#b45309]/25"
                : "bg-[#067a54]/10 text-[#067a54] border-[#067a54]/25"
            }`}
          >
            {Math.round(diagnosis.confidence * 100)}% {isHindi ? "विश्वसनीयता" : "Confidence"}
          </span>
        </div>

        {/* Explanation */}
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-[16px] bg-[#5196fe]/[0.05] border border-[#5196fe]/20 space-y-2"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b5bb5]">
            <span>
              {isHindi
                ? "सरल भाषा में समझें:"
                : "What this means in plain words:"}
            </span>
            <span
              className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-[9999px] border ${
                aiSource === "ai_assisted"
                  ? "bg-[#5196fe]/10 text-[#5196fe] border-[#5196fe]/25"
                  : "bg-white text-[#6e6e6e] border-[#e1dfd8]"
              }`}
            >
              {aiSource === "ai_assisted" ? "AI Model" : isHindi ? "क्यूरेटेड" : "Rules Engine"}
            </span>
          </div>
          <p className="text-[14px] text-[#1b1d20] leading-relaxed">{explanation}</p>
        </div>

        {/* Claim X-Ray — synthetic case reconstruction */}
        <ClaimXray
          rc={diagnosis.root_cause_code}
          confidence={diagnosis.confidence}
          isHindi={isHindi}
        />

        {/* 2-Column Who Fixes + Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-[#f2f1ec] p-4 rounded-[16px] border border-[#e1dfd8] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
              {isHindi ? "कार्रवाई कौन करेगा" : "Who Must Act"}
            </span>
            <p className="text-[14px] font-semibold text-[#1b1d20]">
              {isHindi ? OWNER_LABEL[diagnosis.owner].hi : OWNER_LABEL[diagnosis.owner].en}
            </p>
            <p className="text-[12px] text-[#6e6e6e]">
              {route.can_self_service
                ? isHindi
                  ? "ऑनलाइन स्वयं हो सकता है"
                  : "Can be done online yourself"
                : isHindi
                  ? "बाहरी पक्ष की कार्रवाई आवश्यक"
                  : "Requires employer or bank action"}
            </p>
          </div>

          <div className="bg-[#f2f1ec] p-4 rounded-[16px] border border-[#e1dfd8] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
              {isHindi ? "अनुमानित समयसीमा" : "Estimated Timeline"}
            </span>
            <p className="text-[14px] font-semibold text-[#b45309]">
              {isHindi ? timeline.display_hi : timeline.display_en}
            </p>
            <p className="text-[12px] text-[#6e6e6e]">
              {isHindi ? timeline.next_cycle_window_hi : timeline.next_cycle_window_en}
            </p>
          </div>
        </div>

        {/* Action Button & Links */}
        <div className="space-y-2.5 pt-1">
          <Link
            href={`/action?scheme=${scheme}&rc=${diagnosis.root_cause_code}&owner=${diagnosis.owner}&remedy=${diagnosis.remedy_type}`}
            className="cr-btn cr-btn--primary w-full !min-h-[48px] !text-[14px]"
          >
            <span>
              {isHindi
                ? `समाधान प्लान बनाएं: ${REMEDY_LABEL[diagnosis.remedy_type].hi}`
                : `Build Resolution Plan: ${REMEDY_LABEL[diagnosis.remedy_type].en}`}
            </span>
          </Link>
          <div className="flex items-center justify-between text-xs text-[#6e6e6e] px-1">
            <Link href="/intake" className="py-1.5 hover:text-[#5196fe] transition-colors">
              ← {t("start_over")}
            </Link>
            <Link href="/tracker" className="py-1.5 hover:text-[#5196fe] transition-colors">
              {t("view_tracker")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={<div className="text-center py-16 text-neutral-500">Running diagnosis…</div>}
    >
      <DiagnosisContent />
    </Suspense>
  );
}
