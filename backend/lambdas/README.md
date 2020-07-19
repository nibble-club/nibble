# Lambdas

To edit a Lambda function's code, just change the code in the appropriate directory. Then, from that directory, run `make build` to zip your new code into a deployment package. Then run `make archive` to send that deployment package up to S3. This will also change the appropriate artifact version in the environment's Terraform variables file, so running `make plan` in `deployments` will show changes to be made.
