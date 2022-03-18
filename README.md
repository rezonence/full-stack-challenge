# Full-stack developer challenge

## Getting started
1. Set up an [AWS account](https://aws.amazon.com/account/) 
2. Set up admin [AWS credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html) for your development environment, these can be environment variables in [Github Codespaces](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces)
3. Install the dependencies: `yarn --frozen-lockfile`
4. Bootstrap the AWS CDK to allow it to deploy the stack to your account: `yarn bootstrap`
5. Deploy the stack: `yarn deploy`
6. You should see a URL printed to the console once the stack completes deployment which you'll be able to load in a browser

## Previewing changes
1. Start the demo in dev mode using: `yarn start`
2. Browse to the link shown in the console or the URL displayed by your Github Codespace
3. Scanning the QR code in this scenario will only work via Github Codespaces (or if you set up an alternative tunnel via e.g. [ngrok](https://ngrok.com/))
4. You'll need to re-deploy the backend to observe any changes to it using `yarn deploy` 

## Removing the stack from your AWS account
1. Run `yarn destroy`