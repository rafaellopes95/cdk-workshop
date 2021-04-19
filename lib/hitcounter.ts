import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Code, Function, IFunction, Runtime } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";
import AWS = require("aws-sdk");

export interface HitCounterProps {
    downstream: IFunction;
}

export class HitCounter extends Construct {

    private properties: HitCounterProps;
    public functionHandler: Function;
    public table: Table;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);
        this.properties = props;
    }

    public async provisionResources() {
        const paramValues = await this.getParams();

        this.table = new Table(this, "Hits", {
            partitionKey: {
                name: "path",
                type: AttributeType.STRING,
            }
        });

        this.functionHandler = new Function(this, "HitCounterHandler", {
            runtime: Runtime.NODEJS_10_X,
            handler: "hitcounter.handler",
            code: Code.fromAsset("lambda"),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: this.properties.downstream.functionName,
                HITS_TABLE_NAME: this.table.tableName,
            }
        });

        this.table.grantReadWriteData(this.functionHandler);
        this.properties.downstream.grantInvoke(this.functionHandler);

        console.log('Retrieved parameters: ' + paramValues);
    }

    private async getParams(): Promise<string> {
        AWS.config.credentialProvider = new AWS.CredentialProviderChain([
            () => new AWS.ProcessCredentials({ profile: 'default' }),
        ]);

        const ssm = new AWS.SSM();
        const testParam = await ssm
            .getParameter({Name: '/test/list'})
            .promise();

        return Promise.resolve(testParam.Parameter?.Value || 'EMPTY PARAM!!!');
    }
}