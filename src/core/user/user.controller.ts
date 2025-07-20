import { NextFunction, Request, Response, Router } from "express";

export class UserController {
	private static readonly router = Router();

	static init() {
		this.router.post('create', this.createUser);
		this.router.post('fetch', this.getAllUsers);
		return this.router;
	}

	private static async createUser(req: Request, res: Response, next: NextFunction) { }

	private static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {

			res.json({ success: true });
		} catch (error) {
			next(error);
		}
	}

}