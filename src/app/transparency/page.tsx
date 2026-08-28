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
      badge: isHindi ? "कार्यात्मक व नियम-आधारित" : "FUNCTIONAL & DETERMINISTIC",
      accent: "border-[#067a54]/30 bg-[#067a54]/[0.04]",
      dot: "bg-[#067a54]",
      points: [
        {
          t: "Deterministic rules engine",
          d: "A zero-hallucination classifier maps EPFO rejection text to root causes (RC01–RC05) with phrase matching and confidence gating. Covered by golden tests.",
        },
        {
          t: "OpenAI-powered interpretation",
          d: "When an API key is set, an OpenAI model extracts structured fields and writes the plain-language explanation. Rules — never the model — decide the diagnosis and the fix steps.",
        },
        {
          t: "Resolution packets",
          d: "Exact steps, document checklists, who must act, timelines, and ready-to-send bank / employer letters in English and Hindi.",
        },
        {
          t: "Bilingual, mobile-first UI",
          d: "Full English/Hindi flow, sharp fintech layout, works on small screens.",
        },
      ],
    },
    {
      title: isHindi ? "क्या सिम्युलेटेड है" : "What is SIMULATED / MOCKED",
      badge: isHindi ? "डेमो हेतु सिंथेटिक" : "SYNTHETIC FOR DEMO",
      accent: "border-[#b45309]/30 bg-[#b45309]/[0.04]",
      dot: "bg-[#b45309]",
      points: [
        {
          t: "EPFO portal walkthrough",
          d: "A simulated replica of the member-portal correction screens. It never submits anything to the real EPFO system.",
        },
        {
          t: "Resolution timeline tracker",
          d: "A 4-stage mock lifecycle showing how a claim clears after you act. No real claim status is read or changed.",
        },
        {
          t: "Demo cases & OCR",
          d: "All demo rejections and 'uploaded' screenshots use fictional data. Screenshot upload is a simulated OCR for the demo.",
        },
      ],
    },
    {
      title: isHindi ? "कभी एक्सेस नहीं" : "What is NEVER accessed",
      badge: isHindi ? "सुरक्षा व अनुपालन" : "SECURITY & COMPLIANCE",
      accent: "border-[#d21f3c]/30 bg-[#d21f3c]/[0.04]",
      dot: "bg-[#d21f3c]",
      points: [
        {
          t: "No live government systems",
          d: "No scraping or undocumented API calls to EPFO, UIDAI, or any portal.",
        },
        {
          t: "No real citizen PII",
          d: "No real UAN, Aadhaar, PAN, OTP, or bank passwords are ever accepted, stored, or processed.",
        },
        {
          t: "No government affiliation",
          d: "ClaimReady is an independent prototype built for Build What Moves India 2026. It is not affiliated with EPFO.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
      <div className="cr-badge fade-up">
        <span className="cr-tick" />
        <span>{isHindi ? "अनुपालन व पारदर्शिता" : "Compliance & transparency"}</span>
      </div>
      <h1 className="fade-up mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]" style={{ ["--d" as string]: "0.05s" }}>
        {isHindi ? "क्या वास्तविक है, क्या सिम्युलेटेड" : "Real vs. mocked"}
      </h1>
      <p className="fade-up mt-2 text-sm text-neutral-600" style={{ ["--d" as string]: "0.1s" }}>
        {isHindi
          ? "यह प्रोटोटाइप कैसे काम करता है, कहाँ एआई है, और कहाँ मॉक — स्पष्ट घोषणा।"
          : "Exactly how this prototype works, where AI is used, and where things are mocked."}
      </p>

      <div className="mt-6 space-y-5">
        {groups.map((g, i) => (
          <div key={i} className={`fade-up border p-6 ${g.accent}`} style={{ ["--d" as string]: `${0.12 + i * 0.06}s` }}>
            <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
              <h2 className="text-base font-semibold">{g.title}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-black/10 text-neutral-600">
                {g.badge}
              </span>
            </div>
            <div className="space-y-3.5">
              {g.points.map((p, j) => (
                <div key={j}>
                  <h3 className="text-xs font-bold flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 ${g.dot}`} />
                    {p.t}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5 pl-3 leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fade-up mt-8 text-center">
        <Link href="/intake" className="cr-btn cr-btn--primary">
          <span>← {isHindi ? "जांच पर लौटें" : "Back to claim check"}</span>
        </Link>
      </div>
    </div>
  );
}
