"use client";

import React, { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../i18n/context";
import {
  analyzeJobSwitch,
  getScenario,
  JOB_SWITCH_CHECKS,
  JOB_SWITCH_SCENARIOS,
  type JobSwitchInputs,
  type JobSwitchRisk,
} from "../../core/jobswitch";

const DEFAULT_SCENARIO = "classic-trap";

function sameInputs(a: JobSwitchInputs, b: JobSwitchInputs): boolean {
  return (Object.keys(a) as (keyof JobSwitchInputs)[]).every((k) => a[k] === b[k]);
}

/** Continuity-health ring. Colour tracks severity: red if a critical is armed. */
function ScoreRing({
  score,
  tone,
  label,
}: {
  score: number;
  tone: "red" | "amber" | "green";
  label: string;
}) {
  const color = tone === "red" ? "#d21f3c" : tone === "amber" ? "#b45309" : "#067a54";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div className="relative w-[132px] h-[132px]" role="img" aria-label={label}>
      <svg viewBox="0 0 132 132" className="w-full h-full -rotate-90">
        <circle cx="66" cy="66" r={r} fill="none" stroke="#e1dfd8" strokeWidth="10" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.3s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[34px] font-bold leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e] mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}

function RiskCard({ risk, hi, index }: { risk: JobSwitchRisk; hi: boolean; index: number }) {
  const isCritical = risk.severity === "critical";
  const href = `/diagnosis?scheme=${risk.scheme}&raw_error_text=${encodeURIComponent(
    risk.raw_error_text,
  )}&golden_id=${risk.golden_id}`;
  return (
    <div
      className="fade-up cr-card bg-white p-5 sm:p-6"
      style={{ ["--d" as string]: `${0.05 + index * 0.07}s` }}
    >
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <span
          className={`text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[9999px] border ${
            isCritical
              ? "bg-[#d21f3c]/10 text-[#d21f3c] border-[#d21f3c]/25"
              : "bg-[#b45309]/10 text-[#b45309] border-[#b45309]/25"
          }`}
        >
          {isCritical ? (hi ? "गंभीर" : "Critical") : hi ? "ध्यान दें" : "Watch"}
        </span>
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-[9999px] bg-[#5196fe]/10 text-[#3f75c6]">
          {risk.rc}
        </span>
        <h3 className="text-[16px] font-semibold text-[#1b1d20] w-full sm:w-auto">
          {hi ? risk.title_hi : risk.title_en}
        </h3>
      </div>

      <p className="text-[14px] text-[#4b4b4b] leading-relaxed">{hi ? risk.bomb_hi : risk.bomb_en}</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="bg-[#f2f1ec] rounded-[12px] border border-[#e1dfd8] px-3.5 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
            {hi ? "कौन ठीक करेगा" : "Who must act"}
          </div>
          <div className="text-[13px] font-semibold text-[#1b1d20] mt-0.5">
            {hi ? risk.owner_label_hi : risk.owner_label_en}
          </div>
        </div>
        <div className="bg-[#f2f1ec] rounded-[12px] border border-[#e1dfd8] px-3.5 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
            {hi ? "अनुमानित समय" : "Time to fix"}
          </div>
          <div className="text-[13px] font-semibold text-[#b45309] mt-0.5">
            {hi ? risk.timeline_hi : risk.timeline_en}
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#e1dfd8]">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5196fe] hover:text-[#3f75c6] transition-colors"
        >
          <span>{hi ? "पूरा क्लेम एक्स-रे देखें" : "See the full Claim X-Ray"}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function JobSwitchContent() {
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const hi = lang === "hi";

  const [inputs, setInputs] = useState<JobSwitchInputs>(() => {
    const s = getScenario(searchParams.get("scenario")) ?? getScenario(DEFAULT_SCENARIO)!;
    return { ...s.inputs };
  });

  const report = useMemo(() => analyzeJobSwitch(inputs), [inputs]);
  const tone = report.criticalCount > 0 ? "red" : report.armed.length > 0 ? "amber" : "green";

  const statusText = hi
    ? report.status === "clear"
      ? "फाइल करने के लिए तैयार"
      : `${report.armed.length} समस्याएँ अभी ठीक करें`
    : report.status === "clear"
      ? "Clear to file"
      : `${report.armed.length} thing${report.armed.length > 1 ? "s" : ""} to fix now`;

  const toggle = (key: keyof JobSwitchInputs) =>
    setInputs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-[960px] mx-auto px-6 sm:px-8 py-10">
      {/* Badge */}
      <div className="cr-badge fade-up" style={{ ["--d" as string]: "0s" }}>
        <span className="w-2 h-2 rounded-full bg-[#5196fe] shrink-0" />
        <span>{hi ? "रोकथाम · जीवन-घटना" : "Prevention · Life event"}</span>
      </div>

      <h1
        className="fade-up mt-4 text-2xl sm:text-[34px] font-semibold tracking-[-0.03em] text-[#1b1d20] leading-[1.1]"
        style={{ ["--d" as string]: "0.05s" }}
      >
        {hi ? "जॉब-स्विच एक्स-रे" : "Job-Switch X-Ray"}
      </h1>
      <p
        className="fade-up mt-2 text-[15px] sm:text-[17px] text-[#6e6e6e] max-w-[660px] leading-[1.5]"
        style={{ ["--d" as string]: "0.1s" }}
      >
        {hi
          ? "आपने नौकरी बदली। यहाँ देखें आपके पीएफ में चुपचाप चल रहा वह टाइम-बम — इससे पहले कि यह किसी अस्वीकृत दावे में बदले।"
          : "You changed jobs. See the silent time-bomb ticking in your PF — long before it becomes a rejected claim."}
      </p>

      {/* Scenario presets */}
      <div className="fade-up mt-6" style={{ ["--d" as string]: "0.15s" }}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
          {hi ? "एक डेमो स्थिति चुनें" : "Try a demo situation"}
        </span>
        <div className="mt-2 flex flex-wrap gap-2.5">
          {JOB_SWITCH_SCENARIOS.map((s) => {
            const active = sameInputs(inputs, s.inputs);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setInputs({ ...s.inputs })}
                aria-pressed={active}
                className={`text-left px-3.5 py-2.5 rounded-[14px] border transition-all cursor-pointer max-w-[280px] ${
                  active
                    ? "bg-[#5196fe] text-white border-[#5196fe] shadow-sm"
                    : "bg-white text-[#1b1d20] border-[#e1dfd8] hover:border-[#5196fe]"
                }`}
              >
                <div className="text-[13px] font-semibold leading-tight">{s.name}</div>
                <div className={`text-[11px] mt-0.5 ${active ? "text-white/85" : "text-[#6e6e6e]"}`}>
                  {hi ? s.role_hi : s.role_en}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score + situation toggles */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        {/* Score card */}
        <div
          className="fade-up cr-card bg-white p-6 flex flex-col items-center text-center"
          style={{ ["--d" as string]: "0.2s" }}
          aria-live="polite"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e]">
            {hi ? "पीएफ निरंतरता स्कोर" : "PF continuity score"}
          </span>
          <div className="mt-3">
            <ScoreRing
              score={report.score}
              tone={tone}
              label={`${hi ? "पीएफ निरंतरता स्कोर" : "PF continuity score"}: ${report.score} / 100`}
            />
          </div>
          <span
            className={`mt-3 text-[13px] font-bold px-3 py-1 rounded-[9999px] border ${
              tone === "red"
                ? "bg-[#d21f3c]/10 text-[#d21f3c] border-[#d21f3c]/25"
                : tone === "amber"
                  ? "bg-[#b45309]/10 text-[#b45309] border-[#b45309]/25"
                  : "bg-[#067a54]/10 text-[#067a54] border-[#067a54]/25"
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* Situation toggles */}
        <fieldset
          className="fade-up cr-card bg-white p-5 sm:p-6 border-0 m-0"
          style={{ ["--d" as string]: "0.25s" }}
        >
          <legend className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e] mb-1">
            {hi ? "आपकी स्थिति" : "Your situation"}
          </legend>
          <p className="text-[12px] text-[#797876] mb-3">
            {hi
              ? "कोई भी उत्तर बदलकर देखें स्कोर और जोखिम तुरंत कैसे बदलते हैं।"
              : "Flip any answer to watch the score and risks update instantly."}
          </p>
          <div className="divide-y divide-[#e1dfd8]">
            {JOB_SWITCH_CHECKS.map((check) => {
              const on = inputs[check.key];
              return (
                <label
                  key={check.key}
                  className="flex items-center justify-between gap-3 py-3 cursor-pointer group"
                >
                  <span className="text-[13.5px] text-[#1b1d20] leading-snug">
                    {hi ? check.question_hi : check.question_en}
                  </span>
                  <span className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(check.key)}
                      className="sr-only peer"
                    />
                    <span
                      aria-hidden="true"
                      className="block w-[42px] h-[24px] rounded-[9999px] bg-[#d0cec6] peer-checked:bg-[#067a54] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#5196fe]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[18px]"
                    />
                    <span className="sr-only">
                      {on ? (hi ? "हाँ, ठीक है" : "Yes, in order") : hi ? "नहीं" : "No"}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Armed risks */}
      <section className="mt-8" aria-label={hi ? "जोखिम" : "Risks"}>
        {report.armed.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold text-[#1b1d20] flex items-center gap-2">
              <span aria-hidden="true">⏳</span>
              <span>
                {hi ? "चुपचाप चलते टाइम-बम" : "Silent time-bombs"} ({report.armed.length})
              </span>
            </h2>
            <p className="text-[13px] text-[#6e6e6e] mt-1 mb-4">
              {hi
                ? "हर एक अभी अदृश्य है, पर दावा करते ही अस्वीकृति बनेगा। अभी ठीक करें।"
                : "Each is invisible today but becomes a rejection the moment you file. Fix them now, not then."}
            </p>
            <div className="grid grid-cols-1 gap-3.5">
              {report.armed.map((risk, i) => (
                <RiskCard key={risk.rc} risk={risk} hi={hi} index={i} />
              ))}
            </div>
          </>
        ) : (
          <div className="cr-card bg-[#067a54]/[0.05] border-[#067a54]/30 p-6 text-center">
            <div className="text-3xl" aria-hidden="true">
              ✓
            </div>
            <h2 className="mt-2 text-lg font-semibold text-[#067a54]">
              {hi ? "आपका पीएफ निरंतर है" : "Your PF is continuous"}
            </h2>
            <p className="mt-1 text-[14px] text-[#4b4b4b] max-w-[520px] mx-auto">
              {hi
                ? "आपके स्विच से कोई अस्वीकृति नहीं बनेगी। जब भी दावा करें, तैयार हैं।"
                : "Nothing from your switch will turn into a rejection. Whenever you claim, you're ready."}
            </p>
          </div>
        )}
      </section>

      {/* Cleared items */}
      {report.clear.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6e6e] mb-2.5">
            {hi ? "पहले से ठीक" : "Already in order"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.clear.map((c) => (
              <span
                key={c.rc}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[9999px] bg-[#067a54]/10 text-[#067a54] border border-[#067a54]/20"
              >
                <span aria-hidden="true">✓</span>
                {hi ? c.title_hi : c.title_en}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Cross-links */}
      <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-[#e1dfd8]">
        <Link href="/intake?tab=paste" className="cr-btn cr-btn--ghost">
          {hi ? "पहले ही अस्वीकृत हुआ? डिकोड करें" : "Already rejected? Decode it"}
        </Link>
        <Link href="/demo" className="cr-btn cr-btn--ghost">
          {hi ? "डेमो व जज लॉगिन" : "Judge & Demo logins"}
        </Link>
      </div>

      <p className="mt-6 text-[11px] text-[#797876]">
        {hi
          ? "प्रोटोटाइप · 100% सिंथेटिक डेमो डेटा · कोई वास्तविक UAN/आधार/बैंक जानकारी नहीं। अंतिम कार्रवाई आधिकारिक ईपीएफओ पोर्टल पर सत्यापित करें।"
          : "Prototype · 100% synthetic demo data · no real UAN/Aadhaar/bank information. Verify final actions on the official EPFO portal."}
      </p>
    </div>
  );
}

export default function JobSwitchPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-neutral-500">Loading…</div>}>
      <JobSwitchContent />
    </Suspense>
  );
}
