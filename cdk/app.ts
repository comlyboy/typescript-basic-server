import { App } from "aws-cdk-lib";

import { initLambdaLayer } from "./lambda-layer";
import { initLambdaCdkApplication } from "./lambda-api";
import { AppEnvironmentEnum } from "@incloodsolutions/toolkit";
import { ApplicationConstantEnum } from "./constants";


const app = new App();

// Get the target of the deployment (e.g., 'layer', 'api')
const deploymentTarget = app.node.tryGetContext('deploymentTarget') as string || null;

if (deploymentTarget === 'layer') {
	initLambdaLayer(app);
} else {
	initLambdaCdkApplication(app, {
		stage: AppEnvironmentEnum.PRODUCTION,
		stackName: `${ApplicationConstantEnum.STACK_NAME}-${AppEnvironmentEnum.PRODUCTION}`,
		synthesizerOptions: {
			bucketPrefix: `lambda-api/${AppEnvironmentEnum.PRODUCTION}/`
		}
	});
}