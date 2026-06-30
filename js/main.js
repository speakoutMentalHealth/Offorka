const portrait = document.getElementById('portraitControl');
const img = document.getElementById('portraitImage');
const launcherBtn = document.getElementById('launcherBtn');
const launcher = document.getElementById('launcher');
const launcherClose = document.getElementById('launcherClose');
const activeLabel = document.getElementById('activeLabel');
const nodes = [...document.querySelectorAll('.service')];

const routes = {
  up: 'speaking.html',
  left: 'leadership.html',
  right: 'media.html',
  down: 'booking.html'
};

const labels = {
  up: 'Public Speaking',
  left: 'Leadership & Training',
  right: 'Books & Media',
  down: 'Book Appointment'
};

let dragging = false;
let pointerId = null;
let origin = { x: 0, y: 0 };
let selected = null;
const maxMove = 34;
const trigger = 22;

img?.addEventListener('error', () => {
  img.style.display = 'none';
  const fallback = portrait.querySelector('.portrait-fallback');
  if (fallback) fallback.style.display = 'grid';
});

function setActive(dir){
  selected = dir;
  nodes.forEach(node => node.classList.toggle('active', node.dataset.dir === dir));
  if (activeLabel) activeLabel.textContent = dir ? labels[dir] : 'Move the portrait to select';
}

function directionFrom(dx, dy){
  if (Math.hypot(dx, dy) < trigger) return null;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
}

function movePortrait(dx, dy){
  const distance = Math.hypot(dx, dy) || 1;
  const limited = Math.min(maxMove, distance);
  const x = (dx / distance) * limited;
  const y = (dy / distance) * limited;

  portrait.style.transform = `translate(${x}px, ${y}px) rotateX(${-y/9}deg) rotateY(${x/9}deg)`;
  portrait.style.setProperty('--px', `${50 + x}%`);
  portrait.style.setProperty('--py', `${34 + y}%`);
  setActive(directionFrom(dx, dy));
}

portrait?.addEventListener('pointerdown', (event) => {
  dragging = true;
  pointerId = event.pointerId;
  origin = { x: event.clientX, y: event.clientY };
  portrait.setPointerCapture(pointerId);
  portrait.style.transition = 'none';
});

portrait?.addEventListener('pointermove', (event) => {
  if (!dragging || event.pointerId !== pointerId) return;
  movePortrait(event.clientX - origin.x, event.clientY - origin.y);
});

function endDrag(event){
  if (!dragging || event.pointerId !== pointerId) return;
  dragging = false;
  portrait.releasePointerCapture(pointerId);
  portrait.style.transition = 'transform .34s cubic-bezier(.22,1,.36,1), box-shadow .22s ease';
  portrait.style.transform = 'translate(0,0) rotateX(0) rotateY(0)';

  const destination = selected ? routes[selected] : null;
  setTimeout(() => setActive(null), 180);

  if (destination) {
    if (navigator.vibrate) navigator.vibrate(18);
    setTimeout(() => { window.location.href = destination; }, 160);
  }
}

portrait?.addEventListener('pointerup', endDrag);
portrait?.addEventListener('pointercancel', endDrag);

nodes.forEach(node => {
  node.addEventListener('pointerenter', () => setActive(node.dataset.dir));
  node.addEventListener('pointerleave', () => setActive(null));
});

launcherBtn?.addEventListener('click', () => {
  launcher.classList.add('open');
  launcher.setAttribute('aria-hidden', 'false');
});

launcherClose?.addEventListener('click', () => {
  launcher.classList.remove('open');
  launcher.setAttribute('aria-hidden', 'true');
});

const themeBtn = document.getElementById('themeBtn');
themeBtn?.addEventListener('click', () => document.body.classList.toggle('soft-mode'));
