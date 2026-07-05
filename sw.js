const CACHE='offorka-os-3-v1';
const ASSETS=['./','./index.html','./css/style.css','./js/main.js','./manifest.json','./assets/images/jerry-background.webp','./assets/images/jerry-profile.webp','./about.html','./speaking.html','./consulting.html','./media.html','./booking.html','./contact.html','./speakout.html','./ai.html','./assessment.html','./events.html','./support.html','./impact.html','./emergency.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html')))));
