import { NextFunction, Request, Response, Router } from 'express';

export class AuthController {
	private static readonly router = Router();
	private static readonly prefix = 'auth/';

	static init() {
		this.router.post(`${this.prefix}register`, this.register);
		this.router.post(`${this.prefix}login'`, this.login);
		return this.router;
	};

	private static async register(req: Request, res: Response, next: NextFunction) { }

	private static async login(req: Request, res: Response, next: NextFunction) { }

}