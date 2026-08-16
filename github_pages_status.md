# Estado da publicação GitHub Pages

O GitHub Pages inicialmente exibiu o `README.md` porque o repositório usa a fonte legada `main`/raiz. A versão compilada foi então copiada para a raiz e a implantação automática terminou com sucesso.

O endereço público passou a carregar a aplicação React, mas a interface exibiu a página interna `404`. A causa é a navegação de rotas de uma aplicação que, por requisito, tem apenas uma página e é servida sob o prefixo `/Atividade-9-Ano/`. A correção adotada será remover a rota de fallback e renderizar a página única diretamente, eliminando a dependência de base path para a atividade.
