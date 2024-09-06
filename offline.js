const CACHE_NAME = "binary-game";

self.addEventListener("install", async (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll([
			"./",
			"index.html",
			"events.js",
			"intro.js",
			"tutorial.css",
			"tutorial.js",
			"install.css",
			"install.js",
			"game.css",
			"game.js",
			"manifest.json",
			"icon.png",
			"screenshot.png",
			"UbuntuSansMono.woff2",
		]);
	})());
});

self.addEventListener("fetch", async (event) => {
	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME);
		return cache.match(event.request);
	})());
});