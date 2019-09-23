importScripts('/cache-polyfill.js') // eslint-disable-line no-undef

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('vue-crossword').then(function (cache) {
      return cache.addAll([
        // '/',
        '/index.html',
        '/css/app.9e0f37c5.css',
        '/css/chunk-vendors.cd1704ab.css',
        '/js/app.ef382fec.js',
        '/js/chunk-vendors.63c83423.js',
      ])
    })
  )
})
