
async function loadPortfolio() {
  document.getElementById('year').textContent = new Date().getFullYear();
  const res = await fetch('data.json');
  if (!res.ok) throw new Error('Falha ao carregar conteúdo');
  const data = await res.json();

  document.querySelector('#name').textContent = data.name;
  document.querySelector('#title').textContent = data.title;

  const linksWrap = document.querySelector('#links');
  linksWrap.innerHTML = '';
  if (data.links?.linkedin) linksWrap.innerHTML += `<a class="btn" target="_blank" rel="noopener" href="${data.links.linkedin}">LinkedIn</a>`;
  if (data.links?.github) linksWrap.innerHTML += `<a class="btn" target="_blank" rel="noopener" href="${data.links.github}">GitHub</a>`;

  const aboutEl = document.querySelector('#about'); aboutEl.innerHTML = '';
  (data.about||[]).forEach(p => { const el = document.createElement('p'); el.className='muted'; el.textContent=p; aboutEl.appendChild(el); });

  const expUl = document.querySelector('#experience'); expUl.innerHTML='';
  (data.experience||[]).forEach(exp => {
    const li = document.createElement('li');
    const highlights = (exp.highlights||[]).map(h => `<li>${h}</li>`).join('');
    li.innerHTML = `<div class="title">${exp.role} — ${exp.company}</div>
      <div class="period">${exp.period||''}${exp.location? ' • '+exp.location:''}</div>
      <ul style="margin:8px 0 0 18px">${highlights}</ul>`;
    expUl.appendChild(li);
  });

  const chipWrap = document.querySelector('#skills'); chipWrap.innerHTML='';
  (data.skills||[]).forEach(s => { const span=document.createElement('span'); span.className='chip'; span.textContent=s; chipWrap.appendChild(span); });

  const pjWrap = document.querySelector('#projects'); pjWrap.innerHTML='';
  (data.projects||[]).forEach(pj => {
    const card = document.createElement('article'); card.className='project-card';
    const isFootball = pj.link.includes('/futebol-analytics');
    const isSales = pj.link.includes('/demos/vendas');
    const kind = isFootball ? 'football' : isSales ? 'sales' : 'api';
    const cover = isFootball ? '<div class="field"></div>' : isSales ? '<div class="mini-bars"><i></i><i></i><i></i></div>' : '<div class="code-window"><strong>GET</strong> /pedidos<br>{ "status": "ok" }<br><strong>Python</strong> / FastAPI</div>';
    const tags = (pj.tags||[]).map(t => `<span class="chip">${t}</span>`).join(' ');
    card.innerHTML = `<div class="project-cover cover-${kind}" aria-hidden="true"><span class="cover-label">${isFootball ? 'DADOS & ESTATÍSTICA' : isSales ? 'INDICADORES & VISUALIZAÇÃO' : 'BACKEND & INTEGRAÇÕES'}</span>${cover}<span class="cover-caption">ILUSTRAÇÃO DO PROJETO</span></div>
      <div class="project-body"><span class="project-index">${isSales ? 'DEMONSTRAÇÃO · DADOS FICTÍCIOS' : 'PROJETO PESSOAL · CÓDIGO ABERTO'}</span><h3>${pj.name}</h3><p>${pj.description}</p><div class="chips">${tags}</div>
      ${pj.link ? `<a href="${pj.link}" class="text-link" target="_blank" rel="noopener">Explorar projeto <span aria-hidden="true">↗</span></a>` : ''}</div>`;
    pjWrap.appendChild(card);
  });

  const certList = document.querySelector('#cert-list'); certList.innerHTML='';
  (data.certificates||[]).forEach(cert => {
    const item = document.createElement('div'); item.className='card';
    const extra = cert.hours ? ` • ${cert.hours}` : '';
    item.innerHTML = `<div class="title">${cert.name}</div><div class="period">${cert.issuer} — ${cert.date}${extra}</div>`;
    certList.appendChild(item);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  loadPortfolio().catch(() => {
    document.getElementById('load-error').hidden = false;
  });
});
