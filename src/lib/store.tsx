import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialClaims, type Claim, type Grievance } from "./data";

type Lang = "en" | "hi";

type Ctx = {
  path: string;
  navigate: (to: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, hi: string) => string;
  textSize: number;
  setTextSize: (n: number) => void;
  contrast: boolean;
  setContrast: (b: boolean) => void;
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
  claims: Claim[];
  addClaim: (c: Claim) => void;
  grievances: Grievance[];
  addGrievance: (g: Grievance) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  speak: (text: string) => void;
  speaking: boolean;
};

const AppCtx = createContext<Ctx | null>(null);

function currentPath() {
  const h = window.location.hash.replace(/^#/, "");
  return h === "" ? "/" : h;
}

// Small localStorage wrapper so the demo remembers state across reloads.
const save = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`epfo.${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    // ponytail: private mode / quota just means it won't persist this session
    try {
      localStorage.setItem(`epfo.${key}`, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath());
  const [lang, setLang] = useState<Lang>(() => save.get("lang", "en"));
  const [textSize, setTextSize] = useState(() => save.get("textSize", 100));
  const [contrast, setContrast] = useState(() => save.get("contrast", false));
  const [loggedIn, setLoggedIn] = useState(() => save.get("loggedIn", false));
  const [claims, setClaims] = useState<Claim[]>(() => save.get("claims", initialClaims));
  const [grievances, setGrievances] = useState<Grievance[]>(() => save.get("grievances", []));
  const [toast, setToast] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const onHash = () => {
      setPath(currentPath());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}%`;
  }, [textSize]);

  useEffect(() => {
    document.body.classList.toggle("hc", contrast);
  }, [contrast]);

  // Persist state so a reload during a demo keeps the user's work.
  useEffect(() => save.set("lang", lang), [lang]);
  useEffect(() => save.set("textSize", textSize), [textSize]);
  useEffect(() => save.set("contrast", contrast), [contrast]);
  useEffect(() => save.set("loggedIn", loggedIn), [loggedIn]);
  useEffect(() => save.set("claims", claims), [claims]);
  useEffect(() => save.set("grievances", grievances), [grievances]);

  const navigate = useCallback((to: string) => {
    if (currentPath() === to) {
      window.scrollTo({ top: 0 });
      return;
    }
    window.location.hash = to;
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      if (synth.speaking) {
        synth.cancel();
        setSpeaking(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "hi" ? "hi-IN" : "en-IN";
      u.rate = 0.95;
      u.onend = () => setSpeaking(false);
      setSpeaking(true);
      synth.speak(u);
    },
    [lang],
  );

  const value = useMemo<Ctx>(
    () => ({
      path,
      navigate,
      lang,
      setLang,
      t: (en, hi) => (lang === "hi" ? hi : en),
      textSize,
      setTextSize,
      contrast,
      setContrast,
      loggedIn,
      login: () => setLoggedIn(true),
      logout: () => setLoggedIn(false),
      claims,
      addClaim: (c) => setClaims((prev) => [c, ...prev]),
      grievances,
      addGrievance: (g) => setGrievances((prev) => [g, ...prev]),
      toast,
      showToast,
      speak,
      speaking,
    }),
    [path, navigate, lang, textSize, contrast, loggedIn, claims, grievances, toast, showToast, speak, speaking],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
