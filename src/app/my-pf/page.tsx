"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import { getPersona, personaTotal, formatINR, PERSONAS } from "../../core/personas";

function MyPfContent() {
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const hi = lang === "hi";

  const persona = getPersona(searchParams.get("persona")) ?? PERSONAS[0];
  const first = persona.name.split(" ")[0];
  const total = personaTotal(persona);
  const m = persona.money;
  const claim = persona.claim;

  const money = [
    { label_en: "Your share", label_hi: "आपका अंश", v: m.employee },
    { label_en: "Employer", label_hi: "नियोक्ता", v: m.employer },
    { label_en: "Pension (EPS)", label_hi: "पेंशन (EPS)", v: m.pension },
    { label_en: "Interest", label_hi: "ब्याज", v: m.interest },
  ];

  const xrayHref = claim
    ? `/diagnosis?scheme=${claim.scheme}&raw_error_text=${encodeURIComponent(
        claim.raw_error_text,
      )}&golden_id=${claim.golden_id}`
    : null;

  return (
    <div className="max-w-[880px] mx-auto px-6 sm:px-8 py-10">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-3 fade-up">
        <div>
          <div className="cr-badge mb-3">
            <span>{hi ? "मेरा पीएफ" : "My PF"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1b1d20]">
            {hi ? `नमस्ते, ${first}` : `Namaste, ${first}`}
          </h1>
          <p className="mt-1 text-[14px] text-[#6e6e6e]">
            {hi ? "आपके पीएफ के साथ क्या हो रहा है, यहाँ देखें।" : "Here's what's happening with your PF."}
          </p>
        </div>
        <Link
          href="/demo"
          className="text-[12px] font-semibold text-[#5196fe] whitespace-nowrap py-1.5 shrink-0"
        >
          {hi ? "खाता बदलें" : "Switch account"}
        </Link>
      </div>

      {/* Money */}
      <div
        className="fade-up cr-card mt-6 p-6 bg-white"
        style={{ ["--d" as string]: "0.06s" }}
      >
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6e6e6e]">
              {hi ? "कुल पीएफ शेष" : "Total PF balance"}
            </span>
            <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1b1d20] mt-1">
              {formatINR(total)}
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#797876]">UAN {persona.uan}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {money.map((x, i) => (
            <div key={i} className="p-3 rounded-[14px] bg-[#f2f1ec] border border-[#e1dfd8]">
              <p className="text-[11px] text-[#6e6e6e]">{hi ? x.label_hi : x.label_en}</p>
              <p className="text-[14px] font-semibold text-[#1b1d20] mt-0.5">{formatINR(x.v)}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#797876] mt-3">
          {hi ? "सिंथेटिक डेमो शेष · लाइव ईपीएफओ डेटा नहीं।" : "Synthetic demo balance · not live EPFO data."}
        </p>
      </div>

      {/* Attention */}
      {claim ? (
        <div
          className="fade-up mt-4 rounded-[20px] border border-[#d21f3c]/30 bg-[#d21f3c]/[0.04] p-6"
          style={{ ["--d" as string]: "0.12s" }}
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#d21f3c]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#d21f3c]">
              {hi ? "ध्यान दें" : "Needs your attention"}
            </span>
          </div>
          <p className="mt-2 text-[16px] font-semibold text-[#1b1d20]">
            {hi
              ? `आपका ${formatINR(claim.amount)} का ${claim.type_hi} दावा रुका हुआ है।`
              : `Your ${formatINR(claim.amount)} ${claim.type_en} claim is blocked.`}
          </p>
          <p className="mt-1 text-[13px] text-[#6e6e6e]">
            {hi
              ? `${claim.age_hi} फाइल किया · "${claim.raw_error_text}"`
              : `Filed ${claim.age_en} · "${claim.raw_error_text}"`}
          </p>
          {xrayHref && (
            <Link href={xrayHref} className="cr-btn cr-btn--primary mt-4 !min-h-[48px] !text-[14px]">
              <span>{hi ? "इस दावे का एक्स-रे करें" : "X-Ray this claim"}</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      ) : (
        <div
          className="fade-up mt-4 rounded-[20px] border border-[#067a54]/30 bg-[#067a54]/[0.04] p-6"
          style={{ ["--d" as string]: "0.12s" }}
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#067a54]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#067a54]">
              {hi ? "कुछ लंबित नहीं" : "Nothing pending"}
            </span>
          </div>
          <p className="mt-2 text-[16px] font-semibold text-[#1b1d20]">
            {hi
              ? "आपका खाता ठीक है — एक दावा प्री-फ्लाइट जांच पास कर लेगा।"
              : "Your account is in order — a claim would pass the pre-flight check."}
          </p>
          <Link href="/intake" className="cr-btn cr-btn--ghost mt-4 !min-h-[44px] !text-[13px]">
            <span>{hi ? "प्री-फ्लाइट जांच चलाएं" : "Run a pre-flight check anyway"}</span>
          </Link>
        </div>
      )}

      {/* Work history */}
      <div className="fade-up mt-4 cr-card p-6 bg-white" style={{ ["--d" as string]: "0.18s" }}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6e6e6e]">
          {hi ? "आपका सेवा इतिहास" : "Your work history"}
        </span>
        <ol className="mt-2.5 space-y-2">
          {persona.employments.map((e, i) => {
            const blk = e.status === "blocker";
            return (
              <li
                key={i}
                className={`flex items-start gap-3 p-3 rounded-[14px] border ${
                  blk ? "border-[#d21f3c]/30 bg-[#d21f3c]/[0.04]" : "border-[#e1dfd8] bg-[#f2f1ec]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${blk ? "bg-[#d21f3c]" : "bg-[#5196fe]"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[#1b1d20] truncate">{e.employer}</p>
                    <span className="text-[11px] text-[#6e6e6e] shrink-0">
                      {hi ? e.period_hi : e.period_en}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#797876] mt-0.5 truncate">{e.memberId}</p>
                  {(hi ? e.note_hi : e.note_en) && (
                    <p className={`text-[11px] mt-1 font-medium ${blk ? "text-[#d21f3c]" : "text-[#6e6e6e]"}`}>
                      {blk ? "⚠ " : ""}
                      {hi ? e.note_hi : e.note_en}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Quick actions */}
      <div
        className="fade-up mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
        style={{ ["--d" as string]: "0.24s" }}
      >
        <Link href="/intake?tab=paste" className="cr-card p-4 bg-white hover:border-[#5196fe]/50 transition-colors">
          <p className="text-[13px] font-semibold text-[#1b1d20]">
            {hi ? "कोई अस्वीकृति डिकोड करें" : "Decode a rejection"}
          </p>
          <p className="text-[12px] text-[#6e6e6e] mt-0.5">
            {hi ? "अपनी टिप्पणी पेस्ट करें" : "Paste your own remark"} →
          </p>
        </Link>
        <Link href="/transparency" className="cr-card p-4 bg-white hover:border-[#5196fe]/50 transition-colors">
          <p className="text-[13px] font-semibold text-[#1b1d20]">
            {hi ? "क्या वास्तविक, क्या मॉक" : "Real vs. mocked"}
          </p>
          <p className="text-[12px] text-[#6e6e6e] mt-0.5">
            {hi ? "पारदर्शिता विवरण" : "Transparency details"} →
          </p>
        </Link>
      </div>
    </div>
  );
}

export default function MyPfPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-neutral-500">Loading…</div>}>
      <MyPfContent />
    </Suspense>
  );
}
