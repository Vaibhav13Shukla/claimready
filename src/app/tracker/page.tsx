"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../i18n/context";
import { CaseStatus } from "../../core/taxonomy/taxonomy.schema";

export default function TrackerPage() {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const [current, setCurrent] = useState<CaseStatus>("action_taken");

  const stages: {
    id: CaseStatus;
    n: string;
    title_en: string;
    title_hi: string;
    desc_en: string;
    desc_hi: string;
    when: string;
    icon: string;
  }[] = [
    {
      id: "diagnosed",
      n: "1",
      title_en: "Diagnosed",
      title_hi: "निदान पूर्ण",
      desc_en: "The exact rejection cause is identified and routed to who must act.",
      desc_hi: "सटीक अस्वीकृति कारण की पहचान और जिम्मेदार पक्ष तक मार्ग।",
      when: isHindi ? "आज" : "Today",
      icon: "🔍",
    },
    {
      id: "action_taken",
      n: "2",
      title_en: "Fix submitted",
      title_hi: "सुधार प्रस्तुत",
      desc_en: "Correction raised on the portal, or the letter handed to bank / employer.",
      desc_hi: "पोर्टल पर सुधार दर्ज, या बैंक / नियोक्ता को पत्र प्रस्तुत।",
      when: isHindi ? "आज" : "Today",
      icon: "📄",
    },
    {
      id: "awaiting_cycle",
      n: "3",
      title_en: "Approval & sync",
      title_hi: "स्वीकृति व सिंक",
      desc_en: "Employer / EPFO approval reflects the corrected record on the portal.",
      desc_hi: "नियोक्ता / ईपीएफओ स्वीकृति सही रिकॉर्ड को पोर्टल पर दिखाती है।",
      when: isHindi ? "3–20 दिनों में" : "in 3–20 days",
      icon: "⏳",
    },
    {
      id: "resolved",
      n: "4",
      title_en: "Re-filed & settled",
      title_hi: "पुनः दावा व निपटान",
      desc_en: "You re-file; the claim clears the check and the amount is credited.",
      desc_hi: "आप पुनः दावा करते हैं; दावा जांच पास करता है और राशि जमा होती है।",
      when: isHindi ? "अगले दावे पर" : "on re-file",
      icon: "✅",
    },
  ];

  const currentIndex = stages.findIndex((s) => s.id === current);

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex items-center justify-between fade-up">
        <div className="cr-badge">
          <span className="cr-tick" />
          <span>{isHindi ? "सिमुलेशन" : "Simulation"}</span>
        </div>
        <span className="text-[11px] font-semibold text-[#b45309]">
          🛡 {isHindi ? "सिंथेटिक समयरेखा" : "SYNTHETIC TIMELINE"}
        </span>
      </div>
      <h1
        className="fade-up mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {isHindi ? "समाधान ट्रैकर" : "Resolution tracker"}
      </h1>
      <p className="fade-up mt-2 text-sm text-neutral-600" style={{ ["--d" as string]: "0.1s" }}>
        {isHindi
          ? "सुझाई गई कार्रवाई के बाद आपका दावा सरकारी सिस्टम में कैसे साफ़ होता है।"
          : "How your claim clears through the system once you act on the plan."}
      </p>

      <div className="fade-up cr-card mt-6 p-6 space-y-4" style={{ ["--d" as string]: "0.15s" }}>
        <div className="space-y-3">
          {stages.map((s, idx) => {
            const done = idx <= currentIndex;
            const isCur = idx === currentIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrent(s.id)}
                aria-current={isCur ? "step" : undefined}
                className={`w-full text-left p-4 border transition-colors cursor-pointer flex items-start gap-4 ${
                  isCur
                    ? "border-[#006cd2] bg-[#006cd2]/[0.04]"
                    : done
                      ? "border-black/10 bg-white"
                      : "border-black/[0.06] bg-neutral-50"
                }`}
              >
                <span
                  className={`w-9 h-9 flex items-center justify-center text-sm font-bold shrink-0 ${
                    done ? "bg-[#006cd2] text-white" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {done ? s.icon : s.n}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className={`text-sm font-semibold ${done ? "text-[#0a0a0a]" : "text-neutral-500"}`}
                    >
                      {isHindi ? s.title_hi : s.title_en}
                    </h2>
                    <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                      {s.when}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {isHindi ? s.desc_hi : s.desc_en}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-black/10">
          <span className="text-xs text-neutral-500 mr-1">
            {isHindi ? "चरण आगे बढ़ाएं:" : "Advance:"}
          </span>
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrent(s.id)}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                current === s.id
                  ? "bg-[#006cd2] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s.n}
            </button>
          ))}
        </div>
      </div>

      <div
        className="fade-up flex items-center justify-between text-xs text-neutral-500 mt-6"
        style={{ ["--d" as string]: "0.2s" }}
      >
        <Link href="/intake" className="inline-block py-2 hover:text-[#006cd2]">
          ← {t("start_over")}
        </Link>
        <Link href="/transparency" className="inline-block py-2 hover:text-[#006cd2]">
          {t("transparency_link")} →
        </Link>
      </div>
    </div>
  );
}
