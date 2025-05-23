import { app } from './app';

const port = process.env.PORT || 3030;

app.listen(port, () => {
	console.log(`API running at http://localhost:${port}`)
});
