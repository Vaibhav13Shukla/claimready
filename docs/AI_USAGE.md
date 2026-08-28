# AI Usage & OpenAI Disclosure

**Hackathon compliance statement for "Build What Moves India" 2026**

## How the "powered by an OpenAI model / built with Codex" rule is met

The brief requires the prototype to be **built with Codex OR powered by an OpenAI model**, with the submission explaining the AI's contribution.

PF X-Ray satisfies this **honestly, via the "powered by an OpenAI model" clause**:

- **Runtime is genuinely OpenAI-powered.** Two server routes call an OpenAI model through the Vercel AI SDK (`@ai-sdk/openai`):
  - `POST /api/extract` — `generateObject` extracts `{claim_type, rejection_reason, confidence}` from free-text / screenshot text against a Zod schema.
  - `POST /api/explain` — `generateText` writes the plain-language, empathetic explanation of _why_ the claim was blocked.
- **Rules, not the model, make every decision.** The deterministic classifier picks the root cause and the fix; the model only interprets and explains. This is the "AI interprets → rules decide" safeguard — no hallucinated government remedies.
- **Graceful fallback.** With no `OPENAI_API_KEY`, both routes fall back to a deterministic engine, so the live demo never breaks. The diagnosis UI shows an `OpenAI` vs `curated` badge so reviewers can see which path ran.

## Build toolchain — the honest version

This build was produced with an **AI coding assistant (Claude Code)** driving spec-first, test-driven development: a Zod-typed domain schema, a deterministic rules engine, and a golden-case gate written before/with the feature code (6/6 on Day 1, 7/7 after Day 2's addition below).

**Day 2 changes, for the record:**

- Added `RC05` (multiple/duplicate UAN not merged) end-to-end — taxonomy entry, router, timeline, bilingual remedy template, golden test + 2 adversarial cases, UI wiring — via a failing-test-first (red→green) loop.
- Fixed a broken CI workflow, several genuine React 19 anti-patterns (synchronous `setState` inside `useEffect`, since fixed with `useSyncExternalStore` / derived state instead), and all ESLint findings.
- A dedicated security review pass found and fixed one HIGH finding (client-supplied fields reaching the OpenAI prompt on `/api/explain` unvalidated — now derived server-side from the validated taxonomy) plus input-length caps, rate limiting, and security headers.
- A dedicated WCAG 2.2 AA accessibility audit found and fixed 18 issues (4 critical) — unlabeled form controls, a missing `aria-live` region on the async AI-explanation swap, and more. See git history for the full list.

> **Note for the submitting team:** if you want to make a _Codex_ contribution explicit (the brief encourages Codex specifically), run Codex to do a real, meaningful slice of work on this repo before submitting — e.g. the Playwright e2e flow, or a further RC06 candidate — and then describe _that specific contribution_ here. **Do not claim Codex did work it did not do**; the work above was Claude Code, not Codex, and is described accordingly. The runtime OpenAI usage described above already satisfies the hackathon's AI-usage rule on its own, independent of which coding assistant wrote the code.

## What is NOT AI

- Root-cause decisions, remedy steps, documents, timelines, and letters are deterministic templates and rules — auditable and testable.
- No AI is used to invent legal/financial advice or to promise claim approval.
