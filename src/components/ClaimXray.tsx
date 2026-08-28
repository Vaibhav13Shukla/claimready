import React from "react";
import type { RootCauseCode, Scheme } from "../core/taxonomy/taxonomy.schema";
import { buildXray, TIER_LABEL, type ConfidenceTier } from "../core/xray";

const STATUS: Record<string, { cls: string; sym: string }> = {
  ok: { cls: "text-[#067a54] bg-[#067a54]/10 border-[#067a54]/25", sym: "✓" },
  mismatch: { cls: "text-[#d21f3c] bg-[#d21f3c]/10 border-[#d21f3c]/25", sym: "≠" },
  missing: { cls: "text-[#b45309] bg-[#b45309]/10 border-[#b45309]/25", sym: "—" },
  info: { cls: "text-[#6e6e6e] bg-[#f2f1ec] border-[#e1dfd8]", sym: "i" },
};

const TIER_CHIP: Record<ConfidenceTier, string> = {
  CONFIRMED: "text-[#067a54] bg-[#067a54]/10 border-[#067a54]/25",
  LIKELY: "text-[#3f75c6] bg-[#5196fe]/10 border-[#5196fe]/25",
  NEEDS_VERIFICATION: "text-[#b45309] bg-[#b45309]/10 border-[#b45309]/25",
};

export function ClaimXray({
  rc,
  confidence,
  scheme,
  isHindi,
}: {
  rc: RootCauseCode;
  confidence: number;
  scheme?: Scheme;
  isHindi: boolean;
}) {
  const x = buildXray(rc, confidence, scheme);
  const tier = TIER_LABEL[x.tier];

  return (
    <section
      aria-label={isHindi ? "क्लेम एक्स-रे" : "Claim X-Ray"}
      className="rounded-[20px] border border-[#e1dfd8] bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-[#f2f1ec] border-b border-[#e1dfd8]">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">🔎</span>
          <span className="text-[13px] font-semibold text-[#1b1d20]">
            {isHindi ? "क्लेम एक्स-रे — आपका केस पुनर्निर्मित" : "Claim X-Ray — your case, reconstructed"}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-[9999px] border whitespace-nowrap ${TIER_CHIP[x.tier]}`}
        >
          {isHindi ? tier.hi : tier.en}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Blocker line */}
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-0.5 w-2 h-2 rounded-full bg-[#d21f3c] shrink-0"
          />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6e6e6e]">
              {isHindi ? "मुख्य रुकावट" : "The blocker"}
            </span>
            <p className="text-[14px] font-semibold text-[#1b1d20] leading-snug">
              {isHindi ? x.blocker_hi : x.blocker_en}
            </p>
          </div>
        </div>

        {/* Work-history timeline */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6e6e6e]">
            {isHindi ? "आपका सेवा इतिहास" : "Your work history"}
          </span>
          <ol className="mt-2 space-y-2">
            {x.employments.map((e, i) => {
              const blk = e.status === "blocker";
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-[14px] border ${
                    blk ? "border-[#d21f3c]/30 bg-[#d21f3c]/[0.04]" : "border-[#e1dfd8] bg-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${blk ? "bg-[#d21f3c]" : "bg-[#5196fe]"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[#1b1d20] truncate">{e.employer}</p>
                      <span className="text-[11px] text-[#6e6e6e] shrink-0">
                        {isHindi ? e.period_hi : e.period_en}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#797876] mt-0.5 truncate">{e.memberId}</p>
                    {(isHindi ? e.note_hi : e.note_en) && (
                      <p className={`text-[11px] mt-1 font-medium ${blk ? "text-[#d21f3c]" : "text-[#6e6e6e]"}`}>
                        {blk ? "⚠ " : ""}
                        {isHindi ? e.note_hi : e.note_en}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Evidence — what we compared */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6e6e6e]">
            {isHindi ? "हमने क्या मिलाया" : "What we compared"}
          </span>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {x.evidence.map((r, i) => {
              const s = STATUS[r.status] ?? STATUS.info;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-[12px] border border-[#e1dfd8] bg-[#f2f1ec]"
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${s.cls}`}
                    aria-hidden="true"
                  >
                    {s.sym}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#6e6e6e] truncate">
                      {isHindi ? r.label_hi : r.label_en}
                    </p>
                    <p className="text-[12.5px] font-semibold text-[#1b1d20] truncate">{r.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-[#797876] pt-1 border-t border-[#e1dfd8]">
          {isHindi
            ? "सिंथेटिक डेमो रिकॉर्ड से पुनर्निर्मित · कोई वास्तविक PII नहीं।"
            : "Reconstructed from synthetic demo records · no real PII."}
        </p>
      </div>
    </section>
  );
}
