import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import express, { Express, NextFunction, Request, Response, Router } from 'express';

import { reqResLogger } from './utils';
import { AuthController, UserController } from './core';
import { HttpError } from 'http-errors';

export class ApiApplication {
	readonly app: Express;
	private readonly controllers = [
		AuthController,
		UserController
	];

	constructor() {
		this.app = express();
		this.registerMiddlewares();
		this.registerControllers();
	}

	private registerMiddlewares() {
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(reqResLogger());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private registerControllers() {
		const apiRouter = Router();
		for (const controller of this.controllers) {
			apiRouter.use(controller.init());
		}
		this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).json({ success: true });
		});
		this.app.use('/api/v1', apiRouter);
		this.app.use((error: HttpError, req: Request, res: Response, _: any) => {
			console.log('error.statusCode', error.statusCode);
			res.status(error.statusCode || 500).json({
				success: false,
				path: req.path,
				method: req.method,
				message: error.message || 'Internal Server Error',
				error
			});
		});

	}
}