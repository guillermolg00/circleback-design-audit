# Circleback · Design audit

Design-system-style documentation of a visual consistency and user experience audit of the Circleback web app. Built with Next.js, MDX and Fumadocs, in Circleback's own visual language: dark mode, Plus Jakarta Sans for headings, the official wordmark, the brand orange (`#F24E1D`) for the documentation chrome, and the palette and radii measured in the app.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. The documentation lives under `/docs`.

## Password

The whole site sits behind a password (`proxy.ts`): pages, screenshots, search, `llms.txt` and OG images. Only `/unlock` and the brand assets are public, and every response carries `X-Robots-Tag: noindex`.

- Set `SITE_PASSWORD` in `.env.local` for local work (see `.env.example`) and in your host for deploys, e.g. `vercel env add SITE_PASSWORD production`.
- Without `SITE_PASSWORD` the site fails closed (503).
- Unlocking stores an HMAC of the password in an HttpOnly cookie for 30 days. Changing the password signs everyone out.

## Structure

- `content/docs/` — MDX pages: Overview, Method, Foundations, Components, User experience, Proposal and Appendix. Each folder has a `meta.json` with the page order.
- `components/doc/` — documentation blocks (`Figure`, `Compare`, `Measures`, `Finding`, `Story`, `Scale`) and live replicas of Circleback's components (`MockRow`, `MockMenu`, `Kbd`, `MockButton`, `MockChip`, `MockCard`, …) used to show the current state and the proposal with the same tokens.
- `public/img/` — 34 annotated screenshots of the app (personal data blurred).
- `public/brand/` — the official Circleback wordmark (from circleback.ai) and the "C." mark.
- `app/global.css` — theme: Fumadocs variables overridden with Circleback's palette, plus the styles for the blocks.

## Scripts

- `pnpm dev` — development server.
- `pnpm build` — production build (every page is prerendered).
- `pnpm types:check` — Next route types and `tsc`.
