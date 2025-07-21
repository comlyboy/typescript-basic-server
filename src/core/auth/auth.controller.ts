import { NextFunction, Request, Response, Router } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils';

export class AuthController {
	private static readonly router = Router();
	private static readonly prefix = '/auth/';
	private static readonly authService = new AuthService();


	static init() {
		this.router.post(`${this.prefix}register`, asyncHandler(this.register));
		this.router.post(`${this.prefix}login'`, asyncHandler(this.login));
		return this.router;
	};

	private static async register(req: Request, res: Response, next: NextFunction) {
		this.authService.register();
	}

	private static async login(req: Request, res: Response, next: NextFunction) {
		this.authService.login();
	}

}