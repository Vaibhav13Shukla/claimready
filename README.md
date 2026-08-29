# EPFO: Your PF money, in plain language

A citizen-first redesign concept for India's **Employees' Provident Fund Organisation (EPFO)**.
The goal: make provident-fund, pension and insurance services usable by *anyone*, whether a
first-time worker, a busy parent, or an elderly pensioner. No jargon, no PDF mazes, no captcha
inside a captcha.

> ⚠️ **Demonstration prototype.** This is **not** an official Government of India / EPFO website.
> All accounts, balances and money shown are fictional.

## Highlights

- **Plain language, task-first**: every page does one job and says it the way people say it
  ("How much money do I have?", "Move my PF to my new job").
- **Bilingual**: full English / हिन्दी toggle across the whole interface.
- **Accessible by design**: adjustable text size, a high-contrast mode, **read-aloud
  (text-to-speech)**, high-visibility yellow focus states, skip links, and semantic markup.
- **Realistic mock account**: sign in as a demo member with a full passbook, multiple
  employments, claim tracking and calculators.
- **Ships as one file**: the production build inlines all JS/CSS into a single `index.html`
  with **no external requests**, so it hosts anywhere and opens instantly in a browser.

## Demo login

| Field | Value |
| --- | --- |
| UAN | `100200300400` |
| Password | `epfo123` |
| OTP | `1234` |

Or click **"Fill demo details for me"** on the sign-in page.

## Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite 7** with **Tailwind CSS v4** (`@tailwindcss/vite`)
- **`vite-plugin-singlefile`**: one self-contained `dist/index.html`
- **Vitest** + **Testing Library** (jsdom) for unit & component tests
- **ESLint 9** (flat config) + **typescript-eslint**
- **GitHub Actions** CI/CD → **GitHub Pages**

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Produce the single-file `dist/index.html` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint over the project |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest once (CI mode) |
| `npm run test:coverage` | Vitest with a V8 coverage report |
| `npm run ci` | typecheck → lint → test → build (the full local gate) |

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request to `main`:

1. **quality**: install, typecheck, lint, test, build.
2. **deploy**: on push to `main`, the built `dist/` is published to **GitHub Pages**.

To enable deployment: on GitHub, go to **Settings → Pages → Build and deployment → Source:
GitHub Actions**. Because the build inlines every asset, no `base` path configuration is needed.
It also works on Vercel, Netlify, S3, or any static host by uploading `dist/index.html`.

## Project structure

```
src/
  lib/         data (mock member, passbook, claims), search, global store
  components/  Layout (header/nav/footer/search), shared UI, Ask widget
  pages/       Home, Login, Account, Withdraw, Track, Tools, Forms, Info, Help
  test/        Vitest setup
```

## Accessibility notes

Focus states are always visible (WCAG 2.2), text scales to 130% without breaking layout,
colour is never the only signal, and every interactive element is reachable by keyboard.
The read-aloud feature uses the browser's Speech Synthesis API where available.
