const panelButtons = document.querySelectorAll('[data-panel]');
const panels = document.querySelectorAll('.slide-panel');
const closeButtons = document.querySelectorAll('.close-panel');
const themeToggle = document.getElementById('themeToggle');

function closePanels(){ panels.forEach(panel => panel.classList.remove('open')); }

panelButtons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    closePanels();
    const panel = document.getElementById(button.dataset.panel);
    if(panel) panel.classList.add('open');
  });
});

closeButtons.forEach(button => button.addEventListener('click', closePanels));

document.addEventListener('keydown', event => {
  if(event.key === 'Escape') closePanels();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});
