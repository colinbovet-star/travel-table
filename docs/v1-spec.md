# Modern Round Table Members App — v1 Spec (no payments)

## Context
This repo is the old Travel Table app (Next.js + Supabase + Vercel). The Travel Table and Dating Table are both no longer needed. We're overwriting this project completely. No existing Supabase data needs to be kept.

The new app lives at https://members.modernroundtable.com and is for the Modern Round Table community (~500 existing members). The main marketing site stays at modernroundtable.com.

v1 needs:
- Members create profiles with photo, bio, and current location
- A browsable member directory, visible only to approved members
- An events page with an embedded Luma calendar, visible only to approved members
- A small admin area to approve members and upload an email allowlist

No payments in v1. Stripe will be added later, so design access control so payment can plug in without restructuring. The app does NOT send email (Luma handles that); Supabase auth emails are fine.

## Step 0 — Audit first (stop and report back)
1. Confirm which Vercel project, domains, and Supabase project this repo is connected to.
2. List everything you plan to delete. Wait for my OK.

## Step 1 — Remove
- All Travel Table and Dating Table onboarding steps, fields, components, copy, and pages
- Resend and the weekly-call invite system
- Cloudinary (replace with Supabase Storage)

Keep: Next.js scaffold, Supabase helpers, auth (signup, signin, callback, Google OAuth + email magic link), middleware, and shared UI components.

## Step 2 — Database (fresh migration; drop old tables)
`profiles`
- id (uuid, references auth.users, primary key)
- display_name, avatar_path, bio (max 500 chars), city, country
- onboarding_completed (bool)
- created_at, updated_at

`memberships` (written ONLY server-side with the service role)
- user_id (primary key, references profiles)
- status: `pending` | `active` | `revoked`
- source: `allowlist` | `admin` (Stripe will be added as a source later)
- updated_at

`allowlist`
- email (primary key, lowercase), added_at

Access rule: create a SQL function `is_active_member(uid)` that returns true when status = `active`. EVERY gate (RLS policies and middleware) must use this one function, so adding Stripe later only changes how status gets set.

Row-level security:
- Users can insert and update only their own profile.
- A profile is readable if it's your own, OR if both you and the owner are active members.
- Users can read only their own membership row. No client writes to memberships or allowlist.

Storage:
- Private `avatars` bucket. Users upload only to `{user_id}/...`.
- Serve photos via signed URLs to active members.
- Resize and compress on upload (max ~800px).

On signup (server-side): create a membership row. If the user's email is in the allowlist, status = `active`, source = `allowlist`. Otherwise status = `pending`.

## Step 3 — Routes
Public:
- `/` minimal welcome page with Sign in / Join buttons (the full marketing site lives at modernroundtable.com)
- `/auth/*`

Signed-in:
- `/onboarding` (one step: photo, name, bio, city, country)
- `/profile` (edit)
- `/pending` ("Thanks, you'll get access once approved")

Active members only (middleware redirects pending users to `/pending`):
- `/directory`: grid of member cards, search by name, filter by country/city
- `/members/[id]`: full profile
- `/events`: Luma embed from `NEXT_PUBLIC_LUMA_EMBED_URL`

Admin only (emails in the `ADMIN_EMAILS` env var; enforce server-side):
- `/admin`
  - List of pending members with Approve and Reject buttons
  - Active members with a Revoke button
  - CSV upload of emails to the allowlist
  - Uploading must also activate any existing pending users whose emails match

## Step 4 — Branding
- Name: Modern Round Table
- Background: #4b4b3d (olive)
- Accent: #dba3a3 (pink): headings, buttons, links, highlights
- Body text: off-white (#f5f1ea) on olive
- Button text: #4b4b3d on pink
- Fonts: Montserrat Bold for headings, Montserrat Regular for body, loaded via next/font/google
- Search the codebase for the old pink #D4907A and any Cormorant Garamond / DM Sans references, and replace them all
- Luma embed: full width, responsive height (min 600px), no border, lazy-loaded

## Env vars
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SITE_URL=https://members.modernroundtable.com (use http://localhost:3000 locally)
- NEXT_PUBLIC_LUMA_EMBED_URL=https://luma.com/embed/calendar/cal-zUgcI12WF2ELLwl/events
- ADMIN_EMAILS=colin.bovet@gmail.com

## Done when (test each one and report results)
1. An allowlisted email signs up, onboards, and immediately sees the directory and events.
2. A non-allowlisted email signs up, lands on `/pending`, and cannot see the directory or events.
3. An admin approves them, and they gain access on their next page load.
4. Revoking an active member removes their access.
5. A pending user cannot read other profiles or photos, even when querying Supabase directly from the browser.
6. Non-admins get blocked from `/admin` and from the admin API routes.
7. Users can't edit anyone else's profile or their own membership row.

## Go-live checklist (Colin does these manually)
- Vercel: add env vars; add domain members.modernroundtable.com and create the DNS record Vercel shows; remove the old travel subdomain.
- Supabase → Authentication → URL Configuration: Site URL https://members.modernroundtable.com; Redirect URLs https://members.modernroundtable.com/auth/callback and http://localhost:3000/auth/callback.
- Google Cloud → Credentials: add https://members.modernroundtable.com to Authorized JavaScript origins (redirect URI stays the Supabase callback); rename the consent screen app to "Modern Round Table".
- modernroundtable.com: Join → https://members.modernroundtable.com/auth/signup; Member sign in → https://members.modernroundtable.com/auth/signin.
