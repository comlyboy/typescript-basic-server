#!/usr/bin/env node
// import 'source-map-support/register';
import { App, DefaultStackSynthesizer, DefaultStackSynthesizerProps, Stack, StackProps } from 'aws-cdk-lib';

import { BaseLambdaLayerConstruct, BaseLambdaConstruct, BaseApiGatewayV2Construct } from '@incloodsolutions/devkit';


import { AppEnvironmentType, ObjectType } from '@incloodsolutions/toolkit';
import { ApplicationConstantEnum } from './constants';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';

interface IProp extends StackProps {
	readonly stage: AppEnvironmentType;
}

export function initLambdaCdkApplication(app: App, params: {
	readonly region?: string;
	readonly stackName: string;
	readonly stage: AppEnvironmentType;
	readonly synthesizerOptions: DefaultStackSynthesizerProps;
}) {

	class PlaygroundLambdaApiStack extends Stack {
		constructor(scope: App, id: string, props: IProp) {
			super(scope, id, props);

			const { existingLayer: lambdaLayer } = new BaseLambdaLayerConstruct(this, 'lambdaLayer', {
				options: {
					fromExistingLayerArn: `arn:aws:lambda:${props.env?.region}:${props.env?.account}:layer:locoraLambdaLayer:9`
				}
			});

			// const { existingLayer: coreToolkitsLayer } = new BaseLambdaLayerConstruct(this, 'coreToolkitsLayer', {
			// 	options: {
			// 		fromExistingLayerArn: `arn:aws:lambda:${props.env?.region}:${props.env?.account}:layer:coreToolkitsLayer:3`
			// 	}
			// });

			const { existingLayer: incloodsolutionToolkitsLayer } = new BaseLambdaLayerConstruct(this, 'incloodsolutionsToolkits', {
				options: {
					fromExistingLayerArn: `arn:aws:lambda:${props.env?.region}:${props.env?.account}:layer:incloodsolutionsToolkits:1`
				}
			});

			// Lambda Setup
			const lambdaConstruct = new BaseLambdaConstruct(this, 'lambda', {
				stage: props.stage,
				stackName: props.stackName,
				options: {
					lambdaOptions: {
						layers: [lambdaLayer, incloodsolutionToolkitsLayer],
						environment: {
							NODE_ENV: props.stage
						} as ObjectType
					}
				}
			});

			// API Gateway v2 Setup
			new BaseApiGatewayV2Construct(this, 'apiGatewayV2', {
				handlerFunctions: [lambdaConstruct.function],
				options: {
					gatewayOptions: {
						apiName: props.stackName,
						corsPreflight: {
							allowOrigins: ['*'],
							allowHeaders: [
								'store-id'
							]
						},
					},
					routeOptions: [
						{
							path: '/{proxy+}',
							methods: [HttpMethod.ANY],
						}
					]
				}
			});

			lambdaConstruct.function.role?.addToPrincipalPolicy(new PolicyStatement({
				actions: [
					'ses:SendEmail',
					'ses:SendRawEmail',
					'ses:SendTemplatedEmail',
					'ses:SendBulkTemplatedEmail',
				],
				resources: [`arn:aws:ses:${props.env?.region}:${props.env?.account}:identity/*`],
			}));

		}
	}

	new PlaygroundLambdaApiStack(app, params.stackName, {
		stage: params.stage,
		stackName: params.stackName,
		env: {
			region: params?.region || 'us-east-1',
			account: process.env.CDK_DEFAULT_ACCOUNT,
		},
		tags: {
			appName: ApplicationConstantEnum.APP_NAME,
			stage: params.stage,
			stackName: params.stackName
		},
		synthesizer: new DefaultStackSynthesizer({
			...params?.synthesizerOptions,
			// Custom S3 prefix for Lambda code assets.
			// This ensures that production Lambda code is stored under a dedicated folder, e.g.:
			// s3://<asset-bucket>/lambda/production/
			//
			// Why this matters:
			// - CDK uses a single S3 bucket for all assets.
			// - Separating Lambda code (especially layers vs functions) helps with clarity and management.
			bucketPrefix: params?.synthesizerOptions?.bucketPrefix
		}),
	});
}