import * as AWS from "aws-sdk";

export async function getRecords() {

    let docClient = new AWS.DynamoDB.DocumentClient();

    let dbParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.DatabaseName ?? "DatabaseNameEnvironmentVariableMissing",
        Limit: 5,
    };

    let dbResult = await docClient.scan(dbParams).promise()

    return dbResult.Items!;
};