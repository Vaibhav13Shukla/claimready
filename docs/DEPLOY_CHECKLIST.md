# Deploy Checklist (Vercel)

Everything up to "you click Deploy" is prepared. These steps need your Vercel
account, so they're written for you to run — each one is quick.

## 1. Push to GitHub

```bash
# From the pf-xray/ directory (already a git repo, 9 commits deep):
gh repo create pf-xray --private --source=. --remote=origin
git push -u origin main
```

(No `gh` CLI? Create an empty repo on github.com, then `git remote add origin <url>` and `git push -u origin main`.)

## 2. Import into Vercel

1. [vercel.com/new](https://vercel.com/new) → import the `pf-xray` repo.
2. Framework preset: Vercel auto-detects **Next.js** — no config needed.
3. Root directory: leave as `.` (this repo _is_ the app root, not a monorepo subfolder).

## 3. Set environment variables

In the Vercel project → **Settings → Environment Variables**:

| Variable               | Required?   | Value                                                                                                                                                                                                   |
| ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`       | Optional    | Your OpenAI key. Without it, the app runs entirely on the deterministic fallback — the demo still works, it just won't show the "OpenAI" badge on the diagnosis page.                                   |
| `OPENAI_MODEL`         | Optional    | Defaults to `gpt-4o-mini` if unset.                                                                                                                                                                     |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Your production URL, e.g. `https://pf-xray.vercel.app`. Used for the sitemap, robots.txt, and Open Graph/Twitter card image URLs. **You won't know this until after the first deploy** — see step 5. |

## 4. Deploy

Click **Deploy**. First build takes ~1–2 minutes. You'll get a URL like
`https://pf-xray-<hash>.vercel.app` or `https://pf-xray.vercel.app`
depending on the project name.

## 5. Set `NEXT_PUBLIC_SITE_URL` and redeploy

Now that you have the real URL:

1. Settings → Environment Variables → set `NEXT_PUBLIC_SITE_URL` to it.
2. Deployments → redeploy (or just push any commit — Vercel redeploys on push).

Without this step the OG image/sitemap/robots.txt will reference the
placeholder `https://pf-xray.vercel.app` — harmless (the app itself
works fine either way), but the shared-link preview card and sitemap will
point at the wrong domain.

## 6. Verify the live deployment

Run through `docs/DEMO_RUNBOOK.md`'s judge path against the real URL, plus:

```bash
curl -sI https://your-url.vercel.app/ | grep -i content-security-policy
curl -s  https://your-url.vercel.app/manifest.json   # should say "PF X-Ray", not anything else
curl -s  https://your-url.vercel.app/robots.txt
```

If you set `OPENAI_API_KEY`, open `/intake`, paste a rejection remark, and
check the diagnosis page shows the blue **"OpenAI"** badge (not "curated") —
that confirms the live OpenAI call path is genuinely working, not just
configured.

## 7. Submission checklist

- [ ] Live URL works end-to-end (pre-flight + decode paths)
- [ ] `OPENAI_API_KEY` set and verified live (or explicitly decided to submit fallback-only — both are honest per `docs/AI_USAGE.md`)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real deployed URL
- [ ] README/PRD/AI_USAGE.md reflect the final state (they already do as of this commit)
- [ ] Submission write-up cites the AI usage honestly per `docs/AI_USAGE.md` — don't claim Codex did work it didn't

## Troubleshooting

**Build fails on Vercel but works locally** — almost always a missing env var.
Node version is unlikely to be the cause: `jsdom` (the one dependency that
actually needs Node ^22.22.2 || ^24.15.0 || >=26.0.0, per `package.json`'s
`engines` field) is a devDependency used only by the unit test suite —
`next build` never imports it, so Vercel's build step doesn't hit that
requirement even on an older Node runtime. This was caught for real on the
first GitHub Actions CI run (pinned to Node 20 — jsdom doesn't support it at
all) and fixed there; if Vercel's build ever does fail on something
Node-version-shaped, set the Node version explicitly in Project Settings →
General → Node.js Version to 22.x or newer.

**CSP blocks something in production that worked locally** — check
`next.config.ts`'s `securityHeaders`. It was deliberately built against this
exact app's needs (self-hosted fonts via `next/font`, no other third-party
scripts) — if you add a third-party script/analytics/embed later, its host
needs adding to the relevant CSP directive or it will be silently blocked
(this exact class of bug — CSP blocking Next's own hydration script — is
covered in the `test:` commit history; the Playwright e2e suite would catch
a repeat of it).
