import { Handler, NextFunction, Request, Response } from 'express';

import { CustomException } from '@incloodsolutions/toolkit';

export function asyncHandler(handler: Handler) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(handler(req, res, next))
			// .then(result => res.json(result).status(200))
			.catch(error => next(new CustomException(error)));
	};
}
