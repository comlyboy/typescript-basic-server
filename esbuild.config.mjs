// @ts-check
import { analyzeMetafile, build } from "esbuild";

const environment = process.argv.find((arg) => arg.includes('--stage'))?.split('=')[1] || 'local';

/**
 * @param {import('esbuild').BuildOptions} config
 */
const buildResult = await build({
	color: true,
	bundle: true,
	minify: true,
	format: "esm",
	metafile: true,
	outdir: "dist",
	sourcemap: true,
	platform: "node",
	target: "node24",
	treeShaking: true,
	// logLevel: 'verbose',
	packages: "external",
	legalComments: "linked",
	tsconfig: "tsconfig.build.json",
	outExtension: { ".js": ".js" },
	define: environment
		? {
			"process.env.NODE_ENV": `"${environment}"`,
		}
		: undefined,
	entryPoints: [{ out: "lambda", in: "src/lambda.ts" }],
	resolveExtensions: ['.ts', '.js'],
}).catch((e) => {
	console.error(e);
	process.exit(1);
});

if (buildResult?.metafile) {
	console.log(await analyzeMetafile(buildResult?.metafile, { color: true }));
}
