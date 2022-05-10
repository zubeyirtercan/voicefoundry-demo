# This batch copies all the artifacts from voicefoundry-artifacts bucket to artifact buckets in every region
# so that the Lambda creation block in CloudFormation template can work in any region that supports Amazon Connect
# voicefoundry-artifacts bucket is a bucket that has been created in the author's AWS account

aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-us-east-1
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-us-west-2
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-af-south-1
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-ap-northeast-2
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-ap-southeast-1
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-ap-southeast-2
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-ap-northeast-1
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-ca-central-1
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-eu-central-1
aws s3 sync s3://voicefoundry-artifacts s3://voicefoundry-artifacts-eu-west-2