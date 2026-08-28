"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../i18n/context";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M4 10h10.2M10.4 5.6 15.2 10l-4.8 4.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  // Pause the decorative hero video for users who prefer reduced motion
  // (WCAG 2.2.2), and keep listening — a user can flip this OS setting
  // mid-session and an already-playing video should stop retroactively.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      if (mq.matches) videoRef.current?.pause();
      else videoRef.current?.play().catch(() => {});
    };
    applyPreference();
    mq.addEventListener("change", applyPreference);
    return () => mq.removeEventListener("change", applyPreference);
  }, []);

  const steps = [
    {
      k: "01",
      t: hi ? "अपना दावा बताएं" : "Tell us your claim",
      d: hi
        ? "दावा प्रकार चुनें या अपनी अस्वीकृति टिप्पणी पेस्ट करें।"
        : "Pick your claim type, or paste the rejection remark you got.",
    },
    {
      k: "02",
      t: hi ? "सटीक कारण जानें" : "See the exact blocker",
      d: hi
        ? "नियम-इंजन सटीक कारण बताता है; एआई इसे सरल भाषा में समझाता है।"
        : "A rules engine pins the exact reason; AI explains it in plain language.",
    },
    {
      k: "03",
      t: hi ? "समाधान प्लान पाएं" : "Get the fix plan",
      d: hi
        ? "सटीक कदम, दस्तावेज़, कौन कार्रवाई करे, और समयरेखा — तैयार।"
        : "Exact steps, documents, who must act, and the timeline — ready to use.",
    },
  ];

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        {/* Full-bleed atmospheric background with gradient fallback + light scrim */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#eaf3fb] via-white to-[#eef4fa]" />
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-[0.22]"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_075824_7c8a2ef3-826c-43ca-81a1-162429faa306.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-white/45" />
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="cr-badge wipe-in" style={{ ["--d" as string]: "0.15s" }}>
            <span className="cr-tick" />
            <span>{hi ? "ईपीएफओ दावा अस्वीकृति इंटेलिजेंस" : "EPFO Claim-Rejection Intelligence"}</span>
          </div>

          <h1
            className="mt-6 font-semibold tracking-[-0.038em] leading-[1.12] text-[#0a0a0a]"
            style={{ fontSize: "calc(clamp(2.6rem, 5.8vw, 4.9rem) + 2px)" }}
          >
            <span className="headline-mask">
              <span className="rise" style={{ ["--d" as string]: "0.26s" }}>
                {hi ? "5 में से 1 पीएफ दावा" : "1 in 5 PF claims"}
              </span>
            </span>
            <span className="headline-mask">
              <span
                className="rise whitespace-nowrap"
                style={{ ["--d" as string]: "0.4s" }}
              >
                <span className="text-[#6b7378] font-semibold">
                  {hi ? "अस्वीकृत होता है। इसे " : "gets rejected. Catch yours "}
                </span>
                <span className="accent-paint font-semibold">
                  {hi ? "पहले पकड़ें।" : "before you file."}
                </span>
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-7 max-w-[680px] text-[#1a1a1a] font-light leading-[1.5] tracking-[-0.01em]"
            style={{ fontSize: "clamp(16px, 1.7vw, 19px)", ["--d" as string]: "0.6s" }}
          >
            {hi
              ? "क्लेमरेडी आपके ईपीएफओ दावे को हर सामान्य अस्वीकृति कारण से जांचता है — नाम व जन्म-तिथि बेमेल, बैंक केवाईसी, नियोक्ता निकास तिथि — सरल भाषा में सटीक सुधार बताता है, और यदि आप पहले से अस्वीकृत हैं, तो कारण डिकोड कर आपका समाधान प्लान बनाता है।"
              : "ClaimReady checks your EPFO claim against every common rejection reason — name and date-of-birth mismatches, bank KYC, employer exit dates — tells you the exact fix in plain language, and if you were already rejected, decodes the reason and builds your resolution plan."}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/intake?tab=samples"
              className="cr-btn cr-btn--primary wipe-in"
              style={{ ["--d" as string]: "0.72s" }}
            >
              <span>{hi ? "प्री-फ्लाइट जांच चलाएं" : "Run a pre-flight check"}</span>
              <span className="cr-btn__icon">
                <ArrowIcon />
              </span>
            </Link>
            <Link
              href="/intake?tab=paste"
              className="cr-btn cr-btn--ghost wipe-in"
              style={{ ["--d" as string]: "0.82s" }}
            >
              <span>{hi ? "अस्वीकृति डिकोड करें" : "Decode a rejection"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="border-t border-black/[0.07] bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {hi ? "कैसे काम करता है" : "How it works"}
            </h2>
            <span className="text-xs text-neutral-500">
              {hi ? "फाइल करने से पहले · 30 सेकंड" : "Before you file · 30 seconds"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.08]">
            {steps.map((s, i) => (
              <div
                key={s.k}
                className="fade-up bg-white p-6 sm:p-7"
                style={{ ["--d" as string]: `${0.1 + i * 0.08}s` }}
              >
                <div className="text-[#006cd2] font-semibold text-sm tracking-tight">
                  {s.k}
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-[#0a0a0a]">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#006cd2]" />
              {hi ? "एआई व्याख्या करता है · नियम निर्णय लेते हैं" : "AI interprets · rules decide"}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#006cd2]" />
              {hi ? "100% सिंथेटिक डेटा" : "100% synthetic data"}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#006cd2]" />
              {hi ? "हिंदी + अंग्रेज़ी" : "Hindi + English"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
