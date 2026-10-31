# Thryft — Project Context

> Moderate-depth companion to `README.md`. For the open task backlog see
> [`tasks.md`](./tasks.md) and [`next steps.md`](./next%20steps.md); for domain/DNS/Supabase/
> Google OAuth setup see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## 1. What Thryft is, and who it's for

Thryft (`thryft.life`) is a peer-to-peer resale marketplace, focused on used electronics
(from `tasks.md`: device grading photo requirements — front/back/sides/screen-on/ports/
battery health — and an order lifecycle of Listed → Sold → Shipped → Delivered →
Completed). Payments are via Razorpay and seller verification is planned via Aadhaar/PAN
(`tasks.md`), which points to an India-focused audience. `package.json`'s Lovable scaffold
name (`vite_react_shadcn_ts`) and the default `README.md` (Lovable's boilerplate) confirm the
project was bootstrapped on Lovable and has been extended since.

## 2. Current tech stack (observed)

- **Frontend**: Vite + React 18 + TypeScript, shadcn/ui (Radix primitives) + Tailwind CSS,
  React Router, TanStack Query, React Hook Form + Zod, Framer Motion
- **Dev server**: Vite, pinned to **port 8080** (`vite.config.ts`, `host: "::"`)
- **Backend-as-a-service**: Supabase — `src/integrations/supabase/`, 14 SQL migrations under
  `supabase/migrations/` (products/sellers, product status, users table, wallet + saved
  items, orders, RLS policies, category expansion)
- **Payments**: Razorpay (`src/lib/razorpay.ts`, `VITE_RAZORPAY_KEY_ID`)
- **Analytics**: PostHog (`VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST`)
- **Testing**: Vitest + Testing Library (`src/test/`)
- **Package manager ambiguity**: both `bun.lockb` and `package-lock.json` are committed —
  unclear which is authoritative; pick one and remove the other to avoid drift.
- A `src/integrations/firebase/` folder exists but is **empty** (no files) and nothing under
  `src/` imports from it — looks like a leftover/unused scaffold, not a live integration.

## 3. Directory structure at a glance

```
Thryft/
├── src/
│   ├── pages/            # Index, Browse, Sell, ProductDetail, Checkout, OrderDetail,
│   │                      #   Profile, Admin, About, Collections, Privacy, Terms, NotFound
│   ├── components/       # Header, Footer, CartDrawer, ProductCard, SignInDialog, ui/ (shadcn), home/
│   ├── contexts/         # CartContext
│   ├── hooks/            # useAuth, useProducts, useOrders, use-toast, use-mobile
│   ├── lib/               # supabase-products, orders, razorpay, constants, utils
│   ├── integrations/      # supabase/ (live), firebase/ (empty, unused)
│   └── test/               # vitest setup + example test
├── supabase/
│   ├── migrations/         # 14 timestamped SQL migrations
│   └── seed.sql
├── public/
├── dist/                    # committed build output present — implies a build has been run locally
├── netlify.toml               # build: npm run build, publish: dist, SPA redirect to index.html
├── DEPLOYMENT.md, tasks.md, report.MD, social_GTM.md, socials.MD
├── run.sh / deploy.sh / git.sh / stop.sh
└── README.md, next steps.md
```

## 4. Build / deploy status

- Deploy target per `netlify.toml`: Netlify, `npm run build` → publish `dist/`, with a
  catch-all SPA redirect to `index.html`. `deploy.sh` itself is a one-liner (`npm install &&
  npm run build`) — it builds but does not invoke the Netlify CLI, so an actual deploy today
  relies on Netlify's git-connected auto-deploy (or a manual `netlify deploy`), not this
  script alone.
- Correction (2026-07-27): the description above was stale — `deploy.sh` actually contained git add/commit/push logic (not a build one-liner) and `git.sh` was an empty placeholder; both have now been consolidated into a single canonical `deploy.sh` (push, then Netlify CI auto-deploy, with `--force-manual` for a manual `netlify deploy`), with `git.sh` kept as a thin alias to it.
- `DEPLOYMENT.md` is a step-by-step guide for pointing the custom domain `thryft.life` at
  whichever host is used (Vercel, Netlify, or Lovable are all mentioned as options) and
  wiring up Supabase + Google OAuth redirect URLs consistently across localhost / staging /
  production. Its framing ("to fix 'This site can't be reached'") suggests this was written
  while the custom domain was not yet fully live — worth re-confirming current DNS/domain
  status rather than assuming it's resolved.
- `dist/` is present in the tree, so a production build has succeeded at least once locally.

## 5. Known blockers / rough edges (from `tasks.md`, not independently re-verified)

`tasks.md`'s "Critical (Pre-Launch)" section is still unchecked and includes core commerce
flow items:
- Supabase RLS policies for the products table (seller-only edit/delete) still need
  hardening.
- Razorpay is integrated as a library (`src/lib/razorpay.ts`) but the escrow-style flow
  (buyer pays → seller ships → buyer confirms → seller paid) is listed as not yet built.
- Email verification for new accounts, the multi-photo device-grading upload flow, full order
  tracking, filtered product search, seller identity verification (Aadhaar/PAN via a Supabase
  Edge Function), and API rate limiting are all listed as open, pre-launch items.
- `next steps.md` in this repo currently only has 3 generic bootstrap items checked as
  pending, so it hasn't been kept in sync with the more detailed `tasks.md` — treat
  `tasks.md` as the more current backlog.

## 6. Third-party integrations / accounts (from env files and config)

- **Supabase**: primary database, auth, and storage (`VITE_SUPABASE_URL`,
  `VITE_SUPABASE_PUBLISHABLE_KEY`); see `DEPLOYMENT.md` for the Google-login redirect-URL
  configuration required in the Supabase dashboard.
- **Razorpay**: payments (`VITE_RAZORPAY_KEY_ID`).
- **PostHog**: product analytics (`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`).
- **Google Cloud OAuth**: used for "Login with Google" via Supabase's provider integration
  (`DEPLOYMENT.md` section 5) — the OAuth client itself lives in Google Cloud Console, only
  Supabase's callback URL needs to be registered there.
- **ClickUp**: `.clickup.json` ties this repo to a ClickUp list/task for project tracking
  (fleet-wide tooling convention, not part of the app).

## 7. Where to go next

See [`next steps.md`](./next%20steps.md) for the tracked roadmap items, and
[`tasks.md`](./tasks.md) for the more granular, currently-more-complete task backlog.
