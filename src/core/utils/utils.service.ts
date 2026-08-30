import { apiResult } from "@incloodsolutions/node-toolkit";
import { sendHttpRequest } from "@incloodsolutions/toolkit";

export class UtilsService {

	public async getIpAddress(ip: string) {
		const ipAddress = await sendHttpRequest({ url: `https://ipwho.is/${ip}` });
		// Implementation for getting IP address
		return apiResult({ data: { ipAddress } });
	}

}
