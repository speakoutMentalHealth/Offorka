const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const themes = ["midnight", "sunrise", "aurora", "forest"];
const themeIcons = {
  midnight: "🌙",
  sunrise: "☀️",
  aurora: "✨",
  forest: "🌿"
};

/* UPDATE THESE TWO LINKS */
const CALL_LINK = "tel:+2348118103510";
const PAYSTACK_DONATION_LINK = "https://paystack.com/pay/YOUR-DONATION-LINK";

/*
  Static GitHub Pages cannot safely call OpenAI directly because API keys must never be placed in frontend JavaScript.
  Use one of these:
  1. Default: open ChatGPT with a prepared prompt.
  2. Later: connect this form to a secure backend/serverless function.
*/
const CHATGPT_LINK = "https://chat.openai.com/";

function applyTheme(theme){
  document.documentElement.dataset.theme = theme === "midnight" ? "" : theme;
  localStorage.setItem("offorka-theme", theme);

  const btn = $(".theme-btn");
  if(btn) btn.textContent = themeIcons[theme] || "🌙";
}

applyTheme(localStorage.getItem("offorka-theme") || "midnight");

/* ===========================
   WOW INTRO
=========================== */

const intro = $("#wowIntro");
const skipIntro = $("#skipIntro");

function finishIntro(){
  if(!intro) return;
  intro.classList.add("done");
  sessionStorage.setItem("offorka-intro-seen", "true");
}

function playIntro(){
  if(!intro) return;

  const alreadySeen = sessionStorage.getItem("offorka-intro-seen") === "true";

  if(alreadySeen){
    intro.classList.add("done");
    return;
  }

  setTimeout(finishIntro, 6200);
}

skipIntro?.addEventListener("click", finishIntro);
window.addEventListener("load", playIntro);

/* ===========================
   THEME
=========================== */

$(".theme-btn")?.addEventListener("click", () => {
  const current = localStorage.getItem("offorka-theme") || "midnight";
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  applyTheme(next);
});

/* ===========================
   MENU
=========================== */

$("[data-open-launcher]")?.addEventListener("click", () => {
  $("#launcher")?.classList.add("open");
});

$$("[data-close-launcher], .launcher-close").forEach(btn => {
  btn.addEventListener("click", () => $("#launcher")?.classList.remove("open"));
});

/* ===========================
   DONATION
=========================== */

$$("[data-donate]").forEach(btn => {
  btn.addEventListener("click", event => {
    event.preventDefault();
    window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
  });
});

/* ===========================
   ASK JERRY MODAL / CHATGPT
=========================== */

const aiModal = $("#aiModal");
const aiForm = $("#aiForm");
const aiQuestion = $("#aiQuestion");

function openAI(){
  aiModal?.classList.add("open");
  aiModal?.setAttribute("aria-hidden", "false");
  setTimeout(() => aiQuestion?.focus(), 120);
}

function closeAI(){
  aiModal?.classList.remove("open");
  aiModal?.setAttribute("aria-hidden", "true");
}

$$("[data-open-ai]").forEach(btn => {
  btn.addEventListener("click", event => {
    event.preventDefault();
    openAI();
  });
});

$$("[data-close-ai]").forEach(btn => {
  btn.addEventListener("click", closeAI);
});

aiForm?.addEventListener("submit", event => {
  event.preventDefault();

  const question = aiQuestion?.value.trim() || "";

  const prompt = encodeURIComponent(
    `You are helping me explore mental health, leadership, wellbeing, personal growth, or community impact through Jerry Nnamdi Offorka's platform. My question is: ${question}`
  );

  window.open(`${CHATGPT_LINK}?q=${prompt}`, "_blank", "noopener,noreferrer");
});

/* ===========================
   JOYSTICK PORTRAIT
=========================== */

const portrait = $("#portraitControl");

if(portrait){
  const nodes = {
    up: $(".node-up"),
    left: $(".node-left"),
    right: $(".node-right"),
    down: $(".node-down")
  };

  const labels = {
    up: "Public Speaking",
    left: "Leadership & Consulting",
    right: "Learning Hub",
    down: "Book a Session"
  };

  const urls = {
    up: "speaking.html",
    left: "consulting.html",
    right: "media.html",
    down: "booking.html"
  };

  const label = $("#activeLabel");

  let start = null;
  let active = null;
  let dragging = false;
  let dragDistance = 0;
  let lastTap = 0;

  function labelDefault(){
    if(label){
      label.innerHTML = `
        Let’s Connect
        <small>Tap to call · Drag to explore</small>
      `;
    }
  }

  labelDefault();

  function setActive(direction){
    active = direction;

    Object.values(nodes).forEach(node => node?.classList.remove("active"));

    if(direction){
      nodes[direction]?.classList.add("active");

      if(label){
        label.innerHTML = `
          Release to open
          <small>${labels[direction]}</small>
        `;
      }
    }else{
      labelDefault();
    }
  }

  function getDirection(dx, dy){
    const distance = Math.hypot(dx, dy);

    if(distance < 32) return null;

    if(Math.abs(dx) > Math.abs(dy)){
      return dx > 0 ? "right" : "left";
    }

    return dy > 0 ? "down" : "up";
  }

  portrait.addEventListener("pointerdown", event => {
    dragging = true;
    active = null;
    dragDistance = 0;

    start = {
      x: event.clientX,
      y: event.clientY
    };

    portrait.setPointerCapture(event.pointerId);
    portrait.style.transition = "none";
  });

  portrait.addEventListener("pointermove", event => {
    if(!dragging || !start) return;

    let dx = event.clientX - start.x;
    let dy = event.clientY - start.y;

    dragDistance = Math.hypot(dx, dy);

    const max = 42;
    const magnitude = Math.max(1, dragDistance);

    if(magnitude > max){
      dx = (dx / magnitude) * max;
      dy = (dy / magnitude) * max;
    }

    portrait.style.transform =
      `translate3d(${dx}px, ${dy}px, 48px) rotateX(${-dy / 6}deg) rotateY(${dx / 6}deg) scale(1.02)`;

    portrait.style.setProperty("--px", `${50 + dx}%`);
    portrait.style.setProperty("--py", `${50 + dy}%`);

    setActive(getDirection(event.clientX - start.x, event.clientY - start.y));
  });

  function end(){
    if(!dragging) return;

    dragging = false;

    const chosen = active;
    const wasTap = !chosen && dragDistance < 12;

    portrait.style.transition = "transform .36s cubic-bezier(.18,.9,.22,1.15)";
    portrait.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";

    setTimeout(() => {
      setActive(null);
      portrait.style.transition = "";
    }, 230);

    if(wasTap){
      const now = Date.now();

      if(now - lastTap < 450){
        window.location.href = CALL_LINK;
      }else{
        lastTap = now;

        if(label){
          label.innerHTML = `
            Tap again to call
            <small>or drag to explore</small>
          `;
        }

        setTimeout(() => {
          if(Date.now() - lastTap >= 430) labelDefault();
        }, 1100);
      }

      return;
    }

    if(chosen){
      setTimeout(() => {
        window.location.href = urls[chosen];
      }, 180);
    }
  }

  portrait.addEventListener("pointerup", end);
  portrait.addEventListener("pointercancel", end);
}

/* ===========================
   SERVICE WORKER
=========================== */

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
