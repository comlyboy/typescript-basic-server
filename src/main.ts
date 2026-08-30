import { createApplication } from './app';

const PORT = process.env.PORT || 3030;

createApplication().then(application => {
	application.listen(PORT, () => {
		console.log(`API running at http://localhost:${PORT}`)
	});
});
