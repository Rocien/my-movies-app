// Initiating my cache here
const version = '1';
const cacheName = `pwa-myMovie-${version}`;
const movieDetailsCache = `pwa-movieDetails-${version}`;
const elementsToCache = ['/', '/index.html', '/css/style.css', '/js/main.js']; // Adding the paths of assets that i want to cache

// Installing my service worker here
self.addEventListener('install', (ev) => {
  // Performing the install steps
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('My cache Opened');
      return cache.addAll(elementsToCache);
    })
  );
});

// Activate my service worker here
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName, movieDetailsCache];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (cacheWhitelist.indexOf(name) === -1) {
              return caches.delete(name); // Here it delete caches not in the whitelist
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim(); // After the old caches are cleaned up, claim the clients to activate SW immediately.
      })
  );
});

// Here i am caching the fetched response for future use
self.addEventListener('fetch', function (ev) {
  const url = 'https://moviedb-server-m35e.onrender.com/api/id/'; // Base URL for movie details

  // If the request matches the movie details URL pattern
  if (ev.request.url.startsWith(url)) {
    ev.respondWith(
      caches.open(movieDetailsCache).then((cache) => {
        return cache.match(ev.request).then((response) => {
          if (response) {
            return response; // If the movie details is already cached, return it
          }

          // If not, fetch the movie details from the network
          return fetch(ev.request)
            .then((networkResponse) => {
              // Cache the movie details for future use
              cache.put(ev.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => {
              // If fetching fails, return a generic 404 response
              return response404();
            });
        });
      })
    );
  } else {
    // For all other requests, use cache-first strategy defined earlier
    ev.respondWith(cacheFirstAndSave(ev));
  }
});

// Using this function to implements a cache first and save strategy,
// meaning that where it attempts to serve responses from the cache before fetching from the network.
function cacheFirstAndSave(ev) {
  // Attempting to match the request in the cache
  return caches.match(ev.request).then((cacheResponse) => {
    // The below means if a cached response exists, return it, if not, proceed to fetch from the network
    return (
      cacheResponse ||
      fetch(ev.request)
        .then((fetchResp) => {
          // Check if the response is valid, a response with status > 0 and not ok (not in the 200-299 range) is considered invalid.
          if (fetchResp.status > 0 && !fetchResp.ok) throw new Error('bad response');
          // If the fetched response is valid, open the cache
          return caches
            .open(cacheName)
            .then((cache) => {
              // Once the cache is open, store the fetched response clone in the cache
              // Cloning it will be necessary as responses are streams and can only be read once.
              return cache.put(ev.request, fetchResp.clone());
            })
            .then(() => {
              // After successfully storing the response in the cache, return the original fetch response
              return fetchResp; // Send the response to the browser.
            });
        })
        .catch((err) => {
          // If any error occurs during the fetch or caching process, return a generic 404 response.
          return response404(); // This calling a function below that generates a 404 response
        })
    );
  });
}

// This function generates and returns a generic 404 error response.
function response404() {
  return new Response(null, { status: 404 });
}
