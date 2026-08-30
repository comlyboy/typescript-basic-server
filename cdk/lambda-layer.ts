#!/usr/bin/env node
// import 'source-map-support/register';
import { App, CfnOutput, DefaultStackSynthesizer, Stack, StackProps } from 'aws-cdk-lib';
import { LayerVersion, Code, Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { ApplicationConstantEnum } from './constants';

export function initLambdaLayer(app: App) {
	const stackName = `${ApplicationConstantEnum.STACK_NAME}-layer`;

	class PlaygroundLambdaLayerStack extends Stack {
		constructor(scope: App, id: string, props: StackProps) {
			super(scope, id, props);

			const layer = new LayerVersion(this, id, {
				code: Code.fromAsset('./dist-layer'),
				layerVersionName: 'playgroundLambdaLayer',
				compatibleRuntimes: [Runtime.NODEJS_22_X, Runtime.NODEJS_24_X],
				compatibleArchitectures: [Architecture.ARM_64, Architecture.X86_64]
			});

			new CfnOutput(this, 'LambdaLayerOutput', {
				value: layer.layerVersionArn
			});

		}
	}

	new PlaygroundLambdaLayerStack(app, stackName, {
		stackName,
		env: {
			region: app.node.tryGetContext('region') || 'us-east-1',
			account: process.env.CDK_DEFAULT_ACCOUNT,
		},
		tags: {
			appName: ApplicationConstantEnum.APP_NAME,
			stackName
		},
		synthesizer: new DefaultStackSynthesizer({
			bucketPrefix: 'layer/'
		}),
	});
}