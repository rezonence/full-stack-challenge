import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { resolveTableName } from '../resolveTableName';
import { sortKey } from "../sortKey";

const ddb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async event => {

    try {
        await ddb.delete({
            TableName: resolveTableName() as string,
            Key: {
                [sortKey]: event.requestContext.connectionId,
            }
        }).promise();
    } catch (err) {
        return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
    }

    return { statusCode: 200, body: 'Disconnected.' };
};