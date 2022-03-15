import { DynamoDBStreamHandler } from "aws-lambda";
import { DynamoDB } from 'aws-sdk'
import { AttributeMap } from "aws-sdk/clients/dynamodb";
import { Vote } from "../Vote";
import { chain } from "lodash";
import { VoteKey } from "../VoteKey";
import { CountItem } from "../CountItem";
import { CountKey } from "../CountKey";
import { resolveTableName } from "../resolveTableName";
import { PollingTable } from "../PollingTable";

const ddb = new DynamoDB.DocumentClient()

export const handler: DynamoDBStreamHandler = async event => {
    const allVotes = event.Records
        .filter(r => r.eventName === "INSERT")
        .map(r => r.dynamodb?.NewImage)
        .map(v => DynamoDB.Converter.unmarshall(v as AttributeMap) as Vote);

    const choiceKey: keyof Vote = "choice";

    const voteCounts = chain(allVotes)
        .groupBy(VoteKey.PollId)
        .mapValues(votes => chain(votes).countBy(choiceKey).value()).value()


    const countUpdates: CountItem[] = [];
    for (const pollId of Object.keys(voteCounts)) {
        for (const choice of Object.keys(voteCounts[pollId])) {
            const increment = voteCounts[pollId][choice];
            countUpdates.push({
                pollId,
                choice: parseInt(choice),
                count: increment
            });
        }
    }

    const countKey: keyof CountItem = "count";
    const countExpression = `:${countKey}`;
    
    ddb.transactWrite(({
        TransactItems: countUpdates.map(u => ({
            Update: {
                TableName: resolveTableName(PollingTable.Counts) as string,
                Key: {
                    [CountKey.Choice]: u.choice,
                    [CountKey.PollId]: u.pollId
                },
                ExpressionAttributeValues: {
                    [countExpression]: u.count
                },
                UpdateExpression: `add ${countKey} ${countExpression}`
            }
        }))
    })).promise();
};