create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  objective text not null check (char_length(objective) between 1 and 2000),
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  description text,
  category text not null default 'General',
  status text not null default 'todo' check (status in ('todo','done')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists workspaces_user_created_idx on public.workspaces(user_id, created_at desc);
create index if not exists workspace_tasks_workspace_sort_idx on public.workspace_tasks(workspace_id, sort_order, created_at);
create index if not exists workspace_tasks_user_idx on public.workspace_tasks(user_id);

alter table public.workspaces enable row level security;
alter table public.workspace_tasks enable row level security;

drop policy if exists "Owners can select workspaces" on public.workspaces;
create policy "Owners can select workspaces" on public.workspaces for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Owners can insert workspaces" on public.workspaces;
create policy "Owners can insert workspaces" on public.workspaces for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Owners can update workspaces" on public.workspaces;
create policy "Owners can update workspaces" on public.workspaces for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Owners can delete workspaces" on public.workspaces;
create policy "Owners can delete workspaces" on public.workspaces for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Owners can select tasks" on public.workspace_tasks;
create policy "Owners can select tasks" on public.workspace_tasks for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Owners can insert tasks" on public.workspace_tasks;
create policy "Owners can insert tasks" on public.workspace_tasks for insert to authenticated with check (
  auth.uid() = user_id and exists (select 1 from public.workspaces w where w.id = workspace_id and w.user_id = auth.uid())
);
drop policy if exists "Owners can update tasks" on public.workspace_tasks;
create policy "Owners can update tasks" on public.workspace_tasks for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id and exists (select 1 from public.workspaces w where w.id = workspace_id and w.user_id = auth.uid())
);
drop policy if exists "Owners can delete tasks" on public.workspace_tasks;
create policy "Owners can delete tasks" on public.workspace_tasks for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_tasks to authenticated;