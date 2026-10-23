import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { filterSales, summarize } from '../demos/vendas/logic.mjs';

const csv = fs.readFileSync(new URL('../demos/vendas/vendas.csv', import.meta.url),'utf8').trim().split(/\r?\n/);
const keys = csv.shift().split(',');
const rows = csv.map(line=>{
  const row = Object.fromEntries(line.split(',').map((value,index)=>[keys[index],value]));
  for (const key of ['pedido_id','quantidade','preco_unitario']) row[key] = Number(row[key]);
  return row;
});

test('os indicadores conferem com os seis pedidos do CSV',()=>{
  const total = summarize(rows);
  assert.equal(total.revenue,1500);
  assert.equal(total.orders,6);
  assert.equal(total.ticket,250);
  assert.equal(total.units,80);
  assert.deepEqual(total.monthly.map(m=>m.total),[300,600,600]);
});
test('mês e categoria são combinados no mesmo filtro',()=>{
  const selected = filterSales(rows,'2026-02','Papelaria');
  assert.equal(selected.length,1);
  assert.equal(summarize(selected).revenue,300);
  assert.equal(summarize(filterSales(rows,'','Acessorios')).revenue,750);
});
test('uma combinação sem pedidos produz zeros e ticket indefinido',()=>{
  const selected = filterSales(rows,'2026-01','Acessorios');
  const result = summarize(selected);
  assert.equal(result.revenue,0);
  assert.equal(result.orders,0);
  assert.equal(result.ticket,null);
  assert.equal(result.units,0);
  assert.deepEqual(result.monthly.map(m=>m.total),[0,0,0]);
});
test('a soma monetária usa centavos para evitar erros de ponto flutuante',()=>{
  const result = summarize([{pedido_id:1,data:'2026-01-01',quantidade:3,preco_unitario:0.1},{pedido_id:2,data:'2026-01-02',quantidade:1,preco_unitario:0.2}]);
  assert.equal(result.revenue,0.5);
  assert.equal(result.ticket,0.25);
});
