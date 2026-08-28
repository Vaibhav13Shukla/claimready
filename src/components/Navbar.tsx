"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../i18n/context";

function Logo() {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 bg-[#1f6fe5] text-white font-bold text-sm tracking-tight shrink-0">
      CR
    </span>
  );
}

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { href: "/", label: lang === "hi" ? "होम" : "Home" },
    { href: "/intake", label: lang === "hi" ? "जांच करें" : "Check a claim" },
    { href: "/transparency", label: t("transparency_link") },
  ];

  return (
    <header className="w-full bg-white/85 backdrop-blur-md border-b border-black/[0.07]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="ClaimReady home">
          <Logo />
          <span className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight">{t("app_name")}</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-[#1f6fe5]/10 text-[#14449e] border border-[#1f6fe5]/20">
              EPFO
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="cr-navlink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-xs font-semibold px-3 py-2 cr-glass text-[#1b1d20] hover:text-[#1f6fe5] transition-colors cursor-pointer"
          >
            <span aria-hidden="true">🌐</span> {t("switch_lang")}
          </button>
          <Link
            href="/intake"
            className="cr-btn cr-btn--primary hidden sm:inline-flex !min-h-[40px] !px-4 !text-[13px]"
          >
            <span>{lang === "hi" ? "जांच शुरू करें" : "Check my claim"}</span>
          </Link>
          <button
            className="md:hidden inline-flex flex-col justify-center gap-[5px] w-9 h-9 items-center"
            aria-label={
              open
                ? lang === "hi"
                  ? "मेनू बंद करें"
                  : "Close menu"
                : lang === "hi"
                  ? "मेनू खोलें"
                  : "Open menu"
            }
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="block w-[18px] h-[1.5px] bg-[#1b1d20]" />
            <span className="block w-[18px] h-[1.5px] bg-[#1b1d20]" />
            <span className="block w-[18px] h-[1.5px] bg-[#1b1d20]" />
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-black/[0.07] px-5 py-3 flex flex-col gap-1 bg-white"
          aria-label="Primary"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-[15px] font-medium cr-glass"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
