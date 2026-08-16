# Evolução e Biodiversidade — 9.º Ano A

Atividade interativa de Ciências sobre evolução, seleção natural, especiação, cladogramas, fósseis e biodiversidade. A interface contém vídeo, questões contextualizadas, gráfico, tabela, simulador, mapas conceituais, linha do tempo e evidências visuais reais.

## Publicação

O repositório está preparado para GitHub Pages. Em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação. O fluxo em `.github/workflows/deploy-pages.yml` faz a compilação a cada envio para `main`.

## Google Sheets

A pasta `manual-apps-script/` contém a implementação completa do endpoint. A função `setupWorkbook()` prepara as abas `Respostas`, `Aprendizagens` e `Dashboard`; a função `doPost(e)` recebe o JSON enviado pela atividade, corrige as 12 questões, colore as respostas corretas em azul e as incorretas em vermelho e registra as aprendizagens atingidas e não atingidas. O filtro de aluno fica na célula `Dashboard!B2`.

Depois de colar `manual-apps-script/Code.gs` no Apps Script vinculado à planilha, execute `setupWorkbook()` uma vez, publique como Aplicação Web e configure a atividade com o URL que termina em `/exec`. O passo a passo completo está em `manual-apps-script/GUIA_PUBLICACAO.md`.

Para uma implantação que injete o endpoint durante a compilação, crie a variável do repositório `VITE_SHEETS_ENDPOINT` em **Settings → Secrets and variables → Actions → Variables** com o URL `/exec`. A atividade também mantém um endpoint público de fallback em `client/src/lib/submission.ts`, que pode ser substituído pela variável de ambiente.

> A aplicação está publicada em repositório público. Por isso, ela não deve conter senhas, tokens ou dados pessoais desnecessários de estudantes. O endpoint Apps Script registra os dados somente na planilha autorizada.

## Desenvolvimento

`pnpm install`

`pnpm dev`

`pnpm check`

`pnpm build`

## Recursos

Os créditos e as licenças das evidências visuais estão em `real_evidence_sources.md`. O código e o roteiro do endpoint estão em `manual-apps-script/`.
