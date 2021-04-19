#!/usr/bin/env node
import { App } from '@aws-cdk/core';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import * as AWS from 'aws-sdk';

const run = async () => {
    AWS.config.credentialProvider = new AWS.CredentialProviderChain([
        () => new AWS.ProcessCredentials({ profile: 'default' }),
    ]);

    const ssm = new AWS.SSM();
    const testParam = await ssm
        .getParameter({Name: '/test/list'})
        .promise();

    console.log(testParam.Parameter?.Value);
    console.log('SSM Param get done, proceeding with stack provisioning');

    const app = new App();
    new CdkWorkshopStack(app, 'CdkWorkshopStack');
}

run();
