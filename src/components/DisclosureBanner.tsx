"use client";

import React from "react";
import { useLanguage } from "../i18n/context";

export function DisclosureBanner() {
  const { lang, t } = useLanguage();

  return (
    <div
      role="banner"
      id="compliance-disclosure-banner"
      className="w-full bg-[#006cd2]/[0.06] border-b border-[#006cd2]/15 px-4 py-1.5 text-center text-[11px] sm:text-xs font-medium text-[#0053a3] sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006cd2] pulse-dot shrink-0" />
        <p>
          <span className="font-semibold">
            {lang === "hi" ? "सूचना: " : "Notice: "}
          </span>
          {t("disclosure_banner")}
        </p>
      </div>
    </div>
  );
}
