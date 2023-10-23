import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv (mode, process.cwd(), '');
	// npm run dev
	if (command === 'dev') {
		return {
		}
	// npm run build
	} else {
		return {
			base: env.APP_URL,
			define: {
				__APP_ENV__: JSON.stringify(env.APP_ENV),
				__APP_NAME__: JSON.stringify(env.APP_NAME),
				__APP_AUTHOR__: JSON.stringify(env.APP_AUTHOR)
			},
			build: {
				manifest: true,
				outDir: 'dist',
				rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						let extType = assetInfo.name.split('.').pop(); // or .slice(-1)[0]
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'img';
						}
						return `assets/${extType}/[name]-[hash][extname]`;
					},
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					},
				},
			}
		}
	}
});