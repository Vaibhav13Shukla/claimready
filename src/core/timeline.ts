import type { RootCauseCode } from "./taxonomy/taxonomy.schema";

export interface TimelineEstimate {
  root_cause_code: RootCauseCode;
  min_days: number;
  max_days: number;
  display_en: string;
  display_hi: string;
  next_cycle_window_en: string;
  next_cycle_window_hi: string;
}

const TIMELINE_MAP: Record<RootCauseCode, TimelineEstimate> = {
  RC01: {
    root_cause_code: "RC01",
    min_days: 7,
    max_days: 20,
    display_en: "7–20 Working Days",
    display_hi: "7–20 कार्य दिवस",
    next_cycle_window_en: "Name correction needs employer + EPFO approval before you re-file the claim",
    next_cycle_window_hi: "नाम सुधार के लिए पुनः दावा करने से पहले नियोक्ता + ईपीएफओ की स्वीकृति आवश्यक है",
  },
  RC02: {
    root_cause_code: "RC02",
    min_days: 7,
    max_days: 20,
    display_en: "7–20 Working Days",
    display_hi: "7–20 कार्य दिवस",
    next_cycle_window_en: "DOB correction reflects after employer + EPFO approval; then re-file",
    next_cycle_window_hi: "नियोक्ता + ईपीएफओ की स्वीकृति के बाद जन्म तिथि सुधार दिखेगा; फिर पुनः दावा करें",
  },
  RC03: {
    root_cause_code: "RC03",
    min_days: 3,
    max_days: 10,
    display_en: "3–10 Working Days",
    display_hi: "3–10 कार्य दिवस",
    next_cycle_window_en: "Bank re-KYC / activation reflects on the UAN portal, then re-file",
    next_cycle_window_hi: "बैंक पुनः-केवाईसी / सक्रियण यूएएन पोर्टल पर दिखेगा, फिर पुनः दावा करें",
  },
  RC04: {
    root_cause_code: "RC04",
    min_days: 7,
    max_days: 30,
    display_en: "7–30 Working Days",
    display_hi: "7–30 कार्य दिवस",
    next_cycle_window_en: "Employer must update Date of Exit; escalate via EPFiGMS if unresponsive",
    next_cycle_window_hi: "नियोक्ता को निकास तिथि अपडेट करनी होगी; प्रतिक्रिया न मिलने पर EPFiGMS से escalate करें",
  },
  RC05: {
    root_cause_code: "RC05",
    min_days: 10,
    max_days: 30,
    display_en: "10–30 Working Days",
    display_hi: "10–30 कार्य दिवस",
    next_cycle_window_en: "UAN merger needs EPFO's manual verification of both service histories before you re-file",
    next_cycle_window_hi: "यूएएन मर्जर के लिए ईपीएफओ को दोनों सेवा इतिहास का मैन्युअल सत्यापन करना होता है, फिर पुनः दावा करें",
  },
  UNKNOWN: {
    root_cause_code: "UNKNOWN",
    min_days: 7,
    max_days: 15,
    display_en: "7–15 Working Days",
    display_hi: "7–15 कार्य दिवस",
    next_cycle_window_en: "Needs an EPFiGMS grievance with your claim ID for manual review",
    next_cycle_window_hi: "मैन्युअल समीक्षा के लिए आपके claim ID के साथ EPFiGMS शिकायत आवश्यक है",
  },
};

export function calculateTimeline(rootCause: RootCauseCode): TimelineEstimate {
  return TIMELINE_MAP[rootCause] ?? TIMELINE_MAP.UNKNOWN;
}
