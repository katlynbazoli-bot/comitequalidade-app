import { getSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  recebida: "Recebida",
  validada: "Validada (carimbada)",
  incompleta: "Incompleta (sem carimbo)",
  em_avaliacao: "Em avaliação",
  aprovada_aguardando_categorizacao: "Aprovada — aguardando categorização",
  aprovada: "Aprovada",
  nao_aprovada: "Não Aprovada",
  reavaliar: "Reavaliar no Encerramento",
  em_implementacao: "Em implementação",
  implementada: "Implementada",
  encerrada: "Encerrada",
};

export default async function QualidadePage() {
  const supabase = getSupabaseServerClient();
  const { data: ideias, error } = await supabase
    .from("ideias")
    .select(
      "id, codigo_unico, problema, solucao, status, data_registro, setores(nome), colaboradores(nome)"
    )
    .order("data_registro", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-colibri-green">
        Painel interno — Qualidade
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-colibri-ink">
        Ideias registradas
      </h1>
      <p className="mt-2 text-sm text-colibri-ink/60">
        Esta tela é interna e, na Fase 1, não tem autenticação — proteja o
        acesso com senha do Vercel ou restrinja depois de publicar (veja o
        README).
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">Erro ao carregar: {error.message}</p>
      )}

      <div className="mt-6 overflow-hidden rounded-card bg-white ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-colibri-greenLight text-colibri-greenDark">
            <tr>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Colaborador</th>
              <th className="px-4 py-3 font-medium">Setor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {(ideias ?? []).map((ideia: any) => (
              <tr key={ideia.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-mono text-xs">{ideia.codigo_unico}</td>
                <td className="px-4 py-3">{ideia.colaboradores?.nome ?? "—"}</td>
                <td className="px-4 py-3">{ideia.setores?.nome ?? "—"}</td>
                <td className="px-4 py-3">{STATUS_LABEL[ideia.status] ?? ideia.status}</td>
                <td className="px-4 py-3 text-colibri-ink/60">
                  {new Date(ideia.data_registro).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {(!ideias || ideias.length === 0) && !error && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-colibri-ink/50">
                  Nenhuma ideia registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
