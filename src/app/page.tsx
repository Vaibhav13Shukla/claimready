"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../i18n/context";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M4 10h10.2M10.4 5.6 15.2 10l-4.8 4.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  const steps = [
    {
      k: "01",
      t: hi ? "अपना दावा बताएं" : "Tell us your claim",
      d: hi
        ? "दावा प्रकार चुनें या अपनी अस्वीकृति टिप्पणी दर्ज करें।"
        : "Pick your claim type or paste the rejection remark you received.",
    },
    {
      k: "02",
      t: hi ? "सटीक कारण जानें" : "See the exact blocker",
      d: hi
        ? "नियम आधारित इंजन सटीक कारण और जिम्मेदार पक्ष को पहचानता है।"
        : "The deterministic rules engine pins the exact mismatch and who must act.",
    },
    {
      k: "03",
      t: hi ? "समाधान प्लान पाएं" : "Get the fix plan",
      d: hi
        ? "सटीक कदम, आवश्यक दस्तावेज़, और तैयार पत्र प्राप्त करें।"
        : "Step-by-step steps, required documents, and pre-formatted letters ready to use.",
    },
  ];

  const commonChecks = [
    {
      code: "RC01",
      title: hi ? "नाम बेमेल" : "Name mismatch",
      desc: hi ? "यूएएन, आधार, या बैंक खाते में नाम की वर्तनी में अंतर।" : "Spelling variation between UAN, Aadhaar, and bank records.",
    },
    {
      code: "RC02",
      title: hi ? "जन्म तिथि बेमेल" : "Date of birth mismatch",
      desc: hi ? "ईपीएफओ और आधार रिकॉर्ड में जन्म वर्ष या तारीख का अंतर।" : "Difference in date of birth between EPFO and Aadhaar database.",
    },
    {
      code: "RC03",
      title: hi ? "बैंक केवाईसी / आईएफएससी" : "Bank KYC / IFSC",
      desc: hi ? "बैंक खाता असत्यापित, निष्क्रिय, या आईएफएससी कोड पुराना होना।" : "Bank KYC unapproved, branch merged, or inactive savings account.",
    },
    {
      code: "RC04",
      title: hi ? "निकास तिथि (Date of Exit)" : "Missing date of exit",
      desc: hi ? "पिछले नियोक्ता द्वारा पोर्टल पर नौकरी छोड़ने की तिथि दर्ज न होना।" : "Previous employer has not updated your exit date on the portal.",
    },
    {
      code: "RC05",
      title: hi ? "मल्टीपल यूएएन" : "Multiple UAN accounts",
      desc: hi ? "पुरानी कंपनियों के पीएफ खाते वर्तमान यूएएन में ट्रांसफर न होना।" : "Previous employer PF balance not merged into current active UAN.",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-[#e1dfd8] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20">
          <div className="max-w-[820px]">
            {/* Tagline Badge */}
            <div className="cr-badge wipe-in" style={{ ["--d" as string]: "0.1s" }}>
              <span className="w-2 h-2 rounded-full bg-[#5196fe] shrink-0" />
              <span>
                {hi ? "ईपीएफओ दावा अस्वीकृति रोकथाम" : "EPFO Claim-Rejection Prevention"}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-6 font-semibold tracking-[-0.04em] leading-[1.08] text-[#1b1d20]"
              style={{ fontSize: "calc(clamp(2.4rem, 5.2vw, 4.2rem))" }}
            >
              <span className="headline-mask">
                <span className="rise" style={{ ["--d" as string]: "0.2s" }}>
                  {hi ? "5 में से 1 पीएफ दावा" : "1 in 5 PF claims"}
                </span>
              </span>
              <span className="headline-mask">
                <span className="rise" style={{ ["--d" as string]: "0.32s" }}>
                  <span className="text-[#6e6e6e] font-semibold">
                    {hi ? "अस्वीकृत होता है। इसे " : "gets rejected. Catch yours "}
                  </span>
                  <span>
                    {hi ? (
                      <span className="text-[#5196fe]">पहले पकड़ें।</span>
                    ) : (
                      <>
                        <span className="font-serif-accent italic font-medium text-[#5196fe]">
                          before
                        </span>{" "}
                        <span className="text-[#1b1d20]">you file.</span>
                      </>
                    )}
                  </span>
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="fade-up mt-6 max-w-[660px] text-[#6e6e6e] text-[17px] sm:text-[19px] font-normal leading-[1.5] tracking-[-0.015em]"
              style={{ ["--d" as string]: "0.45s" }}
            >
              {hi
                ? "क्लेमरेडी आपके ईपीएफओ दावे को सामान्य अस्वीकृति कारणों (नाम, जन्मतिथि, बैंक केवाईसी, एग्जिट डेट) से पहले ही जांचता है और सटीक सुधार बताता है।"
                : "EPFO rejects claims for minor mismatches like name spelling, date of birth, inactive bank KYC, or missing exit dates. ClaimReady runs a pre-flight check and gives you the exact fix."}
            </p>

            {/* Action Buttons */}
            <div
              className="mt-8 flex flex-wrap items-center gap-3.5"
              style={{ ["--d" as string]: "0.6s" }}
            >
              <Link
                href="/intake?tab=samples"
                className="cr-btn cr-btn--primary wipe-in shadow-sm"
                style={{ ["--d" as string]: "0.62s" }}
              >
                <span>{hi ? "प्री-फ्लाइट जांच चलाएं" : "Run a pre-flight check"}</span>
                <span className="cr-btn__icon">
                  <ArrowIcon />
                </span>
              </Link>
              <Link
                href="/intake?tab=paste"
                className="cr-btn cr-btn--ghost wipe-in"
                style={{ ["--d" as string]: "0.7s" }}
              >
                <span>{hi ? "अस्वीकृति डिकोड करें" : "Decode a rejection"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="border-b border-[#e1dfd8] bg-white py-14 sm:py-18">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6e6e6e]">
              {hi ? "कैसे काम करता है" : "How it works"}
            </h2>
            <span className="text-xs font-medium text-[#6e6e6e]">
              {hi ? "फाइल करने से पहले: 30 सेकंड" : "Before you file: 30 seconds"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.k}
                className="fade-up cr-card p-6 sm:p-7 bg-white hover:border-[#5196fe] transition-colors"
                style={{ ["--d" as string]: `${0.1 + i * 0.08}s` }}
              >
                <div className="text-[#5196fe] font-bold text-sm tracking-tight">{s.k}</div>
                <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-[#1b1d20]">
                  {s.t}
                </h3>
                <p className="mt-2 text-[14px] text-[#6e6e6e] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-medium text-[#6e6e6e] pt-6 border-t border-[#e1dfd8]">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5196fe]" />
              {hi ? "नियम-आधारित निर्णय" : "Deterministic rules engine"}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5196fe]" />
              {hi ? "100% सिंथेटिक डेटा" : "100% synthetic data"}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5196fe]" />
              {hi ? "हिंदी और अंग्रेज़ी" : "Hindi and English"}
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- COMMON ROOT CAUSES ---------------- */}
      <section className="py-14 sm:py-18 bg-[#f2f1ec] border-b border-[#e1dfd8]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="max-w-[720px] mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]">
              {hi ? "प्रमुख अस्वीकृति कारण जिनकी हम जांच करते हैं" : "Common rejection blockers we check"}
            </h2>
            <p className="mt-2 text-sm text-[#6e6e6e]">
              {hi
                ? "अधिकांश अस्वीकृतियां इन 5 श्रेणियों में आती हैं। फाइल करने से पहले इनकी जांच करें।"
                : "Over 80% of claim rejections belong to these 5 categories. Each has a clear fix path."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonChecks.map((c) => (
              <div
                key={c.code}
                className="cr-card p-5 bg-white flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-[9999px] bg-[#5196fe]/10 text-[#3f75c6]">
                    {c.code}
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#1b1d20] mt-2.5">
                    {c.title}
                  </h3>
                  <p className="text-[13px] text-[#6e6e6e] mt-1.5 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e1dfd8]">
                  <Link
                    href={`/intake?tab=samples`}
                    className="text-xs font-semibold text-[#5196fe] hover:underline flex items-center justify-between"
                  >
                    <span>{hi ? "डेमो केस जांचें" : "Test sample case"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
