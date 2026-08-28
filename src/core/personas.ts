import { buildXray, type XrayEmployment } from "./xray";
import type { Scheme, RootCauseCode } from "./taxonomy/taxonomy.schema";

/**
 * Demo personas — deterministic, 100% synthetic citizens a judge can "log in"
 * as. Each persona has a mock PF money summary, a reconstructed work history,
 * and (usually) one blocked claim that deep-links into the real Claim X-Ray.
 * No real UAN / Aadhaar / PAN / bank data is used.
 */

export interface PersonaClaim {
  scheme: Scheme;
  rc: RootCauseCode;
  raw_error_text: string;
  golden_id: string;
  amount: number;
  type_en: string;
  type_hi: string;
  age_en: string;
  age_hi: string;
}

export interface Persona {
  id: string;
  name: string;
  role_en: string;
  role_hi: string;
  tagline_en: string;
  tagline_hi: string;
  uan: string;
  money: { employee: number; employer: number; pension: number; interest: number };
  employments: XrayEmployment[];
  claim: PersonaClaim | null;
}

const HEALTHY_EMPLOYMENTS: XrayEmployment[] = [
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

function claimPersona(
  base: Omit<Persona, "employments" | "claim"> & { claim: PersonaClaim },
): Persona {
  return {
    ...base,
    claim: base.claim,
    employments: buildXray(base.claim.rc, 0.98).employments,
  };
}

export const PERSONAS: Persona[] = [
  claimPersona({
    id: "priya",
    name: "Priya Sharma",
    role_en: "Software engineer, 29",
    role_hi: "सॉफ़्टवेयर इंजीनियर, 29",
    tagline_en: "Withdrawal blocked by a name mismatch",
    tagline_hi: "नाम बेमेल से निकासी रुकी",
    uan: "1000 0000 0012",
    money: { employee: 152000, employer: 128000, pension: 68000, interest: 44200 },
    claim: {
      scheme: "FINAL_SETTLEMENT",
      rc: "RC01",
      raw_error_text: "Claim rejected: Name mismatch as per Aadhaar",
      golden_id: "GC-01",
      amount: 232000,
      type_en: "Final settlement",
      type_hi: "अंतिम भुगतान",
      age_en: "18 days ago",
      age_hi: "18 दिन पहले",
    },
  }),
  claimPersona({
    id: "rahul",
    name: "Rahul Verma",
    role_en: "Changed jobs, 34",
    role_hi: "नौकरी बदली, 34",
    tagline_en: "Transfer stuck — old employer never filed exit date",
    tagline_hi: "ट्रांसफर रुका — पुराने नियोक्ता ने निकास तिथि नहीं भरी",
    uan: "1000 0000 0034",
    money: { employee: 118000, employer: 99000, pension: 47000, interest: 20600 },
    claim: {
      scheme: "FINAL_SETTLEMENT",
      rc: "RC04",
      raw_error_text: "Rejected: Date of Exit not updated by employer",
      golden_id: "GC-05",
      amount: 284600,
      type_en: "Final settlement",
      type_hi: "अंतिम भुगतान",
      age_en: "24 days ago",
      age_hi: "24 दिन पहले",
    },
  }),
  claimPersona({
    id: "meena",
    name: "Meena Nair",
    role_en: "Nurse, 41",
    role_hi: "नर्स, 41",
    tagline_en: "Medical advance bounced on bank KYC",
    tagline_hi: "बैंक केवाईसी से मेडिकल एडवांस वापस",
    uan: "1000 0000 0041",
    money: { employee: 61000, employer: 54000, pension: 22000, interest: 17400 },
    claim: {
      scheme: "PF_ADVANCE",
      rc: "RC03",
      raw_error_text: "Rejected: Bank KYC not verified / account inactive",
      golden_id: "GC-04",
      amount: 45000,
      type_en: "PF advance (medical)",
      type_hi: "पीएफ एडवांस (मेडिकल)",
      age_en: "12 days ago",
      age_hi: "12 दिन पहले",
    },
  }),
  claimPersona({
    id: "sana",
    name: "Sana Khan",
    role_en: "Designer, 31",
    role_hi: "डिज़ाइनर, 31",
    tagline_en: "Two UANs — old PF was never merged",
    tagline_hi: "दो यूएएन — पुराना पीएफ मर्ज नहीं हुआ",
    uan: "1000 0000 0099",
    money: { employee: 132000, employer: 115000, pension: 58000, interest: 38900 },
    claim: {
      scheme: "FINAL_SETTLEMENT",
      rc: "RC05",
      raw_error_text: "Claim rejected: Multiple UAN found, previous PF account not transferred",
      golden_id: "GC-07",
      amount: 318000,
      type_en: "Final settlement",
      type_hi: "अंतिम भुगतान",
      age_en: "9 days ago",
      age_hi: "9 दिन पहले",
    },
  }),
  {
    id: "vikram",
    name: "Vikram Rao",
    role_en: "Analyst, 27 — all in order",
    role_hi: "विश्लेषक, 27 — सब ठीक",
    tagline_en: "Healthy account, nothing pending",
    tagline_hi: "स्वस्थ खाता, कुछ लंबित नहीं",
    uan: "1000 0000 0007",
    money: { employee: 176000, employer: 149000, pension: 71000, interest: 52300 },
    employments: HEALTHY_EMPLOYMENTS,
    claim: null,
  },
];

export function getPersona(id: string | null | undefined): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

export function personaTotal(p: Persona): number {
  const m = p.money;
  return m.employee + m.employer + m.pension + m.interest;
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
