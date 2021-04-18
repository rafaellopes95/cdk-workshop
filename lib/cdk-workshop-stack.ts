import { Topic } from "@aws-cdk/aws-sns";
import { SqsSubscription } from "@aws-cdk/aws-sns-subscriptions";
import { Queue } from "@aws-cdk/aws-sqs";
import { Stack, App, StackProps, Duration } from "@aws-cdk/core";

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

  }
}
