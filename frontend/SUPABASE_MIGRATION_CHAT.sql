create table if not exists community_threads (
  id uuid default uuid_generate_v4() primary key,
  user_name text not null,
  avatar_text text not null,
  title text not null,
  content text default '',
  category text not null,
  likes int default 0,
  love int default 0,
  laugh int default 0,
  celebrate int default 0,
  replies_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists community_replies (
  id uuid default uuid_generate_v4() primary key,
  thread_id uuid references community_threads(id) on delete cascade not null,
  user_name text not null,
  avatar_text text not null,
  content text not null,
  likes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table community_threads enable row level security;
alter table community_replies enable row level security;

-- Policies for anon access (so testing works without auth)
create policy "Allow public read access on threads" on community_threads for select using (true);
create policy "Allow public insert access on threads" on community_threads for insert with check (true);
create policy "Allow public update access on threads" on community_threads for update using (true);
create policy "Allow public delete access on threads" on community_threads for delete using (true);

create policy "Allow public read access on replies" on community_replies for select using (true);
create policy "Allow public insert access on replies" on community_replies for insert with check (true);
create policy "Allow public update access on replies" on community_replies for update using (true);
create policy "Allow public delete access on replies" on community_replies for delete using (true);

-- Realtime enablement
alter publication supabase_realtime add table community_threads;
alter publication supabase_realtime add table community_replies;
