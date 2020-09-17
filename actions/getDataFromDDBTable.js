import { USER_POOL_REGION } from "../config";
import AWS from "../aws.config";

const getDataFromDDBTable = (tableName) => {
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get((err) => {
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
