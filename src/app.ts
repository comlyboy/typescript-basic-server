import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import express, { Express, NextFunction, Request, Response, Router } from "express";

import { reqResLogger } from "@incloodsolutions/node-toolkit";
import { CustomException, generateISODate } from "@incloodsolutions/toolkit";

import { UtilsController } from "./core/utils";
import { MatechController, VisitsController } from "./core";
import { rateLimiter } from "./middlewares/rate-limiter";

let application: Express | null = null;

export async function createApplication(): Promise<Express> {
	application = express();

	registerMiddlewares();

	// Initialise external dependencies.
	// await Database.connect();

	registerRoutes();
	register404();
	registerErrorHandler();

	return application;
}

function registerMiddlewares(): void {
	application.use(cors());
	application.use(helmet());
	application.use(compression());
	application.use(reqResLogger());

	application.use(express.json({ limit: "5mb" }));
	application.use(express.urlencoded({ extended: true }));

	application.use(rateLimiter);
}

function registerRoutes(): void {
	const router = Router();

	application.get("/health", (_, res) => {
		res.json({
			success: true,
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		});
	});

	router.use(new MatechController().init());
	router.use(new UtilsController().init());
	router.use(new VisitsController().init());

	application.use("/api", router);
}

function register404(): void {
	application.use((req: Request, res: Response) => {
		res.status(404).json({
			success: false,
			message: "Route not found",
			path: req.originalUrl,
			statusCode: 404,
		});
	});
}

function registerErrorHandler(): void {
	application.use((error: CustomException, req: Request, res: Response, next: NextFunction) => {
		console.log('HTTP Error', error);

		if (res.headersSent) {
			return next(error);
		}

		res.status(error.statusCode ?? 500).json({
			success: false,
			message: error.message || "Internal Server Error",
			statusCode: error.statusCode ?? 500,
			error: {
				message: error.message || "Internal Server Error",
				statusCode: error.statusCode ?? 500,
				timestamp: generateISODate(),
				method: req.method,
				path: req.originalUrl,
			}
		});

	});
}