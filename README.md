# Full-stack developer challenge

## Getting started
1. Set up an [AWS account](https://aws.amazon.com/account/) 
2. Set up admin [AWS credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html) for your development environment, these can be environment variables in [Github Codespaces](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces)
3. Install the dependencies: `yarn --frozen-lockfile`
4. Bootstrap the AWS CDK to allow it to deploy the stack to your account: `yarn bootstrap`
5. Deploy the stack: `yarn deploy`
6. You should see a URL printed to the console once the stack completes deployment which you'll be able to load in a browser
## Marking criteria (most important first)

1. Function - Does it work as intended and solve the problem?
2. Ease of making changes - Could another team member easily understand it and make changes?
3. Typescript code quality score - This is an automated process
4. Ease of deployment to existing AWS account - Does it conflict with other stacks?
5. Quality of commit messages - Are they consistent and could another team member understand what each change does?
