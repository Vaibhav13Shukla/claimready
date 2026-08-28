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

- `taxonomy/error-taxonomy.json` + `taxonomy.schema.ts` — Zod-validated root causes RC01–RC05, each with bilingual labels/explanations, error phrases, and confidence-boost phrases.
- `classifier.ts` — deterministic phrase-match + confidence gate → `DiagnosisResult`. No randomness (see determinism test).
- `remedy-router.ts` — root cause → owner + remedy type + escalation tier.
- `timeline.ts` — root cause → working-day window.
- `case.ts` — a tested, standalone `diagnosed → action_taken → awaiting_cycle → resolved` state machine (`createInitialCase`/`canTransition`/`transitionCase`) modeling the intended audit-trail lifecycle of a case. **Not currently wired into the live UI** — the pre-flight/decode flow carries state through URL params across pages instead of a persisted `CaseObject`, and `/tracker` (below) is a deliberately free-form demo simulator, not gated by these transition rules, so a judge can jump to any stage to preview it. Kept as the seam a real backend/session layer would plug into.

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

- `classifier.test.ts` — 7/7 golden-case gate + 14 adversarial/determinism cases.
- `taxonomy-validate.test.ts`, `remedy-router.test.ts`, `timeline.test.ts`, `remedy.test.ts`, `case.test.ts`.
- 53 tests total, run with `npm run test:ci`.

## Safety

100% synthetic data. No live government systems, no real PII. Persistent disclosure + `/transparency`. Not affiliated with EPFO.

## Security (`src/lib/rate-limit.ts`, `next.config.ts`)

- Both API routes validate their full request body against a Zod schema before touching the AI layer — including a hard length cap on free text — so malformed/oversized input is rejected before it costs an OpenAI call.
- `/api/explain`'s `labelHint` is derived server-side from the taxonomy (keyed off the validated `root_cause_code`), never accepted from the client, removing the prompt-injection surface rather than just filtering it.
- Both system prompts (`src/ai/prompts.ts`) explicitly frame request fields as untrusted data, not instructions, as defense in depth.
- A per-IP fixed-window rate limit (20 req/min) guards both routes against runaway OpenAI spend; it's in-memory (single-instance only) by design for a prototype — see the file header for what a production version would need.
- `next.config.ts` sets CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy on every response.

## Accessibility

Audited against WCAG 2.2 AA (Day 2) and brought to zero known violations: labeled form controls, `aria-live` on the async AI-explanation swap, visible focus rings preserved on every input, `role="radiogroup"`/`"tablist"` on the claim-type and tab controls, correct heading hierarchy, and ≥24px touch targets on nav/footer links.

## Production readiness

- **Error handling**: `src/app/error.tsx` (segment-level boundary), `not-found.tsx` (404), `global-error.tsx` (root-layout crash) — all use this Next.js version's actual API (`{ error, retry }`, confirmed against `node_modules/next/dist/docs/`, not the `reset` name from older versions).
- **Fonts**: self-hosted via `next/font/google` (no external request, no CSP dependency on `fonts.googleapis.com`), exposed as the `--font-inter` CSS variable feeding the existing `--font` custom property.
- **SEO/sharing**: `robots.ts`, `sitemap.ts` (Next metadata file conventions), `opengraph-image.tsx` (generated via `next/og`'s `ImageResponse`, on-brand — no static asset to keep in sync).
- **Dependencies**: `sharp` and `lenis` were installed but never imported anywhere — removed. `engines.node >=20` pinned. Verified with a real `npm ci` (not just `npm install`) that the lockfile is fully self-consistent.
- **Deploy**: see `docs/DEPLOY_CHECKLIST.md` for the Vercel steps that need a human.
