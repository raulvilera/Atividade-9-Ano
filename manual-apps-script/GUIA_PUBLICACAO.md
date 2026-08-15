# Publicação do endpoint de respostas

Este pacote cria um endpoint para registrar as respostas da atividade na aba **`9ºAno A (3ºBimestre)`** da planilha. O script calcula os acertos e a nota; em cada coluna Q1–Q12, pinta uma resposta correta de azul e uma incorreta de vermelho.

> O código usa o ID da planilha já configurado. Não altere `SPREADSHEET_ID`, `SHEET_NAME` ou o gabarito, a menos que a atividade também seja alterada.

## 1. Criar o projeto ligado à planilha

Abra a planilha de respostas com a sua conta Google e aceda a **Extensões → Apps Script**. Elimine o conteúdo inicial do ficheiro `Code.gs` e cole integralmente o conteúdo do ficheiro `Code.gs` deste pacote.

No painel de definições do projeto, habilite a visualização do ficheiro de manifesto `appsscript.json`. Substitua o seu conteúdo pelo manifesto deste pacote e guarde todos os ficheiros.

## 2. Publicar como Aplicação Web

No canto superior direito do Apps Script, escolha **Implantar → Nova implantação**. Selecione o tipo **Aplicação Web** e use uma descrição, por exemplo, `Registro de respostas — 9º Ano A`.

Defina **Executar como** a sua própria conta, pois é ela que possui permissão de escrita na planilha. Em **Quem tem acesso**, escolha a opção mais ampla que a política da sua escola permitir para os alunos acessarem a atividade. Para um site estático sem login, a opção equivalente a **Qualquer pessoa** é a necessária; se ela não estiver disponível, solicite à administração da escola uma alternativa autorizada.

Clique em **Implantar** e conclua a autorização pedida pelo Google. Copie o URL gerado que termina em **`/exec`**. Não use o URL que termina em `/dev`.

## 3. Enviar o URL para configuração da atividade

Envie o URL `/exec` nesta conversa. Ele será configurado como `VITE_SHEETS_ENDPOINT` na atividade. A cada envio final de aluno, a página fará um `POST` JSON para o endpoint e uma nova linha será escrita na planilha.

## 4. Verificar o resultado

Após a configuração da atividade, realize um envio de teste com dados fictícios. A aba deve receber Data/Hora, identificação, Q1–Q12, Acertos, Nota, Situação e Feedback. As alternativas corretas devem ficar azuis (`#b8dcf0`) e as incorretas vermelhas (`#ffd5d0`).

## Privacidade

Não publique a lista de alunos, RA, dígitos ou e-mails institucionais num repositório público. O endpoint recebe apenas os dados que a página enviar. A versão pública da atividade deve usar identificação inserida pelo aluno ou uma fonte autenticada, em vez de incorporar a lista da turma no código.

## Referências

[1] [Apps Script: publicar uma aplicação Web](https://developers.google.com/apps-script/guides/web)

[2] [Apps Script: `ContentService`](https://developers.google.com/apps-script/reference/content/content-service)

[3] [Apps Script: `SpreadsheetApp`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
