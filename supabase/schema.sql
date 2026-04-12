-- ============================================================
-- Travel Table · profiles table + RLS + trigger
-- Run this in your Supabase SQL editor
-- ============================================================

create table profiles (
  id uuid references auth.users(id) primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Step 1
  display_name text,
  location text,
  age integer,
  bio text,
  languages text[],
  avatar_url text,
  photo_urls text[],

  -- Step 2
  travel_style_score integer check (travel_style_score between 1 and 5),
  solo_comfort text,
  budget_range text,
  trip_type_tags text[],
  looking_for text[],
  travel_frequency text,
  group_size_pref text,

  -- Step 3
  dream_regions text[],
  travel_months text[],
  upcoming_trip_destination text,
  upcoming_trip_start text,
  upcoming_trip_end text,
  open_to_buddy boolean default true,

  -- Step 4 / prefs
  weekly_call_emails boolean default true,
  discovery_emails boolean default true,

  -- Meta
  onboarding_completed boolean default false
);

-- Keep updated_at current
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- Auto-create empty profile row on new user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'full_name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- RLS
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
