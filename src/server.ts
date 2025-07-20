import { ApiApplication } from './app';

const PORT = process.env.PORT || 3030;

new ApiApplication().app.listen(PORT, () => {
	console.log(`API running at http://localhost:${PORT}`)
});
