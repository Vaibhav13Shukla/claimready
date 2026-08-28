import type { RootCauseCode } from "./taxonomy/taxonomy.schema";

/**
 * Claim X-Ray — deterministic case reconstruction.
 *
 * Given a classified root cause, we reconstruct a *synthetic* view of the
 * member's EPFO case: an employment / service timeline, the exact records we
 * compared (the "evidence"), the single blocker, and an honest confidence
 * tier. Everything here is 100% mock demo data — no real UAN / Aadhaar / PAN /
 * bank information is used or implied.
 */

export type ConfidenceTier = "CONFIRMED" | "LIKELY" | "NEEDS_VERIFICATION";

export const TIER_LABEL: Record<ConfidenceTier, { en: string; hi: string }> = {
  CONFIRMED: { en: "Confirmed by records", hi: "रिकॉर्ड द्वारा पुष्ट" },
  LIKELY: { en: "Likely cause", hi: "संभावित कारण" },
  NEEDS_VERIFICATION: { en: "Needs verification", hi: "सत्यापन आवश्यक" },
};

export interface XrayRecord {
  label_en: string;
  label_hi: string;
  value: string;
  status: "ok" | "mismatch" | "missing" | "info";
}

export interface XrayEmployment {
  employer: string;
  period_en: string;
  period_hi: string;
  memberId: string;
  status: "ok" | "blocker";
  note_en?: string;
  note_hi?: string;
}

export interface XrayReconstruction {
  tier: ConfidenceTier;
  blocker_en: string;
  blocker_hi: string;
  employments: XrayEmployment[];
  evidence: XrayRecord[];
}

export function confidenceTier(rc: RootCauseCode, confidence: number): ConfidenceTier {
  if (rc === "UNKNOWN") return "NEEDS_VERIFICATION";
  if (confidence >= 0.9) return "CONFIRMED";
  if (confidence >= 0.6) return "LIKELY";
  return "NEEDS_VERIFICATION";
}

// Synthetic employment history shared as a base for identity/bank cases.
const BASE_EMPLOYMENTS: XrayEmployment[] = [
  {
    employer: "Northwind Systems (demo)",
    period_en: "2019 – 2022",
    period_hi: "2019 – 2022",
    memberId: "DL/DEMO/0011223/000/0001984",
    status: "ok",
  },
  {
    employer: "Acme Analytics (demo)",
    period_en: "2022 – present",
    period_hi: "2022 – वर्तमान",
    memberId: "KA/DEMO/0044556/000/0002571",
    status: "ok",
  },
];

function clone(list: XrayEmployment[]): XrayEmployment[] {
  return list.map((e) => ({ ...e }));
}

type Recon = Omit<XrayReconstruction, "tier">;

const RECON: Record<Exclude<RootCauseCode, "UNKNOWN">, Recon> = {
  RC01: {
    blocker_en: "Your name is not identical across UAN, Aadhaar and bank records.",
    blocker_hi: "आपका नाम यूएएन, आधार और बैंक रिकॉर्ड में एक जैसा नहीं है।",
    employments: BASE_EMPLOYMENTS,
    evidence: [
      { label_en: "Name on UAN", label_hi: "यूएएन पर नाम", value: "RAHUL K", status: "mismatch" },
      { label_en: "Name on Aadhaar", label_hi: "आधार पर नाम", value: "RAHUL KUMAR", status: "ok" },
      { label_en: "Name on PAN", label_hi: "पैन पर नाम", value: "RAHUL KUMAR", status: "ok" },
      { label_en: "Name in bank KYC", label_hi: "बैंक केवाईसी में नाम", value: "RAHUL K", status: "mismatch" },
    ],
  },
  RC02: {
    blocker_en: "Your date of birth on EPFO does not match Aadhaar.",
    blocker_hi: "ईपीएफओ पर आपकी जन्म तिथि आधार से मेल नहीं खाती।",
    employments: BASE_EMPLOYMENTS,
    evidence: [
      { label_en: "Date of birth on EPFO", label_hi: "ईपीएफओ पर जन्म तिथि", value: "14-03-1992", status: "mismatch" },
      { label_en: "Date of birth on Aadhaar", label_hi: "आधार पर जन्म तिथि", value: "04-03-1992", status: "ok" },
    ],
  },
  RC03: {
    blocker_en: "Your bank account is not verified against your UAN.",
    blocker_hi: "आपका बैंक खाता आपके यूएएन के साथ सत्यापित नहीं है।",
    employments: BASE_EMPLOYMENTS,
    evidence: [
      { label_en: "Bank KYC status", label_hi: "बैंक केवाईसी स्थिति", value: "Not verified", status: "mismatch" },
      { label_en: "Account status", label_hi: "खाता स्थिति", value: "Inactive / dormant", status: "mismatch" },
      { label_en: "IFSC", label_hi: "IFSC", value: "Branch merged — code changed", status: "info" },
    ],
  },
  RC04: {
    blocker_en: "Your previous employer has not marked your Date of Exit.",
    blocker_hi: "आपके पिछले नियोक्ता ने आपकी निकास तिथि दर्ज नहीं की है।",
    employments: [
      {
        ...BASE_EMPLOYMENTS[0],
        status: "blocker",
        note_en: "Date of Exit: not updated",
        note_hi: "निकास तिथि: अपडेट नहीं",
      },
      { ...BASE_EMPLOYMENTS[1] },
    ],
    evidence: [
      { label_en: "Previous employer", label_hi: "पिछला नियोक्ता", value: "Northwind Systems (demo)", status: "info" },
      { label_en: "Date of Exit (EPF)", label_hi: "निकास तिथि (EPF)", value: "Not updated", status: "missing" },
      { label_en: "Current employment", label_hi: "वर्तमान रोज़गार", value: "Active", status: "ok" },
    ],
  },
  RC05: {
    blocker_en: "You have more than one UAN; the older PF was never merged.",
    blocker_hi: "आपके पास एक से अधिक यूएएन हैं; पुराना पीएफ मर्ज नहीं हुआ।",
    employments: [
      {
        ...BASE_EMPLOYMENTS[0],
        status: "blocker",
        note_en: "Old UAN — balance not transferred",
        note_hi: "पुराना यूएएन — बैलेंस ट्रांसफर नहीं",
      },
      {
        ...BASE_EMPLOYMENTS[1],
        note_en: "Current active UAN",
        note_hi: "वर्तमान सक्रिय यूएएन",
      },
    ],
    evidence: [
      { label_en: "Previous UAN", label_hi: "पिछला यूएएन", value: "1000 0000 0012 (not merged)", status: "mismatch" },
      { label_en: "Current UAN", label_hi: "वर्तमान यूएएन", value: "1000 0000 0099 (active)", status: "ok" },
      { label_en: "Service history", label_hi: "सेवा इतिहास", value: "Split across two accounts", status: "mismatch" },
    ],
  },
};

const UNKNOWN_RECON: Recon = {
  blocker_en: "We could not pin the exact blocker from the text.",
  blocker_hi: "हम पाठ से सटीक कारण की पहचान नहीं कर सके।",
  employments: BASE_EMPLOYMENTS,
  evidence: [
    {
      label_en: "Rejection remark",
      label_hi: "अस्वीकृति टिप्पणी",
      value: "Read the exact remark on the member portal",
      status: "info",
    },
  ],
};

export function buildXray(
  rc: RootCauseCode,
  confidence: number,
): XrayReconstruction {
  const base = rc === "UNKNOWN" ? UNKNOWN_RECON : RECON[rc];
  return {
    tier: confidenceTier(rc, confidence),
    blocker_en: base.blocker_en,
    blocker_hi: base.blocker_hi,
    employments: clone(base.employments),
    evidence: base.evidence.map((r) => ({ ...r })),
  };
}
