const CACHE_NAME = 'codelux-academy-v2';
const STATIC_ASSETS = [
    '/CodeLux-Academy/index.html',
    '/CodeLux-Academy/css/style.css',
    '/CodeLux-Academy/js/data.js',
    '/CodeLux-Academy/js/app.js',
    '/CodeLux-Academy/js/supabase-config.js',
    '/CodeLux-Academy/manifest.json',
    '/CodeLux-Academy/icons/icon.svg'
];
const CDN_ASSETS = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://unpkg.com/@supabase/supabase-js@2'
];
const ALL_ASSETS = [...STATIC_ASSETS, ...CDN_ASSETS];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                ALL_ASSETS.map(url =>
                    cache.add(url).catch(() => {
                        console.warn('Échec du cache pour:', url);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.ok) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('/CodeLux-Academy/index.html');
                }
                return new Response('', { status: 408, statusText: 'Hors-ligne' });
            });
        })
    );
});
