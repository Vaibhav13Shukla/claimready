"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../i18n/context";
import { PERSONAS } from "../../core/personas";

export default function DemoPage() {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <div className="max-w-[880px] mx-auto px-6 sm:px-8 py-10">
      <div className="cr-badge fade-up">
        <span>{hi ? "डेमो लॉगिन" : "Demo login"}</span>
      </div>
      <h1
        className="fade-up mt-4 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {hi ? "एक डेमो नागरिक के रूप में लॉगिन करें" : "Log in as a demo citizen"}
      </h1>
      <p
        className="fade-up mt-1.5 text-[15px] text-[#6e6e6e] max-w-[620px]"
        style={{ ["--d" as string]: "0.1s" }}
      >
        {hi
          ? "किसी भी नागरिक को चुनें — कोई असली OTP, आधार या पासवर्ड नहीं। सभी डेटा सिंथेटिक है।"
          : "Pick any citizen — no real OTP, Aadhaar or password. Every account is synthetic."}
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PERSONAS.map((p, i) => {
          const hasIssue = !!p.claim;
          return (
            <Link
              key={p.id}
              href={`/my-pf?persona=${p.id}`}
              className="fade-up cr-card p-4 sm:p-5 bg-white hover:border-[#5196fe]/50 transition-colors group"
              style={{ ["--d" as string]: `${0.12 + i * 0.05}s` }}
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
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#5196fe]">
                {hi ? "इस खाते में जाएं" : "Enter this account"} →
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-[12px] text-[#797876]">
        {hi
          ? "स्वतंत्र प्रोटोटाइप · ईपीएफओ से संबद्ध नहीं · कोई वास्तविक PII नहीं।"
          : "Independent prototype · not affiliated with EPFO · no real PII."}
      </p>
    </div>
  );
}
