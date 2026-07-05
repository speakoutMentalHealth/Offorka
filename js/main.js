const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const CALL_LINK = "tel:+2348118103510";
const PAYSTACK_DONATION_LINK = "https://paystack.shop/pay/speakout-donate";
const FIREBASE_AI_ENDPOINT = "https://us-central1-speaakout-portal.cloudfunctions.net/askJerry";

function applyTheme(theme){
  document.documentElement.dataset.theme = theme === "day" ? "day" : "";
  localStorage.setItem("offorka-theme", theme);
  const btn = $("#themeTrigger");
  if(btn) btn.textContent = theme === "day" ? "☀️" : "🌙";
}
applyTheme(localStorage.getItem("offorka-theme") || "night");

$("#themeTrigger")?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "day" ? "night" : "day";
  applyTheme(next);
});

const intro = $("#intro");
function closeIntro(){ intro?.classList.add("done"); }
$("#introSkip")?.addEventListener("click", closeIntro);
window.addEventListener("load", () => setTimeout(closeIntro, 4300));

$("#menuTrigger")?.addEventListener("click", () => {
  $("#drawer")?.classList.add("open");
  $("#drawer")?.setAttribute("aria-hidden","false");
});
$$("[data-close-menu], .drawer-backdrop").forEach(el => el.addEventListener("click", () => {
  $("#drawer")?.classList.remove("open");
  $("#drawer")?.setAttribute("aria-hidden","true");
}));

$$("[data-donate]").forEach(el => el.addEventListener("click", e => {
  e.preventDefault();
  window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
}));

/* Jerry+ AI */
const aiModal = $("#aiModal");
const aiMessages = $("#aiMessages");
const aiQuestion = $("#aiQuestion");
function openAI(){
  aiModal?.classList.add("open");
  aiModal?.setAttribute("aria-hidden","false");
  setTimeout(() => aiQuestion?.focus(), 100);
}
function closeAI(){
  aiModal?.classList.remove("open");
  aiModal?.setAttribute("aria-hidden","true");
}
$$("[data-open-ai]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); openAI(); }));
$$("[data-close-ai], .modal-backdrop").forEach(el => el.addEventListener("click", closeAI));
function addMessage(role, text){
  const div = document.createElement("div");
  div.className = `ai-message ${role}`;
  div.textContent = text;
  aiMessages?.appendChild(div);
  if(aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
}
$("#aiForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const q = aiQuestion.value.trim();
  if(!q) return;
  addMessage("user", q);
  aiQuestion.value = "";
  addMessage("assistant", "Thinking...");

  try{
    const res = await fetch(FIREBASE_AI_ENDPOINT, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question:q})
    });
    const data = await res.json();
    const replies = $$(".ai-message.assistant", aiMessages);
    const last = replies[replies.length - 1];
    last.textContent = res.ok ? (data.answer || "I’m here with you. Could you share a little more?") : (data.error || "Jerry+ is temporarily unavailable.");
  }catch{
    const replies = $$(".ai-message.assistant", aiMessages);
    const last = replies[replies.length - 1];
    last.textContent = "Jerry+ is not connected yet. Deploy the Firebase function to activate live AI.";
  }
});

/* Restored joystick: drag → label/highlight → release opens */
const joystick = $("#joystick");
if(joystick){
  const joyCopy = $("#joyCopy");
  const targets = {
    up: {label:"Public Speaking", url:"speaking.html", el:$(".sphere-up")},
    left: {label:"Leadership & Consulting", url:"consulting.html", el:$(".sphere-left")},
    right: {label:"Learning Hub", url:"media.html", el:$(".sphere-right")},
    down: {label:"Donate", donate:true, el:$(".sphere-down")}
  };
  let start = null, dragging = false, active = null, distance = 0, lastTap = 0;

  function resetCopy(){
    if(joyCopy) joyCopy.innerHTML = `<strong>Let’s Connect</strong><small>Tap to call · Drag to explore</small>`;
  }
  function setActive(dir){
    active = dir;
    Object.values(targets).forEach(t => t.el?.classList.remove("selected"));
    if(dir && targets[dir]){
      targets[dir].el?.classList.add("selected");
      if(joyCopy) joyCopy.innerHTML = `<strong>${targets[dir].label}</strong><small>Release to open</small>`;
    }else resetCopy();
  }
  function direction(dx,dy){
    const d = Math.hypot(dx,dy);
    if(d < 32) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  }

  joystick.addEventListener("pointerdown", e => {
    dragging = true; distance = 0; active = null;
    start = {x:e.clientX, y:e.clientY};
    joystick.setPointerCapture(e.pointerId);
    joystick.style.transition = "none";
  });

  joystick.addEventListener("pointermove", e => {
    if(!dragging || !start) return;
    const rawDx = e.clientX - start.x;
    const rawDy = e.clientY - start.y;
    distance = Math.hypot(rawDx, rawDy);

    let dx = rawDx, dy = rawDy;
    const max = 36, mag = Math.max(1,distance);
    if(mag > max){ dx = dx / mag * max; dy = dy / mag * max; }

    joystick.style.transform = `translate3d(${dx}px,${dy}px,64px) rotateX(${-dy/7}deg) rotateY(${dx/7}deg) scale(1.025)`;
    joystick.style.setProperty("--px", `${50 + dx}%`);
    joystick.style.setProperty("--py", `${50 + dy}%`);
    setActive(direction(rawDx, rawDy));
  });

  function end(){
    if(!dragging) return;
    dragging = false;
    const chosen = active;

    joystick.style.transition = "transform .34s cubic-bezier(.18,.9,.22,1.15)";
    joystick.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";

    if(distance < 12){
      location.href = CALL_LINK;
      return;
    }

    if(chosen && targets[chosen]){
      setTimeout(() => {
        if(targets[chosen].donate) window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
        else location.href = targets[chosen].url;
      }, 160);
    }
    setTimeout(() => setActive(null), 260);
  }

  joystick.addEventListener("pointerup", end);
  joystick.addEventListener("pointercancel", end);
}

/* Desktop spatial effect only */
if(matchMedia("(pointer:fine)").matches){
  const app = $("#app");
  const stage = $(".stage");
  app?.addEventListener("pointermove", e => {
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    if(stage) stage.style.transform = `rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
  });
}

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
