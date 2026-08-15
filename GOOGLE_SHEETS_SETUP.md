# Ligação à folha de cálculo

## Estado atual

A folha indicada já recebeu a aba **`9ºAno A (3ºBimestre)`**, com os campos de identificação e resultado. A estrutura contém 23 colunas: data/hora, nome, número, série, RA, dígito, e-mail institucional, Q1–Q12, acertos, nota, situação e feedback.

O projeto inclui o ficheiro `google-apps-script/Code.gs`. Ele deve ser usado como endpoint de receção porque a atividade é uma aplicação web estática e não deve expor credenciais da folha no navegador.

## Publicar o endpoint

Abra a folha indicada e aceda a **Extensões → Apps Script**. Crie um projeto vinculado à folha, substitua o conteúdo do editor pelo conteúdo de `google-apps-script/Code.gs` e crie também o ficheiro de manifesto com o conteúdo de `google-apps-script/appsscript.json`.

Em seguida, use **Implementar → Nova implementação → Aplicação Web**. Escolha executar como a sua conta e permita acesso a qualquer pessoa que tenha o link. A primeira implementação pedirá autorização para escrever na folha. Copie o URL que termina em `/exec`.

## Ligar à atividade

Defina a variável de ambiente de compilação:

```bash
VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/SEU_ID/exec
```

Depois de atualizar esta variável no projeto, reinicie o servidor de desenvolvimento ou gere uma nova versão. Sem essa variável, a atividade continua a funcionar em modo local e guarda a última submissão no navegador; com ela, cada envio acrescenta uma linha à aba indicada.

## Cores do registo

O endpoint calcula a correção com o gabarito incorporado e pinta cada resposta na linha criada. **Azul claro** representa resposta correta; **vermelho claro** representa resposta incorreta; células sem resposta permanecem brancas. A função `formatExistingRows()` pode ser executada manualmente no Apps Script para reaplicar as cores a linhas antigas.

## Privacidade

O dropdown usa os 43 nomes únicos presentes no CSV fornecido. O projeto mantém série, número, RA, dígito e e-mail no preenchimento automático, mas os campos são somente leitura para evitar alterações acidentais. O URL da aplicação web deve ser partilhado apenas com a turma e com a equipa escolar autorizada.
