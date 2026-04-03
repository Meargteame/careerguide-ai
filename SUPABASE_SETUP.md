# Supabase Setup Guide

Since we have removed the local backend, we will use Supabase for Database and Authentication.

## 1. Create a Supabase Project
1. Go to [database.new](https://database.new) and create a new project.
2. Store your database password safely.
3. Wait for the project to finish initializing.

## 2. Get API Keys
1. In your project dashboard, go to **Settings (Gear icon) > API**.
2. Copy the **Project URL**.
3. Copy the **anon / public** key.
4. Open `frontend/.env` and paste them:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Run Database Schema
Go to the **SQL Editor** in the Supabase dashboard sidebar.
Click **New Query**, paste the code below, and click **Run**.

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends default auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'student' check (role in ('student', 'admin')),
  academic_year text,
  xp int default 0,
  streak int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. ROADMAPS TABLE
create table roadmaps (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  is_template boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ROADMAP NODES (Steps)
create table roadmap_nodes (
  id uuid default uuid_generate_v4() primary key,
  roadmap_id uuid references roadmaps(id) on delete cascade,
  title text not null,
  description text,
  order_index int,
  resource_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. USER ENROLLMENTS
create table user_enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  roadmap_id uuid references roadmaps(id) on delete cascade,
  status text default 'active' check (status in ('active', 'completed', 'dropped')),
  progress int default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

-- 5. TRIGGER: Create Profile on Signup
-- Automatically adds a row to 'profiles' when a user signs up via Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. Setup Row Level Security (RLS) policies
(Optional but recommended for security later. For now, the above will get you started.)
