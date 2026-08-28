"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../i18n/context";
import { PERSONAS } from "../../core/personas";

export default function DemoPage() {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const [copied, setCopied] = useState(false);

  const copyCreds = () => {
    navigator.clipboard?.writeText("UAN: 1000 0000 0012\nPasscode: DEMO@2026\nType: Evaluator Test Access");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[880px] mx-auto px-6 sm:px-8 py-10">
      <div className="cr-badge fade-up">
        <span>{hi ? "डेमो व मूल्यांकनकर्ता क्रेडेंशियल्स" : "Evaluator & Demo Credentials"}</span>
      </div>
      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {hi ? "डेमो नागरिक के रूप में त्वरित लॉगिन" : "Instant Demo Login & Test Credentials"}
      </h1>
      <p
        className="fade-up mt-1.5 text-[15px] text-[#6e6e6e] max-w-[660px]"
        style={{ ["--d" as string]: "0.1s" }}
      >
        {hi
          ? "हैकथॉन जजों और मूल्यांकनकर्ताओं के लिए तुरंत तैयार टेस्ट प्रोफाइल। किसी वास्तविक OTP या आधार की आवश्यकता नहीं है।"
          : "Instant test access for hackathon evaluators and judges. No real OTP, password, or Aadhaar required."}
      </p>

      {/* Evaluator Quick Access Card */}
      <div className="fade-up mt-6 p-5 rounded-[20px] bg-[#5196fe]/[0.06] border border-[#5196fe]/30" style={{ ["--d" as string]: "0.15s" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#3f75c6]">
                {hi ? "मूल्यांकनकर्ता टेस्ट क्रेडेंशियल्स" : "Instant Judge Test Credentials"}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#067a54]/10 text-[#067a54] border border-[#067a54]/25">
                Ready
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#1b1d20]">
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e1dfd8] mr-2">UAN: 1000 0000 0012</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e1dfd8]">Passcode: DEMO@2026</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCreds}
              className="px-3 py-1.5 rounded-[9999px] bg-white border border-[#5196fe]/40 text-xs font-semibold text-[#3f75c6] hover:bg-[#5196fe]/10 transition-colors cursor-pointer"
            >
              {copied ? (hi ? "✓ कॉपी हुआ" : "✓ Copied") : hi ? "क्रेडेंशियल्स कॉपी करें" : "Copy Credentials"}
            </button>
            <Link
              href="/my-pf?persona=priya"
              className="cr-btn cr-btn--primary !min-h-[36px] !px-3.5 !text-xs whitespace-nowrap"
            >
              <span>{hi ? "त्वरित लॉगिन →" : "1-Click Login →"}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PERSONAS.map((p, i) => {
          const hasIssue = !!p.claim;
          return (
            <Link
              key={p.id}
              href={`/my-pf?persona=${p.id}`}
              className="fade-up cr-card p-4 sm:p-5 bg-white hover:border-[#5196fe]/50 transition-colors group"
              style={{ ["--d" as string]: `${0.2 + i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-[#1b1d20] truncate">{p.name}</h2>
                  <p className="text-[12px] text-[#6e6e6e] mt-0.5">{hi ? p.role_hi : p.role_en}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-[9999px] border whitespace-nowrap shrink-0 ${
                    hasIssue
                      ? "text-[#d21f3c] bg-[#d21f3c]/10 border-[#d21f3c]/25"
                      : "text-[#067a54] bg-[#067a54]/10 border-[#067a54]/25"
                  }`}
                >
                  {hasIssue ? (hi ? "⚠ 1 समस्या" : "⚠ 1 issue") : hi ? "✓ सब ठीक" : "✓ all good"}
                </span>
              </div>
              <p className="text-[13px] text-[#1b1d20] mt-3 leading-snug">
                {hi ? p.tagline_hi : p.tagline_en}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#6e6e6e] pt-2 border-t border-[#e1dfd8]">
                <span className="font-mono">{p.uan}</span>
                <span className="font-semibold text-[#5196fe] group-hover:underline">
                  {hi ? "इस खाते में लॉगिन करें" : "Launch Account"} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#f2f1ec] border border-[#e1dfd8] text-xs text-[#6e6e6e] space-y-1">
        <p className="font-semibold text-[#1b1d20]">
          {hi ? "सुरक्षा एवं गोपनीयता प्रकटीकरण" : "Security & Privacy Disclosure"}
        </p>
        <p>
          {hi
            ? "स्वतंत्र हैकथॉन प्रोटोटाइप। सभी रिकॉर्ड्स 100% सिंथेटिक व मॉक हैं। ईपीएफओ या किसी सरकारी निकाय से कोई वास्तविक PII साझा नहीं की जाती।"
            : "Independent hackathon prototype · 100% synthetic mock records · No real PII or live government credentials accessed."}
        </p>
      </div>
    </div>
  );
}
