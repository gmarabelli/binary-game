const CACHE_NAME = "binary-game";

self.addEventListener("install", async (event) => {
	event.waitUntil(() => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll([
			"binary-game.html",
			"style.css",
			"script.js",
		]);
	}());
});

self.addEventListener("fetch", async (event) => {
	event.respondWith(() => {
		const cache = await caches.open(CACHE_NAME);
		return cache.match(event.request);
	}());
});