"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../i18n/context";

export function Navbar({
  onOpenCommand,
  onOpenPassbook,
  onOpenServiceHistory,
  onOpenSecurity,
}: {
  onOpenCommand?: () => void;
  onOpenPassbook?: () => void;
  onOpenServiceHistory?: () => void;
  onOpenSecurity?: () => void;
}) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHindi = lang === "hi";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#e1dfd8] sticky top-0 z-40 transition-colors shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
        {/* Wordmark / Brand */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="PF X-Ray home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            PF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] sm:text-[20px] font-black tracking-[-0.03em] text-[#0f2a4a]">
                PF X-RAY
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                EPFO 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {isHindi ? "ईपीएफओ दावा जांच और अस्वीकृति रोकथाम" : "EPFO Claim Pre-flight Check & Rejection Decoder"}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
              pathname === "/" ? "text-blue-600" : "text-slate-700"
            }`}
          >
            {isHindi ? "माय ईपीएफओ" : "My EPFO"}
          </Link>

          <Link
            href="/job-switch"
            className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
              pathname.startsWith("/job-switch") ? "text-blue-600" : "text-slate-700"
            }`}
          >
            {isHindi ? "जॉब-स्विच एक्स-रे" : "Job-Switch X-Ray"}
          </Link>

          <Link
            href="/intake?tab=preflight"
            className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
              pathname.startsWith("/intake") || pathname.startsWith("/diagnosis")
                ? "text-blue-600"
                : "text-slate-700"
            }`}
          >
            {isHindi ? "क्लेम एक्स-रे" : "Claim X-Ray"}
          </Link>

          {onOpenPassbook && (
            <button
              onClick={onOpenPassbook}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {isHindi ? "पासबुक व बैलेंस" : "Passbook & Money"}
            </button>
          )}

          {onOpenServiceHistory && (
            <button
              onClick={onOpenServiceHistory}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {isHindi ? "सेवा इतिहास" : "Service History"}
            </button>
          )}

          {onOpenSecurity && (
            <button
              onClick={onOpenSecurity}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>🛡️</span>
              <span>{isHindi ? "सुरक्षा केंद्र" : "Security"}</span>
            </button>
          )}

          <Link
            href="/tracker"
            className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
              pathname === "/tracker" ? "text-blue-600" : "text-slate-700"
            }`}
          >
            {isHindi ? "लाइफसाइकिल ट्रैकर" : "Tracker"}
          </Link>

          <Link
            href="/transparency"
            className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
              pathname === "/transparency" ? "text-blue-600" : "text-slate-700"
            }`}
          >
            {t("transparency_link")}
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search ⌘K Button */}
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
              title="Search Services (Ctrl+K or ⌘K)"
            >
              <span>🔍</span>
              <span>{isHindi ? "सेवा खोजें..." : "Search services..."}</span>
              <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-300">
                ⌘K
              </kbd>
            </button>
          )}

          <Link
            href="/intake?tab=preflight"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>🔎</span>
            <span>{isHindi ? "एक्स-रे चलाएं" : "Run Claim X-Ray"}</span>
          </Link>

          <button
            type="button"
            onClick={() => setLang(isHindi ? "en" : "hi")}
            className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 transition-colors hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={isHindi ? "Switch to English" : "हिंदी में बदलें"}
          >
            {t("switch_lang")}
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden inline-flex flex-col justify-center gap-[5px] w-9 h-9 items-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`block w-[18px] h-[2px] bg-[#1b1d20] transition-transform ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-[18px] h-[2px] bg-[#1b1d20] transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-[18px] h-[2px] bg-[#1b1d20] transition-transform ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <nav className="lg:hidden border-t border-[#e1dfd8] px-6 py-4 flex flex-col gap-2.5 bg-white animate-fade-in">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            {isHindi ? "माय ईपीएफओ (होम)" : "My EPFO (Home)"}
          </Link>
          <Link
            href="/job-switch"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            {isHindi ? "जॉब-स्विच एक्स-रे" : "Job-Switch X-Ray"}
          </Link>
          <Link
            href="/intake?tab=preflight"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            {isHindi ? "दावा निदान (क्लेम एक्स-रे)" : "Claim X-Ray (Diagnosis)"}
          </Link>
          {onOpenPassbook && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenPassbook();
              }}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              {isHindi ? "पासबुक व बैलेंस" : "Passbook & Balance"}
            </button>
          )}
          {onOpenServiceHistory && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenServiceHistory();
              }}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              {isHindi ? "सेवा इतिहास" : "Service History"}
            </button>
          )}
          {onOpenSecurity && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenSecurity();
              }}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              {isHindi ? "सुरक्षा केंद्र" : "Security Center"}
            </button>
          )}
          <Link
            href="/tracker"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            {isHindi ? "लाइफसाइकिल ट्रैकर" : "Lifecycle Tracker"}
          </Link>
          <Link
            href="/transparency"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            {t("transparency_link")}
          </Link>
        </nav>
      )}
    </header>
  );
}
