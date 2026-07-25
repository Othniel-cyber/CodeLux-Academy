const CACHE_NAME = 'codelux-academy-v1';
const ASSETS = [
    '/CodeLux-Academy/index.html',
    '/CodeLux-Academy/css/style.css',
    '/CodeLux-Academy/js/data.js',
    '/CodeLux-Academy/js/app.js',
    '/CodeLux-Academy/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});