-- Execute este script no SQL Editor do Supabase (Project → SQL Editor → New query)

create table if not exists public.colibri_at_storage (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Habilita Row Level Security
alter table public.colibri_at_storage enable row level security;

-- Política simples: qualquer requisição com a anon key pode ler e escrever.
-- Como o painel não tem login, isso equivale a "quem tem o link, acessa".
-- Se quiser exigir login, troque por políticas baseadas em auth.uid().
create policy "Permitir leitura via anon key"
  on public.colibri_at_storage
  for select
  to anon
  using (true);

create policy "Permitir escrita via anon key"
  on public.colibri_at_storage
  for insert
  to anon
  with check (true);

create policy "Permitir atualização via anon key"
  on public.colibri_at_storage
  for update
  to anon
  using (true)
  with check (true);
