import mongoose from 'mongoose';

const DB_URL = "database link";

// const DB_URL_local = "local database link";

export async function connect_DB() {
	try {
		await mongoose.connect(DB_URL, {});
		console.log('Connected to database ==> 100%');
	} catch (error) {
		console.log(error);
		console.log('Cannot connect to database');
	}

}