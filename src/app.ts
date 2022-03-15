import { App } from 'aws-cdk-lib'
import { PollStack } from './PollStack'

const app = new App()
const stack = new PollStack(app, 'Poll', {
  stage: 'dev'
})
console.log(stack.toString())
