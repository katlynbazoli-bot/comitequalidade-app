# Programa Ideia de Melhoria — Fase 1 (MVP)

Este pacote já vem com o código pronto: formulário de registro (as 4
perguntas confirmadas), geração automática de código único, checagem de
requisitos mínimos e carimbo automático. Você não precisa programar nada —
só seguir os passos abaixo para colocar no ar.

## O que este pacote entrega

- **Tela do colaborador** (`/`): formulário de 4 perguntas — Nome, Setor,
  Problema, Solução.
- **Código único automático**: cada ideia recebe algo como `IM-2026-0001`.
- **Carimbo automático**: se problema e solução tiverem conteúdo suficiente
  (regra da Seção 1 do documento de regras), a ideia é carimbada na hora.
- **Painel interno da Qualidade** (`/qualidade`): lista simples de todas as
  ideias registradas, com código, colaborador, setor e status.
- **Banco de dados** já modelado para as próximas fases (avaliação anônima,
  pontuação, tickets de recompensa, ciclos).
- Pronto para publicar tanto na **Vercel** quanto no **Cloudflare Workers** —
  escolha um dos dois no passo 2 abaixo.

## Passo 1 — Criar o banco de dados (Supabase — gratuito, igual nos dois caminhos)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New project**, dê um nome (ex: `ideia-de-melhoria`) e uma senha
   de banco (guarde essa senha em local seguro).
3. Depois que o projeto for criado, vá em **SQL Editor** (menu lateral) →
   **New query**.
4. Abra o arquivo `supabase/schema.sql` deste pacote, copie todo o conteúdo,
   cole no editor e clique em **Run**. Isso cria todas as tabelas.
5. Vá em **Project Settings** → **API**. Copie:
   - **Project URL** → isso é o `SUPABASE_URL`
   - **service_role key** (não é a `anon` key — é a outra, marcada como
     secreta) → isso é o `SUPABASE_SERVICE_ROLE_KEY`

## Passo 2 — Publicar o site: escolha Vercel ou Cloudflare

|  | Vercel | Cloudflare Workers |
|---|---|---|
| Uso comercial no plano gratuito | **Não permitido** pelos termos de uso (Hobby é só pessoal) | Permitido |
| Facilidade de configuração | Zero configuração — mais simples | Precisa dos arquivos de configuração que já incluí no pacote (`wrangler.jsonc`, `open-next.config.ts`) — só rodar os comandos abaixo |
| Limites do plano gratuito | 100 GB de tráfego/mês | 100 mil requisições/dia — mais folgado ainda |

Se o programa é de uso interno da empresa, **Cloudflare é o caminho que
respeita os termos de uso no plano gratuito**. Vercel continua sendo a opção
mais simples se vocês decidirem pagar o plano Pro ($20/mês).

### Opção A — Cloudflare Workers (recomendado para uso interno gratuito)

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e crie uma conta
   gratuita.
2. Suba este pacote de código para um repositório no GitHub (o próprio site
   do GitHub permite arrastar a pasta e fazer upload, em
   **github.com/new** → **uploading an existing file**).
3. No painel da Cloudflare, vá em **Workers & Pages** → **Create** →
   **Import a repository**, e conecte o repositório que você criou.
4. Antes do deploy, adicione as variáveis de ambiente (mesma tela de
   configuração do projeto): `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
   — marque a segunda como **Secret** (criptografada).
5. Cloudflare detecta os arquivos `wrangler.jsonc` e `open-next.config.ts`
   automaticamente e builda usando o comando `npm run cf:deploy`. Clique em
   **Deploy**.
6. Em alguns minutos o site está no ar em algo como
   `https://programa-ideia-melhoria.SEU-USUARIO.workers.dev`.

Se preferir publicar direto do computador em vez de conectar o GitHub:

```bash
npm install
npx wrangler login          # abre o navegador para autorizar
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npm run cf:deploy
```

### Opção B — Vercel (mais simples, mas exige o plano Pro para uso comercial)

1. Acesse [vercel.com](https://vercel.com) e crie uma conta gratuita
   (pode entrar com GitHub).
2. Suba este pacote de código para um repositório no GitHub, como descrito
   acima.
3. Na Vercel, clique em **Add New** → **Project**, escolha o repositório.
4. Antes de clicar em "Deploy", abra a seção **Environment Variables** e
   adicione `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
5. Clique em **Deploy**. Em 1–2 minutos o site está no ar.
6. Se for usar para o programa da empresa (não é projeto pessoal), avalie
   migrar para o plano **Pro** ($20/mês) para ficar dentro dos termos de uso.

## Passo 3 — Proteger o painel interno

O painel `/qualidade` ainda não tem senha nessa fase. Antes de divulgar o
link do formulário para os colaboradores:
- **Cloudflare**: ative **Cloudflare Access** (gratuito até 50 usuários) na
  rota `/qualidade` — exige login antes de acessar.
- **Vercel**: **Project → Settings → Deployment Protection** → **Password
  Protection** (só nos planos pagos).
- Ou peça para eu já incluir um login simples direto no código na próxima
  fase, que funciona igual nos dois caminhos.

## Testando localmente (opcional, se alguém da equipe quiser mexer no código)

```bash
npm install
cp .env.example .env.local   # depois preencha com os dados do Supabase
npm run dev
```

Abra `http://localhost:3000`.

## O que vem nas próximas fases

Este pacote cobre só a Fase 1 do plano (documento
`Programa_Ideia_de_Melhoria_Proposta_Automacao.docx`). As próximas fases
(avaliação anônima da banca, motor de pontuação, tickets de R$25, ciclos,
dashboards) entram por cima dessa mesma base — nenhuma delas exige refazer o
que já está pronto aqui, nem depende de qual dos dois caminhos de publicação
você escolher.
