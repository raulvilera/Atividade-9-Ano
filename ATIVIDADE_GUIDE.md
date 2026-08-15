# Guia de aplicação — Evolução e Biodiversidade

## Público e alinhamento

Esta atividade destina-se ao **9.º Ano A — 3.º Bimestre** da E.E. POFª Wanda Mascagni de Sá. O percurso trabalha a **AE10 — Analisar a evolução e a diversidade das espécies, considerando evidências científicas e processos que explicam a biodiversidade**, em articulação com EF09CI10 e EF09CI11, a partir das aulas 1, 2, 3 e 4 do escopo-sequência do Guia Priorizado.

## Como o aluno utiliza

O aluno começa por selecionar o próprio nome na lista suspensa. O sistema mostra automaticamente série, número, RA, dígito, e-mail institucional e situação do aluno. Em seguida, assiste ao vídeo integrado e percorre 12 pistas organizadas por aula. Cada pista combina interpretação com um objeto de evidência: gráfico, simulador, cladograma, tabela, linha do tempo, imagem fóssil, dados genéticos, mapa conceitual ou mapa de populações.

Ao final, o aluno envia as respostas. O feedback é formativo: além do resultado, a página explica por que a interpretação é consistente ou que hipótese precisa de revisão. O progresso, o estado do vídeo e o resultado ficam visíveis no próprio percurso.

## Como o professor utiliza

A aplicação pode ser feita individualmente em computador ou telemóvel. Recomenda-se reservar um primeiro momento para a exibição do vídeo e um segundo momento para a leitura das evidências. A turma pode discutir as questões 2, 4, 7 e 10 coletivamente, pois elas explicitam as relações entre isolamento, cladogramas, história da ciência e seleção natural.

## Evidências reais e fidelidade visual

Os módulos agora combinam fotografia e documentação visual reais com diagramas didáticos. O simulador usa uma imagem real de um organismo da família Geometridae; o cladograma é contextualizado com uma prancha histórica de tentilhões de Darwin; a tabela de estruturas compara uma imagem de homologia vertebrada com um esqueleto de baleia; e a questão de fósseis usa uma fotografia de um molde de Tiktaalik roseae. Cada ativo tem texto alternativo, legenda e crédito. Os gráficos que apresentam percentagens hipotéticas continuam identificados como modelos didáticos, para não confundir uma representação de aula com uma medição científica.

## Dados da turma

O ficheiro `Alunos(43).csv` contém 45 linhas e 43 nomes únicos, pois o nome **MATHEUS TURCHETTO** aparece três vezes com os mesmos dados. O dropdown utiliza os 43 nomes únicos e preserva os campos do registo. Nos casos repetidos, o gerador prefere o registo marcado como **Ativo** quando essa situação existe.

## Folha de cálculo

A aba **`9ºAno A (3ºBimestre)`** foi criada na folha indicada pelo utilizador e recebeu 23 colunas. A página está preparada para enviar os dados por uma variável de ambiente `VITE_SHEETS_ENDPOINT`. O endpoint Apps Script incluído em `google-apps-script/Code.gs` escreve a identificação, as respostas, os acertos, a nota, a situação e um feedback sintético.

O endpoint pinta a resposta correta em **azul claro** e a resposta incorreta em **vermelho claro** diretamente na linha de cada aluno. Células sem resposta permanecem brancas. Os comandos e os passos de publicação encontram-se em `GOOGLE_SHEETS_SETUP.md`.

## Verificação técnica

O projeto foi validado com `pnpm check` e `pnpm build`. A pré-visualização foi observada em desktop e telemóvel. O vídeo está armazenado como ativo persistente do projeto; as imagens editoriais geradas possuem URLs persistentes fornecidas pelo ambiente web.
