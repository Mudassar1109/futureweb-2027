# FutureWeb 2027 — Nexora

Nexora is an early-stage connected workspace concept. The first MVP slice focuses on capturing a business objective, creating a private workspace, and tracking practical launch tasks.

## Current MVP
- Responsive product landing page
- Passwordless email sign-in using Supabase Auth (PKCE magic link)
- Auth callback and cookie-based SSR session refresh
- Private workspaces and task tracking backed by Supabase PostgreSQL
- Row Level Security on every user-data table

## Stack
- Next.js 15, React 19, TypeScript
- Supabase Auth, PostgreSQL, `@supabase/ssr`
- Lucide icons and custom responsive CSS

## Local setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Never expose a Supabase secret/service-role key in client code.

In Supabase Auth URL Configuration, set the Site URL to your local or deployed origin and allow the callback path `/auth/callback`.

## Database
The initial schema is in `supabase/migrations/20261123000000_init_workspaces.sql`. It creates `workspaces` and `workspace_tasks`, enables RLS, and restricts access to the authenticated owner. The same schema has been applied to the connected Supabase project.

## Product status
This is an MVP foundation, not a validated business or finished AI product. AI generation, billing, team collaboration, external integrations, and analytics are not implemented yet.
