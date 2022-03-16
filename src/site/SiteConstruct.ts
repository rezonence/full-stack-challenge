import { RemovalPolicy } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'
import { SiteConfig } from './SiteConfig'
import { SiteConstructOptions } from './SiteConstructOptions'

export class SiteConstruct extends Construct {
    public readonly bucket: IBucket;
    public readonly deployment: BucketDeployment;

    constructor (scope: Construct, id: string, options: SiteConstructOptions) {
      super(scope, id)
      const indexFile = 'index.html'
      this.bucket = new Bucket(this, `${id}Bucket`, {
        websiteIndexDocument: indexFile,
        websiteErrorDocument: indexFile,
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY
      })

      const siteConfig: SiteConfig = {
        votesTableName: options.votes.tableName,
        pollsTableName: options.polls.tableName,
        region: options.region,
        websocketEndpoint: options.websocketEndpoint,
        identityPoolId: options.identityPool.identityPoolId
      }
      this.deployment = new BucketDeployment(this, `${id}Deployment`, {
        sources: [Source.jsonData(options.configFileName, siteConfig)],
        destinationBucket: this.bucket,
        retainOnDelete: false
      })

      const unauthenticatedRole = options.identityPool.unauthenticatedRole
      options.polls.grantReadData(unauthenticatedRole)
      unauthenticatedRole.addToPrincipalPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'dynamodb:GetItem',
          'dynamodb:Query',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem'
        ],
        resources: [options.votes.tableArn],
        conditions: {
          'ForAllValues:StringEquals': {
            'dynamodb:LeadingKeys': [
              '${cognito-identity.amazonaws.com:sub}'
            ]
          }
        }
      }))
    }
}
