import { USER_POOL_REGION, IDENTITY_POOL_ID, USER_POOL_ID } from "../config";
import AWS from "../aws.config";

/**
 * getCredentials will assign a new AWS.CognitoIdentityCredentials with the passed in token with the Identity pool configuration to the AWS.config and will return this instance too.
 * @param token {string}
 * @return {AWSCredentials} - Returns a AWS config credentials object
 */

const getCredentials = (token) => {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: token
      ? {
          [`cognito-idp.${USER_POOL_REGION}.amazonaws.com/${USER_POOL_ID}`]: token,
        }
      : undefined,
  });

  return AWS.config.credentials;
};

/**
 * getDataFromDDBTable will return a promise that will resolve with data from the DynamoDB database table
 * @param tableName {string} - The table name in the DB that needs to be fetched
 * @param token {string} - The authenticity token (optional) for fetching authenticated data
 * @return {Promise<array>} - Returns a promise that will resolve in an array with records from the table in DynamoDB.
 */

const getDataFromDDBTable = (tableName, token) => {
  const credentials = getCredentials(token);

  return new Promise((resolve) => {
    credentials.get((err) => {
      if (!err) {
        // Instantiate aws sdk service objects now that the credentials have been updated
        const docClient = new AWS.DynamoDB.DocumentClient({
          region: USER_POOL_REGION,
        });

        docClient.scan({ TableName: tableName }, (err, data) => {
          if (err) return console.log(err);

          resolve(data.Items);
        });
      }
    });
  });
};

export default getDataFromDDBTable;
