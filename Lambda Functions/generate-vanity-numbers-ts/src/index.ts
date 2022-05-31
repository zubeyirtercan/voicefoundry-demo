import * as AWS from "aws-sdk";
import * as FS from "fs";

import { Callback, Context } from "aws-lambda";
import { buildResponse } from "./utils/buildResponse";
import { vanityGenerator } from "./utils/vanityGenerator";

let vanityWords: string[] = [];
let selectedWords: string[] = [];

const handler = (event: any, context: Context, callback: Callback) => {

    console.info("Event Details: " + JSON.stringify(event));

    let phoneNumber = event.Details.ContactData.CustomerEndpoint.Address;
    let phoneNumberClean = phoneNumber.replace(/[+01]/gi, "");
    console.info({ phoneNumberClean });

    vanityGenerator("", phoneNumberClean.slice(phoneNumberClean.length - 1), vanityWords);
    vanityGenerator("", phoneNumberClean.slice(phoneNumberClean.length - 2), vanityWords);
    vanityGenerator("", phoneNumberClean.slice(phoneNumberClean.length - 3), vanityWords);
    vanityGenerator("", phoneNumberClean.slice(phoneNumberClean.length - 4), vanityWords);
    vanityGenerator("", phoneNumberClean.slice(phoneNumberClean.length - 5), vanityWords);
    vanityGenerator("", phoneNumberClean.slice(phoneNumberClean.length - 6), vanityWords);
    console.info({ vanityWords });

    let wordsFile = FS.readFileSync('AcronymKeys.csv', 'utf-8');
    let wordsArray = wordsFile.toString().replace(/\r\n/g, '\n').split('\n')

    vanityWords.forEach(word => {
        if (wordsArray.includes(word) && !selectedWords.includes(word)) {
            selectedWords.push(word);
        }
    });

    selectedWords.sort(function (a, b) { return b.length - a.length });
    console.info({ selectedWords });

    let dbParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.DatabaseName ?? "DatabaseNameEnvironmentVariableMissing",
        Item: {
            phoneNumber: phoneNumber,
            recordDate: Date.now(),
            vanityNumbers: selectedWords.slice(0, 5),
        }
    }

    let docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(dbParams, function (err, data) {
        if (err) {
            console.error("DB put error");
            console.error(err);
            callback(err.message, buildResponse(false, null));
        }
        else {
            console.info("DB put completed");
            console.info({data});
            callback(null, buildResponse(true, selectedWords.slice(0, 3).toString()));
        }
    });
};

export { handler };