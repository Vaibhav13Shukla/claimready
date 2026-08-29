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

export function AppProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath());
  const [lang, setLang] = useState<Lang>("en");
  const [textSize, setTextSize] = useState(100);
  const [contrast, setContrast] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
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
