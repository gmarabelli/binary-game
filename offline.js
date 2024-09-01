const CACHE_NAME = "binary-game";

self.addEventListener("install", async (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll([
			"./",
			"index.html",
			"game.css",
			"game.js",
			"install.css",
			"install.js",
			"manifest.json",
			"icon.png",
		]);
	})());
});

self.addEventListener("fetch", async (event) => {
	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME);
		return cache.match(event.request);
	})());
});