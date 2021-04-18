import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Code, Function, IFunction, Runtime } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

export interface HitCounterProps {
    downstream: IFunction;
}

export class HitCounter extends Construct {

    public readonly functionHandler: Function;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        const table = new Table(this, "Hits", {
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
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName,
            }
        });

        table.grantReadWriteData(this.functionHandler);
        props.downstream.grantInvoke(this.functionHandler);
    }
}