# This batch copies all the artifacts from voicefoundry-artifacts bucket to artifact buckets in every region
# so that the Lambda creation block in CloudFormation template can work in any region that supports Amazon Connect
# voicefoundry-artifacts bucket is a bucket that has been created in the author's AWS account.
# This script is intended to be run by the author only.

aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-af-south-1/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-ap-northeast-1/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-ap-northeast-2/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-ap-southeast-1/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-ap-southeast-2/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-ca-central-1/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-eu-central-1/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-eu-west-2/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-us-east-1/LambdaFunctions
aws s3 sync s3://voicefoundry-artifacts/LambdaFunctions s3://voicefoundry-artifacts-us-west-2/LambdaFunctions