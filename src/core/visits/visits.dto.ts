import { Request, Response, NextFunction } from 'express';
import z, { object, string } from 'zod';

import { CustomException } from '@incloodsolutions/toolkit';

const logVisitDto = object({
	pathname: string().min(1),
	referrer: string().optional(),
	utm: object({
		source: string().optional(),
		medium: string().optional(),
		campaign: string().optional(),
		term: string().optional(),
		content: string().optional(),
	}).optional(),
});

// export interface ILogVisitDto extends infer<typeof logVisitDto> { }
export type LogVisitDtoType = z.infer<typeof logVisitDto>;

export function LogVisitDto(req: Request, res: Response, next: NextFunction) {
	const result = logVisitDto.safeParse(req.body);
	if (!result.success) {
		const errorMessage = result.error.issues.map(issue=>issue.message).join(', ');
		throw new CustomException(errorMessage, 400);
	}
	req.body = result.data;
	next();
}