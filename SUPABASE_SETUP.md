# Go Tutor Academy — Supabase setup & deploy guide

The app was migrated off the old Express + MongoDB backend. The React frontend now
talks **directly to Supabase** (Postgres + Auth). There is no Node server to run or
host anymore. The `backend/` folder is kept only for reference and is no longer used.

```
Cloudflare Pages (static React)  ──supabase-js──>  Supabase (Postgres + Auth)
```

Follow these steps once and the live site will work.

---

## 1. Create a Supabase project

1. Go to https://supabase.com → **New project** (the free tier is fine).
2. Pick a name and a database password (save it somewhere).
3. Wait ~2 minutes for it to provision.

## 2. Create the database schema

1. In the Supabase dashboard: **SQL Editor → New query**.
2. Open [`supabase/schema.sql`](supabase/schema.sql) from this repo, copy the whole
   file, paste it into the editor, and click **Run**.
3. This creates all tables (`profiles`, `subjects`, `appointments`, `notes`,
   `feedback`, `reviews`, `actions`), Row-Level-Security policies, the trigger that
   auto-creates a profile when someone signs up, and some seed data (subjects +
   sample reviews).

## 3. Get your API keys

In the dashboard: **Project Settings → API**. You need two values:

- **Project URL** → `https://xxxxxxxx.supabase.co`
- **anon public** key (the long JWT under "Project API keys")

> The `anon` key is safe to ship in the frontend — Row Level Security protects the
> data. **Never** put the `service_role` key in the frontend.

## 4. Configure the frontend locally

In `client/`, copy the example env file and fill it in:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then run it:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## 5. Auth settings (important for testing)

By default Supabase requires users to **confirm their email** before they can log in.
While developing you probably want to turn that off:

- **Authentication → Providers → Email** → turn **"Confirm email"** OFF (dev only).

For the password-reset and confirmation emails to point at the right place in
production, set the redirect URLs:

- **Authentication → URL Configuration → Site URL**: your live URL
  (e.g. `https://gotutor.academy`).
- **Redirect URLs**: add both `http://localhost:5173/**` and your prod
  `https://your-domain/**` so the `/reset-password` link works.

## 6. Roles (student / tutor / admin)

The register form now lets you choose a role at signup, so you can create one of each
to try every dashboard. To change an existing user's role later:

- **Table Editor → profiles** → edit the user's `role` cell
  (`student`, `tutor`, or `admin`).

## 7. Deploy to Cloudflare Pages

In your Cloudflare Pages project settings:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `client`
- **Environment variables** (Production *and* Preview): add
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Redeploy. The included `client/public/_redirects` file makes client-side routing work
(so refreshing on `/tutor-dashboard` etc. doesn't 404).

---

## What changed in the code

- `client/src/lib/supabase.js` — the Supabase client.
- `client/src/api/*` — a small data layer (auth, profiles, tutors, students,
  appointments, subjects, notes, feedback, reviews, search, events). Every old
  `fetch("http://localhost:4000/api/...")` call now goes through these.
- `client/src/context/AuthContext.jsx` — uses Supabase Auth sessions instead of the
  custom JWT.
- `supabase/schema.sql` — the database schema + security policies.

## Notes / things to be aware of

- **Tutor availability** (`available_hours`) is stored as JSON. The booking UI reads
  it; tutors set it via the "Edit My Schedule" modal.
- The old action/audit log lives in the `actions` table (admin-readable).
- Some originally-unfinished pages (e.g. the `ADH-*`/`TDH-*` placeholder pages and
  `Admin/ManageUsers`) were wired up but are not all routed in `App.jsx`.
