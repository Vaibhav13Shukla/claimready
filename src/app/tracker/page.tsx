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
  }[] = [
    {
      id: "diagnosed",
      n: "1",
      title_en: "Diagnosed",
      title_hi: "निदान पूर्ण",
      desc_en: "The exact rejection cause is identified and routed to who must act.",
      desc_hi: "सटीक अस्वीकृति कारण की पहचान और जिम्मेदार पक्ष तक मार्ग।",
      when: isHindi ? "आज" : "Today",
    },
    {
      id: "action_taken",
      n: "2",
      title_en: "Fix submitted",
      title_hi: "सुधार प्रस्तुत",
      desc_en: "Correction raised on the portal, or the letter handed to bank or employer.",
      desc_hi: "पोर्टल पर सुधार दर्ज, या बैंक / नियोक्ता को पत्र प्रस्तुत।",
      when: isHindi ? "आज" : "Today",
    },
    {
      id: "awaiting_cycle",
      n: "3",
      title_en: "Approval and sync",
      title_hi: "स्वीकृति व सिंक",
      desc_en: "Employer or EPFO approval reflects the corrected record on the portal.",
      desc_hi: "नियोक्ता / ईपीएफओ स्वीकृति सही रिकॉर्ड को पोर्टल पर दिखाती है।",
      when: isHindi ? "3 से 20 दिनों में" : "in 3 to 20 days",
    },
    {
      id: "resolved",
      n: "4",
      title_en: "Re-filed and settled",
      title_hi: "पुनः दावा व निपटान",
      desc_en: "You re-file; the claim clears the check and the amount is credited.",
      desc_hi: "आप पुनः दावा करते हैं; दावा जांच पास करता है और राशि जमा होती है।",
      when: isHindi ? "अगले दावे पर" : "on re-file",
    },
  ];

  const currentIndex = stages.findIndex((s) => s.id === current);

  return (
    <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-10">
      {/* Step Badge */}
      <div className="flex items-center justify-between fade-up">
        <div className="cr-badge">
          <span>{isHindi ? "सिमुलेशन ट्रैकर" : "Lifecycle Simulation"}</span>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-[9999px] bg-[#b45309]/10 text-[#b45309] border border-[#b45309]/25">
          {isHindi ? "सिंथेटिक समयरेखा" : "SYNTHETIC TIMELINE"}
        </span>
      </div>

      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {isHindi ? "समाधान समयरेखा ट्रैकर" : "Resolution Lifecycle Tracker"}
      </h1>
      <p className="fade-up mt-1.5 text-[15px] text-[#6e6e6e]" style={{ ["--d" as string]: "0.1s" }}>
        {isHindi
          ? "सुझाई गई कार्रवाई के बाद आपका दावा कैसे साफ़ होता है और राशि कब जमा होती है।"
          : "How your claim clears through the system once you submit the remedy."}
      </p>

      <div className="fade-up cr-card mt-6 p-6 sm:p-7 bg-white space-y-5" style={{ ["--d" as string]: "0.15s" }}>
        <div className="space-y-2.5">
          {stages.map((s, idx) => {
            const done = idx <= currentIndex;
            const isCur = idx === currentIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrent(s.id)}
                aria-current={isCur ? "step" : undefined}
                className={`w-full text-left p-4 rounded-[16px] border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isCur
                    ? "border-[#5196fe] bg-[#5196fe]/[0.05] shadow-sm"
                    : done
                      ? "border-[#e1dfd8] bg-white hover:bg-[#f2f1ec]/40"
                      : "border-[#e1dfd8]/60 bg-[#f2f1ec]/30 opacity-70"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-[9999px] flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    done ? "bg-[#5196fe] text-white" : "bg-[#e1dfd8] text-[#6e6e6e]"
                  }`}
                >
                  {s.n}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className={`text-[15px] font-semibold ${done ? "text-[#1b1d20]" : "text-[#6e6e6e]"}`}
                    >
                      {isHindi ? s.title_hi : s.title_en}
                    </h2>
                    <span className="text-[11px] font-mono text-[#6e6e6e] shrink-0 bg-[#f2f1ec] px-2 py-0.5 rounded-[9999px]">
                      {s.when}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6e6e6e] mt-0.5 leading-relaxed">
                    {isHindi ? s.desc_hi : s.desc_en}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pt-2.5 border-t border-[#e1dfd8]">
          <span className="text-xs font-semibold text-[#6e6e6e] mr-1">
            {isHindi ? "चरण चुनें:" : "Select stage:"}
          </span>
          <div className="flex gap-1.5">
            {stages.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrent(s.id)}
                className={`w-7 h-7 rounded-[9999px] text-xs font-bold transition-all cursor-pointer ${
                  current === s.id
                    ? "bg-[#5196fe] text-white shadow-sm"
                    : "bg-[#f2f1ec] text-[#1b1d20] hover:bg-[#e1dfd8]"
                }`}
              >
                {s.n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="fade-up flex items-center justify-between text-xs text-[#6e6e6e] mt-6 px-1"
        style={{ ["--d" as string]: "0.2s" }}
      >
        <Link href="/intake" className="py-1.5 hover:text-[#5196fe] transition-colors">
          ← {t("start_over")}
        </Link>
        <Link href="/transparency" className="py-1.5 hover:text-[#5196fe] transition-colors">
          {t("transparency_link")} →
        </Link>
      </div>
    </div>
  );
}
