import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Stack, App, StackProps } from "@aws-cdk/core";

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloFunction = new Function(this, "HelloHandler", {
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset("lambda"),
      handler: "hello.handler"
    });
  }
}
