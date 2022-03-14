import { App } from "aws-cdk-lib";
import { CounterStack } from "./CounterStack";

const app = new App();
const stack = new CounterStack(app, "CounterStack", {
    stage: "dev"
});
