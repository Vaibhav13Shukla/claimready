# ClaimReady — Product Requirements & Spec

_Build What Moves India 2026 · Platform: EPFO · Independent hackathon prototype_

## 1. One-line thesis

**Don't file your PF claim and pray. ClaimReady checks it against every common EPFO rejection reason first, tells you in plain language exactly what will get you rejected and how to fix it — and if you were already rejected, it decodes the reason and hands you a resolution packet.**

## 2. Problem (evidence-backed)

- EPF final-settlement rejection rose from ~13% (2017-18) to ~34% (2022-23); EPFO's 2024-25 annual report shows ~1 in 5 claims rejected (~174 lakh). _(Cite the annual-report figure as primary; note the range honestly.)_
- Rejections are overwhelmingly **preventable, trivial mismatches**: name spelling across UAN/Aadhaar/PAN/bank, DOB mismatch, unverified/inactive bank KYC, and Date-of-Exit not updated by a previous employer.
- Citizens wait 15–20 days only to be bounced over a one-letter difference, then guess-and-retry.
- **Blue ocean:** every existing resource is _reactive_ ("your claim was rejected, here's how to reapply"). Nobody ships an interactive _preventive pre-flight_. No government hackathon has targeted PF rejection (unlike cyber-reporting and grievance-routing, which were govt hackathons).

## 3. Target citizen

A salaried Indian who has changed jobs and is filing a PF **final settlement / advance / pension** claim (or was just rejected). Primary persona: the job-switcher who "has an EPFO horror story."

## 4. Core interaction (two modes, one engine)

1. **Pre-flight check (hero):** pick your claim type + your details (mock UAN profile) → engine runs the rejection gauntlet → **Readiness result**: red blockers + the one fix each, in priority order → "Ready to file" green state.
2. **Decode a rejection (mode two):** paste the rejection remark → OpenAI extracts + the rules engine classifies → plain-language cause → resolution packet (steps, documents, who must act, timeline) → escalation draft.

Shared pipeline (the moat is the workflow model, not the LLM):

> **AI INTERPRETS → RULES DECIDE → TEMPLATES EXPLAIN → MOCKS RESOLVE**
> AI does interpretation/plain-language only; a **deterministic rules engine** makes every diagnosis (no hallucinated remedies).

## 5. Rejection taxonomy (v1.1 — 5 root causes + UNKNOWN)

| Code    | Cause                                 | Owner         | Remedy                                                       | Timeline |
| ------- | ------------------------------------- | ------------- | ------------------------------------------------------------ | -------- |
| RC01    | Name mismatch (UAN/Aadhaar/PAN/bank)  | Member (self) | Joint-declaration / member correction                        | 7–20d    |
| RC02    | Date of Birth mismatch vs Aadhaar     | Member (self) | Member correction + proof                                    | 7–20d    |
| RC03    | Bank KYC unverified / inactive / IFSC | Bank          | Bank re-KYC / activation                                     | 3–10d    |
| RC04    | Date of Exit not updated by employer  | Employer      | Employer request → EPFiGMS escalation                        | 7–30d    |
| RC05    | Multiple / duplicate UAN not merged   | Member (self) | Online transfer claim (Form 13 / One Member-One EPF Account) | 10–30d   |
| UNKNOWN | Unclassified                          | EPFO office   | EPFiGMS grievance with claim ID                              | 7–15d    |

## 6. AI role (genuine, OpenAI-powered at runtime)

- `POST /api/extract` — if `OPENAI_API_KEY` set, call an OpenAI model (via `@ai-sdk/openai`) to extract `{claim_type, rejection_reason, confidence}` from free-text/screenshot text; **falls back** to deterministic keyword heuristics if no key or on error (demo never breaks).
- `POST /api/explain` — OpenAI generates the empathetic plain-language explanation (constrained: explain only, never invent steps); falls back to curated bilingual templates.
- **Compliance:** satisfies the hackathon's "powered by an OpenAI model" rule truthfully. `docs/CODEX_CONTRIBUTION.md` describes the real toolchain — no fabricated Codex narrative.

## 7. Non-goals / DO NOT BUILD

Generic "ask EPFO anything" chatbot · PF balance/returns tracker · admin/officer dashboards · real EPFO API / real UAN/Aadhaar/PAN/bank data · account creation · 3D/particles · multi-agent theatre · claims of government endorsement.

## 8. Trust & safety

100% synthetic data (`Demo`, `XXXX-DEMO-…`). Persistent disclosure banner + `/transparency` page (real vs mocked). No real PII collected. "Informational prototype — verify final action on the official EPFO portal."

## 9. Success criteria (verifiable)

- Golden gate: 7/7 golden EPFO cases classify deterministically (Vitest) — 53/53 tests total.
- Taxonomy validates against Zod schema; every RC has ≥4 error phrases, EN+HI content.
- `next build` passes; `/`, `/intake`, `/confirm`, `/diagnosis`, `/action`, `/tracker`, `/transparency` render.
- Judge can log in with printed demo creds and complete the pre-flight → resolution flow in <90s.
- Hindi/English toggle works across the flow.
- Zero ESLint errors/warnings, clean TypeScript strict typecheck, zero known WCAG 2.2 AA violations (audited Day 2).
- API routes validate all input against Zod schemas, are rate-limited, and never let client-supplied free text reach the LLM prompt unvalidated.

## 9a. Production readiness

`error.tsx`/`not-found.tsx`/`global-error.tsx` cover every failure path; `robots.ts`/`sitemap.ts`/a generated Open Graph image cover discoverability and link-sharing; `docs/DEPLOY_CHECKLIST.md` covers the Vercel deploy steps that need a human (repo push, env vars, the post-deploy `NEXT_PUBLIC_SITE_URL` redeploy). MIT-licensed (`LICENSE`).

## 10. Demo (60s)

Real EPFO rejection screen ("1 in 3 end like this") → ClaimReady pre-flight: "2 issues will get you rejected" → tap each → plain fix → all green "Ready to file" → split-screen vs the 20-day-wait-then-reject path → _"Catch it in 30 seconds, not 30 days."_
