const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const launcher = $('#launcher');
$('.launcher-toggle')?.addEventListener('click', () => launcher?.classList.add('open'));
$('.launcher-close')?.addEventListener('click', () => launcher?.classList.remove('open'));
$('.theme-toggle')?.addEventListener('click', () => document.body.classList.toggle('quiet-glow'));

const control = $('#portraitControl');
const hint = $('#hubHint');
const nodes = $$('.service-node');
let active = null;
let dragging = false;
let start = { x: 0, y: 0 };
const limit = 28;

function serviceFromVector(dx, dy) {
  const ax = Math.abs(dx), ay = Math.abs(dy);
  if (Math.max(ax, ay) < 14) return null;
  if (ay > ax) return dy < 0 ? 'speaking' : 'booking';
  return dx < 0 ? 'consulting' : 'media';
}
function setActive(name) {
  active = name;
  nodes.forEach(n => n.classList.toggle('active', n.dataset.service === name));
  const label = nodes.find(n => n.dataset.service === name)?.textContent.trim();
  if (hint) hint.textContent = label ? `Release for ${label}` : 'Touch the portrait and move';
  if (navigator.vibrate && name) navigator.vibrate(8);
}
function moveTo(dx, dy) {
  const dist = Math.hypot(dx, dy) || 1;
  const factor = Math.min(limit, dist) / dist;
  const x = dx * factor;
  const y = dy * factor;
  control.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${-y/8}deg) rotateY(${x/8}deg)`;
  control.style.setProperty('--x', `${50 + x}%`);
  control.style.setProperty('--y', `${40 + y}%`);
  setActive(serviceFromVector(dx, dy));
}
function reset() {
  control.style.transform = '';
  control.style.setProperty('--x', '35%');
  control.style.setProperty('--y', '25%');
  setTimeout(() => setActive(null), 180);
}

if (control) {
  control.addEventListener('pointerdown', e => {
    dragging = true;
    start = { x: e.clientX, y: e.clientY };
    control.setPointerCapture(e.pointerId);
  });
  control.addEventListener('pointermove', e => {
    if (!dragging) return;
    moveTo(e.clientX - start.x, e.clientY - start.y);
  });
  control.addEventListener('pointerup', () => {
    dragging = false;
    const chosen = active;
    reset();
    if (chosen) {
      const url = nodes.find(n => n.dataset.service === chosen)?.dataset.url;
      setTimeout(() => { if (url) window.location.href = url; }, 210);
    }
  });
  control.addEventListener('pointercancel', () => { dragging = false; reset(); });
}

nodes.forEach(node => node.addEventListener('click', () => {
  const url = node.dataset.url;
  if (url) window.location.href = url;
}));

const canvas = $('#particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    particles = Array.from({ length: Math.min(80, Math.floor(innerWidth / 7)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + .4,
      vx: (Math.random() - .5) * .16 * devicePixelRatio,
      vy: (Math.random() - .5) * .16 * devicePixelRatio,
      a: Math.random() * .5 + .12
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(120,190,255,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize, { passive: true });
  resize(); draw();
}
