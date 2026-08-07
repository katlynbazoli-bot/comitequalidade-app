"use server";

import { getSupabaseServerClient } from "@/lib/supabase";

export type Setor = { id: string; nome: string };

export async function listarSetores(): Promise<Setor[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("setores")
    .select("id, nome")
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type RegistrarIdeiaResult =
  | { ok: true; codigo: string; carimbada: boolean }
  | { ok: false; erro: string };

// Requisito mínimo, conforme Seção 1 das regras oficiais: a ideia
// precisa conter Problema + Proposta de solução, de forma real —
// não apenas preenchida. Usamos um comprimento mínimo simples para
// barrar respostas vazias ou de uma palavra só; a Qualidade continua
// sendo quem valida o conteúdo de fato na triagem (Fase 2).
const TAMANHO_MINIMO = 15;

export async function registrarIdeia(formData: FormData): Promise<RegistrarIdeiaResult> {
  const nome = String(formData.get("nome") ?? "").trim();
  const setorId = String(formData.get("setor_id") ?? "").trim();
  const problema = String(formData.get("problema") ?? "").trim();
  const solucao = String(formData.get("solucao") ?? "").trim();

  if (!nome || !setorId || !problema || !solucao) {
    return { ok: false, erro: "Preencha todos os campos antes de enviar." };
  }

  const atendeMinimo =
    problema.length >= TAMANHO_MINIMO && solucao.length >= TAMANHO_MINIMO;

  const supabase = getSupabaseServerClient();

  // 1. Garante o colaborador (cria se for a primeira ideia dessa pessoa)
  const { data: colaboradorExistente, error: buscaError } = await supabase
    .from("colaboradores")
    .select("id")
    .eq("nome", nome)
    .eq("setor_id", setorId)
    .maybeSingle();

  if (buscaError) return { ok: false, erro: buscaError.message };

  let colaboradorId = colaboradorExistente?.id as string | undefined;

  if (!colaboradorId) {
    const { data: novoColaborador, error: criaError } = await supabase
      .from("colaboradores")
      .insert({ nome, setor_id: setorId })
      .select("id")
      .single();

    if (criaError) return { ok: false, erro: criaError.message };
    colaboradorId = novoColaborador.id;
  }

  // 2. Registra a ideia — status inicial depende do requisito mínimo
  const status = atendeMinimo ? "validada" : "incompleta";

  const { data: novaIdeia, error: ideiaError } = await supabase
    .from("ideias")
    .insert({
      colaborador_id: colaboradorId,
      setor_id: setorId,
      problema,
      solucao,
      status,
    })
    .select("id, codigo_unico")
    .single();

  if (ideiaError) return { ok: false, erro: ideiaError.message };

  // 3. Carimbo automático — só para ideias que atendem ao requisito mínimo
  if (atendeMinimo) {
    const { error: carimboError } = await supabase.from("carimbos").insert({
      colaborador_id: colaboradorId,
      ideia_id: novaIdeia.id,
    });
    if (carimboError) return { ok: false, erro: carimboError.message };
  }

  return { ok: true, codigo: novaIdeia.codigo_unico, carimbada: atendeMinimo };
}
