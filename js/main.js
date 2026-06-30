const core = document.getElementById('core');
const hint = document.getElementById('hint');
const nodes = [...document.querySelectorAll('.node')];
const launcherBtn = document.getElementById('launcherBtn');
const launcherPanel = document.getElementById('launcherPanel');
const closeLauncher = document.getElementById('closeLauncher');
const themeBtn = document.getElementById('themeBtn');

let dragging = false;
let startX = 0, startY = 0;
let currentDir = null;
const maxMove = 30;
const threshold = 22;

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function dirFromDelta(dx, dy){
  if(Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return null;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
}
function setActive(dir){
  currentDir = dir;
  nodes.forEach(n => n.classList.toggle('active', n.dataset.dir === dir));
  const labels = {up:'Speaking',left:'Consulting',right:'Books & Media',down:'Book Appointment'};
  hint.textContent = dir ? labels[dir] : 'Touch the centre and move';
  hint.classList.toggle('active', Boolean(dir));
  if(dir && navigator.vibrate) navigator.vibrate(8);
}
function start(e){
  dragging = true;
  core.classList.add('is-dragging');
  const p = e.touches ? e.touches[0] : e;
  startX = p.clientX; startY = p.clientY;
  core.setPointerCapture?.(e.pointerId || 1);
}
function move(e){
  if(!dragging) return;
  const p = e.touches ? e.touches[0] : e;
  const dx = clamp(p.clientX - startX, -maxMove, maxMove);
  const dy = clamp(p.clientY - startY, -maxMove, maxMove);
  const tiltX = dx / 3;
  const tiltY = -dy / 3;
  core.style.transform = `translate(${dx}px, ${dy}px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
  setActive(dirFromDelta(dx, dy));
}
function end(){
  if(!dragging) return;
  dragging = false;
  core.classList.remove('is-dragging');
  core.style.transform = '';
  if(currentDir){
    const link = document.querySelector(`.node[data-dir="${currentDir}"]`);
    setTimeout(()=>{ window.location.href = link.href; }, 180);
  }
  setTimeout(()=>setActive(null), 260);
}

core.addEventListener('pointerdown', start);
window.addEventListener('pointermove', move);
window.addEventListener('pointerup', end);
core.addEventListener('touchstart', start, {passive:true});
window.addEventListener('touchmove', move, {passive:true});
window.addEventListener('touchend', end);

launcherBtn?.addEventListener('click', ()=> launcherPanel.classList.add('open'));
closeLauncher?.addEventListener('click', ()=> launcherPanel.classList.remove('open'));
launcherPanel?.addEventListener('click', e => { if(e.target === launcherPanel) launcherPanel.classList.remove('open'); });
themeBtn?.addEventListener('click', ()=> document.body.classList.toggle('light-mode'));
