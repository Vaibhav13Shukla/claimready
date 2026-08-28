# AI Usage & OpenAI Disclosure
**Hackathon compliance statement for "Build What Moves India" 2026**

## How the "powered by an OpenAI model / built with Codex" rule is met
The brief requires the prototype to be **built with Codex OR powered by an OpenAI model**, with the submission explaining the AI's contribution.

ClaimReady satisfies this **honestly, via the "powered by an OpenAI model" clause**:

- **Runtime is genuinely OpenAI-powered.** Two server routes call an OpenAI model through the Vercel AI SDK (`@ai-sdk/openai`):
  - `POST /api/extract` — `generateObject` extracts `{claim_type, rejection_reason, confidence}` from free-text / screenshot text against a Zod schema.
  - `POST /api/explain` — `generateText` writes the plain-language, empathetic explanation of *why* the claim was blocked.
- **Rules, not the model, make every decision.** The deterministic classifier picks the root cause and the fix; the model only interprets and explains. This is the "AI interprets → rules decide" safeguard — no hallucinated government remedies.
- **Graceful fallback.** With no `OPENAI_API_KEY`, both routes fall back to a deterministic engine, so the live demo never breaks. The diagnosis UI shows an `OpenAI` vs `curated` badge so reviewers can see which path ran.

## Build toolchain — the honest version
This build was produced with an **AI coding assistant** driving spec-first, test-driven development: a Zod-typed domain schema, a deterministic rules engine, and a 6/6 golden-case gate written before/with the feature code.

> **Note for the submitting team:** if you want to make a *Codex* contribution explicit (the brief encourages Codex specifically), run Codex to do a real, meaningful slice of work on this repo before submitting — e.g. add a new root cause (`RC05`, multiple-UAN / transfer) end-to-end with its golden test, or generate the Playwright e2e flow — and then describe *that specific contribution* here. **Do not claim Codex did work it did not do.** The runtime OpenAI usage above already satisfies the rule on its own.

## What is NOT AI
- Root-cause decisions, remedy steps, documents, timelines, and letters are deterministic templates and rules — auditable and testable.
- No AI is used to invent legal/financial advice or to promise claim approval.
