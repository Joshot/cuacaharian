/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Deklarasi tipe untuk __WB_MANIFEST
declare const self: ServiceWorkerGlobalScope & {
    __WB_MANIFEST: { url: string; revision: string | null }[];
};

// Precaching assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache OpenWeatherMap API responses (termasuk /forecast)
registerRoute(
    ({ url }) => url.origin === 'https://api.openweathermap.org',
    new CacheFirst({
        cacheName: 'weather-api',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
        ],
    })
);

// Cache images
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }),
        ],
    })
);

// Cache other assets (CSS, JS)
registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    self.clients.claim();
});