import { USER_POOL_REGION, IDENTITY_POOL_ID, USER_POOL_ID } from "../config";
import AWS from "../aws.config";

const getCredentials = (token) => {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Login: token
      ? {
          [`cognito-idp.${USER_POOL_REGION}.amazonaws.com/${USER_POOL_ID}`]: token,
        }
      : undefined,
  });

  return AWS.config.credentials;
};

const getDataFromDDBTable = (tableName, token) => {
  const credentials = getCredentials(token);

  console.log(token);

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
