# ClaimReady — Architecture

## Principle
> **AI INTERPRETS → RULES DECIDE → TEMPLATES EXPLAIN → MOCKS RESOLVE**

The intelligence is the **workflow + state model**, not a chatbot. A general LLM can talk about EPFO; it cannot reliably map a specific rejection remark to a specific, safe, testable fix. ClaimReady does.

## Layers

### 1. AI interprets (`src/ai/`, `src/app/api/`)
- `extract.ts` / `POST /api/extract` — OpenAI `generateObject` pulls `{claim_type, rejection_reason, confidence}` from free-text/screenshot text; deterministic `heuristicExtract` fallback.
- `explain.ts` / `POST /api/explain` — OpenAI `generateText` writes the ≤70-word plain-language explanation; curated bilingual fallback.
- `prompts.ts` — constrained system prompts (explain only, never invent steps).
- The model is fenced: it interprets and explains; it never decides the diagnosis or the remedy.

### 2. Rules decide (`src/core/`)
- `taxonomy/error-taxonomy.json` + `taxonomy.schema.ts` — Zod-validated root causes RC01–RC04, each with bilingual labels/explanations, error phrases, and confidence-boost phrases.
- `classifier.ts` — deterministic phrase-match + confidence gate → `DiagnosisResult`. No randomness (see determinism test).
- `remedy-router.ts` — root cause → owner + remedy type + escalation tier.
- `timeline.ts` — root cause → working-day window.
- `case.ts` — in-session case object + a `diagnosed → action_taken → awaiting_cycle → resolved` state machine.

### 3. Templates explain (`src/core/remedy.ts`, `src/documents/`)
- `remedy.ts` — per-remedy resolution plan: steps, documents, escalation, timeline (EN/HI).
- `base-walkthrough.ts` — interactive simulated EPFO member-portal correction (name / DOB).
- `bank-letter.ts` — bank KYC / activation request letter.
- `grievance-letter.ts` — employer Date-of-Exit request (+ EPFiGMS escalation).

### 4. Mocks resolve (`src/app/tracker/`)
- A 4-stage synthetic lifecycle showing how a claim clears after the fix.

## Frontend
- Next.js (App Router) + Tailwind v4. Light "fintech" design system in `globals.css` (Inter, sharp corners, `#006cd2` accent, glass, wipe/rise/paint-on animations).
- Flow: `/` → `/intake` → `/confirm` → `/diagnosis` → `/action` → `/tracker`, plus `/transparency`.
- Bilingual via `src/i18n/` (English/Hindi), persisted to `localStorage`.

## Testing (`tests/`)
- `classifier.test.ts` — 6/6 golden-case gate + 12 adversarial/determinism cases.
- `taxonomy-validate.test.ts`, `remedy-router.test.ts`, `timeline.test.ts`, `remedy.test.ts`, `case.test.ts`.
- 46 tests total, run with `npm run test:ci`.

## Safety
100% synthetic data. No live government systems, no real PII. Persistent disclosure + `/transparency`. Not affiliated with EPFO.
