'use strict';
var cacheVersion = 1;
var cacheName = 'v1'
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
var offlineUrls = ['/static/avatars/temp.png',
                   '/static/css/bootstrap.min.css',
                   '/static/js/bootstrap.min.js',
                   'static/js/jquery-3.4.1.min.js',
                   '/',
                   '/profile'];

//install

self.addEventListener('install', function(event) {console.log('WORKER: install event in progress.');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {console.log('Opened cache');
      return cache.addAll(offlineUrls)
    }).then(function() {console.log('WORKER: install completed');
  })
  );
});

// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           // Return true if you want to remove this cache,
//           // but remember that caches are shared across
//           // the whole origin
//           // handel indexedDB
//         }).map(function(cacheName) {
//           console.log('clearing old caches');
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {console.log('WORKER: fetch event in progress...');

//       if (event.request.method !== 'GET') {
//         console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
//         return;
//       }

//       event.respondWith(caches.match(event.request).then(function(cached) {
//       var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve)
//       .catch(unableToResolve);
//       console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
//       return cached || networked;


// function fetchedFromNetwork(response) {
//   var cacheCopy = response.clone();
//   console.log('WORKER: fetch response from network.', event.request.url);
//   caches.open(version + 'pages')
//   .then(function add(cache) {
//     cache.put(event.request, cacheCopy);
//   })
//   .then(function() {
//     console.log('WORKER: fetch response stored in cache.', event.request.url);
//   });
//   return response;
// }

// function unableToResolve () {
//   console.log('WORKER: fetch request failed in both cache and network.');
//   return new Response('<h1>Service Unavailable</h1>', {
//     status: 503,
//     statusText: 'Service Unavailable',
//     headers: new Headers({
//       'Content-Type': 'text/html'
//     })
//   });
// }
// })
// );
// });


// self.addEventListener('message', function (event) {
//   console.log('form data', event.data)
//   if (event.data.hasOwnProperty('form_data')) {
//     // receives form data from db.js upon submission
//     form_data = event.data.form_data
//   }
// })

// function getObjectStore (storeName, mode) {
//   // retrieve our object store
//   return db.transaction([storeName],mode
//    ).objectStore(storeName);
// }
// function savePostRequests (url, payload) {
//   // get object_store and save our payload inside it
//   var request = getObjectStore('profile', 'readwrite').put(payload,1
//   //   {
//   //   url: url,
//   //   payload: payload,
//   //   method: 'POST'
//   // }
//   )
//   request.onsuccess = function (event) {
//     console.log('a new pos_ request has been added to indexedb')
//   }
//   request.onerror = function (error) {
//     console.error(error)
//   }
// }

self.addEventListener('fetch', e=> {console.log('WORKER: fetch event in progress...');

      if (e.request.method !== 'GET') {
        console.log('GET methodes only');
        // e.respondWith(
          
        //   // fetch(event.request.clone()).catch(function
        //   //   (error) {
        //   //     // only save post requests in browser, if an error occurs
        //   //     savePostRequests(event.request.clone().url, form_data)
        //   //   })
        //     );

      }

      e.respondWith(
        fetch(e.request).catch(()=> caches.match(e.request))
      );

      // e.respondWith(
      //   fetch(e.request).then(
      //     res => {
      //     // clone the response
      //     const cresClone = response.clone();
      //     caches.open(cacheName).then(cache => {
      //       cache.put(e.request, cresClone);
      //     });
      //     return res;
      //     }).catch(err => caches.match(e.request).then(res => res))
      // );


});