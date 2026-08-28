# ClaimReady

### Check your EPFO PF claim before it gets rejected — and decode it if it already was

_Built for the "Build What Moves India" Hackathon 2026 · Platform: EPFO · Independent prototype_

---

## What it is

**1 in 5 EPFO claims is rejected — almost always for a small, fixable mismatch** (a one-letter name difference, a DOB mismatch, unverified bank KYC, or an employer that never marked your Date of Exit). Citizens wait 15–20 days only to be bounced, then guess and retry.

ClaimReady is a **pre-flight check + rejection decoder** for PF claims:

1. **Pre-flight** — pick your claim type / paste your details, and it tells you which rejection reason will hit you and the exact fix, _before_ you file.
2. **Decode** — already rejected? Paste the remark; it classifies the cause, explains it in plain language, and hands you a resolution plan (steps, documents, who must act, timeline, and a ready-to-send bank/employer letter).

**The blue ocean:** every other resource is _reactive_ ("your claim was rejected, here's how to reapply"). Nobody ships an interactive _preventive_ check, and no government hackathon has targeted PF rejection.

## Architecture

> **AI INTERPRETS → RULES DECIDE → TEMPLATES EXPLAIN → MOCKS RESOLVE**

- **AI interprets** — an OpenAI model extracts structured fields from messy rejection text and writes the plain-language explanation.
- **Rules decide** — a deterministic, Zod-typed classifier maps the text to a root cause (`RC01`–`RC04`). The model never decides the diagnosis or the fix, so there are no hallucinated remedies. 100% covered by golden tests.
- **Templates explain** — bilingual (English/Hindi) resolution steps, document checklists, and bank/employer letters.
- **Mocks resolve** — a 4-stage simulated lifecycle shows how the claim clears once you act.

## Root-cause taxonomy (v1.1)

| Code | Cause                                 | Who fixes it                      | Timeline |
| ---- | ------------------------------------- | --------------------------------- | -------- |
| RC01 | Name mismatch (UAN/Aadhaar/PAN/bank)  | You (self-service)                | 7–20d    |
| RC02 | Date of Birth mismatch vs Aadhaar     | You (self-service)                | 7–20d    |
| RC03 | Bank KYC unverified / inactive / IFSC | Your bank                         | 3–10d    |
| RC04 | Date of Exit not updated by employer  | Previous employer                 | 7–30d    |
| RC05 | Multiple / duplicate UAN not merged   | You (self-service, EPFO verifies) | 10–30d   |

## OpenAI / hackathon compliance

The prototype is **genuinely powered by an OpenAI model at runtime** (via `@ai-sdk/openai`) for the two interpretation steps — satisfying the hackathon's "powered by an OpenAI model" requirement. It **degrades gracefully** to a deterministic engine when no key is present, so the demo never breaks. See [`docs/AI_USAGE.md`](docs/AI_USAGE.md) for an honest account of the toolchain and how to make an AI coding agent's contribution explicit in your submission.

No login is required (it is a public citizen tool), so **no credentials are needed** to test it.

## Run locally

```bash
cd claimready
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY to enable live OpenAI calls
npm run dev                  # http://localhost:3000
```

## Test & build

```bash
npm run test:ci        # 100 unit tests incl. the 7/7 golden-case gate
npm run test:coverage  # same, with a coverage report (89% statements)
npm run test:e2e       # Playwright: the full judge critical path, real browser
npm run build          # Next.js production build (type-checked)
```

## Quality bar

- Zero ESLint errors/warnings, clean `tsc --noEmit`, 100/100 unit tests + 5/5 e2e tests green, `next build` green, verified against a clean `npm ci`.
- 89% statement coverage / 80% branch coverage on `src/` (core rules engine at 97%; UI components covered by the e2e suite instead of shallow unit renders).
- Zero known WCAG 2.2 AA violations — audited and fixed (see git log for the full findings list).
- API routes (`/api/extract`, `/api/explain`) validate every field against Zod schemas, cap free-text
  input length, rate-limit per IP, and never let client-supplied text reach the LLM prompt unvalidated.
- Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) on every response.
- `error.tsx` / `not-found.tsx` / `global-error.tsx` — no route ever falls through to Next's raw default error UI.
- `robots.ts` / `sitemap.ts` / a generated Open Graph image — a shared demo link renders a real preview card.

## Deploy (Vercel)

See [`docs/DEPLOY_CHECKLIST.md`](docs/DEPLOY_CHECKLIST.md) for the full walkthrough. Short version:

1. Push this repo to GitHub, import into Vercel.
2. Set `OPENAI_API_KEY` (optional — the demo works without it) and `NEXT_PUBLIC_SITE_URL` (your Vercel URL, once you have it) in Vercel project env.
3. Deploy → you get the public browser URL for submission.

## Privacy & safety

- **100% synthetic data** — obviously fake identifiers (`Demo Member`, `XXXX-DEMO-…`).
- No scraping, no live EPFO/UIDAI APIs, no real UAN/Aadhaar/PAN/bank/OTP data.
- Persistent disclosure banner + a `/transparency` page detailing real vs mocked layers.
- Not affiliated with EPFO or any government body.
