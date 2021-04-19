import { LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Stack, App, StackProps } from "@aws-cdk/core";
import { TableViewer } from "cdk-dynamo-table-viewer";
import { HitCounter } from "./hitcounter";

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    this.provisionResources();
  }

  private async provisionResources() {
    const helloFunction = new Function(this, "HelloHandler", {
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset("lambda"),
      handler: "hello.handler"
    });

    console.log('Created HelloHandler function');

    const helloWithCounter = new HitCounter(this, "HelloHitCounter", {
      downstream: helloFunction,
    });

    await helloWithCounter.provisionResources();

    console.log('Created HitCounter construct');

    const api = new LambdaRestApi(this, "Endpoint", {
      handler: helloWithCounter.functionHandler,
    });

    console.log('Created LambdaRestApi api');

    new TableViewer(this, "ViewHitCounter", {
      title: "Hello Hits",
      table: helloWithCounter.table,
    });

    console.log('Created ViewHitCounter table viewer');
  }
}
