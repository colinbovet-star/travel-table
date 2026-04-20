-- ============================================================
-- Dating Table — members + referrals schema
-- Run in the Supabase SQL editor
-- ============================================================

-- MEMBERS
create table if not exists members (
  id uuid references auth.users(id) on delete cascade primary key,

  -- Contact
  email text,
  first_name text,
  phone text,

  -- Referral origin
  referral_source text,           -- Instagram, Referral, Friend, Matchmaker, Other
  referred_by_name text,
  referred_by_user_id uuid,       -- FK added below after table exists

  -- Membership
  member_type text default 'intro' check (member_type in ('intro', 'member', 'vip')),
  profile_completion integer default 0,
  cinqe_opt_in boolean default false,

  -- Step 1 — About You
  age integer,
  city text,
  state text,
  relationship_status text,
  headshot_url text,
  photo_2_url text,
  photo_3_url text,
  how_long_single text,
  dating_activity text,
  exciting_about_dating text,
  hoping_to_gain text[],
  topics_to_discuss text,

  -- Step 2 — Who You're Open to Meeting
  age_min integer,
  age_max integer,
  travel_distance text,
  open_to_relocate text,
  want_marriage text,
  want_children text,
  has_children boolean,
  religion text,
  religion_importance text,
  politics text,
  deal_breakers text,

  -- Step 3 — Table Preferences
  table_experiences text[],

  -- Step 4 — Membership + Community
  membership_interest text[],
  cinqe_interest text,
  instagram_handle text,

  -- Meta
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Self-referential FK (safe to add after table creation)
alter table members
  add constraint members_referred_by_fk
  foreign key (referred_by_user_id) references members(id);

-- REFERRALS
create table if not exists referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references members(id) on delete cascade not null,
  invitee_email text not null,
  status text default 'Invited' check (status in ('Invited', 'Signed Up', 'Completed')),
  created_at timestamptz default now()
);

-- updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists members_updated_at on members;
create trigger members_updated_at
  before update on members
  for each row execute procedure update_updated_at();

-- Auto-create member row on auth signup, pulling metadata passed via signInWithOtp
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.members (id, email, first_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- RLS
alter table members enable row level security;
alter table referrals enable row level security;

drop policy if exists "members_select_own" on members;
create policy "members_select_own" on members
  for select using (auth.uid() = id);

drop policy if exists "members_update_own" on members;
create policy "members_update_own" on members
  for update using (auth.uid() = id);

drop policy if exists "members_insert_own" on members;
create policy "members_insert_own" on members
  for insert with check (auth.uid() = id);

-- Directory: completed members can view other completed members
drop policy if exists "members_select_directory" on members;
create policy "members_select_directory" on members
  for select using (
    onboarding_completed = true
    and exists (
      select 1 from members m2
      where m2.id = auth.uid() and m2.onboarding_completed = true
    )
  );

drop policy if exists "referrals_select_own" on referrals;
create policy "referrals_select_own" on referrals
  for select using (auth.uid() = referrer_id);

drop policy if exists "referrals_insert_own" on referrals;
create policy "referrals_insert_own" on referrals
  for insert with check (auth.uid() = referrer_id);

-- ============================================================
-- Storage: create "member-photos" bucket in the Supabase
-- dashboard (Storage tab, Public = true), then run these:
-- ============================================================
create policy "user_upload_own_photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "user_update_own_photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "public_read_photos"
  on storage.objects for select
  to public
  using (bucket_id = 'member-photos');
