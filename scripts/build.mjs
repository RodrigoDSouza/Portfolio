import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarize, formatMoney } from '../demos/vendas/logic.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const data = JSON.parse(read('data.json'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = value => {
  if (typeof value !== 'string') return '';
  if (/^https:\/\//.test(value)) return esc(value);
  if (/^(?:assets|demos)\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..')) return esc(value);
  throw new Error('URL não permitida: ' + value);
};
const external = url => url.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : '';
const iconMap = {'Power BI':'powerbi',DAX:'dax',SQL:'sql',PostgreSQL:'postgresql','Modelagem de Dados':'modelagem',Python:'python',pandas:'pandas','APIs REST':'api',Django:'django',FastAPI:'fastapi',Git:'git',Docker:'docker','Power Apps':'powerapps','Power Automate':'powerautomate',Postman:'postman'};
const covers = {
  football:'<div class="field"></div>',
  sales:'<div class="mini-bars"><i></i><i></i><i></i></div>',
  api:'<div class="code-window"><strong>GET</strong> /pedidos<br>{ "status": "ok" }<br><strong>Python</strong> / FastAPI</div>'
};
const labels = {football:'DADOS & ESTATÍSTICA',sales:'INDICADORES & VISUALIZAÇÃO',api:'BACKEND & INTEGRAÇÕES'};
const projects = data.projects.map(p => {
  const kind = covers[p.kind] ? p.kind : 'api';
  return `<article class="project-card">
<div class="project-cover cover-${kind}" aria-hidden="true"><span class="cover-label">${labels[kind]}</span>${covers[kind]}<span class="cover-caption">ILUSTRAÇÃO DO PROJETO</span></div>
<div class="project-body"><span class="project-index">${esc(p.status)}</span><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p>
<div class="chips">${p.tags.map(t=>'<span class="chip">'+esc(t)+'</span>').join('')}</div>
<a class="text-link" href="${safeUrl(p.link)}"${external(p.link)} aria-label="${esc(p.linkLabel + ': ' + p.name)}">${esc(p.linkLabel)} <span aria-hidden="true">↗</span></a>
${p.source ? '<a class="source-link" href="'+safeUrl(p.source)+'"'+external(p.source)+'>Ver dados e roteiro no GitHub ↗</a>' : ''}
</div></article>`;
}).join('\n');
const values = {
  PROJECTS: projects,
  ABOUT: data.about.map(p=>'<p>'+esc(p)+'</p>').join('\n'),
  LINKS: Object.entries(data.links).map(([key,url])=>'<a href="'+safeUrl(url)+'"'+external(url)+'>'+esc(key === 'github' ? 'GitHub' : 'LinkedIn')+' ↗</a>').join('\n'),
  EXPERIENCE: data.experience.map(e=>'<li><h3 class="title">'+esc(e.role)+' — '+esc(e.company)+'</h3><p class="period">'+esc(e.period)+' · '+esc(e.location)+'</p><ul>'+e.highlights.map(h=>'<li>'+esc(h)+'</li>').join('')+'</ul></li>').join('\n'),
  SKILLS: data.skills.map(s=>{
    const icon = iconMap[s];
    if (icon && !fs.existsSync(path.join(root,'assets/icons/'+icon+'.svg'))) throw new Error('Ícone ausente: '+s);
    return '<div class="skill-tile">'+(icon ? '<img src="assets/icons/'+icon+'.svg" alt="" width="28" height="28" loading="lazy" decoding="async">' : '')+'<span>'+esc(s)+'</span></div>';
  }).join('\n'),
  CERTIFICATES: [...data.certificates].sort((a,b)=>a.date.split('/').reverse().join('').localeCompare(b.date.split('/').reverse().join('')) * -1).map(c=>'<article class="card"><h3 class="title">'+esc(c.name)+'</h3><p class="period">'+esc(c.issuer)+' · '+esc(c.date)+'</p></article>').join('\n'),
  YEAR: '2026',
  CONTACT_URL: safeUrl(data.links.linkedin)
};
const render = template => template.replace(/\{\{([A-Z_]+)\}\}/g, (_,key)=>{
  if (!(key in values)) throw new Error('Campo desconhecido: '+key);
  return values[key];
});
const csvLines = read('demos/vendas/vendas.csv').trim().split(/\r?\n/);
const columns = csvLines.shift().split(',');
const sales = csvLines.map(line => {
  const row = Object.fromEntries(line.split(',').map((value,index)=>[columns[index],value]));
  for (const key of ['pedido_id','quantidade','preco_unitario']) row[key] = Number(row[key]);
  return row;
});
const summary = summarize(sales);
if (summary.revenue !== 1500 || summary.orders !== 6 || summary.units !== 80) throw new Error('Confira os indicadores da demonstração ao mudar o CSV.');
const demoRows = sales.map(row=>'<tr>'+[row.pedido_id,row.data.slice(8)+'/'+row.data.slice(5,7)+'/'+row.data.slice(0,4),row.produto,row.categoria==='Acessorios'?'Acessórios':row.categoria,row.quantidade,formatMoney(row.preco_unitario),formatMoney(row.quantidade*row.preco_unitario)].map((value,index)=>'<td'+(index>=4?' class="numeric"':'')+'>'+esc(value)+'</td>').join('')+'</tr>').join('\n');
const demoChart = `<svg viewBox="0 0 640 245" role="img" aria-labelledby="monthly-title monthly-description">
<title id="monthly-title">Faturamento mensal dos pedidos fictícios</title><desc id="monthly-description">Janeiro: R$ 300,00. Fevereiro: R$ 600,00. Março: R$ 600,00.</desc>
<g stroke="#dce3dd"><path d="M90 45H625M90 120H625M90 195H625"/></g>
<g fill="#52645d" font-family="Arial, sans-serif" font-size="14"><text x="0" y="50">R$ 600,00</text><text x="0" y="125">R$ 300,00</text><text x="0" y="200">R$ 0,00</text></g>
${summary.monthly.map((m,index)=>'<rect x="'+(140+index*175)+'" y="'+(195-m.total/600*150)+'" width="70" height="'+(m.total/600*150)+'" rx="4" fill="'+['#658650','#aac98b','#254b41'][index]+'"/><text x="'+(175+index*175)+'" y="'+(185-m.total/600*150)+'" text-anchor="middle" fill="#173439" font-family="Arial, sans-serif" font-size="15">'+esc(formatMoney(m.total))+'</text><text x="'+(175+index*175)+'" y="225" text-anchor="middle" fill="#52645d" font-family="Arial, sans-serif" font-size="14">'+esc(m.label)+'</text>').join('')}
</svg>`;
const demoPage = read('templates/vendas.html').replace('{{DEMO_ROWS}}',demoRows).replace('{{DEMO_CHART}}',demoChart).replace('{{DEMO_DATA}}',JSON.stringify(sales).replace(/</g,'\\u003c'));
const outputs = {'index.html':render(read('templates/index.html')), 'demos/vendas/index.html':demoPage};
for (const [name, content] of Object.entries(outputs)) {
  if (process.argv.includes('--check')) {
    if (read(name) !== content) throw new Error(name+' está desatualizado; execute node scripts/build.mjs');
  } else fs.writeFileSync(path.join(root,name),content);
}
console.log(process.argv.includes('--check') ? 'HTML consistente com os dados e o template.' : 'Portfólio gerado com conteúdo estático.');

