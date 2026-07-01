(function(){
  const root=document.documentElement;
  const themes=['night','day','aura'];
  const themeIcon={night:'☾',day:'☀',aura:'✦'};
  const saved=localStorage.getItem('jerryTheme')||'night';
  root.dataset.theme=themes.includes(saved)?saved:'night';
  function syncTheme(){document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=themeIcon[root.dataset.theme]||'☾';b.setAttribute('aria-label','Theme: '+root.dataset.theme+'. Tap to change theme');});}
  syncTheme();
  document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-toggle]'); if(!b) return; const i=(themes.indexOf(root.dataset.theme)+1)%themes.length; root.dataset.theme=themes[i]; localStorage.setItem('jerryTheme',themes[i]); syncTheme();});
  window.addEventListener('load',()=>setTimeout(()=>document.querySelector('.preloader')?.classList.add('done'),450));
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}

  const launcherBtn=document.getElementById('launcherBtn'), launcher=document.getElementById('launcher'), launcherClose=document.getElementById('launcherClose');
  launcherBtn?.addEventListener('click',()=>launcher?.classList.add('open'));
  launcherClose?.addEventListener('click',()=>launcher?.classList.remove('open'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') launcher?.classList.remove('open')});

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const portrait=document.getElementById('portraitControl'), system=document.getElementById('orbitalSystem');
  if(!portrait||!system) return;
  const nodes=[...document.querySelectorAll('.node[data-dir]')];
  const activeLabel=document.getElementById('activeLabel');
  const labels={up:'Public Speaking — keynotes, panels and workshops',left:'Leadership & Consulting — strategy, training and institutional support',right:'Books & Media — books, podcasts, articles and videos',down:'Book a Session — mental health consultation'};
  const urls={up:'speaking.html',left:'consulting.html',right:'media.html',down:'booking.html'};
  let startX=0,startY=0,dragging=false,selected=null; const maxMove=44, threshold=23;
  function setActive(dir){selected=dir; nodes.forEach(n=>n.classList.toggle('active',n.dataset.dir===dir)); if(activeLabel) activeLabel.textContent=dir?labels[dir]:'Drag the centre portrait to choose a service'; if(dir&&navigator.vibrate&&!reduced) navigator.vibrate(8);}
  function direction(dx,dy){if(Math.hypot(dx,dy)<threshold)return null; return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
  function move(x0,y0){const dx=x0-startX,dy=y0-startY,mag=Math.hypot(dx,dy)||1,lim=Math.min(maxMove,mag),x=dx/mag*lim,y=dy/mag*lim; portrait.style.transform=`translate(${x}px,${y}px) rotateX(${-y/7}deg) rotateY(${x/7}deg)`; portrait.style.setProperty('--px',`${50+x}%`); portrait.style.setProperty('--py',`${35+y}%`); const d=direction(dx,dy); if(d!==selected)setActive(d);}
  portrait.addEventListener('pointerdown',e=>{dragging=true;selected=null;startX=e.clientX;startY=e.clientY;portrait.setPointerCapture(e.pointerId);portrait.style.transition='none';});
  portrait.addEventListener('pointermove',e=>{if(dragging)move(e.clientX,e.clientY)});
  function release(){if(!dragging)return; dragging=false; portrait.style.transition='transform .34s cubic-bezier(.2,.9,.2,1), box-shadow .25s ease'; portrait.style.transform='translate(0,0) rotateX(0) rotateY(0)'; const target=selected; setTimeout(()=>nodes.forEach(n=>n.classList.remove('active')),250); if(target&&urls[target]) setTimeout(()=>location.href=urls[target],170);}
  portrait.addEventListener('pointerup',release); portrait.addEventListener('pointercancel',release);
})();
