# Nibble Backend

## Deploying Changes

To add a lambda, add a folder to the `lambdas` folder, again following the existing examples. Then run `make build` to build the .zip and run tests, and `make archive` to upload the artifact to S3.

After you've built your new code to deploy, or edited the deployment itself, run `make plan`. This will show you the plan; run `make apply` to apply it to real physical infrastructure.

If you add a new Lambda, make sure to also add the relevant variables to `inputs.tf` (the artifact and the release version). Follow the existing examples.

If you add any new input variables, make sure to document them with a description!

## Secrets Management

Currently, if you need to store a secret (e.g. the Postgres password), you will need to use the AWS console and [create a secure parameter](https://us-west-2.console.aws.amazon.com/systems-manager/parameters/create?region=us-west-2); make it Standard tier, of type SecureString, and use `alias/account-key` to encrypt it. Then you can use it as a data source in your Terraform stack. In the future we will have a more robust system in place here.

## Schemas

If you've updated schemas, then call `make sync-*-schemas` (replace `*` with the name of the schema, e.g. `postgres`; this step is not necessary for Elasticsearch). This will put the schemas in an S3 bucket, but do nothing else yet. You'll need to call `make migrate-*-schemas` to actually migrate those schemas.

## SSH Access

If you set up your public and private key correctly based on the instructions above, then once you deploy the stack you will have an EC2 instance you can use to inspect the databases. When you deploy the stack, there will be an output `"ssh_instance_address"`; copy the address, then run the following command:

```shell script
ssh -i "~/.ssh/dev-ssh_key_pair.pem" ubuntu@[enter address here]
```

Once you accept the key, you will be in. Useful environment variables and utilities are already loaded; for example, try running

```shell script
redis-cli -h $REDIS_ADDRESS -p $REDIS_PORT
```

to access Redis, or

```shell script
PGPASSWORD=$DB_PASSWORD psql -h $DB_ADDRESS -p $DB_PORT -U $DB_USERNAME $DB_NAME
```

to access the Postgres database. Note that these will only work if you are SSH'ed in to the EC2 instance as described above; these resources are in a private subnet, with restrictive security group settings, so they cannot be accessed from the internet.

Another useful command:

```shell script
sudo flyway clean
```

That command will completely wipe your database. Obviously do not use this command on any real data!!

### Elasticsearch Access

Because the Elasticsearch instance is in your VPC, it's difficult (but still possible) to access it. If you _really_ need to, here's how:

1. In your hosts file (on Windows, that's at `C:\Windows\System32\drivers\etc\hosts`); on Mac and Linux, it's at `/etc/hosts` (wow so much easier)), add the following line:

   ```text
   127.0.0.1         [YOUR ELASTICSEARCH ENDPOINT]
   ```

   (for example, my Elasticsearch endpoint is `vpc-dev-adchurch-elasticsearch-6yqskxqq4ttomtf2l6umepixou.us-west-2.es.amazonaws.com`)

   This is necessary for signing requests later; AWS will not sign requests to `localhost`, so you need to associate the address of your Elasticsearch domain with it here. Don't worry, this won't mess with your web browsing; the address is not accessible from the public internet anyway.

2. Assuming you have completed the above steps for SSH access (if not go do that), run the following command:

   ```shell
   ssh -i "~/.ssh/dev-ssh_key_pair.pem" ubuntu@[enter address here] -N -L 9200:[YOUR ELASTICSEARCH ENDPOINT]:443
   ```

   This will create an SSH tunnel, forwarding requests to `localhost:9200` to your Elasticsearch endpoint at port 443. It's using the EC2 instance to SSH through, which has the permissions to access the Elasticsearch domain (unlike your local machine).

3. In an ideal world (or if you set your personal Elasticsearch instance to fully open access), you would be able to just navigate to `localhost:9200` in your browser and see information. But unless you have enabled fully open access, you'll need to _sign your requests_. Luckily that's quite easy to do in Python; see the `scripts/inspect_es.py` file for an example to work from. Feel free to use this file to query away at Elasticsearch as you need to. It works because it signs every request with your current credentials, which should be your `nibble-deploy` profile.
