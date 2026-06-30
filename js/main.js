const launcherBtn = document.getElementById('launcherBtn');
const launcher = document.getElementById('launcher');
const launcherClose = document.getElementById('launcherClose');
if (launcherBtn && launcher) launcherBtn.addEventListener('click', () => launcher.classList.add('open'));
if (launcherClose && launcher) launcherClose.addEventListener('click', () => launcher.classList.remove('open'));

const portrait = document.getElementById('portraitControl');
const system = document.getElementById('orbitalSystem');
const nodes = [...document.querySelectorAll('.node')];
let dragging = false, startX = 0, startY = 0, activeDir = null;
const routes = { up:'speaking.html', left:'consulting.html', right:'media.html', down:'booking.html' };

function setActive(dir){
  activeDir = dir;
  nodes.forEach(n => n.classList.toggle('active', n.dataset.dir === dir));
}
function getDir(dx, dy){
  const dist = Math.hypot(dx,dy);
  if (dist < 22) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
function move(clientX, clientY){
  const dx = clientX - startX, dy = clientY - startY;
  const max = 42;
  const dist = Math.hypot(dx,dy) || 1;
  const limited = Math.min(dist, max);
  const x = dx / dist * limited;
  const y = dy / dist * limited;
  portrait.style.transform = `translate(${x}px, ${y}px) rotateX(${-y/6}deg) rotateY(${x/6}deg) scale(1.025)`;
  portrait.style.setProperty('--px', `${50 + x}%`);
  portrait.style.setProperty('--py', `${50 + y}%`);
  system.style.setProperty('--tx', `${x}px`);
  system.style.setProperty('--ty', `${y}px`);
  setActive(getDir(dx,dy));
}
function reset(){
  portrait.style.transform = '';
  portrait.style.setProperty('--px','36%');
  portrait.style.setProperty('--py','22%');
}
if (portrait){
  portrait.addEventListener('pointerdown', e => {
    dragging = true; startX = e.clientX; startY = e.clientY; activeDir = null;
    portrait.setPointerCapture(e.pointerId);
  });
  portrait.addEventListener('pointermove', e => { if(dragging) move(e.clientX,e.clientY); });
  portrait.addEventListener('pointerup', e => {
    if(!dragging) return; dragging = false;
    const selected = activeDir;
    reset();
    nodes.forEach(n => n.classList.remove('active'));
    if(selected && routes[selected]){
      if (navigator.vibrate) navigator.vibrate(25);
      setTimeout(() => window.location.href = routes[selected], 120);
    }
  });
  portrait.addEventListener('pointercancel', () => { dragging=false; reset(); nodes.forEach(n=>n.classList.remove('active')); });
}
