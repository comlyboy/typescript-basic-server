import express from 'express';
import cors from 'cors';

// import { connect_DB } from './database/connection';

import { AuthRoute } from './core/auth/auth.route';

const application = express();

application.use(cors());
application.use(express.json());


// Connecting to mongoDB database
// connect_DB();

// permissions
application.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	next();
});



// For various routes
application.use('/api/v1/auth', AuthRoute);


export default application;