# VoiceFoundry Demo Project

## Introduction
This project is a demo project for Voicefoundry. It uses Amazon Connect service as its base and utilizes some other AWS services.

Project implements a contact flow that could be attached to a phone number in Amazon Connect. When a client calls the flow triggers a lamda function to calculate the possible vanity numbers according the caller's phone number. The Lambda function saves the best 5 of those numbers to the DynamoDB and returns top 3 of them to the flow and flow reads them aloud to the caller. The vanity number are checked against a list of abbreviations scraped from Wikipedia and sorted by length from longest to the shortest.

There is aslo a Lambda function that has a public URL to display last 5 records in the DynamoDB. 

## Services
This demo project uses the following AWS services
- Amazon Connect
- DynamoDB
- S3
- Lambda
- IAM

## Setup
The CloudFormation template has been designed in a way that you do not need to compile anything on your local machine unless you explicitly want to do so. Therefore two setup options has been included.

### Prerequisites
- AWS Account
- An Amazon Connect instance
- Preferably a phone number attached to the Connect Instance to test the flow (optional)

If you meet the prerequisites above you can launch the stack. Please use the region on which your Amazon Connect instance resides. All the resources will be created automatically.

[![Launch Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=VoiceFoundryDemo&templateURL=https://voicefoundry-artifacts.s3.amazonaws.com/VoiceFoundryDemo.yaml)

### Updating the ContactFlow
Because of the limitations of the Amazon Connect service, the ContactFlow needs to be updated manually. At least, for now.

- Login into your Amazon Connect instance. Please use Chrome or Firefox
- Go to the page Routing > Contact flows 
- In the contact flow list find "VoiceFoundry Demo Flow" and open it
- From the combo-button on the top-right corner select "Import flow (beta)"
- Either use [the flow file in this project](ContactFlow/VoiceFoundryDemo.json) or download from [here](https://voicefoundry-artifacts.s3.amazonaws.com/VoiceFoundryDemo.json) and import it into the contact flow.
- Now we need to update the Lambda function ARN in the flow. In order to do this go to the Outputs tab of the CloudFormation stack
- Select and copy the LambdaARN value
- Back to the flow and find the "Invoke AWS Lambda Function" block and click to open the details.
- Paste the function ARN in the clipboard into the "Function ARN" selector directly.
- Publish the flow by clicking "Publish"

## Testing

- If you have a toll free or DID number to test you can attach the flow to that number and make a call.
- Vanity numbers will be generated and top 5 of them will be saved to the DynamoDB, top 3 of them will be read to the caller during the flow
- You can list the last 5 records in the DynamoDB table by clicking the WebpageURL in the CloudFormation outputs tab.
- The working version of this project can be called at `+1 800-497-0290` and the last 5 records can be liste [here](https://vcfo2xqo6mculbej3onbhsfl2e0qfzaf.lambda-url.us-west-2.on.aws/)

## Lambda Functions Manual Update

It is possible to compile and deploy the Lambda functions from the source code. There are two Lambda function:

- `generate-vanity-numbers-ts`: This function generates possible vanity numbers, stores top 5 to the DynamoDB and returns top 3 to the caller flow
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
- Open `package.json` file and find the occurences of `voicefoundry-artifacts-8106ee20` and replace it with the `ArtifactsBucket` value from the Outputs tab in the CloudFormation result page. Please note that the bucket name occurs twice in the package file.
- If you have 7-Zip installed it will be used automatically. But if you prefer to use any other compression utility please update the `zip` command in the `package.json` file.
- Open the terminal window and type `npm run deploy`
- This command will install all the packages, build the project, zip it, upload the S3 bucket generated by the CloudFormation template and update the Lambda function automatically.

## Challanges

### Amazon Connect ContactFlow Content

The DevOps side of Amazon Connect is relatively weak and there are some actions that are not supported or poorly documented. The biggest obstacle is the ContactFlow content. There is a very powerful and yet simple UI editor to edit the flow very effectively but the support to build the flow programatically is really weak. The export/import utility uses a format which is not supported by CloudFormation. 

AWS has introduced [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) just to over come this purposes.

> We've provided you with the Flow language so you can:
>
> - Efficiently update contact flows that you're migrating from one instance to another.
> - Write contact flows rather than drag blocks onto the contact flow designer.

This format is supported by CloudFormation and in this project it is attempted to use as a mean to hold the contact flows. But the documentation does not cover every detail and it is lacking some functions. For example `Invoke AWS Lambda function` equivalent `InvokeLambdaFunction` method produces HTTP 400 error without any further detail.

Therefore automating the contact flow content has been done in manual ways.

### Region Restriction for Lambda Creation with CloudFormation

Creating a Lambda function with CloudFormation via S3 bucket is the easiest and trouble-free way. When the CF template is run the artifacts of the Lambda function can be retrieved from an S3 bucket that is outside of the templete and this way the template can be run without any problems. But there is a region restriction that the bucket from which the artifact will be retrieved has to be in the same region the template runs.

```yaml
  SuperLambdaFunction:
    Type: 'AWS::Lambda::Function'
    Properties:
      FunctionName: super-lambda-function
      Handler: app.lambdaHandler
      Code:
        S3Bucket: artifact-bucket
        S3Key: artifact.zip
      Runtime: nodejs14.x
```
Therefore 10 buckets have been created and the artifacts copied to each of them with [a batch script](Artifacts/Copy%20Artifacts.ps1). It would be nice to have only one bucket (or source) to handle this need.

### Toll Free or DID Number Availability

This demo project is prepared in an AWS account in free-tier. There is a glitch in allocating the phone numbers in Amazon Connect that once you allocate a phone number your free-tier limit is reached and you cannot allocate another number even if you release the first one. 

Therefore in the CloudFormation template the part for allocation a phone number has been commented-out

```yaml
  PhoneNumber:
    Type: 'AWS::Connect::PhoneNumber'
    Properties:
      TargetArn: !Ref ConnectInstanceARN
      Description: Toll free number to use with the flow.
      Type: TOLL_FREE
      CountryCode: US
```

## Improvements

 - Further research can be made on Amazon Connect Flow language
 - Single file source for Lambda function creation in CloudFormation in different AWS regions
