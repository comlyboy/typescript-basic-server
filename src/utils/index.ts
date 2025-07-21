import { Handler, NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import morgan, { Options } from 'morgan';

export function asyncHandler(handler: Handler) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(handler(req, res, next)).catch(err => {
			console.log('err', err.name);
			console.log('err status', err.status);
			next(createHttpError(err.name));
		});
	};
}

export function reqResLogger(formats: string[] = [], options?: Options<any, any>) {
	let requestId = Date.now().toString();
	formats = formats.map(format => format.startsWith(':') ? format : `:${format}`);
	const defaultFormats = [':date[iso]', ':id', ':method', ':status', ':url', ...formats, ':total-time ms', ':res[content-length]'];
	morgan.token('id', () => requestId);
	return morgan(defaultFormats.join(' | '), options);
}

interface RouteInfo {
	method: string;
	path: string;
	fullPath: string;
	middlewareCount: number;
	handler?: string;
}

/**
 * Recursively extracts all routes from an Express Router
 * @param router - Express Router instance or Express app
 * @param basePath - Base path prefix (used for recursion)
 * @returns Array of route information
 */
export function extractRoutes(router: any, basePath: string = ''): RouteInfo[] {
	const routes: RouteInfo[] = [];

	// Get the stack from router - handle both app._router and Router instances
	let stack: any[];

	if (router && router.stack) {
		// Direct router instance
		stack = router.stack;
	} else if (router && router._router && router._router.stack) {
		// Express app instance
		stack = router._router.stack;
	} else {
		return routes;
	}

	if (!Array.isArray(stack)) {
		return routes;
	}

	stack.forEach((layer: any) => {
		if (layer.route) {
			// This is a route layer - extract route info
			extractRouteFromLayer(layer, basePath, routes);
		} else if (layer.handle && typeof layer.handle === 'function') {
			// Check if this is a router middleware
			if (layer.handle.stack) {
				// This is a nested router
				const mountPath = getLayerPath(layer);
				const fullNestedPath = basePath + mountPath;

				// Recursively extract routes from nested router
				const nestedRoutes = extractRoutes(layer.handle, fullNestedPath);
				routes.push(...nestedRoutes);
			} else if (layer.name === 'router') {
				// Alternative router structure
				const mountPath = getLayerPath(layer);
				const fullNestedPath = basePath + mountPath;

				const nestedRoutes = extractRoutes(layer.handle, fullNestedPath);
				routes.push(...nestedRoutes);
			}
		}
	});

	return routes;
}

/**
 * Extracts route information from a route layer
 */
function extractRouteFromLayer(layer: any, basePath: string, routes: RouteInfo[]) {
	if (!layer.route) return;

	const route = layer.route;
	const routePath = route.path || '';
	const layerPath = getLayerPath(layer) || '';

	// Combine paths - prefer route.path, fallback to layer path
	const combinedPath = routePath || layerPath;
	const fullPath = basePath + combinedPath;

	// Get all methods for this route
	const methods = route.methods || {};

	Object.keys(methods).forEach(method => {
		if (methods[method]) {
			const middlewareCount = route.stack ? route.stack.length : 0;
			const handler = getHandlerName(route.stack);

			routes.push({
				method: method.toUpperCase(),
				path: combinedPath,
				fullPath: fullPath,
				middlewareCount: middlewareCount,
				handler: handler
			});
		}
	});
}

/**
 * Attempts to extract path from layer using various methods
 */
function getLayerPath(layer: any): string {
	// Method 1: Check if regexp has a fast_slash property (common optimization)
	if (layer.regexp && layer.regexp.fast_slash) {
		return '/';
	}

	// Method 2: Check if regexp has a fast_star property
	if (layer.regexp && layer.regexp.fast_star) {
		return '/*';
	}

	// Method 3: Try to extract from regexp source
	if (layer.regexp && layer.regexp.source) {
		return extractPathFromRegexSource(layer.regexp.source, layer.keys || []);
	}

	// Method 4: Check layer.path property (if exists)
	if (layer.path) {
		return layer.path;
	}

	// Method 5: Check if it's a simple path in regexp
	if (layer.regexp) {
		const regexStr = layer.regexp.toString();

		// Handle root path
		if (regexStr.includes('^\\/\\?$') || regexStr.includes('^\\/?$')) {
			return '/';
		}

		// Handle empty path (middleware mounted at current level)
		if (regexStr.includes('^\\/?(?=\\/|$)') || regexStr.includes('^\\/\\?(?=\\/|$)')) {
			return '';
		}
	}

	return '';
}

/**
 * Extracts path from regex source string
 */
function extractPathFromRegexSource(source: string, keys: any[]): string {
	// Handle common patterns
	if (source === '^\\/\\?$' || source === '^\\/?$') {
		return '/';
	}

	if (source === '^\\/\\?(?=\\/|$)' || source === '^\\/?(?=\\/|$)') {
		return '';
	}

	// Try to extract path
	let path = source
		.replace(/^\^\\?\/?/, '')     // Remove start anchors
		.replace(/\$.*$/, '')         // Remove end patterns
		.replace(/\\\//g, '/')        // Unescape slashes
		.replace(/\(\?\=/g, '')       // Remove lookaheads start
		.replace(/\(\?\:/g, '')       // Remove non-capturing groups start
		.replace(/\)/g, '')           // Remove closing parens
		.replace(/\?/g, '')           // Remove optional markers
		.replace(/\|.*$/, '');        // Remove alternations

	// Handle parameters
	if (keys && keys.length > 0) {
		// Simple replacement for common parameter patterns
		path = path.replace(/\([^)]+\)/g, () => {
			const key = keys.shift();
			return key ? `:${key.name}` : ':param';
		});
	}

	// Clean up and ensure proper format
	path = path.replace(/[\\^$*+?.()|[\]{}]/g, ''); // Remove regex special chars

	if (path && !path.startsWith('/')) {
		path = '/' + path;
	}

	return path;
}

/**
 * Gets handler function name from route stack
 */
function getHandlerName(stack: any[]): string {
	if (!stack || stack.length === 0) return 'anonymous';

	// Get the last handler (usually the actual route handler)
	const lastHandler = stack[stack.length - 1];

	if (lastHandler && lastHandler.handle) {
		const name = lastHandler.handle.name;
		return name && name !== 'anonymous' ? name : 'anonymous';
	}

	return 'anonymous';
}

/**
 * Pretty print routes in a formatted table
 */
export function printRoutes(routes: RouteInfo[]): void {
	if (routes.length === 0) {
		console.log('No routes found.');
		return;
	}

	console.log('\n📋 Extracted Routes:');
	console.log('━'.repeat(91));

	const headers = ['METHOD', 'PATH', 'HANDLER', 'MIDDLEWARE'];
	const colWidths = [8, 40, 20, 12];

	// Print header
	let headerRow = '';
	headers.forEach((header, i) => {
		headerRow += header.padEnd(colWidths[i]) + ' │ ';
	});
	console.log(headerRow);
	console.log('━'.repeat(91));

	// Print routes
	routes.forEach(route => {
		let row = '';
		row += route.method.padEnd(colWidths[0]) + ' │ ';
		row += route.fullPath.padEnd(colWidths[1]) + ' │ ';
		row += (route.handler || 'anonymous').padEnd(colWidths[2]) + ' │ ';
		row += route.middlewareCount.toString().padEnd(colWidths[3]) + ' │ ';
		console.log(row);
	});

	console.log('━'.repeat(91));
	console.log(`📊 Total routes: ${routes.length}\n`);
}

/**
 * Get routes as JSON
 */
export function getRoutesAsJSON(router: any, basePath?: string): string {
	const routes = extractRoutes(router, basePath);
	return JSON.stringify(routes, null, 2);
}

/**
 * Filter routes by method
 */
export function getRoutesByMethod(router: any, method: string, basePath?: string): RouteInfo[] {
	const routes = extractRoutes(router, basePath);
	return routes.filter(route => route.method === method.toUpperCase());
}

/**
 * Get all unique paths
 */
export function getUniquePaths(router: any, basePath?: string): string[] {
	const routes = extractRoutes(router, basePath);
	const paths = routes.map(route => route.fullPath);
	return [...new Set(paths)];
}

/**
 * Debug function to inspect router structure
 */
export function debugRouterStructure(router: any, depth: number = 0): void {
	const indent = '  '.repeat(depth);
	console.log(`${indent}Router structure:`);

	let stack: any[];
	if (router && router.stack) {
		stack = router.stack;
	} else if (router && router._router && router._router.stack) {
		stack = router._router.stack;
	} else {
		console.log(`${indent}  No stack found`);
		return;
	}

	stack.forEach((layer, index) => {
		console.log(`${indent}  Layer ${index}:`);
		console.log(`${indent}    Name: ${layer.name}`);
		console.log(`${indent}    Has route: ${!!layer.route}`);
		console.log(`${indent}    Has handle: ${!!layer.handle}`);
		console.log(`${indent}    Has handle.stack: ${!!(layer.handle && layer.handle.stack)}`);

		if (layer.route) {
			console.log(`${indent}    Route path: ${layer.route.path}`);
			console.log(`${indent}    Route methods: ${Object.keys(layer.route.methods || {})}`);
		}

		if (layer.regexp) {
			console.log(`${indent}    Regexp: ${layer.regexp.toString()}`);
			console.log(`${indent}    Fast slash: ${layer.regexp.fast_slash}`);
			console.log(`${indent}    Fast star: ${layer.regexp.fast_star}`);
		}

		if (layer.keys && layer.keys.length > 0) {
			console.log(`${indent}    Keys: ${layer.keys.map((k: any) => k.name).join(', ')}`);
		}
	});
}

// Example usage:
/*
import express from 'express';

const app = express();
const router = Router();

router.get('/users', function getUsers(req, res) { res.json({}); });
router.post('/users', function createUser(req, res) { res.json({}); });
router.get('/users/:id', function getUserById(req, res) { res.json({}); });

const nestedRouter = Router();
nestedRouter.get('/profile', function getProfile(req, res) { res.json({}); });
nestedRouter.post('/settings', function updateSettings(req, res) { res.json({}); });

router.use('/account', nestedRouter);
app.use('/api/v1', router);

// Extract and print routes
const routes = extractRoutes(app);
printRoutes(routes);

// Debug router structure if needed
debugRouterStructure(app);
*/