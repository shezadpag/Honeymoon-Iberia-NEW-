const CACHE='honeymoon-v12';
const ASSETS=[
  './',
  './index.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://a.tile.openstreetmap.org/10/512/342.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.slice(0,2))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(res=>{
      if(!res||res.status!==200||res.type==='opaque')return res;
      var clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    }).catch(()=>cached||new Response('Offline',{status:503}));
  }));
});
