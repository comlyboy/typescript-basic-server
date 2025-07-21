import { NextFunction, Request, Response, Router } from "express";
import { BadGateway } from "http-errors";

import { asyncHandler } from "../../utils";

export class UserController {
	private static readonly router = Router();
	private static readonly prefix = '/users/';

	static init() {
		this.router.post(`${this.prefix}create`, asyncHandler(this.createUser));
		this.router.get(`${this.prefix}fetch`, asyncHandler(this.getUsers));
		this.router.get(`${this.prefix}`, asyncHandler(this.getAllUsers));
		return this.router;
	}

	private static async createUser(req: Request, res: Response, next: NextFunction) { }

	private static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		// throw new BadGateway('Unprocessible Entity error!');
	}
	private static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		throw new BadGateway('Unprocessible Entity error!');
	}

}