import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig((configuration) => {

	console.log('configuration,', configuration);

	return {
		build: {
			target: 'ES2024',
			outDir: 'dist',
			minify: 'terser', // Enable minification for better dead code elimination
			ssr: true,
			rollupOptions: {
				input: resolve(__dirname, 'src/server.ts'),
				external: [
					'express',
					/^node:/
				],
				output: {
					format: 'cjs',
					entryFileNames: 'server.js',
					// Enable tree-shaking
					preserveModules: false,
					// Remove unused exports
					exports: 'named'
				},
				// Tree-shaking options
				treeshake: {
					moduleSideEffects: false, // Assume no side effects for better tree-shaking
					propertyReadSideEffects: false,
					tryCatchDeoptimization: false
				}
			}
		},
		ssr: {
			external: ['express'],
			noExternal: true
		},
		// Enable dead code elimination in development too
		esbuild: {
			treeShaking: true,
			minifySyntax: true,
			minifyIdentifiers: true,
		}
	}
})