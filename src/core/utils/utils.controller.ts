import { NextFunction, Request, Response, Router } from 'express';

import { UtilsService } from "./utils.service";
import { returnApiResponse } from "@incloodsolutions/node-toolkit";

export class UtilsController {
	private readonly router = Router();
	private readonly utilsService = new UtilsService();

	private getIpAddress = async (req: Request, res: Response, next: NextFunction) => {
		const data = await this.utilsService.getIpAddress(req.ip);
		returnApiResponse(res, data);
	}

	init() {
		this.router.get(`/utils/ip-address`, this.getIpAddress);
		return this.router;
	}


}