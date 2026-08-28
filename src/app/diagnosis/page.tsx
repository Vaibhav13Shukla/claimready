"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { diagnose } from "../../core/classifier";
import { routeRemedy } from "../../core/remedy-router";
import { calculateTimeline } from "../../core/timeline";
import { Scheme, Owner, RemedyType } from "../../core/taxonomy/taxonomy.schema";

const OWNER_LABEL: Record<Owner, { en: string; hi: string }> = {
  MEMBER_SELF: { en: "You (self-service on the UAN portal)", hi: "आप स्वयं (यूएएन पोर्टल पर)" },
  BANK: { en: "Your bank branch", hi: "आपकी बैंक शाखा" },
  EMPLOYER: { en: "Your previous employer", hi: "आपका पिछला नियोक्ता" },
  EPFO_OFFICE: { en: "EPFO field office (via EPFiGMS)", hi: "ईपीएफओ फील्ड ऑफिस (EPFiGMS)" },
};

const REMEDY_LABEL: Record<RemedyType, { en: string; hi: string }> = {
  member_correction: { en: "Member correction (Joint Declaration)", hi: "सदस्य सुधार (जॉइंट डिक्लेरेशन)" },
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
  const timeline = useMemo(() => calculateTimeline(diagnosis.root_cause_code), [diagnosis.root_cause_code]);

  // Deterministic explanation is pure derived state — no effect needed, and
  // it renders instantly while the (optional) AI-assisted version loads.
  const deterministicExplanation = isHindi ? diagnosis.explanation_hi : diagnosis.explanation_en;
  const requestKey = `${diagnosis.root_cause_code}|${lang}|${scheme}`;

  // aiState is only ever written from inside the async callback below (after
  // an await), never synchronously in the effect body, so this doesn't cause
  // the cascading-render pattern the set-state-in-effect rule warns about.
  // Its `key` is compared against the current requestKey before use, so a
  // slow response for a stale diagnosis/language never flashes onto screen.
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
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex items-center justify-between fade-up">
        <div className="cr-badge">
          <span className="cr-tick" />
          <span>{isHindi ? "चरण 3 / 4 · निदान" : "Step 3 / 4 · Diagnosis"}</span>
        </div>
        {goldenId && (
          <span className="text-[10px] font-mono font-bold px-2 py-1 bg-[#006cd2]/10 text-[#0053a3] border border-[#006cd2]/20">
            {goldenId}
          </span>
        )}
      </div>

      <h1 className="fade-up mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]" style={{ ["--d" as string]: "0.05s" }}>
        {isHindi ? "मूल कारण एवं समाधान मार्ग" : "Root cause & resolution path"}
      </h1>

      <div className="fade-up cr-card mt-6 p-6 space-y-6" style={{ ["--d" as string]: "0.12s" }}>
        {/* Root cause header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-1 bg-[#006cd2] text-white">
                {diagnosis.root_cause_code}
              </span>
              <span className="text-xs font-semibold text-neutral-500">
                {isHindi ? "वर्गीकृत मूल कारण" : "Classified root cause"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mt-2 tracking-tight">
              {isHindi ? diagnosis.label_hi : diagnosis.label_en}
            </h2>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 border self-start ${
              isUnknown
                ? "bg-[#b45309]/10 text-[#b45309] border-[#b45309]/30"
                : "bg-[#067a54]/10 text-[#067a54] border-[#067a54]/30"
            }`}
          >
            {Math.round(diagnosis.confidence * 100)}% {isHindi ? "विश्वसनीयता" : "confidence"}
          </span>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-[#006cd2]/[0.04] border border-[#006cd2]/15 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0053a3]">
            <span>💡</span>
            <span>{isHindi ? "यह आपकी गलती नहीं — सरल भाषा में:" : "This isn't your fault — in plain words:"}</span>
            <span
              className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 border ${
                aiSource === "ai_assisted"
                  ? "bg-[#006cd2]/10 text-[#006cd2] border-[#006cd2]/25"
                  : "bg-neutral-100 text-neutral-500 border-black/10"
              }`}
            >
              {aiSource === "ai_assisted" ? "OpenAI" : isHindi ? "क्यूरेटेड" : "curated"}
            </span>
          </div>
          <p className="text-sm text-[#0a0a0a] leading-relaxed font-medium">{explanation}</p>
        </div>

        {/* Owner + timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/[0.08] border border-black/10">
          <div className="bg-white p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {isHindi ? "कौन ठीक करेगा" : "Who fixes it"}
            </span>
            <p className="text-sm font-semibold text-[#0053a3]">
              {isHindi ? OWNER_LABEL[diagnosis.owner].hi : OWNER_LABEL[diagnosis.owner].en}
            </p>
            <p className="text-[11px] text-neutral-500">
              {route.can_self_service
                ? isHindi ? "✓ ज़्यादातर ऑनलाइन स्वयं हो सकता है" : "✓ Mostly doable online yourself"
                : isHindi ? "⚠️ किसी और की कार्रवाई ज़रूरी" : "⚠️ Needs someone else to act"}
            </p>
          </div>
          <div className="bg-white p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {isHindi ? "अनुमानित समय" : "Estimated timeline"}
            </span>
            <p className="text-sm font-semibold text-[#b45309]">
              ⏱ {isHindi ? timeline.display_hi : timeline.display_en}
            </p>
            <p className="text-[11px] text-neutral-500">
              {isHindi ? timeline.next_cycle_window_hi : timeline.next_cycle_window_en}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 pt-1">
          <Link
            href={`/action?scheme=${scheme}&rc=${diagnosis.root_cause_code}&owner=${diagnosis.owner}&remedy=${diagnosis.remedy_type}`}
            className="cr-btn cr-btn--primary w-full"
          >
            <span>
              {isHindi
                ? `समाधान प्लान बनाएं · ${REMEDY_LABEL[diagnosis.remedy_type].hi}`
                : `Build my resolution plan · ${REMEDY_LABEL[diagnosis.remedy_type].en}`}
            </span>
          </Link>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <Link href="/intake" className="hover:text-[#006cd2]">
              ← {t("start_over")}
            </Link>
            <Link href="/tracker" className="hover:text-[#006cd2]">
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
    <Suspense fallback={<div className="text-center py-16 text-neutral-500">Running diagnosis…</div>}>
      <DiagnosisContent />
    </Suspense>
  );
}
