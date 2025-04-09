create table public.spaces (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  link text not null,
  category text not null,
  tag text,
  creator_id uuid references auth.users(id) not null,
  creator_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  likes integer default 0 not null,
  featured boolean default false not null
);

-- Enable RLS
alter table public.spaces enable row level security;

-- Create policies
create policy "Users can view all spaces"
  on public.spaces
  for select
  using (true);

create policy "Authenticated users can create spaces"
  on public.spaces
  for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own spaces"
  on public.spaces
  for update
  using (auth.uid() = creator_id);

-- Create function to handle likes
create or replace function increment_likes(space_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.spaces
  set likes = likes + 1
  where id = space_id;
end;
$$; 