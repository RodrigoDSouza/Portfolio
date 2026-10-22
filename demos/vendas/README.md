# Análise de vendas — demonstração

Dados inteiramente fictícios, criados para mostrar uma entrega pequena de análise de vendas. Não são dados do ICMBio nem resultados de clientes.

## Problema e entrega

Uma loja quer acompanhar vendas mensais, produtos e ticket médio a partir de uma planilha.
O arquivo [vendas.csv](vendas.csv) contém seis pedidos, um produto por pedido, sem descontos, devoluções ou frete.
Este material é uma base e um roteiro; ainda não inclui arquivo PBIX, captura de dashboard ou vídeo.

## Montar no Power BI Desktop

1. Importe o CSV como UTF-8, separado por vírgula.
2. Defina `data` como Data, quantidade como inteiro e preço como decimal usando a localidade Inglês (Estados Unidos), pois o CSV usa ponto decimal.
3. Crie as medidas abaixo na tabela `vendas`.
4. Monte três cartões (faturamento, pedidos e ticket médio), uma evolução mensal e um gráfico de faturamento por produto.
5. Adicione filtros de data e categoria. Confira os totais antes de apresentar.

```dax
Faturamento = SUMX(vendas, vendas[quantidade] * vendas[preco_unitario])
Pedidos = DISTINCTCOUNT(vendas[pedido_id])
Ticket Medio = DIVIDE([Faturamento], [Pedidos])
Unidades = SUM(vendas[quantidade])
```

A separação dos argumentos pode variar conforme a configuração regional do Power BI.
Faturamento significa valor bruto vendido nesta base, não lucro ou recebimento.

## Valores para conferência

| Indicador | Valor |
| --- | ---: |
| Faturamento | R$ 1.500,00 |
| Pedidos | 6 |
| Ticket médio | R$ 250,00 |
| Unidades | 80 |
| Janeiro | R$ 300,00 |
| Fevereiro | R$ 600,00 |
| Março | R$ 600,00 |

## Padrão visual

Fundo claro, uma cor principal, títulos que expliquem a medida e valores monetários em reais.
Priorize leitura e consistência. O faturamento por produto deve somar o faturamento total.
