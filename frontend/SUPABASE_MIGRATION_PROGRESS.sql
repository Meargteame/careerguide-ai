-- Migration to add robust tracking and economy features

alter table profiles add column if not exists meridian_coins int default 0;
alter table profiles add column if not exists achievements jsonb default '[]'::jsonb;
alter table profiles add column if not exists last_active_date date;
alter table profiles add column if not exists daily_bounties_state jsonb default '{}'::jsonb;

-- Example initial achievements or data could optionally be seeded, but jsonb is sufficient for client modifications.
