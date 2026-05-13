# Anvance Production — Client Brief Module

A professional, multi-step client brief webapp for **Anvance Production**.

Clients fill in a guided analytical brief covering company, store profile,
brand identity, digital presence, marketing and the services they want to
activate — from cinematic video, reels and long-form YouTube to professional
photography and custom-coded scalable websites. The team gets a beautiful,
branded PDF and an internal dashboard to triage every request.

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + shadcn/ui (Radix primitives)
- **Supabase** for storage of briefs (Postgres + RLS)
- **react-hook-form** for the multi-step form
- **jsPDF + jspdf-autotable** for the branded PDF output

## Getting started

```bash
pnpm install     # or npm install / yarn
pnpm dev         # starts the app on http://localhost:3000
```

### 1 — Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase keys:

```bash
cp .env.example .env.local
```

```ini
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 2 — Supabase schema

Run the SQL in `supabase/migrations/20260513_init_clients.sql` either via the
Supabase **SQL editor** or with the Supabase CLI:

```bash
supabase db push
```

This creates the `public.clients` table, the `updated_at` trigger and the
Row-Level-Security policies the app expects (public insert, authenticated
read/update/delete).

### 3 — Admin authentication (recommended)

`/admin` reads every brief. In production, protect it with Supabase Auth or
your reverse-proxy of choice — the route is **not** gated out of the box.

## Project layout

```
app/
  page.tsx           Public client brief
  admin/page.tsx     Internal dashboard
components/
  client-form/       Multi-step brief form (13 steps, conditional)
  admin/             Table, stats, detail modal
  ui/                shadcn/ui primitives
lib/
  types.ts           Data model + option catalogues
  pdf-generator.ts   Branded PDF (cover, sections, chips, footer)
  language-context.tsx  IT/EN translations
supabase/
  migrations/        SQL schema + RLS policies
```

## Form structure

1. **Brief metadata** — agent, date, existing client toggle
2. **Company** — name, sector, VAT
3. **Contact**
4. **Address**
5. **Punto vendita** — staff, surface, revenue, customer flow
6. **Identità & punto vendita** — logo, colours, materials, coherence
7. **Presenza digitale** — site, social, Google Business
8. **Marketing & sponsorships** — newsletter, WhatsApp, online + offline ads
9. **Servizi richiesti** — macro-categories + detailed brand / social / ads / web checklists
10. **Video / foto** (shown only if applicable)
11. **Sito web custom** (shown only if applicable)
12. **Brand & audience**
13. **Difficoltà, budget & tempistiche** — pain points + budget + timeline

Each step uses smooth transitions, mobile-first layout and accessible Radix
primitives. The web step explicitly offers **custom-coded, scalable
websites** rather than off-the-shelf templates.

## PDF output

The PDF generator produces an A4 brief with:

- Branded black cover header with Anvance wordmark
- Client summary card with "Cliente attivo" badge for returning clients
- Hairline section dividers and a tight 2-column key/value layout
- Macro-category chips and per-category service lists
- Conditional video/photo + website sub-sections
- Pain-points bulleted list
- Auto-paginated footer with page numbers

## License

© Anvance Production. All rights reserved.
# AnvanceModule
# AnvanceModule
