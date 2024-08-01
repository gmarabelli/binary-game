const CACHE_NAME = "binary-game";

self.addEventListener("install", async (event) => {
	const cache = await caches.open(CACHE_NAME);
	event.waitUntil(await cache.addAll([
		"binary-game.html",
		"style.css",
		"script.js",
	]));
});

self.addEventListener("fetch", async (event) => {
	const cache = await caches.open(CACHE_NAME);
	event.respondWith(cache.match(event.request));
});