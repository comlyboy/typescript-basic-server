import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import express, { Express, Router } from 'express';

import { reqResLogger } from './utils';
import { AuthController, UserController } from './core';

export class ApiApplication {
	public readonly app: Express;

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
		for (const Controller of this.controllers) {
			apiRouter.use(Controller.init());
		}
		this.app.use('api/v1', apiRouter);
	}
}