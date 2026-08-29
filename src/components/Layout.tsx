import { useState, type KeyboardEvent, type ReactNode } from "react";
import { useApp } from "../lib/store";
import { cn } from "../utils/cn";
import { searchServices } from "../lib/search";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#12436d]">
        <span className="text-xl font-black">पf</span>
      </div>
      <div className="leading-tight">
        <p className="text-xl font-extrabold tracking-tight">EPFO</p>
        <p className="text-sm text-white/80">Employees&rsquo; Provident Fund Organisation</p>
      </div>
    </div>
  );
}

function AccessBar() {
  const { lang, setLang, textSize, setTextSize, contrast, setContrast, t } = useApp();
  return (
    <div className="no-print border-b border-[#2b4a63] bg-[#0b2135] text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-base">
        <div className="flex items-center gap-2">
          <span className="text-white/70">{t("Make it easy to read:", "पढ़ने में आसान बनाएँ:")}</span>
          <div className="flex overflow-hidden rounded-sm border border-white/40">
            {[
              { s: 100, l: "A" },
              { s: 115, l: "A+" },
              { s: 130, l: "A++" },
            ].map((o) => (
              <button
                key={o.s}
                onClick={() => setTextSize(o.s)}
                aria-label={`Text size ${o.l}`}
                className={cn("px-3 py-1 font-bold", textSize === o.s ? "bg-white text-[#0b2135]" : "hover:bg-white/15")}
              >
                {o.l}
              </button>
            ))}
          </div>
          <button
            onClick={() => setContrast(!contrast)}
            className={cn(
              "rounded-sm border border-white/40 px-3 py-1 font-bold",
              contrast ? "bg-[#ffdd00] text-black" : "hover:bg-white/15",
            )}
          >
            {t("High contrast", "हाई कॉन्ट्रास्ट")}
          </button>
        </div>
        <div className="flex overflow-hidden rounded-sm border border-white/40">
          <button
            onClick={() => setLang("en")}
            className={cn("px-3 py-1 font-bold", lang === "en" ? "bg-white text-[#0b2135]" : "hover:bg-white/15")}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={cn("px-3 py-1 font-bold", lang === "hi" ? "bg-white text-[#0b2135]" : "hover:bg-white/15")}
          >
            हिन्दी
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchBox({ big }: { big?: boolean }) {
  const { navigate, t, lang } = useApp();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const results = q.trim().length > 1 ? searchServices(q, lang).slice(0, 6) : [];

  const go = (i: number) => {
    const r = results[i] ?? results[0];
    if (!r) return;
    navigate(r.to);
    setQ("");
    setActive(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? results.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    } else if (e.key === "Escape") {
      setQ("");
      setActive(-1);
    }
  };

  return (
    <div className="no-print relative w-full">
      <div className="flex">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={active >= 0 ? `search-opt-${active}` : undefined}
          autoComplete="off"
          placeholder={t("Search e.g. withdraw money, pension", "खोजें जैसे पैसा निकालना, पेंशन")}
          className={cn(
            "w-full rounded-l-[3px] border-2 border-r-0 border-[#0b0c0c] bg-white px-4 text-[#0b0c0c] placeholder:text-[#6f777b]",
            big ? "py-4 text-lg" : "py-3 text-base",
          )}
        />
        <button
          onClick={() => go(active)}
          aria-label={t("Search", "खोजें")}
          className={cn("flex items-center justify-center rounded-r-[3px] bg-[#12436d] px-5 font-bold text-white hover:bg-[#0b2f4d]", big ? "text-lg" : "")}
        >
          <svg width={big ? 26 : 22} height={big ? 26 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>
      {results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border-2 border-[#0b0c0c] bg-white shadow-xl"
        >
          {results.map((r, i) => (
            <li key={r.to + r.title} id={`search-opt-${i}`} role="option" aria-selected={i === active}>
              <button
                onMouseMove={() => setActive(i)}
                onClick={() => go(i)}
                className={cn(
                  "block w-full px-4 py-3 text-left",
                  i === active ? "bg-[#1d70b8] text-white" : "hover:bg-[#f0f4f8]",
                )}
              >
                <span className={cn("block font-bold", i === active ? "text-white" : "text-[#1d70b8] underline")}>{r.title}</span>
                <span className={cn("block text-base", i === active ? "text-white/90" : "text-[#505a5f]")}>{r.desc}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const navItems = [
  { to: "/", en: "Home", hi: "होम" },
  { to: "/services", en: "All services", hi: "सभी सेवाएँ" },
  { to: "/dashboard", en: "My account", hi: "मेरा खाता" },
  { to: "/calculators", en: "Calculators", hi: "कैलकुलेटर" },
  { to: "/help", en: "Help", hi: "मदद" },
  { to: "/about", en: "About EPFO", hi: "ईपीएफओ के बारे में" },
];

export function Header() {
  const { navigate, path, t, loggedIn, logout } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <header className="no-print">
      <button
        onClick={() => {
          const el = document.getElementById("main");
          el?.scrollIntoView({ behavior: "smooth" });
          el?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[#ffdd00] focus:px-4 focus:py-2 focus:font-bold"
      >
        Skip to main content
      </button>
      <AccessBar />
      <div className="bg-[#12436d] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <button onClick={() => navigate("/")} className="text-left">
            <Logo />
          </button>
          <div className="hidden w-80 md:block">
            <SearchBox />
          </div>
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-[3px] bg-white px-4 py-2 text-base font-bold text-[#12436d]"
                >
                  {t("My account", "मेरा खाता")}
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="rounded-[3px] border-2 border-white px-4 py-2 text-base font-bold"
                >
                  {t("Sign out", "साइन आउट")}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="rounded-[3px] bg-white px-4 py-2 text-base font-bold text-[#12436d]"
              >
                {t("Sign in with UAN", "यूएएन से साइन इन")}
              </button>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-[3px] border-2 border-white px-3 py-2 text-base font-bold md:hidden"
            >
              ☰
            </button>
          </div>
          <div className="w-full md:hidden">
            <SearchBox />
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
      </div>
      <nav className={cn("border-b-4 border-[#12436d] bg-white", open ? "block" : "hidden md:block")}>
        <ul className="mx-auto flex max-w-6xl flex-col px-2 md:flex-row">
          {navItems.map((n) => {
            const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
            return (
              <li key={n.to}>
                <button
                  onClick={() => {
                    navigate(n.to);
                    setOpen(false);
                  }}
                  className={cn(
                    "block w-full px-4 py-3 text-left text-lg font-bold md:w-auto",
                    active ? "bg-[#12436d] text-white" : "text-[#12436d] hover:bg-[#eef2f6]",
                  )}
                >
                  {t(n.en, n.hi)}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export function Footer() {
  const { navigate, t } = useApp();
  const cols = [
    {
      head: t("Popular services", "लोकप्रिय सेवाएँ"),
      links: [
        { l: t("Check PF balance", "पीएफ बैलेंस देखें"), to: "/balance" },
        { l: t("Withdraw money", "पैसा निकालें"), to: "/withdraw" },
        { l: t("Track a claim", "क्लेम ट्रैक करें"), to: "/track" },
        { l: t("Transfer PF to new job", "नई नौकरी में पीएफ भेजें"), to: "/transfer" },
      ],
    },
    {
      head: t("Support", "सहायता"),
      links: [
        { l: t("Help centre", "सहायता केंद्र"), to: "/help" },
        { l: t("Raise a complaint", "शिकायत दर्ज करें"), to: "/grievance" },
        { l: t("Find your EPFO office", "अपना ईपीएफओ ऑफिस खोजें"), to: "/offices" },
        { l: t("I don't know my UAN", "मुझे अपना यूएएन नहीं पता"), to: "/uan-help" },
      ],
    },
    {
      head: t("About", "परिचय"),
      links: [
        { l: t("Vision, mission & objectives", "विज़न, मिशन और उद्देश्य"), to: "/about" },
        { l: t("Schemes we run", "हमारी योजनाएँ"), to: "/about#schemes" },
        { l: t("For employers", "नियोक्ताओं के लिए"), to: "/employers" },
        { l: t("Accessibility statement", "सुगम्यता विवरण"), to: "/accessibility" },
      ],
    },
  ];
  return (
    <footer className="no-print mt-16 border-t-8 border-[#12436d] bg-[#f3f2f1]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {cols.map((c) => (
            <div key={c.head}>
              <h2 className="mb-3 text-lg font-extrabold">{c.head}</h2>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.to + l.l}>
                    <button
                      onClick={() => navigate(l.to)}
                      className="text-left text-lg text-[#1d70b8] underline underline-offset-4"
                    >
                      {l.l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t-2 border-[#b1b4b6] pt-6 text-base text-[#505a5f]">
          <p className="font-bold text-[#0b0c0c]">
            {t(
              "A redesign concept for EPFO, Ministry of Labour & Employment, Government of India.",
              "ईपीएफओ के लिए एक पुनःडिज़ाइन अवधारणा, श्रम एवं रोजगार मंत्रालय, भारत सरकार।",
            )}
          </p>
          <p className="mt-2">
            {t(
              "Toll free helpline 14470 · Missed call 011-22901406 to get your balance · SMS “EPFOHO UAN ENG” to 7738299899",
              "टोल फ्री हेल्पलाइन 14470 · बैलेंस के लिए 011-22901406 पर मिस्ड कॉल · 7738299899 पर “EPFOHO UAN HIN” एसएमएस करें",
            )}
          </p>
          <p className="mt-2">
            {t(
              "This is a demonstration prototype. All data, accounts and money shown here are fake.",
              "यह एक डेमो प्रोटोटाइप है। यहाँ दिखाया गया सारा डेटा और खाते काल्पनिक हैं।",
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

function Feedback() {
  const { t, path, showToast } = useApp();
  const [done, setDone] = useState(false);
  if (path === "/") return null;
  return (
    <div className="no-print mt-12 border-t-2 border-[#b1b4b6] pt-5">
      {done ? (
        <p className="text-lg font-bold text-[#00703c]">
          ✓ {t("Thank you. This helps us fix the confusing parts.", "धन्यवाद। इससे हमें उलझन वाली जगहें ठीक करने में मदद मिलती है।")}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold">{t("Was this page easy to use?", "क्या यह पेज इस्तेमाल करना आसान था?")}</span>
          {[
            { l: t("Yes", "हाँ"), m: t("Thanks for telling us.", "बताने के लिए धन्यवाद।") },
            { l: t("No", "नहीं"), m: t("Sorry about that, we will simplify it.", "क्षमा करें, हम इसे और आसान बनाएँगे।") },
          ].map((b) => (
            <button
              key={b.l}
              onClick={() => {
                setDone(true);
                showToast(b.m);
              }}
              className="rounded-full border-2 border-[#12436d] px-4 py-2 text-lg font-bold text-[#12436d] hover:bg-[#eef2f6]"
            >
              {b.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackSlot() {
  const { path } = useApp();
  return <Feedback key={path} />;
}

export function Shell({ children }: { children: ReactNode }) {
  const { toast } = useApp();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" tabIndex={-1} className="fade-in mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
        <FeedbackSlot />
      </main>
      <Footer />
      {toast && (
        <div className="no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-[#0b0c0c] px-5 py-3 text-lg font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
