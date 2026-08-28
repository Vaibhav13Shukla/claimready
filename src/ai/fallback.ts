import type { Scheme } from "../core/taxonomy/taxonomy.schema";

export interface ErrorOption {
  id: string;
  scheme: Scheme;
  phrase_en: string;
  phrase_hi: string;
  badge: string;
}

// Common EPFO rejection remarks, used for the intake quick-select and the
// low-confidence picker. Each maps to a claim type + reads like a real remark.
export const COMMON_ERROR_OPTIONS: ErrorOption[] = [
  {
    id: "OPT-01",
    scheme: "FINAL_SETTLEMENT",
    phrase_en: "Claim rejected: Name mismatch as per Aadhaar",
    phrase_hi: "दावा अस्वीकृत: आधार अनुसार नाम बेमेल",
    badge: "Final Settlement",
  },
  {
    id: "OPT-02",
    scheme: "PF_ADVANCE",
    phrase_en: "Rejected: Name mismatch between UAN and bank KYC",
    phrase_hi: "अस्वीकृत: यूएएन और बैंक केवाईसी में नाम बेमेल",
    badge: "PF Advance",
  },
  {
    id: "OPT-03",
    scheme: "FINAL_SETTLEMENT",
    phrase_en: "Claim rejected: Date of Birth not matching Aadhaar",
    phrase_hi: "दावा अस्वीकृत: जन्म तिथि आधार से मेल नहीं खाती",
    badge: "Final Settlement",
  },
  {
    id: "OPT-04",
    scheme: "PF_ADVANCE",
    phrase_en: "Rejected: Bank KYC not verified / account inactive",
    phrase_hi: "अस्वीकृत: बैंक केवाईसी सत्यापित नहीं / खाता निष्क्रिय",
    badge: "PF Advance",
  },
  {
    id: "OPT-05",
    scheme: "FINAL_SETTLEMENT",
    phrase_en: "Rejected: Date of Exit not updated by employer",
    phrase_hi: "अस्वीकृत: नियोक्ता द्वारा निकास तिथि अपडेट नहीं",
    badge: "Final Settlement",
  },
  {
    id: "OPT-06",
    scheme: "PENSION_EPS",
    phrase_en: "Claim rejected: IFSC mismatch, payment returned by bank",
    phrase_hi: "दावा अस्वीकृत: IFSC बेमेल, बैंक द्वारा भुगतान वापस",
    badge: "Pension / EPS",
  },
];

export function getErrorOptionsForScheme(scheme?: Scheme | null): ErrorOption[] {
  if (!scheme) return COMMON_ERROR_OPTIONS;
  return COMMON_ERROR_OPTIONS.filter((opt) => opt.scheme === scheme);
}
