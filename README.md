# Anvance Production — Client Brief Module

Internal team tool for **Anvance Production**: capture client briefs, manage leads in a dashboard, configure shared pricing (listino), and export branded PDFs (brief + preventivo).

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **Supabase** — Postgres, Auth, RLS
- **react-hook-form** — multi-step brief
- **jsPDF + jspdf-autotable** — PDF export

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login` until authenticated.

### 1 — Environment variables

```bash
cp .env.example .env.local
```

Fill in:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 2 — Database migrations

Run all files in `supabase/migrations/` in order via the Supabase **SQL editor** or CLI:

```bash
supabase db push
```

Important migrations:

| File | Purpose |
|------|---------|
| `20260513_init_clients.sql` | `clients` table + base RLS |
| `20260514_simplify_clients.sql` | Simplified brief columns |
| `20260516_secure_rls_and_settings.sql` | Secure RLS + `app_settings` (shared listino) |

**Do not** re-apply `20260515_admin_dashboard_rls.sql` on production — it opens anonymous read/update/delete. The `20260516` migration removes those policies.

### 3 — Team users (no public sign-up)

1. Supabase Dashboard → **Authentication** → **Users** → **Add user**
2. Enter email + password for each team member
3. They log in at `/login`

Sign-up is disabled in the app; only users you create in the dashboard can access it.

### 4 — Security model

- **Middleware** — all routes require login except `/login` and `/auth/callback`
- **RLS** — `clients`: authenticated insert/select/update/delete; `app_settings`: authenticated read/write (shared listino)
- **Anon key** — still public in the browser, but RLS blocks unauthorized data access

Rotate your anon key if it was ever committed to git.

## Project layout

```
app/
  page.tsx              Client brief (login required)
  login/                Team login
  admin/page.tsx        Dashboard
  admin/settings/       Listino preventivi (saved in Supabase)
components/
  client-form/          6-step brief
  admin/                Table, stats, detail modal
lib/
  service-pricing.ts    Pricing types + PDF line builder
  listino-settings.ts   Supabase persistence for listino
  listino-context.tsx   Shared listino for all components
  pdf-generator.ts      PDF export
supabase/migrations/    SQL schema + RLS
```

## Form structure (6 steps)

1. Brief metadata (agent, date)
2. Company
3. Contact
4. Address (optional)
5. Services (website, logo, social, video, photo, graphic, ads)
6. Summary + submit

## Listino preventivi

Configured at **Admin → Listino preventivi** (`/admin/settings`). Saved to Supabase `app_settings` so every team member sees the same prices, billing modes (once/monthly), and PDF visibility toggles.

Existing browser `localStorage` listino is migrated automatically on first load after the migration runs.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

## License

© Anvance Production. All rights reserved.
