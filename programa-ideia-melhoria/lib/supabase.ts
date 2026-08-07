import { createClient } from "@supabase/supabase-js";

// No Cloudflare Workers, variáveis de ambiente em runtime às vezes não
// aparecem em process.env do jeito tradicional — o caminho garantido é
// via getCloudflareContext(). Em outros ambientes (Vercel, `next dev`
// local), essa função não está disponível/aplicável, então caímos de
// volta para process.env normalmente.
function readEnvVar(name: "SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY"): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const value = getCloudflareContext()?.env?.[name];
    if (value) return value as string;
  } catch {
    // Não estamos rodando no Cloudflare Workers — segue para process.env
  }
  return process.env[name];
}

// Este cliente só roda no servidor (Server Components / Server Actions).
// A service role key nunca é enviada ao navegador — é isso que garante
// que o navegador do colaborador ou do avaliador jamais tenha acesso
// direto ao banco (e, portanto, ao nome do autor de uma ideia).
export function getSupabaseServerClient() {
  const url = readEnvVar("SUPABASE_URL");
  const serviceKey = readEnvVar("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    throw new Error(
      "Faltam as variáveis de ambiente SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY. Configure-as no painel do Cloudflare (Settings > Variables and Secrets) ou no .env.local (veja .env.example) para rodar localmente."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
