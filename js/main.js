const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const PAYSTACK_DONATION_LINK = "https://paystack.shop/pay/speakout-donate";
const CALL_LINK = "tel:+2348118103510";
const FIREBASE_AI_ENDPOINT = "https://us-central1-speaakout-portal.cloudfunctions.net/askJerry";

const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("offorka-theme") || "night";
if(savedTheme === "day") document.documentElement.dataset.theme = "day";

themeBtn?.addEventListener("click", () => {
  const isDay = document.documentElement.dataset.theme === "day";
  document.documentElement.dataset.theme = isDay ? "" : "day";
  localStorage.setItem("offorka-theme", isDay ? "night" : "day");
  themeBtn.querySelector("span").textContent = isDay ? "🌙" : "☀️";
});

function greeting(){
  const h = new Date().getHours();
  const text = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  const g = $("#greeting");
  if(g) g.innerHTML = `${text}, <em>Friend</em> 👋`;
}
greeting();

$$("[data-donate]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
  });
});

$("#menuBtn")?.addEventListener("click", () => $("#drawer")?.classList.add("open"));
$$("[data-close-menu], .drawer-backdrop").forEach(btn => {
  btn.addEventListener("click", () => $("#drawer")?.classList.remove("open"));
});

const aiModal = $("#aiModal");
const aiMessages = $("#aiMessages");
const aiQuestion = $("#aiQuestion");
const aiForm = $("#aiForm");

function openAI(){
  aiModal?.classList.add("open");
  aiModal?.setAttribute("aria-hidden","false");
  setTimeout(() => aiQuestion?.focus(), 100);
}

function closeAI(){
  aiModal?.classList.remove("open");
  aiModal?.setAttribute("aria-hidden","true");
}

$$("[data-open-ai]").forEach(btn => btn.addEventListener("click", openAI));
$$("[data-close-ai], .modal-backdrop").forEach(btn => btn.addEventListener("click", closeAI));

function addMessage(role, text){
  const div = document.createElement("div");
  div.className = `ai-message ${role}`;
  div.textContent = text;
  aiMessages?.appendChild(div);
  if(aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
}

aiForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const question = aiQuestion.value.trim();
  if(!question) return;

  addMessage("user", question);
  aiQuestion.value = "";
  addMessage("assistant", "Thinking...");

  try{
    const res = await fetch(FIREBASE_AI_ENDPOINT, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question})
    });

    const data = await res.json();
    const assistants = $$(".ai-message.assistant", aiMessages);
    const last = assistants[assistants.length - 1];

    if(!res.ok){
      last.textContent = data.error || "Jerry+ is temporarily unavailable.";
      return;
    }

    last.textContent = data.answer || "I’m here with you. Could you share a little more?";
  }catch(err){
    const assistants = $$(".ai-message.assistant", aiMessages);
    const last = assistants[assistants.length - 1];
    last.textContent = "Jerry+ is not connected yet. Deploy the Firebase function to activate live AI.";
  }
});

/* Mobile-first joystick feel */
const portrait = $("#portraitControl");
if(portrait){
  let start = null;
  let dragging = false;
  let distance = 0;
  let lastTap = 0;

  portrait.addEventListener("pointerdown", e => {
    dragging = true;
    distance = 0;
    start = {x:e.clientX, y:e.clientY};
    portrait.setPointerCapture(e.pointerId);
    portrait.style.transition = "none";
  });

  portrait.addEventListener("pointermove", e => {
    if(!dragging || !start) return;

    let dx = e.clientX - start.x;
    let dy = e.clientY - start.y;
    distance = Math.hypot(dx,dy);

    const max = 34;
    const mag = Math.max(1,distance);
    if(mag > max){
      dx = dx / mag * max;
      dy = dy / mag * max;
    }

    portrait.style.transform = `translate3d(${dx}px,${dy}px,60px) rotateX(${-dy/7}deg) rotateY(${dx/7}deg) scale(1.025)`;
    portrait.style.setProperty("--px", `${50 + dx}%`);
    portrait.style.setProperty("--py", `${50 + dy}%`);
  });

  function reset(){
    if(!dragging) return;
    dragging = false;
    portrait.style.transition = "transform .34s cubic-bezier(.18,.9,.22,1.15)";
    portrait.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";

    if(distance < 12){
      const now = Date.now();
      if(now - lastTap < 450){
        location.href = CALL_LINK;
      }else{
        lastTap = now;
        const txt = $("#portraitText");
        if(txt) txt.innerHTML = `<strong>Tap Again</strong><small>to call now</small><i></i>`;
        setTimeout(() => {
          if(txt) txt.innerHTML = `<strong>Let’s Connect</strong><small>Tap to call · Drag to explore</small><i></i>`;
        }, 1200);
      }
    }
  }

  portrait.addEventListener("pointerup", reset);
  portrait.addEventListener("pointercancel", reset);
}

/* Desktop spatial movement */
if(matchMedia("(pointer:fine)").matches){
  const app = $("#app");
  app?.addEventListener("pointermove", e => {
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    document.documentElement.style.setProperty("--mx", x.toFixed(2));
    document.documentElement.style.setProperty("--my", y.toFixed(2));

    $(".hero-orbit")?.style.setProperty("transform", `rotateX(${y * -3}deg) rotateY(${x * 4}deg)`);
  });
}
