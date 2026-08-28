"use client";

import React from "react";
import { useLanguage } from "../i18n/context";

export function DisclosureBanner() {
  const { lang, t } = useLanguage();

  return (
    <div
      role="region"
      aria-label={lang === "hi" ? "सूचना" : "Disclosure"}
      id="compliance-disclosure-banner"
      className="w-full bg-[#1f6fe5]/[0.06] border-b border-[#1f6fe5]/15 px-4 py-1.5 text-center text-[11px] sm:text-xs font-medium text-[#14449e]"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1f6fe5] pulse-dot shrink-0" />
        <p>
          <span className="font-semibold">{lang === "hi" ? "सूचना: " : "Notice: "}</span>
          {t("disclosure_banner")}
        </p>
      </div>
    </div>
  );
}
