import errorTaxonomyRaw from "./taxonomy/error-taxonomy.json";
import { ErrorTaxonomy } from "./taxonomy/taxonomy.schema";
import type {
  DiagnosisResult,
  RootCauseCode,
  Owner,
  RemedyType,
  Scheme,
} from "./taxonomy/taxonomy.schema";

const taxonomy = ErrorTaxonomy.parse(errorTaxonomyRaw);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "in",
  "on",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "and",
  "or",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "but",
  "if",
  "then",
  "else",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "can",
  "will",
  "just",
  "should",
  "now",
  "bank", // generic word across banking context
  "account", // generic word
]);

function matchAgainstEntry(
  input: string,
  entry: (typeof taxonomy)[keyof typeof taxonomy]
): { score: number; matchedPhrase: string | null; exactMatchCount: number } {
  const normalizedInput = normalize(input);
  if (!normalizedInput) {
    return { score: 0, matchedPhrase: null, exactMatchCount: 0 };
  }

  let score = 0;
  let matchedPhrase: string | null = null;
  let longestMatchedLength = 0;
  let exactMatchCount = 0;

  // 1. Exact phrase matches (High precision)
  for (const phrase of entry.error_phrases) {
    const normalizedPhrase = normalize(phrase);
    if (normalizedPhrase && normalizedInput.includes(normalizedPhrase)) {
      const phraseWordCount = normalizedPhrase.split(/\s+/).length;
      const phraseScore = 20 + phraseWordCount * 10;
      score += phraseScore;
      exactMatchCount++;
      if (normalizedPhrase.length > longestMatchedLength) {
        longestMatchedLength = normalizedPhrase.length;
        matchedPhrase = phrase;
      }
    }
  }

  // 2. Confidence boost phrases (Distinctive markers)
  const boostPhrases = entry.confidence_boost_phrases ?? [];
  for (const phrase of boostPhrases) {
    const normalizedPhrase = normalize(phrase);
    if (normalizedPhrase && normalizedInput.includes(normalizedPhrase)) {
      const phraseWordCount = normalizedPhrase.split(/\s+/).length;
      score += 15 + phraseWordCount * 8;
      if (!matchedPhrase) {
        matchedPhrase = phrase;
      }
    }
  }

  // 3. Keyword co-occurrence for key signals
  const inputWords = new Set(
    normalizedInput
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );

  for (const phrase of entry.error_phrases) {
    const distinctiveWords = normalize(phrase)
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
    
    if (distinctiveWords.length > 0) {
      const matched = distinctiveWords.filter((w) => inputWords.has(w));
      if (matched.length === distinctiveWords.length) {
        score += 8;
      }
    }
  }

  return { score, matchedPhrase, exactMatchCount };
}

export interface DiagnoseOptions {
  rawErrorText: string;
  scheme: Scheme;
}

export function diagnose({
  rawErrorText,
  scheme,
}: DiagnoseOptions): DiagnosisResult {
  const normalized = normalize(rawErrorText);
  if (!normalized || normalized.length === 0) {
    return getUnknownResult();
  }

  let bestEntry: (typeof taxonomy)[keyof typeof taxonomy] | null = null;
  let bestScore = 0;
  let bestMatchedPhrase: string | null = null;

  for (const entry of Object.values(taxonomy)) {
    if (!entry.scheme_applicable.includes(scheme)) continue;

    const { score, matchedPhrase } = matchAgainstEntry(rawErrorText, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
      bestMatchedPhrase = matchedPhrase;
    }
  }

  // Minimum score threshold to avoid false positives on random text
  if (!bestEntry || bestScore < 15) {
    return getUnknownResult();
  }

  // Calculate normalized confidence between 0.65 and 0.98
  const confidence = Math.min(0.65 + (bestScore / 100) * 0.33, 0.98);

  return {
    root_cause_code: bestEntry.code,
    owner: bestEntry.owner,
    remedy_type: bestEntry.remedy_type,
    confidence: Math.round(confidence * 100) / 100,
    matched_phrase: bestMatchedPhrase ?? undefined,
    explanation_en: bestEntry.explanation_en,
    explanation_hi: bestEntry.explanation_hi,
    estimated_timeline_days: bestEntry.estimated_timeline_days,
    label_en: bestEntry.label_en,
    label_hi: bestEntry.label_hi,
  };
}

function getUnknownResult(): DiagnosisResult {
  return {
    root_cause_code: "UNKNOWN" as RootCauseCode,
    owner: "CSC" as Owner,
    remedy_type: "csc_referral" as RemedyType,
    confidence: 0,
    matched_phrase: undefined,
    explanation_en:
      "We could not safely identify the specific root cause from the error text. Please take this case summary to your nearest Common Service Centre (CSC) for manual diagnosis.",
    explanation_hi:
      "हम त्रुटि संदेश से विशिष्ट कारण की सुरक्षित पहचान नहीं कर सके। कृपया मैन्युअल निदान के लिए इस केस सारांश को अपने निकटतम सामान्य सेवा केंद्र (CSC) ले जाएं।",
    estimated_timeline_days: "7-14",
    label_en: "Unclassified / CSC Assistance Required",
    label_hi: "अवर्गीकृत / CSC सहायता आवश्यक",
  };
}

export function getTaxonomy(): typeof taxonomy {
  return taxonomy;
}
