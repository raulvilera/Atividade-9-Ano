# Google Apps Script — Atividade de Ciências

## 1. Preparação

Abra a planilha da atividade e acesse **Extensões → Apps Script**. Apague o conteúdo existente do editor e cole o conteúdo do arquivo `Code.gs`.

Confirme se o ID da planilha no objeto `CONFIG` é o mesmo da sua planilha. O código já está configurado para o ID informado: `1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno`.

## 2. Primeira execução

Salve o projeto e execute a função `setupWorkbook`. Na primeira execução, o Google solicitará autorização. Conceda as permissões para o projeto acessar e editar a planilha.

A função cria ou reorganiza três abas: `Respostas`, `Aprendizagens` e `Dashboard`. Execute-a novamente somente se desejar recriar a estrutura dessas abas.

## 3. Implantação como Aplicação Web

No Apps Script, selecione **Implantar → Nova implantação**. Escolha o tipo **Aplicativo da Web**, defina **Executar como: Eu** e selecione a política de acesso adequada à escola. Para uma atividade enviada por link sem login dos alunos, a implantação normalmente precisa aceitar usuários que tenham o link, conforme a política da conta institucional.

Copie a URL que termina em `/exec`. Essa URL deve ser usada no front-end da atividade. Não use a URL de teste que termina em `/dev`.

## 4. Funcionamento das abas

A aba `Respostas` registra cada envio em uma nova linha. As questões 1 a 7 são corrigidas automaticamente com o gabarito do arquivo. As questões 8 a 10 são dissertativas e aparecem como **Recebida — correção manual**, pois uma resposta aberta não deve ser classificada automaticamente sem avaliação docente.

As respostas corretas ficam em azul, as incorretas em vermelho, as dissertativas recebidas em amarelo e as questões não respondidas em branco. A aba `Aprendizagens` documenta a habilidade e a aprendizagem essencial associada a cada questão.

Na aba `Dashboard`, a célula `B2` contém um filtro com os nomes dos alunos. Ao escolher um aluno, o painel mostra nome, RA, série, acertos, nota, percentual, resultado questão por questão, aprendizagens atingidas, aprendizagens essenciais não atingidas e dissertativas aguardando correção manual.

## 5. Teste do endpoint

Depois da implantação, abra a URL `/exec` no navegador. Ela deve retornar um JSON com `ok: true` e a mensagem `Endpoint de respostas disponível.`. Em seguida, faça um envio real de teste pela atividade e confirme se uma nova linha apareceu na aba `Respostas`.

## 6. Observação sobre o gabarito

O gabarito utilizado é: **Q1 B, Q2 B, Q3 C, Q4 B, Q5 A, Q6 A e Q7 B**. As questões 8, 9 e 10 são dissertativas e ficam pendentes de correção manual.
