"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../i18n/context";

export default function TransparencyPage() {
  const { lang } = useLanguage();
  const isHindi = lang === "hi";

  const groups = [
    {
      title: isHindi ? "क्या वास्तविक है" : "What is REAL",
      badge: isHindi ? "कार्यात्मक व नियम-आधारित" : "DETERMINISTIC RULES",
      accent: "border-[#067a54]/25 bg-[#067a54]/[0.03]",
      dot: "bg-[#067a54]",
      points: [
        {
          t: "Deterministic rules engine",
          d: "A zero-hallucination classifier maps EPFO rejection text to root causes (RC01 to RC05) with phrase matching and confidence gating. Covered by golden test suites.",
        },
        {
          t: "OpenAI-powered interpretation",
          d: "When an API key is provided, the language model writes a plain-language explanation. Rules, never the model, decide the diagnosis and fix steps.",
        },
        {
          t: "Resolution packets",
          d: "Step-by-step instructions, document checklists, who must act, timelines, and ready-to-send bank or employer letters in English and Hindi.",
        },
        {
          t: "Bilingual interface",
          d: "Full English and Hindi flows, responsive layouts, and accessible color hierarchy.",
        },
      ],
    },
    {
      title: isHindi ? "क्या सिम्युलेटेड है" : "What is SIMULATED",
      badge: isHindi ? "डेमो हेतु" : "SYNTHETIC DEMO",
      accent: "border-[#b45309]/25 bg-[#b45309]/[0.03]",
      dot: "bg-[#b45309]",
      points: [
        {
          t: "EPFO portal walkthrough",
          d: "A simulated demonstration of the member-portal correction screens. It does not submit anything to live government servers.",
        },
        {
          t: "Resolution timeline tracker",
          d: "A 4-stage mock lifecycle showing how a claim clears after you act. No live claim status is read or modified.",
        },
        {
          t: "Demo cases and OCR",
          d: "All demo rejections and uploaded screenshots use synthetic test data for demonstration purposes.",
        },
      ],
    },
    {
      title: isHindi ? "कभी एक्सेस नहीं" : "What is NEVER accessed",
      badge: isHindi ? "सुरक्षा व अनुपालन" : "SECURITY & PRIVACY",
      accent: "border-[#d21f3c]/25 bg-[#d21f3c]/[0.03]",
      dot: "bg-[#d21f3c]",
      points: [
        {
          t: "No live government systems",
          d: "No scraping, automated logins, or undocumented API calls to EPFO, UIDAI, or any portal.",
        },
        {
          t: "No real citizen PII",
          d: "No real UAN, Aadhaar, PAN, OTP, or bank credentials are ever accepted, stored, or processed.",
        },
        {
          t: "No government affiliation",
          d: "ClaimReady is an independent project built for Build What Moves India 2026. It is not affiliated with EPFO or the Government of India.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-10">
      {/* Step Badge */}
      <div className="cr-badge fade-up">
        <span>{isHindi ? "अनुपालन व पारदर्शिता" : "Compliance & Transparency"}</span>
      </div>

      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {isHindi ? "क्या वास्तविक है, क्या सिम्युलेटेड" : "Real vs. Simulated"}
      </h1>
      <p className="fade-up mt-1.5 text-[15px] text-[#6e6e6e]" style={{ ["--d" as string]: "0.1s" }}>
        {isHindi
          ? "यह प्रोटोटाइप कैसे काम करता है, कहाँ एआई है, और कहाँ मॉक: पूर्ण पारदर्शी विवरण।"
          : "Full disclosure on architecture, data safety, synthetic scopes, and governance boundaries."}
      </p>

      <div className="mt-6 space-y-4">
        {groups.map((g, i) => (
          <div
            key={i}
            className={`fade-up rounded-[20px] border p-5 sm:p-6 ${g.accent}`}
            style={{ ["--d" as string]: `${0.12 + i * 0.06}s` }}
          >
            <div className="flex items-center justify-between border-b border-[#e1dfd8] pb-3 mb-4">
              <h2 className="text-[16px] font-semibold text-[#1b1d20]">{g.title}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[9999px] bg-white border border-[#e1dfd8] text-[#1b1d20]">
                {g.badge}
              </span>
            </div>
            <div className="space-y-3">
              {g.points.map((p, j) => (
                <div key={j}>
                  <h3 className="text-[13px] font-semibold text-[#1b1d20] flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${g.dot}`} />
                    {p.t}
                  </h3>
                  <p className="text-[12px] text-[#6e6e6e] mt-0.5 pl-3.5 leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fade-up mt-8 text-center">
        <Link href="/intake" className="cr-btn cr-btn--primary !min-h-[46px] !px-6 !text-[14px]">
          <span>← {isHindi ? "दावा जांच पर लौटें" : "Back to Claim Check"}</span>
        </Link>
      </div>
    </div>
  );
}
