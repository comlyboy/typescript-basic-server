import { Request, Response } from 'express';

export async function signIn(req: Request, res: Response) {
	// const { email, password }: AuthDto = req.body;

	try {

		// Business logic goes here

		res.status(200).json({
			message: 'logged in successfully'
		});

	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong!'
		});
	}

}
