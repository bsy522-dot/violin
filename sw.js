const CACHE='violin-v27';
const URLS=['./','./ViolinReal-v5.html','./v6_patch.js','./v7_patch.js','./v8_patch.js','./v9_patch.js','./v10_patch.js','./v11_patch.js','./v12_patch.js','./v13_patch.js','./v14_patch.js','./v15_patch.js','./v16_patch.js','./v17_patch.js','./v18_patch.js','./v19_patch.js','./v20_patch.js','./v21_patch.js','./v22_patch.js','./v23_patch.js','./v24_patch.js','./v25_patch.js','./v26_patch.js','./v27_patch.js','./manifest.json'];
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
            for(let v=6;v<=27;v++){
              if(!html.includes('v'+v+'_patch.js')){
                html=html.replace('</body>','<script src="./v'+v+'_patch.js"><\/script>\n</body>');
              }
            }
            return new Response(html,{headers:{'content-type':'text/html;charset=UTF-8'}});
          });
        }
        return res;
      }).catch(()=>caches.match(e.request).then(cached=>{
        if(!cached)return caches.match('./');
        return cached.text().then(html=>{
          for(let v=6;v<=27;v++){
            if(!html.includes('v'+v+'_patch.js')){
              html=html.replace('</body>','<script src="./v'+v+'_patch.js"><\/script>\n</body>');
            }
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
