# Assistência Técnica · Colibri Móveis — hospedagem

Painel estático (HTML puro) com persistência de dados no Supabase.

## Arquivos

- `index.html` — o painel em si.
- `config.js` — credenciais do Supabase (URL + anon key). **Edite este arquivo.**
- `schema.sql` — script para criar a tabela no Supabase.

## 1. Projeto no Supabase (já configurado)

Este pacote já está conectado ao seu projeto Supabase
(`jhjxeggmifnlmfmkrfys`, região `sa-east-1`). A tabela
`colibri_at_storage` (chave/valor em JSON) foi criada com RLS
habilitado e as políticas de leitura/escrita via anon key — é o que
guarda: indicadores mensais, metas, plano de ação, diário de
ocorrências e treinamentos. `schema.sql` fica no pacote apenas como
referência/backup, não precisa rodar de novo.

> A política de acesso liberada é para "quem tem o link, acessa"
> (sem login). Se quiser exigir autenticação, ajuste as políticas de
> RLS em *Authentication → Policies* no painel do Supabase.

O `config.js` já vem preenchido com a URL e a anon key do seu
projeto — não precisa editar nada, a menos que troque de projeto.

## 2. Publicar no GitHub Pages

1. Crie um repositório no GitHub (pode ser público ou privado, desde
   que o GitHub Pages esteja disponível no seu plano para privados).
2. Suba os 3 arquivos (`index.html`, `config.js`, `schema.sql`) na
   raiz do repositório — ou apenas `index.html` e `config.js`, o
   `schema.sql` é só para você rodar uma vez no Supabase.
3. No repositório: **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione `main` (ou `master`) e pasta `/ (root)`.
6. Salve. Em alguns minutos o link ficará disponível em algo como:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## Observações importantes

- A **anon key** do Supabase é pública por natureza — é a chave feita
  para rodar no navegador. Quem realmente controla o acesso são as
  **políticas de RLS** da tabela. Como o painel roda sem login, a
  política liberada é "quem tem o link, acessa os dados". Se o
  repositório for público no GitHub, qualquer pessoa consegue ver a
  URL e a anon key no `config.js` — nesse caso, deixe o repositório
  **privado** ou adicione autenticação no Supabase.
- Se preferir não versionar as credenciais no Git, adicione
  `config.js` ao `.gitignore` e suba manualmente pela interface do
  GitHub, ou use GitHub Actions com secrets para gerar o arquivo no
  deploy.
- O botão **Backup** dentro do painel continua funcionando: exporta e
  importa um `.json` com todos os dados, independente do Supabase.
