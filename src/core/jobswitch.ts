import { routeRemedy } from "./remedy-router";
import { calculateTimeline } from "./timeline";
import type { KnownRootCauseCode, Owner, Scheme } from "./taxonomy/taxonomy.schema";

/**
 * Job-Switch X-Ray — the prevention / life-event simulator.
 *
 * A PF claim rejection is a *lagging* symptom. The real damage is done months
 * earlier, the day you change jobs: an old employer forgets your Date of Exit,
 * a new employer quietly opens a second UAN, your bank KYC drifts. Nothing
 * looks wrong at the time — the "time-bomb" only detonates when you finally
 * file a withdrawal or transfer and it bounces.
 *
 * This engine takes a handful of *facts* about a job switch and deterministically
 * arms the specific rejection each unresolved fact will cause later. It is a
 * rules engine (no AI, no guessing): every risk maps to a known root cause and
 * reuses the SAME owner/timeline routers the diagnosis flow uses, so a
 * simulated risk and a real rejection resolve to exactly one truth.
 *
 * 100% synthetic demo data — no real UAN / Aadhaar / PAN / bank data.
 */

const OWNER_LABEL: Record<Owner, { en: string; hi: string }> = {
  MEMBER_SELF: { en: "You (self-service on the UAN portal)", hi: "आप स्वयं (यूएएन पोर्टल पर)" },
  BANK: { en: "Your bank branch", hi: "आपकी बैंक शाखा" },
  EMPLOYER: { en: "Your previous employer", hi: "आपका पिछला नियोक्ता" },
  EPFO_OFFICE: { en: "EPFO field office (via EPFiGMS)", hi: "ईपीएफओ फील्ड ऑफिस (EPFiGMS)" },
};

export type Severity = "critical" | "warning";

/** The five facts a member can (not) have in order after switching jobs. */
export interface JobSwitchInputs {
  filedExit: boolean; // old employer marked Date of Exit
  transferredOldPf: boolean; // old PF moved into the current UAN
  bankKycVerified: boolean; // bank/KYC verified on the current UAN
  nameConsistent: boolean; // name identical across UAN / Aadhaar / bank
  dobConsistent: boolean; // date of birth matches Aadhaar
}

interface RiskConfig {
  rc: KnownRootCauseCode;
  severity: Severity;
  weight: number; // continuity-score penalty when this fact is unresolved
  title_en: string;
  title_hi: string;
  bomb_en: string; // the silent time-bomb: what fails, and when
  bomb_hi: string;
  scheme: Scheme; // scheme the eventual rejection would hit
  raw_error_text: string; // the rejection remark it would later produce
  golden_id: string; // deep-links into the existing Claim X-Ray
}

/**
 * Each check is one toggle in the UI. `key` reads the fact; ON always means
 * "in order" so the questions stay non-alarming. Ordered most-severe first so
 * the classic job-switch traps (exit date, un-merged UAN) lead.
 */
export const JOB_SWITCH_CHECKS = [
  {
    key: "filedExit",
    rc: "RC04",
    question_en: "Did your previous employer file your Date of Exit?",
    question_hi: "क्या आपके पिछले नियोक्ता ने आपकी निकास तिथि (Date of Exit) दर्ज की?",
  },
  {
    key: "transferredOldPf",
    rc: "RC05",
    question_en: "Did you transfer your old PF into your current UAN?",
    question_hi: "क्या आपने पुराना पीएफ अपने वर्तमान यूएएन में ट्रांसफर किया?",
  },
  {
    key: "bankKycVerified",
    rc: "RC03",
    question_en: "Is your bank KYC verified on the current UAN?",
    question_hi: "क्या आपके वर्तमान यूएएन पर बैंक केवाईसी सत्यापित है?",
  },
  {
    key: "nameConsistent",
    rc: "RC01",
    question_en: "Is your name identical across UAN, Aadhaar and bank?",
    question_hi: "क्या आपका नाम यूएएन, आधार और बैंक में एक जैसा है?",
  },
  {
    key: "dobConsistent",
    rc: "RC02",
    question_en: "Does your date of birth match Aadhaar?",
    question_hi: "क्या आपकी जन्म तिथि आधार से मेल खाती है?",
  },
] as const satisfies ReadonlyArray<{
  key: keyof JobSwitchInputs;
  rc: KnownRootCauseCode;
  question_en: string;
  question_hi: string;
}>;

const RISK_CONFIG: Record<KnownRootCauseCode, RiskConfig> = {
  RC04: {
    rc: "RC04",
    severity: "critical",
    weight: 33,
    title_en: "Date of Exit never filed",
    title_hi: "निकास तिथि दर्ज ही नहीं हुई",
    bomb_en:
      "Your old employer never marked your Date of Exit, so EPFO still shows that job as active. Nothing looks wrong today — but the moment you file a final settlement or transfer, it is rejected because you appear to be 'still employed' there.",
    bomb_hi:
      "आपके पुराने नियोक्ता ने निकास तिथि दर्ज नहीं की, इसलिए ईपीएफओ में वह नौकरी अब भी सक्रिय दिखती है। आज कुछ गलत नहीं लगता — पर जैसे ही आप अंतिम भुगतान या ट्रांसफर फाइल करेंगे, यह अस्वीकृत हो जाएगा।",
    scheme: "FINAL_SETTLEMENT",
    raw_error_text: "Rejected: Date of Exit not updated by employer",
    golden_id: "GC-05",
  },
  RC05: {
    rc: "RC05",
    severity: "critical",
    weight: 33,
    title_en: "Old PF split across a second UAN",
    title_hi: "पुराना पीएफ दूसरे यूएएन में बँटा",
    bomb_en:
      "Your new job opened a second UAN and your old PF was never moved into it. Your money is silently split across two accounts. A withdrawal will bounce with 'Multiple UAN found, previous PF not transferred'.",
    bomb_hi:
      "आपकी नई नौकरी ने दूसरा यूएएन खोला और पुराना पीएफ उसमें ट्रांसफर नहीं हुआ। आपका पैसा चुपचाप दो खातों में बँटा है। निकासी 'Multiple UAN' त्रुटि से रुक जाएगी।",
    scheme: "FINAL_SETTLEMENT",
    raw_error_text: "Claim rejected: Multiple UAN found, previous PF account not transferred",
    golden_id: "GC-07",
  },
  RC03: {
    rc: "RC03",
    severity: "warning",
    weight: 14,
    title_en: "Bank KYC not verified on new UAN",
    title_hi: "नए यूएएन पर बैंक केवाईसी असत्यापित",
    bomb_en:
      "Your bank/KYC on the current UAN isn't verified. Everything seems fine until you actually claim — then any advance or settlement fails at the payment step until the bank re-verifies your account.",
    bomb_hi:
      "आपके वर्तमान यूएएन पर बैंक/केवाईसी सत्यापित नहीं है। दावा करते ही भुगतान चरण पर एडवांस या सेटलमेंट रुक जाएगा, जब तक बैंक पुनः सत्यापित न करे।",
    scheme: "PF_ADVANCE",
    raw_error_text: "Rejected: Bank KYC not verified / account inactive",
    golden_id: "GC-04",
  },
  RC01: {
    rc: "RC01",
    severity: "warning",
    weight: 12,
    title_en: "Name spelled differently across records",
    title_hi: "रिकॉर्ड में नाम की वर्तनी अलग",
    bomb_en:
      "Your name is spelled differently across UAN, Aadhaar and bank. The mismatch sits quietly until a claim is checked against Aadhaar — then it is rejected for a name mismatch.",
    bomb_hi:
      "आपका नाम यूएएन, आधार और बैंक में अलग-अलग लिखा है। यह अंतर तब तक चुप रहता है जब तक दावा आधार से जाँचा न जाए — फिर नाम बेमेल से अस्वीकृत।",
    scheme: "FINAL_SETTLEMENT",
    raw_error_text: "Claim rejected: Name mismatch as per Aadhaar",
    golden_id: "GC-01",
  },
  RC02: {
    rc: "RC02",
    severity: "warning",
    weight: 8,
    title_en: "Date of birth doesn't match Aadhaar",
    title_hi: "जन्म तिथि आधार से मेल नहीं खाती",
    bomb_en:
      "Your date of birth differs between EPFO and Aadhaar. A claim stalls on the DOB check and comes back for correction.",
    bomb_hi:
      "ईपीएफओ और आधार में आपकी जन्म तिथि अलग है। दावा जन्म-तिथि जाँच पर रुककर सुधार के लिए वापस आ जाता है।",
    scheme: "FINAL_SETTLEMENT",
    raw_error_text: "Claim rejected: Date of Birth not matching Aadhaar",
    golden_id: "GC-03",
  },
};

export interface JobSwitchRisk extends RiskConfig {
  owner: Owner;
  owner_label_en: string;
  owner_label_hi: string;
  timeline_en: string;
  timeline_hi: string;
}

export interface JobSwitchReport {
  score: number; // continuity health, 0–100
  status: "at_risk" | "clear";
  criticalCount: number;
  armed: JobSwitchRisk[]; // time-bombs, most severe first
  clear: { rc: KnownRootCauseCode; title_en: string; title_hi: string }[];
}

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1 };

/** A fact is "armed" (a future rejection) when the member does NOT have it in order. */
function isArmed(inputs: JobSwitchInputs, key: keyof JobSwitchInputs): boolean {
  return inputs[key] === false;
}

export function analyzeJobSwitch(inputs: JobSwitchInputs): JobSwitchReport {
  const armed: JobSwitchRisk[] = [];
  const clear: JobSwitchReport["clear"] = [];

  for (const check of JOB_SWITCH_CHECKS) {
    const cfg = RISK_CONFIG[check.rc];
    if (isArmed(inputs, check.key)) {
      const route = routeRemedy(cfg.rc);
      const timeline = calculateTimeline(cfg.rc);
      armed.push({
        ...cfg,
        owner: route.owner,
        owner_label_en: OWNER_LABEL[route.owner].en,
        owner_label_hi: OWNER_LABEL[route.owner].hi,
        timeline_en: timeline.display_en,
        timeline_hi: timeline.display_hi,
      });
    } else {
      clear.push({ rc: cfg.rc, title_en: cfg.title_en, title_hi: cfg.title_hi });
    }
  }

  armed.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.weight - a.weight);

  const penalty = armed.reduce((sum, r) => sum + r.weight, 0);
  const score = Math.max(0, 100 - penalty);
  const criticalCount = armed.filter((r) => r.severity === "critical").length;

  return {
    score,
    status: armed.length === 0 ? "clear" : "at_risk",
    criticalCount,
    armed,
    clear,
  };
}

export interface JobSwitchScenario {
  id: string;
  name: string;
  role_en: string;
  role_hi: string;
  summary_en: string;
  summary_hi: string;
  inputs: JobSwitchInputs;
}

const ALL_CLEAR: JobSwitchInputs = {
  filedExit: true,
  transferredOldPf: true,
  bankKycVerified: true,
  nameConsistent: true,
  dobConsistent: true,
};

/**
 * Demo scenarios, designed backwards from what a judge should see: the default
 * is the classic two-bomb trap almost every job-switcher hits.
 */
export const JOB_SWITCH_SCENARIOS: JobSwitchScenario[] = [
  {
    id: "classic-trap",
    name: "Rahul Verma",
    role_en: "Just switched jobs · 34",
    role_hi: "अभी नौकरी बदली · 34",
    summary_en: "The classic trap — exit date never filed, old PF never moved.",
    summary_hi: "क्लासिक जाल — निकास तिथि नहीं भरी, पुराना पीएफ नहीं ट्रांसफर हुआ।",
    inputs: { ...ALL_CLEAR, filedExit: false, transferredOldPf: false },
  },
  {
    id: "serial-switcher",
    name: "Sana Khan",
    role_en: "Third job in five years · 31",
    role_hi: "पाँच साल में तीसरी नौकरी · 31",
    summary_en: "Multiple UANs, drifting name, and unverified new bank KYC.",
    summary_hi: "कई यूएएन, बदलता नाम, और असत्यापित नई बैंक केवाईसी।",
    inputs: { ...ALL_CLEAR, transferredOldPf: false, nameConsistent: false, bankKycVerified: false },
  },
  {
    id: "clean-switch",
    name: "Vikram Rao",
    role_en: "Switched cleanly · 27",
    role_hi: "सही तरीके से बदली · 27",
    summary_en: "Did everything right — clear to file whenever the time comes.",
    summary_hi: "सब सही किया — जब भी ज़रूरत हो, दावा करने के लिए तैयार।",
    inputs: { ...ALL_CLEAR },
  },
];

export function getScenario(id: string | null | undefined): JobSwitchScenario | undefined {
  return JOB_SWITCH_SCENARIOS.find((s) => s.id === id);
}
