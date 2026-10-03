# Modern Round Table — Members App

Members-only web app for the Modern Round Table community at members.modernroundtable.com: profiles, member directory, and Luma events, with admin approval and an email allowlist. Payments (Stripe) come later. Do not build them yet.

Full spec: docs/v1-spec.md. Read it before starting any work.

## Stack
Next.js (App Router), Supabase (auth, Postgres, storage), Vercel.

## Rules
- Work one spec step at a time. Stop after each step, summarize what changed, and wait for my OK.
- Commit after each completed step with a clear message.
- All access checks use the SQL function `is_active_member(uid)`. Never duplicate this logic.
- Never write to `memberships` or `allowlist` from the client. Use server-side code with the service role only.
- Never commit secrets. Env vars go in .env.local, which is gitignored.
- Explain row-level security policies in plain English before applying them.

## Brand
Olive #4b4b3d background, pink #dba3a3 accent, off-white #f5f1ea body text. Montserrat (Bold for headings, Regular for body).

## Admin
Admins are defined by the ADMIN_EMAILS env var (currently colin.bovet@gmail.com).
