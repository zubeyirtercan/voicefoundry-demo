import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { getRecords } from "./functions/getRecords";
import { makeTable } from "./functions/makeTable";
import * as FS from "fs";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  let rows = await getRecords();
  let htmlTemplate = FS.readFileSync('body.html', 'utf-8');
  let htmlBody: string = htmlTemplate.replace(/{{table-rows}}/g, makeTable(rows));

  return {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: htmlBody,
  }
}