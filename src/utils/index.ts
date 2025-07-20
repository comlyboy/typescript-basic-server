import morgan, { Options } from 'morgan';

export function reqResLogger(formats: string[] = [], options?: Options<any, any>) {
	let requestId = Date.now().toString();
	formats = formats.map(format => format.startsWith(':') ? format : `:${format}`);
	const defaultFormats = [':date[iso]', ':id', ':method', ':status', ':url', ...formats, ':total-time ms', ':res[content-length]'];
	morgan.token('id', () => requestId);
	return morgan(defaultFormats.join(' | '), options);
}
