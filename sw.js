const CACHE = 'offorka-v1';
const ASSETS = ['./','./index.html','./css/style.css','./js/main.js','./assets/images/jerry-background.webp','./assets/images/jerry-profile.jpg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
