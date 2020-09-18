# Authentication in Vibuco

Authentication in Vibuco is done using [AWS Cognito](https://aws.amazon.com/cognito/) and the package [aws-cognito-next](https://www.npmjs.com/package/aws-cognito-next).

## Deployment

Make sure you have the correct environment variables setup in your environment (locally in a `.env` file, on production it's set on the server).
These are:

```
IDP_DOMAIN=<domain>
PUBLIC_BUCKET_NAME='vibuco-public-photos'
COMMON_BUCKET_NAME='vibuco-common-photos'
USER_POOL_REGION=<region>
USER_POOL_ID=<pool_id>
USER_POOL_CLIENT_ID=<client_id>
IDENTITY_POOL_ID='<identity-pool-id>'
REDIRECT_SIGN_IN=<domain>
REDIRECT_SIGN_OUT=<domain>
AUTH_COOKIE_DOMAIN=<domain_name>
```

Also a `pems.json` file needs to generate the right keys when added to a new environment. Please run:

```
USER_POOL_REGION=<userPoolRegion> USER_POOL_ID=<userPoolId> yarn pems:prepare
```

Please use the right pool credentials for the right environment. AWS has 2 pools setup: 1 for localhost, 1 for production. Once the pems.json keys have been generated, this command doesn't need to be run anymore, it should only be done once.
