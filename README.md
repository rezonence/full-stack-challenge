# YouGov Rezonence Full-stack developer challenge

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/rezonence/full-stack-challenge.git)

## Why
This repository contains a sample full-stack voting application and allows candidates to demonstrate their skills by taking on the challenge of adding a new feature.

## How
1. Follow the steps in the [getting started section](#getting-started) to set up your environment and backend systems
2. Implement the feature described in [the challenge section](#the-challenge) - this should hopefully take less than a day to do
3. Submit your work by adding [@jabrythehutt](https://github.com/jabrythehutt) as a [collaborator](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) to your private repository

## What
The project makes use of websockets and stream processing to display a live poll. A voter can scan the QR code displayed alongside the poll and submit a vote on their mobile device, the result of which should show up shortly afterwards without requiring a refresh. The infrastructure is defined with the AWS CDK.

## Project structure, frameworks and services

* The infrastructure is defined with Typescript using the [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html), allowing values and interfaces to be shared between the infrastructure, server-side and client-side code
* Polls, votes and counts are stored in [DynamoDB](https://aws.amazon.com/dynamodb/) tables 
* [DynamoDB streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) are used to trigger vote counting and websocket broadcasting logic
* The pertinent tables and streams are configured in the [polling CDK construct](src/polls/PollsConstruct.ts)
* The server-side code consists of [Lambda](https://aws.amazon.com/lambda/) functions responsible for keeping track of websocket connections, counting votes and broadcasting changes
* The [vote counter](src/polls/VoteCounter.ts) receives a stream of submitted votes via the [counter lambda function](src/polls/counter/handler.ts) and increments the counts associated with each answer
* The [UI](src/poller/) is defined with [Svelte](https://svelte.dev) and statically hosted on [S3](https://aws.amazon.com/s3/) via [CloudFront](https://aws.amazon.com/cloudfront/)
* The [voting component](src/poller/Vote.svelte) displays the available answers and allows a user to select one when they first interact with a poll

## The challenge
Your challenge is to **enable the voter to change their answer**. This requires changes to the infrastructure definition, the server-side code and the UI - allowing you to demonstrate your understanding of how all the components of this full-stack application fit together with the limited information available.

## Getting started
1. [Import](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/importing-a-repository-with-github-importer) this repository into your account and make sure that your copy is private
2. Open the new repo in [Gitpod](https://www.gitpod.io/docs/getting-started) using https://gitpod.io/#[your-new-repo-url] and replacing [your-new-repo-url] with your new repository URL, alternatively you can clone and open the project locally
3. Set up an [AWS account](https://aws.amazon.com/account/) 
4. Set up admin [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) for your development environment, these can be environment variables in [Gitpod](https://www.gitpod.io/docs/environment-variables)
5. Install the dependencies: `yarn --frozen-lockfile`
6. Bootstrap the AWS CDK to allow it to deploy the stack to your account: `yarn bootstrap`
7. Deploy the stack: `yarn deploy`
8. You should see a URL printed to the console once the stack completes deployment which you'll be able to load in a browser

## Previewing changes
1. Start the demo in dev mode using: `yarn start`
2. Browse to the URL displayed by Gitpod or the localhost link in your console if you're running the project locally
3. Make sure that the forwarded port is public if you're using [Gitpod](https://www.gitpod.io/docs/config-ports) to allow the QR code link to work on another device
4. Scanning the QR code in this scenario will only work via Gitpod (or if you set up an alternative tunnel via e.g. [ngrok](https://ngrok.com/))
5. You can open the voting link in a private window if you need to submit a fresh vote
6. You'll need to re-deploy the backend to observe any changes to it using `yarn deploy` 

## Help
Please feel free to [submit an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue) if you find a bug or contact [@jabrythehutt](https://github.com/jabrythehutt) directly for any questions related to the challenge.

## Removing the stack from your AWS account
1. Run `yarn destroy`
