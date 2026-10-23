// O conteúdo é pré-renderizado por scripts/build.mjs e funciona sem JavaScript.
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.skill-tile img').forEach(icon => {
  const hideBrokenIcon = () => { icon.hidden = true; };
  icon.addEventListener('error', hideBrokenIcon);
  if (icon.complete && !icon.naturalWidth) hideBrokenIcon();
});

const details = document.querySelector('.learning details');
if (details) {
  const symbol = details.querySelector('.summary-hint b');
  details.addEventListener('toggle', () => {
    if (symbol) symbol.textContent = details.open ? '−' : '+';
  });
}

