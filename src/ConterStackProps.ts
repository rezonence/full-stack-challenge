import { StackProps } from "aws-cdk-lib";
import { DynamoWebsocketOptions } from "./websocket";

export interface CounterStackProps extends StackProps, DynamoWebsocketOptions {
}