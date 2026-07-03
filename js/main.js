const $=(s,root=document)=>root.querySelector(s);const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const themes=['night','day','aura'];
function applyTheme(t){document.documentElement.dataset.theme=t==='night'?'':t;localStorage.setItem('offorka-theme',t);const btn=$('.theme-btn');if(btn)btn.textContent=t==='night'?'🌙':t==='day'?'☀️':'✨';}
applyTheme(localStorage.getItem('offorka-theme')||'night');
window.addEventListener('load',()=>setTimeout(()=>$('.preloader')?.classList.add('done'),650));
$('.theme-btn')?.addEventListener('click',()=>{let cur=localStorage.getItem('offorka-theme')||'night';applyTheme(themes[(themes.indexOf(cur)+1)%themes.length]);});
$('[data-open-launcher]')?.addEventListener('click',()=>$('#launcher')?.classList.add('open'));
$$('[data-close-launcher],.launcher-close').forEach(b=>b.addEventListener('click',()=>$('#launcher')?.classList.remove('open')));
const reflections=['Every meaningful change begins with a conversation.','Strong minds create stronger communities.','Healing begins when people feel heard.','Compassion is the beginning of leadership.','Every voice deserves hope.'];
const ref=$('#dailyReflection'); if(ref){let i=new Date().getDate()%reflections.length;ref.textContent=reflections[i];setInterval(()=>{i=(i+1)%reflections.length;ref.animate([{opacity:.25,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'ease-out'});ref.textContent=reflections[i];},10000);}
const portrait=$('#portraitControl');
if(portrait){
  const nodes={up:$('.node-up'),left:$('.node-left'),right:$('.node-right'),down:$('.node-down')};
  const labels={up:'Public Speaking',left:'Leadership & Consulting',right:'Learning Hub',down:'Book a Session'};
  const urls={up:'speaking.html',left:'consulting.html',right:'media.html',down:'booking.html'};
  const label=$('#activeLabel');let start=null,active=null,dragging=false;
  function setActive(dir){active=dir;Object.values(nodes).forEach(n=>n?.classList.remove('active'));if(dir){nodes[dir]?.classList.add('active');if(label)label.textContent=`Release to open ${labels[dir]}`;}else if(label)label.textContent='Drag my portrait toward a service';}
  function direction(dx,dy){const d=Math.hypot(dx,dy); if(d<30)return null; return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
  portrait.addEventListener('pointerdown',e=>{dragging=true;start={x:e.clientX,y:e.clientY};portrait.setPointerCapture(e.pointerId);portrait.style.transition='none';});
  portrait.addEventListener('pointermove',e=>{if(!dragging||!start)return;let dx=e.clientX-start.x,dy=e.clientY-start.y;const max=36;const mag=Math.max(1,Math.hypot(dx,dy));if(mag>max){dx=dx/mag*max;dy=dy/mag*max;}portrait.style.transform=`translate(${dx}px,${dy}px) rotateX(${-dy/7}deg) rotateY(${dx/7}deg)`;portrait.style.setProperty('--px',`${50+dx}%`);portrait.style.setProperty('--py',`${50+dy}%`);setActive(direction(e.clientX-start.x,e.clientY-start.y));});
  function end(){if(!dragging)return;dragging=false;portrait.style.transition='transform .34s cubic-bezier(.18,.9,.22,1.15)';portrait.style.transform='translate(0,0)';const chosen=active;setTimeout(()=>{setActive(null);portrait.style.transition='';},220);if(chosen)setTimeout(()=>{location.href=urls[chosen];},180);}
  portrait.addEventListener('pointerup',end);portrait.addEventListener('pointercancel',end);
}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
