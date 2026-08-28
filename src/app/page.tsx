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
        : "Actionable steps, required documents, and pre-formatted letters ready to use.",
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
          <div className="max-w-[840px]">
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
              className="fade-up mt-6 max-w-[680px] text-[#6e6e6e] text-[17px] sm:text-[19px] font-normal leading-[1.5] tracking-[-0.015em]"
              style={{ ["--d" as string]: "0.45s" }}
            >
              {hi
                ? "ईपीएफओ के दावों में मामूली विसंगतियों (नाम की वर्तनी, जन्मतिथि, बैंक केवाईसी, या छूटी हुई निकास तिथि) से होने वाली अस्वीकृतियों को पहले ही रोकें। पीएफ एक्स-रे प्री-फ्लाइट जांच चलाकर सटीक सुधार बताता है।"
                : "Even as EPFO expands auto-mode settlements, avoidable rejections persist due to minor profile discrepancies like name spelling, date of birth, unverified bank KYC, or missing exit dates. PF X-Ray runs a pre-flight check and gives you the exact fix."}
            </p>

            {/* Action Buttons */}
            <div
              className="mt-8 flex flex-wrap items-center gap-3.5"
              style={{ ["--d" as string]: "0.6s" }}
            >
              <Link
                href="/job-switch"
                className="cr-btn cr-btn--primary wipe-in shadow-sm"
                style={{ ["--d" as string]: "0.62s" }}
              >
                <span>{hi ? "जॉब बदली? पहले जांचें" : "Changed jobs? Check first"}</span>
                <span className="cr-btn__icon">
                  <ArrowIcon />
                </span>
              </Link>
              <Link
                href="/intake?tab=preflight"
                className="cr-btn cr-btn--ghost wipe-in"
                style={{ ["--d" as string]: "0.7s" }}
              >
                <span>{hi ? "प्री-फ्लाइट जांच चलाएं" : "Run a pre-flight check"}</span>
              </Link>
              <Link
                href="/intake?tab=paste"
                className="cr-btn cr-btn--ghost wipe-in"
                style={{ ["--d" as string]: "0.76s" }}
              >
                <span>{hi ? "अस्वीकृति डिकोड करें" : "Decode a rejection"}</span>
              </Link>
              <Link
                href="/demo"
                className="cr-btn cr-btn--ghost wipe-in"
                style={{ ["--d" as string]: "0.78s" }}
              >
                <span>{hi ? "डेमो व जज लॉगिन" : "Judge & Demo logins"}</span>
              </Link>
            </div>

            {/* Source Citation & Reality Check */}
            <div className="mt-7 flex items-center gap-2 text-xs text-[#797876]">
              <span className="text-[#3f75c6]">ℹ</span>
              <span>
                {hi
                  ? "स्रोत: ईपीएफओ वार्षिक रिपोर्ट (2023–24) एवं क्लेम सेटलमेंट आधिकारिक रिलीज़।"
                  : "Data references: EPFO Annual Reports (2023–24) & FY 2024–25 Claim Settlement releases."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- JOB-SWITCH X-RAY (hero feature) ---------------- */}
      <section className="border-b border-[#e1dfd8] bg-[#0f2a4a]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[9999px] border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                <span className="w-2 h-2 rounded-full bg-[#5196fe]" />
                {hi ? "नया · रोकथाम" : "New · Prevention"}
              </div>
              <h2 className="mt-4 text-2xl sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.12] text-white">
                {hi ? (
                  "अधिकांश पीएफ दावे उस दिन टूटते हैं जब आप नौकरी बदलते हैं — फाइल करने के दिन नहीं।"
                ) : (
                  <>
                    Most PF claims break the day you{" "}
                    <span className="font-serif-accent italic text-[#8fc0ff]">change jobs</span> — not
                    the day you file.
                  </>
                )}
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] text-white/70 leading-[1.55] max-w-[560px]">
                {hi
                  ? "जॉब-स्विच एक्स-रे आपके स्विच को दोबारा जीता है और उन अदृश्य टाइम-बमों को दिखाता है — छूटी निकास तिथि, दूसरा यूएएन, बैंक केवाईसी — जो महीनों बाद दावे को अस्वीकृत कराते हैं। सब कुछ फाइल करने से पहले।"
                  : "Job-Switch X-Ray replays your switch and surfaces the invisible time-bombs — a missing exit date, a second UAN, drifting bank KYC — that reject a claim months later. All of it, before you ever file."}
              </p>
              <div className="mt-6">
                <Link
                  href="/job-switch"
                  className="inline-flex items-center gap-2 rounded-[9999px] bg-[#5196fe] hover:bg-[#3f75c6] text-white font-semibold text-[14px] px-5 py-3 transition-colors shadow-sm"
                >
                  <span>{hi ? "जॉब-स्विच एक्स-रे चलाएं" : "Run the Job-Switch X-Ray"}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            {/* Mini time-bomb preview */}
            <div className="rounded-[20px] border border-white/15 bg-white/[0.06] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60">
                  {hi ? "पीएफ निरंतरता स्कोर" : "PF continuity score"}
                </span>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-[9999px] bg-[#d21f3c]/20 text-[#ff8fa0] border border-[#d21f3c]/30">
                  {hi ? "2 समस्याएँ" : "2 to fix"}
                </span>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-[44px] font-bold leading-none text-[#ff8fa0]">34</span>
                <span className="text-white/50 text-sm mb-1.5">/ 100</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {[
                  hi ? "निकास तिथि दर्ज नहीं — RC04" : "Date of Exit never filed — RC04",
                  hi ? "पुराना पीएफ दूसरे यूएएन में — RC05" : "Old PF split across a second UAN — RC05",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-[13px] text-white/85">
                    <span className="text-[#ff8fa0]" aria-hidden="true">
                      ⏳
                    </span>
                    {t}
                  </li>
                ))}
                {[hi ? "बैंक केवाईसी सत्यापित" : "Bank KYC verified"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-[13px] text-white/50">
                    <span className="text-[#6ee7b7]" aria-hidden="true">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
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
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#067a54]" />
              {hi ? "मुक्त व खुला स्रोत" : "Independent open prototype"}
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
                ? "अधिकांश रोकी जा सकने वाली अस्वीकृतियां इन 5 मुख्य श्रेणियों में आती हैं। प्रत्येक का स्पष्ट समाधान मार्ग उपलब्ध है।"
                : "Historically, over 80% of preventable claim rejections stem from these core discrepancy categories. Each has a clear fix path."}
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
                    href={`/intake?tab=preflight`}
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
