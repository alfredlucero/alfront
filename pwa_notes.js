// Progressive Web Apps
// Using service workers to cache app shell locally on device for faster performance over time
// and so it is available even when the network isn't
// - Service workers more of progressive enhancement and added only if supported by browser through feature detection
// - Only works with HTTPS
// - Sample strategy such as cache-first-then-network or the converse
// - Can declare app manifest with manifest.json for Android full-screen presence, "splash screen"
// or add to Homescreen elements for Safari on iOS

/* Typical Steps */
// 1. Register service worker if available
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./service-worker.js')
           .then(function() { console.log('Service worker registered') });
}

// Once registered an install event is triggered the first time the user visits the page
// 2. Cache the site assets for the application
// Sample but not best practice -> debug by going to DevTools-Application-Service Worker
// -> edge cases: cache depends on updating cache key for every change, requires everything to be redownloaded 
// for every change, browser cache may prevent service worker cache from updating
// -> probably user sw-precache to provide fine control over what is expired and ensure requests go directly to 
// the network and handles all of the hard work for you
// Set Update On Reload checkbox so new service worker gets activated 
var cacheName = 'sampleAppCache-1';
// Make sure you you include all permutations of file names like index.html being served from /
// and /index.html
var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

// Happens after registering
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] install');
  e.waitUntil(
    // Cache name lets you version files or separate data from app shell
    // so we can easily update one but not affect the other
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      // Takes list of URLS, then fetches them from server and adds response to the cache
      // Atomic action and if any of the files fail, the entire cache step fails
      return cache.addAll(filesToCache);
    });
  );
});

// Happens on start up
// Ensuring that service worker updates its cache whenever any of the app shell files change
// Need to increment the cacheName variable at top of your service worker file
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    });
  );

  // Lets you activate the service worker faster in the corner case
  // that it won't show newer cached data
  return self.clients.claim();
});

// 3. Serve the app shell from the cache
// Can check out Cache Storage pane on Application panel and enable offline to test
// and seeing yellow warning on network panel
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    // Evaluates web request that triggered fetch and checks to see if
    // available in the cache and then responds with cached version  or
    // users fetch to get a copy from the network
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    });
  );
})
