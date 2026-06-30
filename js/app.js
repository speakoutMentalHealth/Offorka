const launcher = document.getElementById('launcher');
document.querySelectorAll('.launcher-toggle').forEach(btn => btn.addEventListener('click', () => launcher?.classList.add('open')));
document.querySelectorAll('.launcher-close').forEach(btn => btn.addEventListener('click', () => launcher?.classList.remove('open')));

const portraitImage = document.getElementById('portraitImage');
const fallback = document.querySelector('.portrait-fallback');
if (portraitImage) {
  portraitImage.addEventListener('error', () => {
    portraitImage.style.display = 'none';
    if (fallback) fallback.style.display = 'grid';
  });
}

const control = document.getElementById('portraitControl');
const hub = document.getElementById('hub');
const nodes = [...document.querySelectorAll('.service-node')];
let dragging = false;
let startX = 0;
let startY = 0;
let activeDirection = null;
let lastHaptic = null;

const routes = {
  up: 'speaking.html',
  left: 'consulting.html',
  right: 'media.html',
  down: 'booking.html'
};

function directionFromDelta(dx, dy) {
  const distance = Math.hypot(dx, dy);
  if (distance < 22) return null;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  if (angle >= -45 && angle <= 45) return 'right';
  if (angle > 45 && angle < 135) return 'down';
  if (angle < -45 && angle > -135) return 'up';
  return 'left';
}

function setActive(direction) {
  activeDirection = direction;
  document.body.dataset.activeDirection = direction || '';
  nodes.forEach(node => node.classList.toggle('active', node.dataset.direction === direction));
  if (direction && direction !== lastHaptic && navigator.vibrate) {
    navigator.vibrate(10);
    lastHaptic = direction;
  }
}

function moveControl(clientX, clientY) {
  if (!dragging || !control) return;
  const rawDx = clientX - startX;
  const rawDy = clientY - startY;
  const direction = directionFromDelta(rawDx, rawDy);
  const maxTravel = Math.min(58, Math.max(38, window.innerWidth * 0.12));
  const distance = Math.hypot(rawDx, rawDy) || 1;
  const eased = Math.min(maxTravel, distance) / distance;
  const dx = rawDx * eased;
  const dy = rawDy * eased;

  control.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotateX(${-dy / 8}deg) rotateY(${dx / 8}deg)`;
  control.style.setProperty('--x', `${50 + dx * 0.75}%`);
  control.style.setProperty('--y', `${34 + dy * 0.75}%`);
  if (hub) {
    hub.style.setProperty('--tilt-x', `${dx / 24}deg`);
    hub.style.setProperty('--tilt-y', `${-dy / 24}deg`);
  }
  setActive(direction);
}

function resetControl() {
  if (!control) return;
  control.style.transform = 'translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
  if (hub) {
    hub.style.setProperty('--tilt-x', '0deg');
    hub.style.setProperty('--tilt-y', '0deg');
  }
}

function openSelected(direction) {
  if (!direction || !routes[direction]) return;
  const target = nodes.find(node => node.dataset.direction === direction);
  if (target) target.classList.add('launching');
  setTimeout(() => { window.location.href = routes[direction]; }, 145);
}

if (control) {
  control.addEventListener('pointerdown', event => {
    event.preventDefault();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    lastHaptic = null;
    control.setPointerCapture?.(event.pointerId);
    document.body.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', event => {
    if (!dragging) return;
    event.preventDefault();
    moveControl(event.clientX, event.clientY);
  }, { passive: false });

  function finishDrag() {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('is-dragging');
    const selected = activeDirection;
    resetControl();
    if (selected) openSelected(selected);
    setTimeout(() => setActive(null), selected ? 180 : 0);
  }

  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', () => {
    dragging = false;
    resetControl();
    setActive(null);
    document.body.classList.remove('is-dragging');
  });
}

const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    particles = Array.from({ length: 58 }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.35 + .35,
      s: Math.random() * .28 + .06,
      o: Math.random() * .42 + .16
    }));
  }
  function animate() {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach(p => {
      p.y -= p.s;
      if (p.y < -5) { p.y = innerHeight + 5; p.x = Math.random() * innerWidth; }
      ctx.fillStyle = `rgba(170,220,255,${p.o})`;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  resize();
  addEventListener('resize', resize);
  animate();
}
