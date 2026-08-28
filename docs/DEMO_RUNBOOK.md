# ClaimReady — Demo Runbook

## Judge quick path (no login required)
1. Open the deployed URL → landing hero.
2. Click **Run a pre-flight check** → **intake**.
3. On the **Try a demo case** tab, click **GC-01 (Name mismatch)** — or **GC-07 (Multiple UAN)** to see the newest root cause, added Day 2.
4. **Confirm** the extracted case → **Yes, run the diagnosis**.
5. **Diagnosis**: RC01, plain-language explanation, who fixes it, timeline.
6. **Build my resolution plan** → the EPFO portal walkthrough (name correction) + steps + documents.
7. Try **Decode a rejection** from the landing for the reactive mode (paste any remark).
8. Toggle **हिंदी** in the nav — the whole flow is bilingual.
9. Visit **/transparency** for the real-vs-mocked disclosure.

## 60-second demo script
| Time | On screen |
|---|---|
| 0–5s | Real EPFO rejection remark. Caption: **"1 in 5 PF claims ends like this."** |
| 5–12s | Open ClaimReady → pick claim type → click a demo rejection. |
| 12–22s | Confirm screen — "this is what we read" (editable). |
| 22–35s | Diagnosis: **RC01 · Name mismatch**, 98% confidence, plain-language "this isn't your fault", who fixes it, 7–20 days. |
| 35–48s | Resolution plan: the simulated EPFO portal walkthrough correcting the name to match Aadhaar. |
| 48–56s | Split: cryptic rejection remark **vs** the clear fix plan. |
| 56–60s | Payoff: **"Catch it in 30 seconds, not 30 days."** |

## 2-minute video plan
- **Minute 1 — citizen demo:** the path above, no jargon, let the transformation speak.
- **Minute 2 — how/why built:**
  - Product decision: *"We refused a chat box. Citizens don't want to ask questions — they want their money. So we lead with a diagnosis, not a prompt."*
  - Architecture: AI interprets (OpenAI) → **rules decide** (deterministic, golden-tested) → templates explain → mocks resolve.
  - Honesty: 100% synthetic data; OpenAI powers interpretation with a graceful deterministic fallback; `/transparency` documents real vs mocked.

## Data honesty for the writeup
Cite the **EPFO 2024-25 annual-report figure (~1 in 5 claims rejected)** as the primary number. The rejection rate has ranged ~25–34% across recent years — don't headline the scariest year without noting it's older.

## Demo profiles (all synthetic)
The 7 golden cases (GC-01…GC-07) cover: name mismatch (final settlement + advance), DOB mismatch, bank KYC/inactive, Date-of-Exit not updated, IFSC/pension, and multiple/duplicate UAN. Every one classifies deterministically (see `tests/unit/classifier.test.ts`).
