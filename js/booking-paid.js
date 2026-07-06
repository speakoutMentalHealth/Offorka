const bookingModal=document.querySelector('#bookingModal');const bookingService=document.querySelector('#bookingService');const bookingMeta=document.querySelector('#bookingMeta');const bookingPayButton=document.querySelector('#bookingPayButton');document.querySelectorAll('[data-paid-booking]').forEach(button=>{button.addEventListener('click',()=>{const service=button.dataset.service||'Private Consultation';const duration=button.dataset.duration||'';const price=button.dataset.price||'';const paylink=button.dataset.paylink||'#';bookingService.textContent=service;bookingMeta.textContent=`${duration} · ${price}`;bookingPayButton.href=paylink;if(paylink.includes('PASTE_PAYSTACK')||paylink==='#'){bookingPayButton.textContent='Payment Link Needed';bookingPayButton.removeAttribute('target');bookingPayButton.onclick=e=>{e.preventDefault();alert('Add the correct Paystack payment link for this service in booking.html.')}}else{bookingPayButton.textContent='Proceed to Payment';bookingPayButton.setAttribute('target','_blank');bookingPayButton.onclick=null}bookingModal.classList.add('open');bookingModal.setAttribute('aria-hidden','false')})});document.querySelectorAll('[data-close-booking],.booking-backdrop').forEach(el=>{el.addEventListener('click',()=>{bookingModal.classList.remove('open');bookingModal.setAttribute('aria-hidden','true')})});


/* OFFORKA OS v6.0 production guards */
(() => {
  document.documentElement.classList.add("offorka-v6");

  // Close overlays with Escape
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    document.querySelector("#drawer")?.classList.remove("open");
    document.querySelector("#drawer")?.setAttribute("aria-hidden","true");
    document.querySelector("#aiModal")?.classList.remove("open");
    document.querySelector("#aiModal")?.setAttribute("aria-hidden","true");
    document.querySelector("#bookingModal")?.classList.remove("open");
    document.querySelector("#bookingModal")?.setAttribute("aria-hidden","true");
  });

  // Prevent broken placeholder links from silently failing
  document.addEventListener("click", e => {
    const link = e.target.closest("a[href*='PASTE_']");
    if (!link) return;
    e.preventDefault();
    alert("This link needs to be updated in the code before going live.");
  });

  // Add mobile tap feedback class
  document.addEventListener("pointerdown", e => {
    const target = e.target.closest("a,button");
    if (!target) return;
    target.classList.add("is-tapping");
  }, {passive:true});

  document.addEventListener("pointerup", () => {
    document.querySelectorAll(".is-tapping").forEach(el => el.classList.remove("is-tapping"));
  }, {passive:true});
})();
