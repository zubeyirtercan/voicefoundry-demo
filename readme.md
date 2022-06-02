# VoiceFoundry Demo Project

## Introduction

This project is a demo project for VoiceFoundry. It uses Amazon Connect service as its base and utilizes some other AWS services.

Project implements a contact flow that could be attached to a phone number in Amazon Connect. When a client calls the flow triggers a lambda function to calculate the possible vanity numbers according to the caller's phone number. The Lambda function saves the best 5 of those numbers to the DynamoDB and returns top 3 of them to the flow and flow reads them aloud to the caller. The vanity numbers are checked against a list of abbreviations scraped from Wikipedia and sorted by length from longest to the shortest.

There is also a Lambda function that has a public URL to display last 5 records in the DynamoDB. 

## Services

This demo project uses the following AWS services

- CloudFormation
- Amazon Connect
- DynamoDB
- S3
- Lambda
- IAM

## Setup

The CloudFormation template has been designed in a way that you do not need to compile anything on your local machine unless you explicitly want to do so. If you prefer, you can manually compile the Lambda functions locally and upload to your AWS environment by using ready to use commands.

### Steps
1. Create an AWS account (if you do not one have already)
2. Create an Amazon Connect instance (if you do not have one already)
3. Launch the stack into the region in which you create (or have created) your Amazon Connect instance. All the resources will be created automatically.
4. Update the ContactFlow that is created by the template as described below.
5. Do some testing
6. Delete the stack if you prefer


[![Launch Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=VoiceFoundryDemo&templateURL=https://voicefoundry-artifacts.s3.amazonaws.com/CloudFormation/VoiceFoundryDemoTemplate.yaml)

### Updating the ContactFlow

Because of the limitations of the Amazon Connect service, the ContactFlow needs to be updated manually. At least, for now.

- Login into your Amazon Connect instance. Please use Chrome or Firefox
- Go to the page Routing > Contact flows 
- In the contact flow list find "VoiceFoundry Demo Flow" and open it
- From the combo-button in the top-right corner select "Import flow (beta)"
- Either use [VoiceFoundryDemoContactFlow.json file in this project](ContactFlow/VoiceFoundryDemoContactFlow.json) or download from [here](https://voicefoundry-artifacts.s3.amazonaws.com/ContactFlow/VoiceFoundryDemoContactFlow.json) and import it into the contact flow.
- Now we need to update the Lambda function ARN in the flow. To do this, go to the Outputs tab of the CloudFormation stack
- Select and copy the LambdaARN value
- Back to the flow and find the "Invoke AWS Lambda Function" block and click to open the details.
- Paste the function ARN in the clipboard into the "Function ARN" selector directly.
- Publish the flow by clicking "Publish"
- Go to the phone numbers in the Amazon Connect console and assign the ContactFlow to it. If you do not have a phone number or did not let the template create one for you, you can claim a number in Amazon Connect console.

## Testing

- Call your phone number to initiate the ContactFlow you attached.
- Vanity numbers will be generated and top 5 of them will be saved to the DynamoDB, top 3 of them will be read back to the caller during the flow.
- You can list the last 5 records in the DynamoDB table by clicking the WebpageURL in the CloudFormation outputs tab.
- The working version of this project can be called at `+1 800-497-0290` and the last 5 records can be listed [here](https://yiq4g7yxx6xenfbr47saput3fq0bboas.lambda-url.us-west-2.on.aws/)

## Deleting the stack

You can delete the stack from via CloudFormation console. This way the template will delete all the resources it has created. Before initiating the delete command, you need to detach the contact flow from the phone number. Otherwise, you will get a "resource in use" error.

## Lambda Functions Manual Deployment

It is possible to compile and deploy the Lambda functions from the source code. There are two Lambda function:

- `generate-vanity-numbers-ts`: This function generates possible vanity numbers, stores top 5 to the DynamoDB, and returns top 3 to the caller flow
- `webpage-ts`: This function lists the last 5 calls and generated vanity number by the flow

Both of those functions are written in TypeScript and can be compiled and deployed by using `npm run deploy` function declared in the respective `package.json` files. 

### Prerequisites

- AWS CLI
- AWS credentials set-up locally
- Node.js
- npm
- 7-Zip (or any other equivalent)

### Deploying Lambda Functions

- Fully download this project to your locale
- Go to the root folder (folder above src folder) of either function.
- Open `package.json` file and replace all occurrences of `ArtifactsBucketName` and with `ArtifactsBucket` value from the Outputs tab in the CloudFormation result page. Please note that the bucket name occurs twice in the package file.
- In the same `package.json` file find `VanityNumbersLambdaFunctionName` or `WebpageLambdaFunctionName` and replace it with the appropriate value from the Outputs tab.
- If you have 7-Zip installed it will be used automatically. But if you prefer to use any other compression utility, please update the `zip` command in the `package.json` file.
- Open the terminal window and type `npm run deploy`
- This command will install all the packages, build the project, zip it, upload the S3 bucket generated by the CloudFormation template and update the Lambda function automatically.

## Challenges

### Amazon Connect ContactFlow Content

The DevOps side of Amazon Connect is relatively weak and there are some actions that are not supported or poorly documented. The biggest obstacle is the ContactFlow content. There is a very powerful and yet simple UI editor to edit the flow very effectively but the support to build the flow programmatically is weak. The export/import utility uses a format which is not supported by CloudFormation. 

AWS has introduced [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) just to overcome these purposes.

> We've provided you with the Flow language, so you can:
> - Efficiently update contact flows that you are migrating from one instance to another.
> - Write contact flows rather than drag blocks onto the contact flow designer.

During the development of the demo project some attempts to convert the ContactFlows into Flow Language and the sample flow document can be found [here](/ContactFlow/ConnectFlow%20Language%20Sample.json). The flow language seems to be easy to understand and implement. Some excerpt is included below.

```json
{
  "Version": "2019-10-30",
  "StartAction": "32e5247f-7929-44f5-93f5-605ce2317b2c",
  "Actions": [
    {
      "Identifier": "32e5247f-7929-44f5-93f5-605ce2317b2c",
      "Type": "MessageParticipant",
      "Transitions": {
        "NextAction": "5fa06901-2fc6-4056-a698-97cfb7c6782a",
        "Errors": [],
        "Conditions": []
      },
      "Parameters": {
        "Text": "Thanks for calling the basic flow!"
      }
    },
    {
      "Identifier": "5fa06901-2fc6-4056-a698-97cfb7c6782a",
      "Type": "DisconnectParticipant",
      "Transitions": {},
      "Parameters": {}
    }
  ]
}
```

This format is officially supported by CloudFormation. But the documentation does not cover every detail, and it is lacking some functions. For example, `Invoke AWS Lambda function` equivalent `InvokeLambdaFunction` method produces HTTP 400 error without any further detail.

Therefore, automating the contact flow content has been done in manual ways.

### Region Restriction for Lambda Creation with CloudFormation

Creating a Lambda function with CloudFormation via S3 bucket is the easiest and trouble-free way. When the CF template is run the artifacts of the Lambda function can be retrieved from an S3 bucket that is outside the template and this way the template can be run without any problems. But there is a region restriction that the bucket from which the artifact will be retrieved has to be in the same region the template runs.

```yaml
  SuperLambdaFunction:
    Type: 'AWS::Lambda::Function'
    Properties:
      FunctionName: super-lambda-function
      Handler: app.lambdaHandler
      Code:
        S3Bucket: artifact-bucket # this bucket must be in the same region the template runs
        S3Key: artifact.zip
      Runtime: nodejs14.x
```
Therefore, 10 buckets have been created, and the artifacts copied to each of them with [a batch script](Artifacts/Copy%20Artifacts.ps1). It would be nice to have only one bucket (or source) to handle this need.

### Manual Deployment Process

For security reasons one can prefer to build and deploy the Lambda functions locally. Since this process might be tricky sometimes, some `npm run` commands has been prepared. 

Only running `npm run deploy` command will install all the packages, build the project, zip it, upload the S3 bucket generated by the CloudFormation template and update the Lambda function automatically. This way the user does not have to worry about deploying the project right. 

## Improvements

 - Further research can be made on Amazon Connect Flow language
 - Single file source for Lambda function creation in CloudFormation in different AWS regions
 - Vanity number determination could be done in a more linguistically correct way, probably with an online service

## Architecture Diagram

### Contact Flow Diagram

![Contact Flow Diagram](/Assets/DemoFlow.png "Contact Flow Diagram")

### Architectural Diagram

![Architectural Diagram](/Assets/ArchitecturalDiagram.png "Architectural Diagram")