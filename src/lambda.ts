import { APIGatewayProxyCallbackV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';

import { ApiApplication } from './app';

let apiInstance: APIGatewayProxyHandlerV2;

// https://youtu.be/9a74LuU2EoU
// https://towardsaws.com/5-ways-to-speed-up-your-lambda-function-2163f63ffc49
// https://lumigo.io/learn/aws-lambda-timeout-best-practices/
// https://www.serverless.com/framework/docs/providers/aws/events/http-api#lambda-request-authorizers

export async function handler(event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2) {
	context.callbackWaitsForEmptyEventLoop = false;
	if (!apiInstance) {
		console.log('LOG => Initializing new Lambda API instance');
		const expressInstance = new ApiApplication().app;
		apiInstance = serverlessExpress({ app: expressInstance });
	}
	return await apiInstance(event, context, callback);
}