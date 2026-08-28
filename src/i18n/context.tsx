"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback, useEffect } from "react";
import en from "./en.json";
import hi from "./hi.json";

export type Language = "en" | "hi";

const STORAGE_KEY = "claimready_lang";

// Minimal external store so the language survives across tabs/reloads without
// a mount-time setState (which would either flash the wrong language or trip
// the `set-state-in-effect` rule). useSyncExternalStore is the React-correct
// way to read a browser API that isn't available during SSR: the server
// snapshot is always "en", and the client re-reads localStorage on mount
// without ever causing a hydration mismatch.
const listeners = new Set<() => void>();

function isValidLanguage(v: string | null): v is Language {
  return v === "en" || v === "hi";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isValidLanguage(saved) ? saved : "en";
  } catch {
    // localStorage can throw in private-browsing / storage-disabled contexts.
    return "en";
  }
}

function getServerSnapshot(): Language {
  return "en";
}

function writeLanguage(l: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {
    // Non-fatal: language just won't persist this session.
  }
  listeners.forEach((cb) => cb());
}

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => en[k] || (k as string),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Reflect the active language on <html lang> so screen readers announce
  // Hindi content in Hindi (WCAG 3.1.1 / 3.1.2). This synchronizes the DOM
  // with React state (a legitimate effect use, unlike setState-in-effect).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Language) => writeLanguage(l), []);

  const t = useCallback(
    (key: keyof typeof en): string => {
      const dict: Record<string, string> = lang === "hi" ? hi : en;
      return dict[key] || en[key] || (key as string);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
