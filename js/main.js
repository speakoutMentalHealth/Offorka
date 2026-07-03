const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const themes = ['night', 'day', 'aura'];
const icons = { night: '🌙', day: '☀️', aura: '✨' };
const savedTheme = localStorage.getItem('offorka-theme') || 'night';
document.documentElement.dataset.theme = savedTheme === 'night' ? '' : savedTheme;

function setTheme(theme){
  const value = theme === 'night' ? '' : theme;
  document.documentElement.dataset.theme = value;
  localStorage.setItem('offorka-theme', theme);
  $$('.theme-btn').forEach(btn => btn.textContent = icons[theme]);
}
setTheme(savedTheme);

$$('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = localStorage.getItem('offorka-theme') || 'night';
    setTheme(themes[(themes.indexOf(current) + 1) % themes.length]);
  });
});

window.addEventListener('load', () => {
  setTimeout(() => $('.preloader')?.classList.add('done'), 500);
});

const launcher = $('#launcher');
$$('[data-open-launcher]').forEach(btn => btn.addEventListener('click', () => launcher?.classList.add('open')));
$$('[data-close-launcher]').forEach(btn => btn.addEventListener('click', () => launcher?.classList.remove('open')));

const reflections = [
  'Every meaningful change begins with a conversation.',
  'Strong minds create stronger communities.',
  'Healing begins when people feel heard.',
  'Compassion is the beginning of leadership.',
  'Every voice deserves hope.'
];
const quote = $('#dailyReflection');
let quoteIndex = 0;
if(quote){
  quote.textContent = reflections[0];
  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % reflections.length;
    quote.animate([{opacity:1, transform:'translateY(0)'},{opacity:0, transform:'translateY(6px)'}], {duration:180, fill:'forwards'}).onfinish = () => {
      quote.textContent = reflections[quoteIndex];
      quote.animate([{opacity:0, transform:'translateY(-6px)'},{opacity:1, transform:'translateY(0)'}], {duration:260, fill:'forwards'});
    };
  }, 7000);
}

const portrait = $('#portraitControl');
const nodes = {
  up: $('.node-up'),
  left: $('.node-left'),
  right: $('.node-right'),
  down: $('.node-down')
};
const routes = { up:'speaking.html', left:'consulting.html', right:'media.html', down:'booking.html' };
const labels = {
  up:'Public Speaking — keynotes, panels and transformational conversations',
  left:'Leadership & Consulting — strategy, wellbeing and organizational support',
  right:'Learning Hub — books, videos, podcasts and resources',
  down:'Book a Session — schedule a mental health consultation'
};
const activeLabel = $('#activeLabel');
let drag = null;

function setActive(direction){
  Object.values(nodes).forEach(n => n?.classList.remove('active'));
  if(direction && nodes[direction]){
    nodes[direction].classList.add('active');
    if(activeLabel) activeLabel.textContent = labels[direction];
  } else if(activeLabel){
    activeLabel.textContent = 'Drag my portrait toward a service';
  }
}
function getDirection(x,y){
  const absX = Math.abs(x), absY = Math.abs(y);
  const threshold = 26;
  if(Math.max(absX, absY) < threshold) return null;
  return absX > absY ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');
}
function movePortrait(dx, dy){
  const max = 38;
  const x = Math.max(-max, Math.min(max, dx));
  const y = Math.max(-max, Math.min(max, dy));
  portrait.style.transform = `translate(${x}px, ${y}px) rotateX(${-y/6}deg) rotateY(${x/6}deg)`;
  portrait.style.setProperty('--px', `${50 + x}%`);
  portrait.style.setProperty('--py', `${38 + y}%`);
}
if(portrait){
  portrait.addEventListener('pointerdown', e => {
    drag = {x:e.clientX, y:e.clientY, direction:null};
    portrait.setPointerCapture(e.pointerId);
  });
  portrait.addEventListener('pointermove', e => {
    if(!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    movePortrait(dx, dy);
    drag.direction = getDirection(dx, dy);
    setActive(drag.direction);
  });
  const release = () => {
    if(!drag) return;
    const direction = drag.direction;
    drag = null;
    portrait.style.transform = '';
    setTimeout(() => setActive(null), 200);
    if(direction && routes[direction]) window.location.href = routes[direction];
  };
  portrait.addEventListener('pointerup', release);
  portrait.addEventListener('pointercancel', release);
}

$$('.slot').forEach(slot => {
  slot.addEventListener('click', () => {
    $$('.slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
  });
});

if('serviceWorker' in navigator){
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
