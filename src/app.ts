import { App } from 'aws-cdk-lib'
import { defaultTableOptions } from './defaultTableOptions'
import { PollStack } from './PollStack'

const app = new App()
const stack = new PollStack(app, 'Poll', {
  stage: 'dev',
  tableOptions: defaultTableOptions
})
console.log(stack.stackName)
