# DynamoDB in Vibuco

We use DynamoDB to fetch our data for the images that are rendered on the page.

## Pipeline

Not logged in users:

`client -> fetch DynamoDB vibuco-public-photos data -> fetch S3 images with urls -> render images on screen`

Logged in users:

`client -> fetch DynamoDB vibuco-common-photos data with permissions from logged in token -> get signed urls from S3 to render the images -> get images with signed url from S3 -> render on screen`

## How to use

The main function is found in `actions/getDataFromDDBTable.js`

To use:

```javascript
import getDataFromDDBTable from "actions/getDataFromDDBTable.js";

const data = await getDataFromDDBTable("<table-name>", "<optional-token>");
```

The `<optional-token>` can come from the `useAuth` function that is used to authenticate users. This will return an object with auth information. You can use the `auth.idToken` as the token to connect with the DB if it is necessary to be authenticated.

## How it works

Inside of `actions/getDataFromDDBTable.js` we first set the right credentials with the id token of the logged in user (if we have that).

Once these are set and received, we create a new docClient using the AWS SDK and pass in the correct region from our environment variables.

Then we pass in the `tableName` from the parameter to fetch the data from the right table.
