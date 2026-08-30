import { Request } from "express";

import { apiResult } from "@incloodsolutions/node-toolkit";
import { sendHttpRequest } from "@incloodsolutions/toolkit";

export class VisitsService {

	public async logVisit(request: Request) {
		const ip = await sendHttpRequest<string>({ url: 'https://api.ipify.org' });
		const ipAddress = await sendHttpRequest({ url: `https://ipwho.is/${ip}` });

		console.log('ip', ip);
		console.log('ipAddress', ipAddress);

		// Implementation for getting IP address
		return apiResult({ message: 'Visit logged successfully' });
	}

}
