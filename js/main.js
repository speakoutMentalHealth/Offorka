const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const themes = ['night', 'day', 'aura'];
const CALL_LINK = 'tel:+2348118103510';

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === 'night' ? '' : theme;
  localStorage.setItem('offorka-theme', theme);
  const btn = $('.theme-btn');
  if (btn) btn.textContent = theme === 'night' ? '🌙' : theme === 'day' ? '☀️' : '✨';
}

applyTheme(localStorage.getItem('offorka-theme') || 'night');

window.addEventListener('load', () => {
  setTimeout(() => $('.preloader')?.classList.add('done'), 650);
});

$('.theme-btn')?.addEventListener('click', () => {
  const current = localStorage.getItem('offorka-theme') || 'night';
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  applyTheme(next);
});

$('[data-open-launcher]')?.addEventListener('click', () => {
  $('#launcher')?.classList.add('open');
});

$$('[data-close-launcher], .launcher-close').forEach((btn) => {
  btn.addEventListener('click', () => $('#launcher')?.classList.remove('open'));
});

const reflections = [
  'Every meaningful change begins with a conversation.',
  'Strong minds create stronger communities.',
  'Healing begins when people feel heard.',
  'Compassion is the beginning of leadership.',
  'Every voice deserves hope.'
];

const reflection = $('#dailyReflection');
if (reflection) {
  let index = new Date().getDate() % reflections.length;
  reflection.textContent = reflections[index];
  setInterval(() => {
    index = (index + 1) % reflections.length;
    reflection.animate(
      [
        { opacity: 0.25, transform: 'translateY(4px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 380, easing: 'ease-out' }
    );
    reflection.textContent = reflections[index];
  }, 10000);
}

const portrait = $('#portraitControl');

if (portrait) {
  const nodes = {
    up: $('.node-up'),
    left: $('.node-left'),
    right: $('.node-right'),
    down: $('.node-down')
  };

  const labels = {
    up: 'Public Speaking',
    left: 'Leadership & Consulting',
    right: 'Learning Hub',
    down: 'Book a Session'
  };

  const urls = {
    up: 'speaking.html',
    left: 'consulting.html',
    right: 'media.html',
    down: 'booking.html'
  };

  const label = $('#activeLabel');

  let start = null;
  let active = null;
  let dragging = false;
  let dragDistance = 0;

  function setLabelDefault() {
    if (!label) return;
    label.classList.remove('is-active');
    label.innerHTML = `Let's Connect<small>Tap to call · Drag to explore</small>`;
  }

  function setActive(direction) {
    active = direction;
    Object.values(nodes).forEach((node) => node?.classList.remove('active'));

    if (direction) {
      nodes[direction]?.classList.add('active');
      if (label) {
        label.classList.add('is-active');
        label.innerHTML = `Release to open<small>${labels[direction]}</small>`;
      }
    } else {
      setLabelDefault();
    }
  }

  function getDirection(dx, dy) {
    const distance = Math.hypot(dx, dy);
    if (distance < 32) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }

  portrait.addEventListener('pointerdown', (event) => {
    dragging = true;
    dragDistance = 0;
    active = null;
    start = { x: event.clientX, y: event.clientY };
    portrait.setPointerCapture(event.pointerId);
    portrait.style.transition = 'none';
  });

  portrait.addEventListener('pointermove', (event) => {
    if (!dragging || !start) return;

    let dx = event.clientX - start.x;
    let dy = event.clientY - start.y;
    dragDistance = Math.hypot(dx, dy);

    const max = 38;
    const magnitude = Math.max(1, Math.hypot(dx, dy));
    if (magnitude > max) {
      dx = (dx / magnitude) * max;
      dy = (dy / magnitude) * max;
    }

    portrait.style.transform = `translate(${dx}px, ${dy}px) rotateX(${-dy / 7}deg) rotateY(${dx / 7}deg)`;
    portrait.style.setProperty('--px', `${50 + dx}%`);
    portrait.style.setProperty('--py', `${50 + dy}%`);

    setActive(getDirection(event.clientX - start.x, event.clientY - start.y));
  });

  function end() {
    if (!dragging) return;
    dragging = false;

    const chosen = active;
    const wasTap = !chosen && dragDistance < 12;

    portrait.style.transition = 'transform .34s cubic-bezier(.18,.9,.22,1.15)';
    portrait.style.transform = 'translate(0,0) rotateX(0deg) rotateY(0deg)';

    setTimeout(() => {
      setActive(null);
      portrait.style.transition = '';
    }, 220);

    if (wasTap) {
      setTimeout(() => {
        window.location.href = CALL_LINK;
      }, 120);
      return;
    }

    if (chosen) {
      setTimeout(() => {
        window.location.href = urls[chosen];
      }, 180);
    }
  }

  portrait.addEventListener('pointerup', end);
  portrait.addEventListener('pointercancel', end);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
