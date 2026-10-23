# Rodrigo Duarte — Dados e Automação

Portfólio profissional com foco em Power BI, SQL/PostgreSQL, automações com Python e consumo e testes de APIs com Postman.

[Portfólio](https://rodrigodsouza.github.io/Portfolio/) · [Demonstração de vendas](https://rodrigodsouza.github.io/Portfolio/demos/vendas/) · [LinkedIn](https://www.linkedin.com/in/rodrigo-duarte-08a3001a2/) · [GitHub](https://github.com/RodrigoDSouza)

## Projetos em destaque

| Projeto | O que demonstra |
| --- | --- |
| [Análise de vendas](demos/vendas/README.md) | Indicadores, filtros, tabela e cálculos com dados fictícios |
| [Futebol Analytics](https://github.com/RodrigoDSouza/futebol-analytics) | Integração de fontes, armazenamento e análise estatística |
| [API de Gestão de Pedidos](https://github.com/RodrigoDSouza/rest) | Backend Python e organização em camadas |

Projetos de estudo e demonstrações são identificados. Materiais privados do trabalho não são publicados aqui.

## Executar localmente

Na raiz do repositório:

```bash
python -m http.server 5500
```

Abra http://localhost:5500. O conteúdo principal está no HTML e pode ser lido sem JavaScript. Os filtros da demonstração exigem JavaScript.

## Atualizar e conferir

Requer Node.js 22 ou superior, sem dependências npm:

```bash
node scripts/build.mjs
node --test tests/*.test.mjs
node scripts/build.mjs --check
```

- Edite `data.json` para atualizar o perfil, a experiência, as competências e os projetos.
- Edite `templates/index.html` ou `templates/vendas.html` para alterar a estrutura.
- Edite `styles.css` e `demos/vendas/demo.css` para alterar os estilos.
- Após mudar dados ou templates, gere novamente os arquivos HTML e inclua-os no commit.

O comando `--check` detecta HTML desatualizado. O workflow de validação executa os testes dos cálculos e essa conferência a cada push e pull request; a publicação continua sob a configuração do GitHub Pages.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Página gerada, pronta para GitHub Pages |
| `templates/` | Estrutura das páginas |
| `scripts/build.mjs` | Geração do HTML e conferência de consistência |
| `data.json` | Conteúdo profissional |
| `styles.css` | Identidade visual e adaptação às telas |
| `script.js` | Melhorias opcionais de interface |
| `assets/icons/` | SVGs locais e atribuição das fontes |
| `demos/vendas/` | Exemplo interativo, CSV e roteiro de Power BI |
| `tests/sales.test.mjs` | Conferência dos cálculos e filtros |

## GitHub Pages

A publicação pode utilizar a branch `main` e a pasta raiz em Settings → Pages.
Como os arquivos finais estão versionados, o site não exige um processo de build no servidor.
O endereço fica disponível após a conclusão da publicação.

## Contato

[Conversar pelo LinkedIn](https://www.linkedin.com/in/rodrigo-duarte-08a3001a2/)

