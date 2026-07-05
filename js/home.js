const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const CALL_LINK = "tel:+2348118103510";
const PAYSTACK_DONATION_LINK = "https://paystack.shop/pay/speakout-donate";
const FIREBASE_AI_ENDPOINT = "https://us-central1-speaakout-portal.cloudfunctions.net/askJerry";

function applyTheme(theme){
  document.documentElement.dataset.theme = theme === "day" ? "day" : "";
  localStorage.setItem("offorka-theme", theme);
  const btn = $("#themeAction");
  if(btn) btn.textContent = theme === "day" ? "☀️" : "🌙";
}
applyTheme(localStorage.getItem("offorka-theme") || "night");

$("#themeAction")?.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "day" ? "night" : "day");
});

const boot = $("#boot");
function closeBoot(){ boot?.classList.add("done"); }
$("#skipBoot")?.addEventListener("click", closeBoot);
window.addEventListener("load", () => setTimeout(closeBoot, 4200));

$("#menuAction")?.addEventListener("click", () => {
  $("#drawer")?.classList.add("open");
  $("#drawer")?.setAttribute("aria-hidden", "false");
});
$$("[data-close-menu], .drawer-backdrop").forEach(el => el.addEventListener("click", () => {
  $("#drawer")?.classList.remove("open");
  $("#drawer")?.setAttribute("aria-hidden", "true");
}));

$$("[data-donate]").forEach(el => el.addEventListener("click", e => {
  e.preventDefault();
  window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
}));

/* AI modal */
const aiModal = $("#aiModal");
const aiMessages = $("#aiMessages");
const aiQuestion = $("#aiQuestion");

function openAI(){
  aiModal?.classList.add("open");
  aiModal?.setAttribute("aria-hidden", "false");
  setTimeout(() => aiQuestion?.focus(), 100);
}
function closeAI(){
  aiModal?.classList.remove("open");
  aiModal?.setAttribute("aria-hidden", "true");
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

    last.textContent = res.ok
      ? (data.answer || "I’m here with you. Could you share a little more?")
      : (data.error || "Jerry+ is temporarily unavailable.");
  }catch{
    const replies = $$(".ai-message.assistant", aiMessages);
    const last = replies[replies.length - 1];
    last.textContent = "Jerry+ is not connected yet. Deploy the Firebase function to activate live AI.";
  }
});

/* joystick */
const analog = $("#analog");

if(analog){
  const chip = $("#analogChip");
  const targets = {
    up: { label:"Public Speaking", url:"speaking.html", el:$(".up") },
    left: { label:"Leadership & Consulting", url:"consulting.html", el:$(".left") },
    right: { label:"Learning Hub", url:"media.html", el:$(".right") },
    down: { label:"Donate", donate:true, el:$(".down") }
  };

  let start = null;
  let dragging = false;
  let active = null;
  let distance = 0;

  function resetChip(){
    if(chip) chip.innerHTML = `<strong>Tap to Call</strong><small>Drag to explore</small>`;
  }

  function setActive(dir){
    active = dir;
    Object.values(targets).forEach(t => t.el?.classList.remove("selected"));

    if(dir && targets[dir]){
      targets[dir].el?.classList.add("selected");
      if(chip) chip.innerHTML = `<strong>${targets[dir].label}</strong><small>Release to open</small>`;
    }else{
      resetChip();
    }
  }

  function direction(dx,dy){
    const d = Math.hypot(dx,dy);
    if(d < 32) return null;
    return Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? "right" : "left")
      : (dy > 0 ? "down" : "up");
  }

  analog.addEventListener("pointerdown", e => {
    dragging = true;
    active = null;
    distance = 0;
    start = { x:e.clientX, y:e.clientY };
    analog.setPointerCapture(e.pointerId);
    analog.style.transition = "none";
  });

  analog.addEventListener("pointermove", e => {
    if(!dragging || !start) return;

    const rawDx = e.clientX - start.x;
    const rawDy = e.clientY - start.y;
    distance = Math.hypot(rawDx, rawDy);

    let dx = rawDx;
    let dy = rawDy;
    const max = 36;
    const mag = Math.max(1, distance);

    if(mag > max){
      dx = dx / mag * max;
      dy = dy / mag * max;
    }

    analog.style.transform = `translate3d(${dx}px,${dy}px,68px) rotateX(${-dy/7}deg) rotateY(${dx/7}deg) scale(1.025)`;
    analog.style.setProperty("--px", `${50 + dx}%`);
    analog.style.setProperty("--py", `${50 + dy}%`);

    setActive(direction(rawDx, rawDy));
  });

  function endAnalog(){
    if(!dragging) return;

    dragging = false;
    const chosen = active;

    analog.style.transition = "transform .34s cubic-bezier(.18,.9,.22,1.15)";
    analog.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";

    if(distance < 12){
      location.href = CALL_LINK;
      return;
    }

    if(chosen && targets[chosen]){
      setTimeout(() => {
        if(targets[chosen].donate){
          window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
        }else{
          location.href = targets[chosen].url;
        }
      }, 150);
    }

    setTimeout(() => setActive(null), 250);
  }

  analog.addEventListener("pointerup", endAnalog);
  analog.addEventListener("pointercancel", endAnalog);
}

/* desktop spatial depth */
if(matchMedia("(pointer:fine)").matches){
  const orbit = $("#orbitSystem");
  $("#homeOS")?.addEventListener("pointermove", e => {
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    if(orbit) orbit.style.transform = `rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
  });
}
