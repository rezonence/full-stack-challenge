# YouGov Rezonence Full-stack developer challenge

## Why
This repository contains a sample full-stack application and allows candidates to demonstrate their skills by taking on the challenge of adding a new feature.

## How
1. [Import](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/importing-a-repository-with-github-importer) this repository into your account and make sure that your copy is private
2. Follow the steps in the [getting started section](#getting-started) to set up your environment and backend systems
3. Implement the feature described in [the challenge section](#the-challenge) - this should hopefully take less than a day to do
4. Submit your work by adding [@jabrythehutt](https://github.com/jabrythehutt) as a [collaborator](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) to your private repository

## What
The project makes use of websockets and stream processing to display a live poll. A voter can scan the QR code displayed alongside the poll and submit a vote on their mobile device, the result of which should show up shortly afterwards without requiring a refresh.

## The challenge
Your challenge is to **enable the voter to change their answer**. This requires changes to the infrastructure definition, the server-side code and the UI - allowing you to demonstrate your understanding of how all the components of this full-stack application fit together with the limited information available.

## Getting started
1. Set up an [AWS account](https://aws.amazon.com/account/) 
2. Set up admin [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) for your development environment, these can be environment variables in [Github Codespaces](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces)
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