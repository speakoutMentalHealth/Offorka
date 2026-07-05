const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const themes = ["midnight", "sunrise", "aurora", "forest"];
const themeIcons = { midnight: "🌙", sunrise: "☀️", aurora: "✨", forest: "🌿" };

const CALL_LINK = "tel:+2348118103510";
const PAYSTACK_DONATION_LINK = "https://paystack.shop/pay/speakout-donate";
const FIREBASE_AI_ENDPOINT = "https://us-central1-speaakout-portal.cloudfunctions.net/askJerry";

function applyTheme(theme){
  document.documentElement.dataset.theme = theme === "midnight" ? "" : theme;
  localStorage.setItem("offorka-theme", theme);
  const btn = $(".theme-btn");
  if(btn) btn.textContent = themeIcons[theme] || "🌙";
}
applyTheme(localStorage.getItem("offorka-theme") || "midnight");

/* Phase B — Intro plays every page open/refresh */
const intro = $("#wowIntro");
const skipIntro = $("#skipIntro");
function finishIntro(){ if(!intro) return; intro.classList.add("done"); }
function playIntro(){ if(!intro) return; setTimeout(finishIntro, 6200); }
skipIntro?.addEventListener("click", finishIntro);
window.addEventListener("load", playIntro);

/* Phase E — Theme */
$(".theme-btn")?.addEventListener("click", () => {
  const current = localStorage.getItem("offorka-theme") || "midnight";
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  applyTheme(next);
});

/* Navigation */
$("[data-open-launcher]")?.addEventListener("click", () => $("#launcher")?.classList.add("open"));
$$("[data-close-launcher], .launcher-close").forEach(btn => btn.addEventListener("click", () => $("#launcher")?.classList.remove("open")));

/* Phase D — Donation */
$$("[data-donate]").forEach(btn => {
  btn.addEventListener("click", event => {
    event.preventDefault();
    window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
  });
});

/* Phase C/D — Jerry+ AI */
const aiModal = $("#aiModal");
const aiForm = $("#aiForm");
const aiQuestion = $("#aiQuestion");
const aiMessages = $("#aiMessages");

function openAI(){
  aiModal?.classList.add("open");
  aiModal?.setAttribute("aria-hidden", "false");
  setTimeout(() => aiQuestion?.focus(), 120);
}
function closeAI(){
  aiModal?.classList.remove("open");
  aiModal?.setAttribute("aria-hidden", "true");
}
function addMessage(role, text){
  if(!aiMessages) return;
  const item = document.createElement("div");
  item.className = `ai-message ${role}`;
  item.textContent = text;
  aiMessages.appendChild(item);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}
$$("[data-open-ai]").forEach(btn => btn.addEventListener("click", e => { e.preventDefault(); openAI(); }));
$$("[data-close-ai]").forEach(btn => btn.addEventListener("click", closeAI));

aiForm?.addEventListener("submit", async event => {
  event.preventDefault();
  const question = aiQuestion?.value.trim();
  if(!question) return;

  addMessage("user", question);
  aiQuestion.value = "";
  addMessage("assistant", "Thinking...");

  try{
    const response = await fetch(FIREBASE_AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    const messages = $$(".ai-message.assistant", aiMessages);
    const last = messages[messages.length - 1];

    if(!response.ok){
      last.textContent = data.error || "Jerry+ is temporarily unavailable. Please try again later.";
      return;
    }

    last.textContent = data.answer || "I’m here with you. Could you share a little more?";
  }catch(error){
    const messages = $$(".ai-message.assistant", aiMessages);
    const last = messages[messages.length - 1];
    last.textContent = "Jerry+ is not connected yet. Please check your Firebase function deployment.";
  }
});

/* Joystick */
const portrait = $("#portraitControl");
if(portrait){
  const nodes = { up: $(".node-up"), left: $(".node-left"), right: $(".node-right"), down: $(".node-down") };
  const labels = { up: "Public Speaking", left: "Leadership & Consulting", right: "Learning Hub", down: "Book a Session" };
  const urls = { up: "speaking.html", left: "consulting.html", right: "media.html", down: "booking.html" };
  const label = $("#activeLabel");
  let start = null, active = null, dragging = false, dragDistance = 0, lastTap = 0;

  function labelDefault(){ if(label) label.innerHTML = `Let’s Connect<small>Tap to call · Drag to explore</small>`; }
  labelDefault();

  function setActive(direction){
    active = direction;
    Object.values(nodes).forEach(node => node?.classList.remove("active"));
    if(direction){
      nodes[direction]?.classList.add("active");
      if(label) label.innerHTML = `Release to open<small>${labels[direction]}</small>`;
    }else labelDefault();
  }

  function getDirection(dx, dy){
    const distance = Math.hypot(dx, dy);
    if(distance < 32) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  }

  portrait.addEventListener("pointerdown", event => {
    dragging = true; active = null; dragDistance = 0;
    start = { x: event.clientX, y: event.clientY };
    portrait.setPointerCapture(event.pointerId);
    portrait.style.transition = "none";
  });

  portrait.addEventListener("pointermove", event => {
    if(!dragging || !start) return;
    let dx = event.clientX - start.x, dy = event.clientY - start.y;
    dragDistance = Math.hypot(dx, dy);
    const max = 42, magnitude = Math.max(1, dragDistance);
    if(magnitude > max){ dx = (dx / magnitude) * max; dy = (dy / magnitude) * max; }

    portrait.style.transform = `translate3d(${dx}px, ${dy}px, 48px) rotateX(${-dy / 6}deg) rotateY(${dx / 6}deg) scale(1.02)`;
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

    setTimeout(() => { setActive(null); portrait.style.transition = ""; }, 230);

    if(wasTap){
      const now = Date.now();
      if(now - lastTap < 450){ window.location.href = CALL_LINK; }
      else{
        lastTap = now;
        if(label) label.innerHTML = `Tap again to call<small>or drag to explore</small>`;
        setTimeout(() => { if(Date.now() - lastTap >= 430) labelDefault(); }, 1100);
      }
      return;
    }

    if(chosen) setTimeout(() => { window.location.href = urls[chosen]; }, 180);
  }

  portrait.addEventListener("pointerup", end);
  portrait.addEventListener("pointercancel", end);
}

/* Phase E — Mouse/phone parallax */
const stage = $("#appRoot");
const layers = $$(".layer-depth");
function moveLayers(x, y){
  layers.forEach(layer => {
    const depth = parseFloat(layer.dataset.depth || "0.06");
    layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
  });
}
stage?.addEventListener("pointermove", e => {
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  moveLayers((e.clientX - cx) / 8, (e.clientY - cy) / 8);
});
window.addEventListener("deviceorientation", e => {
  if(e.gamma == null || e.beta == null) return;
  moveLayers(e.gamma * 1.5, e.beta * 0.9);
});

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
