import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { PollKey } from "./PollKey";
import { VoteKey } from "./VoteKey";

export class PollsConstruct extends Construct {
    
    public readonly polls: Table;
    public readonly votes: Table;
    
    constructor (scope: Construct, id: string) {
        super(scope, id);
        this.polls = new Table(this, `${id}Polls`, {
            removalPolicy: RemovalPolicy.DESTROY,
            partitionKey: {
                name: PollKey.Id,
                type: AttributeType.STRING
            }
        })
        this.votes = new Table(this, `${id}Votes`, {
            removalPolicy: RemovalPolicy.DESTROY,
            partitionKey: {
                name: VoteKey.IdentityId,
                type: AttributeType.STRING
            },
            sortKey: {
                name: VoteKey.PollId,
                type: AttributeType.STRING
            }
        })
    }

}