import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// When ORIGIN is set (e.g. in docker-compose), SvelteKit's adapter uses it
		// to answer CSRF origin checks correctly behind a reverse proxy. When it is
		// not set we disable the origin check so the app still works in plain
		// reverse-proxy setups where the header may differ from the perceived host.
		csrf: process.env.ORIGIN ? {} : { trustedOrigins: ['*'] }
	}
};

export default config;
