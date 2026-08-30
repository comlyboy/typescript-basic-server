import "reflect-metadata";

import { APIGatewayProxyCallbackV2, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { Express } from 'express';

import { createApplication } from './app';
import { initLambdaFunctionHandler } from '@incloodsolutions/node-toolkit';

let expressInstance: Express = null;

export async function handler(event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2) {
	if (!expressInstance) {
		console.log('LOG => Initializing new Lambda API instance');
		expressInstance = await createApplication();
	}
	return initLambdaFunctionHandler({ app: expressInstance, event, context, callback });
}