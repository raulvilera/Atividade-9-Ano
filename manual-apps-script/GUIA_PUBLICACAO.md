# Publicação do endpoint de respostas

Este pacote contém um endpoint completo para registrar a atividade do 9º Ano A na planilha Google Sheets. A implementação usa as 12 questões da atividade publicada e cria três abas: `Respostas`, `Aprendizagens` e `Dashboard`.

## O que o script faz

Ao receber o JSON enviado pelo botão **enviar respostas**, o script registra a identificação do aluno, as 12 respostas, o gabarito, o status de cada questão, a nota, o percentual e as aprendizagens atingidas ou não atingidas.

As respostas corretas são destacadas em azul claro; as incorretas, em vermelho claro; e as não respondidas permanecem brancas. A aba `Aprendizagens` mantém o código, a aprendizagem essencial e a alternativa correta de cada questão.

A aba `Dashboard` possui uma lista suspensa em `B2`. Ao selecionar um aluno, ela exibe nome, RA, série, acertos, nota, percentual, o resultado questão por questão e as aprendizagens atingidas e não atingidas.

## Configuração

Abra a planilha com a sua conta Google e acesse **Extensões → Apps Script**. Apague o conteúdo inicial de `Code.gs` e cole integralmente o conteúdo de `manual-apps-script/Code.gs`.

O ID da planilha já está configurado no código como `1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno`. Se o script for usado em outra planilha, altere somente `CONFIG.spreadsheetId`.

Salve o projeto e execute manualmente a função `setupWorkbook()` uma única vez. Autorize o acesso solicitado pelo Google. Essa função prepara os cabeçalhos, os filtros, a formatação, a aba de aprendizagens e o dashboard.

## Implantação como aplicação web

No Apps Script, escolha **Implantar → Nova implantação**. Selecione **Aplicação Web**. Em **Executar como**, use a sua conta proprietária da planilha. Em **Quem tem acesso**, selecione a opção permitida pela política da escola que possibilite aos alunos acessarem o formulário sem autenticação. Para uma página pública sem login, normalmente é necessário permitir acesso anônimo.

Conclua a autorização e copie o endereço que termina em `/exec`. Não use o endereço `/dev`.

A atividade do repositório já está preparada para enviar um `POST` em JSON. Se quiser substituir o endpoint configurado no front-end, defina `VITE_SHEETS_ENDPOINT` no ambiente de compilação ou ajuste o valor público em `client/src/lib/submission.ts`.

## Teste recomendado

Antes de enviar o link aos alunos, abra a atividade, selecione um aluno de teste e envie uma resposta de teste. Verifique se uma nova linha aparece em `Respostas`, se as cores foram aplicadas, se a aba `Dashboard` mostra o aluno e se o filtro em `B2` exibe as 12 questões.

## Observações de segurança e privacidade

Como o repositório é público, evite colocar senhas, tokens ou dados pessoais desnecessários no código. O endpoint de Apps Script deve permanecer protegido pelas permissões da conta Google e pela política da escola. A planilha deve ser compartilhada apenas com as pessoas autorizadas.

## Referências

[1] [Apps Script — Aplicações Web](https://developers.google.com/apps-script/guides/web)

[2] [Apps Script — ContentService](https://developers.google.com/apps-script/reference/content/content-service)

[3] [Apps Script — SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
