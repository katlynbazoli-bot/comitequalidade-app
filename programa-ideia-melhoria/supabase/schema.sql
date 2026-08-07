-- ============================================================
-- Programa Ideia de Melhoria — Fase 1 (MVP)
-- Rode este arquivo inteiro no SQL Editor do Supabase
-- (Supabase > seu projeto > SQL Editor > New query > colar > Run)
-- ============================================================

create extension if not exists "pgcrypto";

-- SETORES ------------------------------------------------------
create table if not exists setores (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique
);

insert into setores (nome) values
  ('Produção'), ('Qualidade'), ('Manutenção'), ('Logística'),
  ('Administrativo'), ('Comercial'), ('RH')
on conflict (nome) do nothing;

-- COLABORADORES -------------------------------------------------
create table if not exists colaboradores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  setor_id uuid references setores(id),
  created_at timestamptz not null default now()
);

-- CICLOS ----------------------------------------------------------
create table if not exists ciclos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  data_abertura date not null,
  data_fim_recebimento date not null,
  status text not null default 'aberto' check (status in ('aberto','encerrado'))
);

-- Gerador de código único (IM-2026-0001, IM-2026-0002, ...) -----
create sequence if not exists ideia_codigo_seq;

create or replace function gerar_codigo_ideia() returns text as $$
declare
  ano text := to_char(now(), 'YYYY');
  seq int;
begin
  seq := nextval('ideia_codigo_seq');
  return 'IM-' || ano || '-' || lpad(seq::text, 4, '0');
end;
$$ language plpgsql;

-- IDEIAS ------------------------------------------------------------
create table if not exists ideias (
  id uuid primary key default gen_random_uuid(),
  codigo_unico text not null unique default gerar_codigo_ideia(),
  colaborador_id uuid not null references colaboradores(id),
  setor_id uuid not null references setores(id),
  problema text not null,
  solucao text not null,
  ciclo_id uuid references ciclos(id),
  status text not null default 'recebida' check (status in (
    'recebida', 'validada', 'incompleta', 'em_avaliacao',
    'aprovada_aguardando_categorizacao', 'aprovada', 'nao_aprovada',
    'reavaliar', 'em_implementacao', 'implementada', 'encerrada'
  )),
  data_registro timestamptz not null default now()
);

-- CARIMBOS --------------------------------------------------------
create table if not exists carimbos (
  id uuid primary key default gen_random_uuid(),
  colaborador_id uuid not null references colaboradores(id),
  ideia_id uuid not null references ideias(id),
  data_concessao timestamptz not null default now()
);

-- HISTÓRICO DE STATUS (auditoria — usado a partir da Fase 2) ------
create table if not exists historico_status (
  id uuid primary key default gen_random_uuid(),
  ideia_id uuid not null references ideias(id),
  status_anterior text,
  status_novo text not null,
  alterado_por text,
  data timestamptz not null default now()
);

-- Segurança: bloqueia acesso direto do navegador. Toda escrita/leitura
-- passa pelo backend do Next.js, que usa a service role key (nunca
-- exposta ao navegador). Isso já garante, desde a Fase 1, que o
-- nome do colaborador nunca fica acessível via API pública.
alter table setores enable row level security;
alter table colaboradores enable row level security;
alter table ciclos enable row level security;
alter table ideias enable row level security;
alter table carimbos enable row level security;
alter table historico_status enable row level security;
-- (nenhuma policy criada de propósito = acesso público bloqueado por padrão)
