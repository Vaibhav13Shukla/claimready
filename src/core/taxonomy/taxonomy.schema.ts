import { z } from "zod";

// --- Root Cause Code (why an EPFO PF claim was / would be rejected) ---
export const RootCauseCode = z.enum(["RC01", "RC02", "RC03", "RC04", "UNKNOWN"]);
export type RootCauseCode = z.infer<typeof RootCauseCode>;

// --- Owner (who must act to fix the rejection cause) ---
export const Owner = z.enum(["MEMBER_SELF", "BANK", "EMPLOYER", "EPFO_OFFICE"]);
export type Owner = z.infer<typeof Owner>;

// --- Remedy Type ---
export const RemedyType = z.enum([
  "member_correction",
  "bank_fix",
  "employer_request",
  "epfigms_grievance",
]);
export type RemedyType = z.infer<typeof RemedyType>;

// --- Claim Type (kept as "Scheme" key for engine compatibility) ---
export const Scheme = z.enum(["FINAL_SETTLEMENT", "PF_ADVANCE", "PENSION_EPS"]);
export type Scheme = z.infer<typeof Scheme>;

// --- Individual taxonomy entry ---
export const TaxonomyEntry = z.object({
  code: RootCauseCode,
  label_en: z.string().min(1, "label_en must not be empty"),
  label_hi: z.string().min(1, "label_hi must not be empty"),
  owner: Owner,
  remedy_type: RemedyType,
  estimated_timeline_days: z.string().min(1, "estimated_timeline_days must not be empty"),
  explanation_en: z.string().min(1, "explanation_en must not be empty"),
  explanation_hi: z.string().min(1, "explanation_hi must not be empty"),
  error_phrases: z
    .array(z.string().min(1, "error_phrases entries must not be empty"))
    .min(1, "must have at least one error_phrase"),
  scheme_applicable: z
    .array(Scheme)
    .min(1, "must apply to at least one claim type"),
  confidence_boost_phrases: z
    .array(z.string().min(1, "confidence_boost_phrases entries must not be empty"))
    .optional(),
});

// --- Known Taxonomy Root Causes ---
export const KnownRootCauseCode = z.enum(["RC01", "RC02", "RC03", "RC04"]);
export type KnownRootCauseCode = z.infer<typeof KnownRootCauseCode>;

// --- Full taxonomy: keyed by known root cause code (RC01..RC04) ---
export const ErrorTaxonomy = z.record(z.string(), TaxonomyEntry);
export type ErrorTaxonomy = z.infer<typeof ErrorTaxonomy>;

// --- Diagnosis result ---
export const DiagnosisResult = z.object({
  root_cause_code: RootCauseCode,
  owner: Owner,
  remedy_type: RemedyType,
  confidence: z.number().min(0).max(1),
  matched_phrase: z.string().optional(),
  explanation_en: z.string(),
  explanation_hi: z.string(),
  estimated_timeline_days: z.string(),
  label_en: z.string(),
  label_hi: z.string(),
});
export type DiagnosisResult = z.infer<typeof DiagnosisResult>;

// --- Case object (in-session) ---
export const CaseInputType = z.enum(["screenshot", "text"]);
export type CaseInputType = z.infer<typeof CaseInputType>;

export const CaseStatus = z.enum([
  "diagnosed",
  "action_taken",
  "awaiting_cycle",
  "resolved",
]);
export type CaseStatus = z.infer<typeof CaseStatus>;

export const CaseObject = z.object({
  case_id: z.string(),
  scheme: Scheme,
  raw_input_type: CaseInputType,
  extracted: z.object({
    raw_error_text: z.string(),
    confidence: z.number().min(0).max(1),
  }),
  diagnosis: z.object({
    root_cause_code: RootCauseCode,
    owner: Owner,
    confidence: z.number().min(0).max(1),
  }),
  remedy: z.object({
    type: RemedyType,
    language: z.enum(["hi", "en"]),
    steps: z.array(z.string()),
    estimated_timeline_days: z.string(),
  }),
  status: CaseStatus,
});
export type CaseObject = z.infer<typeof CaseObject>;
