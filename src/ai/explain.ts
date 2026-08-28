import type { RootCauseCode, Owner } from "../core/taxonomy/taxonomy.schema";
import { EXPLANATION_SYSTEM_PROMPT } from "./prompts";

export interface ExplanationRequest {
  root_cause_code: RootCauseCode;
  owner: Owner;
  language: "hi" | "en";
  schemeName?: string;
  labelHint?: string;
}

const DETERMINISTIC_EXPLANATIONS: Record<RootCauseCode, { en: string; hi: string }> = {
  RC01: {
    en: "Your name is written slightly differently across your EPFO, Aadhaar, PAN or bank records — even one letter is enough. Because the systems can't confirm the accounts are all yours, the claim is blocked. It's a spelling fix, not a problem with your money.",
    hi: "आपका नाम आपके ईपीएफओ, आधार, पैन या बैंक रिकॉर्ड में थोड़ा अलग लिखा है — एक अक्षर भी काफी है। चूंकि सिस्टम पुष्टि नहीं कर पाता कि सभी खाते आपके हैं, दावा रुक जाता है। यह वर्तनी की गलती है, आपके पैसे की समस्या नहीं।",
  },
  RC02: {
    en: "Your date of birth in EPFO doesn't match the one on your Aadhaar. EPFO checks this against Aadhaar, so any difference holds the claim until the two are made the same. This is a records fix you can start yourself.",
    hi: "आपके ईपीएफओ में जन्म तिथि आपके आधार से मेल नहीं खाती। ईपीएफओ इसे आधार से जांचता है, इसलिए कोई भी अंतर दावे को तब तक रोकता है जब तक दोनों एक जैसे न हों। यह रिकॉर्ड सुधार है जिसे आप स्वयं शुरू कर सकते हैं।",
  },
  RC03: {
    en: "Your bank account isn't correctly verified against your UAN — it may be inactive, or the IFSC/details are off. EPFO won't send money to an unverified or closed account, so it returned the claim. Your bank can fix this quickly.",
    hi: "आपका बैंक खाता आपके यूएएन के साथ सही ढंग से सत्यापित नहीं है — यह निष्क्रिय हो सकता है, या IFSC/विवरण गलत हैं। ईपीएफओ असत्यापित या बंद खाते में पैसा नहीं भेजता, इसलिए दावा वापस आया। आपका बैंक इसे जल्दी ठीक कर सकता है।",
  },
  RC04: {
    en: "Your previous employer hasn't marked your last working day (Date of Exit) in EPFO. Until they do, EPFO still treats you as employed there and won't release a final settlement. Your employer needs to update this.",
    hi: "आपके पिछले नियोक्ता ने ईपीएफओ में आपका अंतिम कार्य दिवस (Date of Exit) दर्ज नहीं किया है। जब तक वे नहीं करते, ईपीएफओ आपको वहीं कार्यरत मानता है और अंतिम भुगतान जारी नहीं करता। आपके नियोक्ता को इसे अपडेट करना होगा।",
  },
  UNKNOWN: {
    en: "We couldn't safely pin the exact reason from the text. Don't worry — read the exact remark on the member portal's claim status, and an EPFiGMS grievance with your claim ID will get an officer to review it.",
    hi: "हम पाठ से सटीक कारण की सुरक्षित पहचान नहीं कर सके। चिंता न करें — मेंबर पोर्टल की क्लेम स्थिति पर सटीक टिप्पणी पढ़ें, और आपके claim ID के साथ EPFiGMS शिकायत से कोई अधिकारी इसकी समीक्षा करेगा।",
  },
};

export async function generatePlainExplanation(req: ExplanationRequest): Promise<{
  explanation: string;
  source: "ai_assisted" | "deterministic";
}> {
  const fallback =
    DETERMINISTIC_EXPLANATIONS[req.root_cause_code]?.[req.language] ||
    DETERMINISTIC_EXPLANATIONS.UNKNOWN[req.language];

  if (!process.env.OPENAI_API_KEY) {
    return { explanation: fallback, source: "deterministic" };
  }

  try {
    const { generateText } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const { text } = await generateText({
      model: openai(model),
      system: EXPLANATION_SYSTEM_PROMPT,
      prompt: `Root cause code: ${req.root_cause_code}${
        req.labelHint ? ` (${req.labelHint})` : ""
      }.
Responsible party: ${req.owner}.
Claim type: ${req.schemeName || "EPFO PF claim"}.
Language: ${req.language === "hi" ? "Hindi" : "English"}.
Write the plain-language explanation now.`,
    });

    const cleaned = (text || "").trim();
    if (cleaned.length < 10) return { explanation: fallback, source: "deterministic" };
    return { explanation: cleaned, source: "ai_assisted" };
  } catch {
    return { explanation: fallback, source: "deterministic" };
  }
}
