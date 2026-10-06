"use strict";

var CACHE_NAME = "cielo-v3";

var ASSETS = [
  "./",
  "./Cielo.html",
  "./estilos.css",
  "./app.js",
  "./wiki.js",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
          .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event){
  if (event.request.method !== "GET"){ return; }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if (cached){ return cached; }
      return fetch(event.request).then(function(response){
        if (!response || response.status !== 200 ||
            response.type !== "basic"){
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function(){
        return caches.match("./Cielo.html");
      });
    })
  );
});