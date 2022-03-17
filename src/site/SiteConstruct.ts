import { RemovalPolicy } from 'aws-cdk-lib'
import { Distribution } from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'
import { configFileName, SiteConfig } from '../poller'
import { SiteConstructOptions } from './SiteConstructOptions'

export class SiteConstruct extends Construct {
    public readonly bucket: IBucket;
    public readonly deployment: BucketDeployment;
    public readonly distribution: Distribution;

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
        votesTableName: options.tables.Votes.tableName,
        pollsTableName: options.tables.Polls.tableName,
        region: options.region,
        websocketEndpoint: options.websocketEndpoint,
        identityPoolId: options.identityPool.identityPoolId
      }
      this.distribution = new Distribution(this, `${id}Distribution`, {
        defaultBehavior: {
          origin: new S3Origin(this.bucket)
        }
      })
      this.deployment = new BucketDeployment(this, `${id}Deployment`, {
        sources: [Source.asset(options.distFolder), Source.jsonData(configFileName, siteConfig)],
        destinationBucket: this.bucket,
        retainOnDelete: false,
        distribution: this.distribution
      })

      const role = options.identityPool.unauthenticatedRole
      options.tables.Polls.grantReadData(role)
      options.tables.Counts.grantReadData(role)
      role.addToPrincipalPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'dynamodb:GetItem',
          'dynamodb:Query',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem'
        ],
        resources: [options.tables.Votes.tableArn],
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
