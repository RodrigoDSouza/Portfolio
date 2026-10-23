import { filterSales, summarize, formatMoney } from './logic.mjs';
const rows = JSON.parse(document.getElementById('sales-data').textContent);
const form = document.querySelector('.demo-filters');
const month = document.getElementById('month');
const category = document.getElementById('category');
const tbody = document.getElementById('sales-rows');
const empty = document.getElementById('empty-state');
const ns = 'http://www.w3.org/2000/svg';
function svgNode(tag, attrs, text) {
  const node = document.createElementNS(ns,tag);
  for (const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
  if (text !== undefined) node.textContent = text;
  return node;
}
function drawChart(summary) {
  const svg = svgNode('svg',{viewBox:'0 0 640 245',role:'img','aria-labelledby':'monthly-title monthly-description'});
  const title = svgNode('title',{id:'monthly-title'},'Faturamento mensal dos pedidos filtrados');
  const description = svgNode('desc',{id:'monthly-description'},summary.monthly.map(m=>m.label+': '+formatMoney(m.total)).join('. '));
  svg.append(title,description);
  const max = Math.max(600,...summary.monthly.map(m=>m.total));
  for (let index=0;index<3;index++) {
    const y = 45+index*75;
    svg.append(svgNode('path',{d:'M90 '+y+'H625',fill:'none',stroke:'#dce3dd'}));
    svg.append(svgNode('text',{x:0,y:y+5,fill:'#52645d','font-family':'Arial, sans-serif','font-size':14},formatMoney(max*(1-index/2))));
  }
  summary.monthly.forEach((m,index)=>{
    const x=140+index*175, height=m.total/max*150;
    svg.append(svgNode('rect',{x,y:195-height,width:70,height,rx:4,fill:['#658650','#aac98b','#254b41'][index]}));
    svg.append(svgNode('text',{x:x+35,y:185-height,'text-anchor':'middle',fill:'#173439','font-family':'Arial, sans-serif','font-size':15},formatMoney(m.total)));
    svg.append(svgNode('text',{x:x+35,y:225,'text-anchor':'middle',fill:'#52645d','font-family':'Arial, sans-serif','font-size':14},m.label));
  });
  document.getElementById('monthly-chart').replaceChildren(svg);
}
function update() {
  const selected = filterSales(rows,month.value,category.value);
  const result = summarize(selected);
  document.getElementById('revenue').textContent = formatMoney(result.revenue);
  document.getElementById('orders').textContent = result.orders;
  document.getElementById('ticket').textContent = result.ticket === null ? '—' : formatMoney(result.ticket);
  document.getElementById('units').textContent = result.units;
  document.getElementById('filter-status').textContent = result.orders+' '+(result.orders===1?'pedido encontrado. ':'pedidos encontrados. ')+month.selectedOptions[0].textContent+' · '+category.selectedOptions[0].textContent+'.';
  tbody.replaceChildren();
  for (const row of selected) {
    const tr = document.createElement('tr');
    const values = [row.pedido_id,row.data.slice(8)+'/'+row.data.slice(5,7)+'/'+row.data.slice(0,4),row.produto,row.categoria==='Acessorios'?'Acessórios':row.categoria,row.quantidade,formatMoney(row.preco_unitario),formatMoney(row.quantidade*row.preco_unitario)];
    values.forEach((value,index)=>{
      const td=document.createElement('td');
      td.textContent=value;
      if(index>=4)td.className='numeric';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  empty.hidden = selected.length > 0;
  drawChart(result);
}
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('change',update);
form.addEventListener('reset',()=>{month.value='';category.value='';update();});
update();
form.hidden = false;

