# Evolução e Biodiversidade — 9.º Ano A

Atividade interativa de Ciências sobre evolução, seleção natural, especiação, cladogramas, fósseis e biodiversidade. A interface contém vídeo, questões contextualizadas, gráfico, tabela, simulador, mapas conceituais, linha do tempo e evidências visuais reais.

## Publicação

O repositório está preparado para GitHub Pages. Em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação. O fluxo em `.github/workflows/deploy-pages.yml` faz a compilação a cada envio para `main`.

## Google Sheets

Após corrigir/publicar o Apps Script, crie a variável do repositório `VITE_SHEETS_ENDPOINT` em **Settings → Secrets and variables → Actions → Variables** com o URL `/exec`. O próximo envio a `main` incorporará o endpoint no site.

> A aplicação está publicada em repositório público. Por isso, ela não inclui nome, RA, dígito ou e-mail institucional de estudantes. Cada aluno preenche a identificação manualmente; o endpoint Apps Script registra a resposta na planilha.

## Desenvolvimento

`pnpm install`

`pnpm dev`

`pnpm exec vite build`

## Recursos

Os créditos e as licenças das evidências visuais estão em `real_evidence_sources.md`. O código e o roteiro do endpoint estão em `manual-apps-script/`.
