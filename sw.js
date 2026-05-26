const CACHE='violin-v8';
const URLS=['./','./ViolinReal-v5.html','./v6_patch.js','./v7_patch.js','./v8_patch.js','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('.html')){
    e.respondWith(
      fetch(e.request).then(res=>{
        if(res.ok){
          const clone=res.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request,clone));
          return res.text().then(html=>{
            if(!html.includes('v6_patch.js')){
              html=html.replace('</body>','<script src="./v6_patch.js"><\/script>\n</body>');
            }
            if(!html.includes('v7_patch.js')){
              html=html.replace('</body>','<script src="./v7_patch.js"><\/script>\n</body>');
            }
            if(!html.includes('v8_patch.js')){
              html=html.replace('</body>','<script src="./v8_patch.js"><\/script>\n</body>');
            }
            return new Response(html,{headers:{'content-type':'text/html;charset=UTF-8'}});
          });
        }
        return res;
      }).catch(()=>caches.match(e.request).then(cached=>{
        if(!cached)return caches.match('./');
        return cached.text().then(html=>{
          if(!html.includes('v6_patch.js')){
            html=html.replace('</body>','<script src="./v6_patch.js"><\/script>\n</body>');
          }
          if(!html.includes('v7_patch.js')){
            html=html.replace('</body>','<script src="./v7_patch.js"><\/script>\n</body>');
          }
          if(!html.includes('v8_patch.js')){
            html=html.replace('</body>','<script src="./v8_patch.js"><\/script>\n</body>');
          }
          return new Response(html,{headers:{'content-type':'text/html;charset=UTF-8'}});
        });
      }))
    );
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(res.ok){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}
      return res;
    }).catch(()=>caches.match('./'))));
  }
});