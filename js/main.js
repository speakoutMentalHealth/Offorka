const stage = document.getElementById('controlStage');
const pad = document.getElementById('portraitPad');
const knob = document.getElementById('joystickKnob');
const microCopy = document.getElementById('microCopy');
const orbs = [...document.querySelectorAll('.service-orb')];

let dragging = false;
let activeDirection = null;
let lastX = 0;
let lastY = 0;
const threshold = 38;

function setDirection(direction, commit = false){
  activeDirection = direction;
  orbs.forEach(orb => orb.classList.toggle('active', orb.dataset.direction === direction));
  const labels = {up:'Speaking', left:'Consulting', right:'Books & Media', down:'Book Appointment'};
  microCopy.textContent = direction ? `${labels[direction]} selected` : 'Drag the centre control or tap a direction';
  if(commit && direction){
    const target = orbs.find(orb => orb.dataset.direction === direction);
    if(target) target.click();
  }
}

function handlePoint(clientX, clientY){
  const rect = pad.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  let dx = clientX - cx;
  let dy = clientY - cy;
  const max = rect.width * 0.23;
  const distance = Math.hypot(dx, dy);
  if(distance > max){
    dx = dx / distance * max;
    dy = dy / distance * max;
  }
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
  lastX = dx; lastY = dy;

  if(Math.abs(dx) < threshold && Math.abs(dy) < threshold){
    setDirection(null);
    return;
  }
  if(Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 'right' : 'left');
  else setDirection(dy > 0 ? 'down' : 'up');
}

function resetKnob(commit = false){
  knob.style.transform = 'translate(0, 0)';
  if(commit && activeDirection) setDirection(activeDirection, true);
  setTimeout(() => setDirection(null), 220);
}

pad.addEventListener('pointerdown', e => {
  dragging = true;
  pad.setPointerCapture(e.pointerId);
  handlePoint(e.clientX, e.clientY);
});

pad.addEventListener('pointermove', e => {
  if(!dragging) return;
  handlePoint(e.clientX, e.clientY);
});

pad.addEventListener('pointerup', () => {
  dragging = false;
  resetKnob(true);
});

pad.addEventListener('pointercancel', () => {
  dragging = false;
  resetKnob(false);
});

pad.addEventListener('click', e => {
  if(Math.abs(lastX) > threshold || Math.abs(lastY) > threshold) return;
  const rect = pad.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  if(Math.abs(x) > Math.abs(y)) setDirection(x > 0 ? 'right' : 'left', true);
  else setDirection(y > 0 ? 'down' : 'up', true);
});

document.querySelector('.theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('calm');
});
