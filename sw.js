const CACHE_NAME = 'hanzai-tools-v1';
const CACHE_URLS = [
    '/index.html',
    '/studen/king_of_words/index.html',
    '/studen/random_studen_drawing/index.html',
    '/studen/studen_leaderboard/index.html',
    // 添加其他需要缓存的资源路径
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_URLS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});