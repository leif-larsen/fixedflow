import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// Allow form submissions from any origin so the app works behind a reverse
		// proxy (e.g. Tailscale) where the Origin header may differ from the
		// server's perceived host. For a known public URL, set the ORIGIN env var
		// in docker-compose instead and remove this override.
		csrf: {
			trustedOrigins: ['*']
		}
	}
};

export default config;
