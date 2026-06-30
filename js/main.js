const joystick = document.getElementById('joystick');
const nodes = [...document.querySelectorAll('.service-node')];
const preview = document.getElementById('servicePreview');
const glow = document.getElementById('glowTrail');
const launcherBtn = document.getElementById('launcherBtn');
const launcherPanel = document.getElementById('launcherPanel');
const closeLauncher = document.getElementById('closeLauncher');
const modeBtn = document.getElementById('modeBtn');

const services = {
  up: { label: 'Speaking', href: 'speaking.html', theme: 'theme-blue', text: 'Invite Jerry to speak' },
  left: { label: 'Consulting', href: 'consulting.html', theme: 'theme-purple', text: 'Consulting & strategy' },
  right: { label: 'Books & Media', href: 'media.html', theme: 'theme-teal', text: 'Books, podcast & media' },
  down: { label: 'Appointment', href: 'https://speakoutmentalhealth.org', theme: 'theme-gold', text: 'Book an appointment' }
};

let dragging = false;
let startX = 0;
let startY = 0;
let activeDirection = null;
const maxMove = 30;
const trigger = 25;

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function clearTheme(){ document.body.classList.remove('theme-blue','theme-purple','theme-teal','theme-gold'); }
function setActive(direction){
  if(activeDirection === direction) return;
  activeDirection = direction;
  nodes.forEach(n => n.classList.toggle('active', n.dataset.direction === direction));
  clearTheme();
  if(direction && services[direction]){
    document.body.classList.add(services[direction].theme);
    preview.innerHTML = `<span class="preview-kicker">Selected</span><strong>${services[direction].text}</strong>`;
    if(navigator.vibrate) navigator.vibrate(12);
  } else {
    preview.innerHTML = `<span class="preview-kicker">Move the hub</span><strong>Choose a direction</strong>`;
  }
}
function directionFrom(dx, dy){
  if(Math.abs(dx) < trigger && Math.abs(dy) < trigger) return null;
  if(Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
function moveHub(dx, dy){
  const x = clamp(dx, -maxMove, maxMove);
  const y = clamp(dy, -maxMove, maxMove);
  const tiltX = y / 3;
  const tiltY = -x / 3;
  joystick.style.transform = `translate(${x}px, ${y}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  glow.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
  setActive(directionFrom(dx, dy));
}
function resetHub(){
  joystick.style.transform = 'translate(0,0) rotateX(0) rotateY(0) scale(1)';
  glow.style.transform = 'translate(0,0)';
  setTimeout(() => { setActive(null); clearTheme(); }, 360);
}

joystick.addEventListener('pointerdown', e => {
  dragging = true;
  joystick.setPointerCapture(e.pointerId);
  startX = e.clientX;
  startY = e.clientY;
});
joystick.addEventListener('pointermove', e => {
  if(!dragging) return;
  moveHub(e.clientX - startX, e.clientY - startY);
});
joystick.addEventListener('pointerup', () => {
  dragging = false;
  const selected = activeDirection;
  resetHub();
  if(selected && services[selected]){
    setTimeout(() => { window.location.href = services[selected].href; }, 220);
  }
});
joystick.addEventListener('pointercancel', () => { dragging = false; resetHub(); });

nodes.forEach(node => node.addEventListener('click', () => {
  if(navigator.vibrate) navigator.vibrate(18);
}));

launcherBtn.addEventListener('click', () => launcherPanel.classList.add('open'));
closeLauncher.addEventListener('click', () => launcherPanel.classList.remove('open'));
launcherPanel.addEventListener('click', e => { if(e.target === launcherPanel) launcherPanel.classList.remove('open'); });
modeBtn.addEventListener('click', () => document.body.classList.toggle('light-mode'));

// Gentle device tilt for supported mobile browsers
window.addEventListener('deviceorientation', e => {
  if(dragging || !e.gamma || !e.beta) return;
  const x = clamp(e.gamma / 3, -8, 8);
  const y = clamp((e.beta - 45) / 5, -8, 8);
  joystick.style.transform = `translate(${x}px, ${y}px)`;
}, true);
