"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../i18n/context";

export function DisclosureBanner() {
  const { lang, t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label={lang === "hi" ? "सूचना" : "Disclosure"}
      id="announcement-banner"
      className="w-full bg-[#5196fe] text-white text-[12px] sm:text-[13px] font-medium min-h-[40px] py-1.5 flex items-center justify-between px-4 sm:px-6 relative z-50 transition-all"
    >
      <div className="flex-1 flex items-center justify-center gap-2 text-center">
        <p className="leading-snug">
          <span className="font-semibold">{lang === "hi" ? "सूचना: " : "Notice: "}</span>
          {t("disclosure_banner")}
          <Link
            href="/transparency"
            className="text-white underline underline-offset-2 font-semibold hover:opacity-90 transition-opacity ml-1.5"
          >
            {lang === "hi" ? "विवरण देखें" : "Learn more"}
          </Link>
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label={lang === "hi" ? "बंद करें" : "Dismiss"}
        className="text-white/80 hover:text-white p-1 ml-2 transition-colors cursor-pointer text-lg leading-none shrink-0"
      >
        &times;
      </button>
    </div>
  );
}
