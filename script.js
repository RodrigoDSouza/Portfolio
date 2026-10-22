
async function loadPortfolio() {
  const res = await fetch('data.json');
  if (!res.ok) throw new Error('Falha ao carregar conteúdo');
  const data = await res.json();

  document.querySelector('#name').textContent = data.name;
  document.querySelector('#title').textContent = data.title;
  document.querySelector('#headline').textContent = data.headline;

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
    const card = document.createElement('div'); card.className='card';
    const tags = (pj.tags||[]).map(t => `<span class="chip">${t}</span>`).join(' ');
    const link = pj.link ? `<a href="${pj.link}" class="btn" style="margin-top:10px" target="_blank" rel="noopener">Ver projeto</a>` : '';
    card.innerHTML = `<h3 style="margin:0 0 6px">${pj.name}</h3>
      <p class="muted" style="margin:0 0 8px">${pj.description}</p>
      <div class="chips">${tags}</div>${link}`;
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
