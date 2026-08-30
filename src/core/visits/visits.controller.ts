import { NextFunction, Request, Response, Router } from 'express';

import { VisitsService } from "./visits.service";
import { returnApiResponse } from "@incloodsolutions/node-toolkit";
import { LogVisitDto } from './visits.dto';

export class VisitsController {
	private readonly router = Router();
	private readonly visitsService = new VisitsService();

	private logVisit = async (req: Request, res: Response, next: NextFunction) => {
		const data = await this.visitsService.logVisit(req);
		returnApiResponse(res, data);
	}

	init() {
		this.router.post(`/visits`, LogVisitDto, this.logVisit);
		return this.router;
	}

}