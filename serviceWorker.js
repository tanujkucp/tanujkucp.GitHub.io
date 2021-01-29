const version = "0.9";
const cacheName = `tanuj-${version}`;

var externalUrlsToPrefetch = [
    'https://github.com/tanujkucp.png',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.2.4/pdfobject.min.js'
];

const urlsToCache = [
    `/`,
    '/manifest.json',
    '/index.html',
    '/404.html',
    '/projects.html',
    '/resume.html',
    '/favicon.ico',
    '/images/404-error.svg',
    '/images/android-chrome-192x192.png',
    '/images/android-chrome-512x512.png',
    '/images/apple-touch-icon.png',
    '/images/favicon-16x16.png',
    '/images/favicon-32x32.png',
    '/images/maskable_icon_x1.png',
    '/fonts/glyphicons-halflings-regular.eot',
    '/fonts/glyphicons-halflings-regular.svg',
    '/fonts/glyphicons-halflings-regular.ttf',
    '/fonts/glyphicons-halflings-regular.woff',
    '/fonts/glyphicons-halflings-regular.woff2',
    '/css/bootstrap.min.css',
    '/css/main.css',
    '/css/nav-and-footer.css',
    '/css/projects.css',
    '/files/Resume___Tanuj_Mehta.pdf'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            //cache all static URLS from our own site
            return cache.addAll(urlsToCache)
                .then(() => self.skipWaiting());
            // cache all external URLs
            // cache.addAll(externalUrlsToPrefetch.map(function(urlToPrefetch) {
            //     return new Request(urlToPrefetch, { mode: 'no-cors' });
            // })).then(function() {
            //     console.log('All resources have been fetched and cached.');
            // }).catch(reason => console.log('Install failed: ', reason));

        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        // caches.open(cacheName)
        //     .then(cache => cache.match(event.request, {ignoreSearch: true}))
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        //cache.put(event.request, responseToCache);

                        caches.open(cacheName)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache).then(r => console.log("Written to cache: ", r));
                            });

                        return response;
                    }
                );
            })
    );
});
