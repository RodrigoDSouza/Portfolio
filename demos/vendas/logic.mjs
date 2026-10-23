export const months = [
  {value:'2026-01',label:'Janeiro'},
  {value:'2026-02',label:'Fevereiro'},
  {value:'2026-03',label:'Março'}
];
export const formatMoney = value => new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(value);
export function filterSales(rows, month = '', category = '') {
  return rows.filter(row => (!month || row.data.startsWith(month)) && (!category || row.categoria === category));
}
export function summarize(rows) {
  // A base utiliza uma linha por pedido e preços em centavos para somas exatas.
  const revenueCents = rows.reduce((total,row) => total + row.quantidade * Math.round(row.preco_unitario * 100), 0);
  const orders = new Set(rows.map(row=>row.pedido_id)).size;
  return {
    revenue: revenueCents / 100,
    orders,
    ticket: orders ? revenueCents / 100 / orders : null,
    units: rows.reduce((total,row)=>total+row.quantidade,0),
    monthly: months.map(month=>({...month,total: rows.filter(row=>row.data.startsWith(month.value)).reduce((total,row)=>total + row.quantidade * Math.round(row.preco_unitario * 100),0)/100}))
  };
}

