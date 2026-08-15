# Direção visual — Evolução e Biodiversidade

## Três abordagens consideradas

### Abordagem 1

**Theme Name:** Caderno de Campo Editorial

**Very Brief Intro:** Uma experiência de Ciências com linguagem de caderno de campo, combinando papel mineral, diagramas precisos e apontamentos de observação. A interface deve fazer o estudante sentir que está a investigar evidências, não apenas a responder a um questionário.

**Probability:** 0.073

### Abordagem 2

**Theme Name:** Laboratório de Dados Vivos

**Very Brief Intro:** Um laboratório digital luminoso, com cartões modulares, gráficos e pistas visuais que se reorganizam conforme o estudante formula hipóteses. A emoção dominante é a descoberta orientada por dados.

**Probability:** 0.041

### Abordagem 3

**Theme Name:** Atlas de Linhagens

**Very Brief Intro:** Um atlas narrativo que usa mapas, linhas do tempo e trilhos de parentesco para transformar a sequência de aulas numa expedição pela história da vida. A sensação é de navegação e construção de uma explicação.

**Probability:** 0.086

## Abordagem escolhida: Caderno de Campo Editorial

### Design Movement

Editorial científico contemporâneo com referências ao design de livros de campo, ao modernismo suíço e a materiais de laboratório: composição assimétrica, regras finas, etiquetas de espécime, áreas de anotação e dados com escala explícita.

### Core Principles

1. **Evidência antes da resposta:** cada questão começa com um vestígio — gráfico, cladograma, mapa, tabela, linha do tempo, recorte de vídeo ou infográfico — e só depois pede interpretação.
2. **Clareza investigativa:** o estudante deve distinguir observação, hipótese, evidência e conclusão através de microcopy e estados visuais, sem excesso de ornamento.
3. **Ritmo de caderno:** alternar blocos densos e espaços de respiração, usando uma régua vertical de aulas e marcadores que mostrem o progresso.
4. **Precisão acessível:** gráficos e simuladores devem ser visualmente envolventes, mas numericamente coerentes, legíveis e explicados em linguagem adequada ao 9.º ano.

### Color Philosophy

O fundo marfim sugere papel de observação e reduz o cansaço visual. O verde profundo remete à biodiversidade e funciona como cor de confiança. O azul-petróleo indica evidência e leitura científica. O amarelo-ocre destaca hipóteses e pistas, enquanto o coral reservado sinaliza erro ou revisão sem transformar a avaliação num ambiente punitivo. A paleta deve parecer natural, táctil e editorial; não usar gradientes roxos ou estética neon.

### Layout Paradigm

Uma coluna lateral estreita funciona como **régua de investigação**: vídeo, aulas 1–4, síntese e envio. O conteúdo principal alterna uma faixa introdutória ampla com módulos de investigação de largura variável. Questões de gráfico e tabela ocupam mais espaço horizontal; questões de interpretação e simulador usam cartões em duas colunas. O resultado evita uma grelha centralizada uniforme e dá aos dados a largura de que precisam.

### Signature Elements

1. **Marcador de espécime:** pequenas etiquetas em caixa alta com número da aula, habilidade e tipo de evidência.
2. **Régua evolutiva:** linha vertical com pontos de progresso que se transformam em folhas estilizadas quando uma aula é concluída.
3. **Carimbo de análise:** feedback que aparece como uma anotação editorial curta — “evidência consistente”, “rever hipótese” — em vez de apenas “certo/errado”.

### Interaction Philosophy

As interações devem parecer gestos de investigação: selecionar uma hipótese, arrastar uma espécie para um ramo, ajustar uma pressão seletiva, revelar um dado ou comparar dois modelos. O sistema não deve interromper o raciocínio com feedback imediato excessivo; após cada bloco, revela a leitura orientadora e permite voltar à evidência.

### Animation

As entradas usam deslocamento curto e opacidade, com duração entre 180 e 260 ms, como uma página que assenta no caderno. Os pontos da régua evolutiva recebem um pulso único quando uma aula é concluída. No simulador, apenas os elementos alterados devem se mover. O botão de envio usa uma compressão de 0,97 no clique. Todos os movimentos não essenciais ficam desativados para `prefers-reduced-motion`.

### Typography System

Usar **Fraunces** para títulos, números de aula e chamadas editoriais; usar **IBM Plex Sans** para corpo, tabelas, opções de resposta e instruções. Títulos grandes com peso 650–750, corpo entre 16 e 18 px em desktop, rótulos em 11–12 px com espaçamento de letras e caixa alta. O texto deve ter linhas curtas e hierarquia explícita, sem usar Inter.

### Brand Essence

**Posicionamento:** uma atividade de Ciências para estudantes do 9.º ano que transforma evidências evolutivas em decisões interpretativas, ligando o vídeo às quatro primeiras aulas do 3.º bimestre.

**Personalidade:** investigativa, rigorosa, encorajadora.

### Brand Voice

As manchetes devem convidar a observar e justificar, não apenas a acertar. Os CTAs devem ser verbos de investigação; o microcopy deve reconhecer o esforço e indicar o próximo passo.

**Exemplo de linha 1:** “Toda adaptação deixa uma pista. O que este conjunto de dados permite afirmar?”

**Exemplo de linha 2:** “Regista a tua hipótese e volta à evidência antes de concluir.”

### Wordmark & Logo

O símbolo é uma folha de samambaia construída a partir de quatro pequenos nós ligados por uma linha evolutiva. O nó inferior é um ponto de observação; os três superiores abrem-se como ramos divergentes. O wordmark usa “EVO / CAMPO” em Fraunces com uma barra vertical verde entre as palavras; a marca gráfica sem texto será usada no cabeçalho e no favicon.

### Signature Brand Color

**Verde clorofila — `#177E69`**. É a cor proprietária da experiência: representa vida em transformação e orienta os estados de progresso, sem substituir o azul-petróleo usado para evidências.

## Decisões de implementação

O conteúdo será implementado como uma página React responsiva, com componentes semânticos, SVGs determinísticos para os gráficos, cladograma, linha do tempo e infográficos, além de um simulador simples de seleção natural. O vídeo fornecido será apresentado na própria atividade. A interface não exporá a lista de estudantes no código; o aluno preencherá a sua identificação no início e a submissão enviará os dados para o endpoint configurável de registo.

## Style Decisions

- Cada bloco de investigação deve apresentar o objeto de evidência antes das opções de resposta.
- As opções são compactadas em escolhas de campo de nota no desktop e voltam a uma coluna no telemóvel.
- A marca EVO / CAMPO e o símbolo de samambaia aparecem no cabeçalho, nos separadores das aulas e no fecho da atividade, usando `#177E69` como cor de identidade.

## Fontes pedagógicas utilizadas

- Guia do Currículo Priorizado — Ciências, Ensino Fundamental Anos Finais, arquivo fornecido pelo utilizador.
- Vídeo fornecido pelo utilizador: “Teorias Evolucionistas — Entenda as Bases da Evolução”.
