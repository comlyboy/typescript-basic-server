import { NextFunction, Request, Response, Router } from 'express';

import { MatechService } from "./matech.service";
import { returnApiResponse } from "@incloodsolutions/node-toolkit";

export class MatechController {
	private readonly router = Router();
	private readonly matechService = new MatechService();

	private getProducts = async (req: Request, res: Response, next: NextFunction) => {

		const data = await this.matechService.getProducts();
		returnApiResponse(res, data);
	}

	init() {
		this.router.get(`/matech/products`, this.getProducts);
		return this.router;
	}

}