const CACHE_NAME = 'fwork-v1';

const cacheUrls = ['replaceMe'];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(cacheUrls);
		}),
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(cachedResponse) {
			if (cachedResponse && !navigator.onLine) {
				return cachedResponse;
			}

			return fetch(event.request).then((response) => {
				// const url = new URL(event.request.url);
				// if (/.jpg|.jpeg|.png$/.test(url.pathname)) {
				let responseClone = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseClone);
				});
				// }

				return response;
			});
		}),
	);
});

self.addEventListener('activate', (event) => {
	const cacheKeeplist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (cacheKeeplist.indexOf(key) === -1) {
						return caches.delete(key);
					}
				}),
			);
		}),
	);
});
