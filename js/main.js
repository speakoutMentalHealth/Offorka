const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const PAYSTACK_DONATION_LINK = "https://paystack.shop/pay/speakout-donate";
const FIREBASE_AI_ENDPOINT = "https://us-central1-speaakout-portal.cloudfunctions.net/askJerry";

function applyTheme(theme){
  document.documentElement.dataset.theme = theme === "day" ? "day" : "";
  localStorage.setItem("offorka-theme", theme);
  $$(".theme-action").forEach(btn => btn.textContent = theme === "day" ? "☀️" : "🌙");
}
applyTheme(localStorage.getItem("offorka-theme") || "night");

$$(".theme-action").forEach(btn => btn.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "day" ? "night" : "day");
}));

$$("[data-donate]").forEach(el => el.addEventListener("click", e => {
  e.preventDefault();
  window.open(PAYSTACK_DONATION_LINK, "_blank", "noopener,noreferrer");
}));

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
