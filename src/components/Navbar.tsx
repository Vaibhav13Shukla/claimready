"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../i18n/context";

function Logo() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#5196fe] text-white font-bold text-xs tracking-tight shrink-0">
      CR
    </span>
  );
}

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { href: "/", label: lang === "hi" ? "होम" : "Home" },
    { href: "/intake", label: lang === "hi" ? "जांच करें" : "Check Claim" },
    { href: "/tracker", label: lang === "hi" ? "ट्रैकर" : "Tracker" },
    { href: "/transparency", label: t("transparency_link") },
  ];

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#e1dfd8] sticky top-0 z-40 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 h-[64px] flex items-center justify-between gap-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="ClaimReady home">
          <Logo />
          <span className="flex items-center gap-2">
            <span className="text-[19px] font-semibold tracking-[-0.03em] text-[#1b1d20]">
              {t("app_name")}
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-[9999px] bg-[#5196fe]/10 text-[#3f75c6]">
              EPFO
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`cr-navlink ${isActive ? "active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-[9999px] border border-[#e1dfd8] bg-[#f2f1ec] text-[#1b1d20] hover:bg-[#e1dfd8] transition-colors cursor-pointer"
          >
            {t("switch_lang")}
          </button>

          {/* Ghost Pill Button */}
          <Link
            href="/intake"
            className="cr-btn cr-btn--ghost hidden sm:inline-flex !min-h-[38px] !py-1.5 !px-4 !text-[13px]"
          >
            <span>{lang === "hi" ? "जांच शुरू करें" : "Check Claim"}</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex flex-col justify-center gap-[5px] w-9 h-9 items-center rounded-lg hover:bg-neutral-100 transition-colors"
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
            <span className={`block w-[18px] h-[1.5px] bg-[#1b1d20] transition-transform ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[#1b1d20] transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[#1b1d20] transition-transform ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <nav
          className="md:hidden border-t border-[#e1dfd8] px-6 py-4 flex flex-col gap-2 bg-white"
          aria-label="Mobile Navigation"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-[14px] font-medium text-[#1b1d20] hover:bg-[#f2f1ec] rounded-xl transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#e1dfd8] mt-2">
            <Link
              href="/intake"
              onClick={() => setOpen(false)}
              className="cr-btn cr-btn--primary w-full text-center"
            >
              <span>{lang === "hi" ? "जांच शुरू करें" : "Check Claim"}</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
