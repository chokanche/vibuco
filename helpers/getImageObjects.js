import AWS from "../aws.config";
import { USER_POOL_REGION } from "../config";

/**
 * getImageObjects will use the s3.getObject method to fetch objects from a bucket
 * @param imageData {array} - The data array coming from DynamoDB
 * @param bucketName {string} - The bucket name that the objects need to be fetched from
 * @return {array} - Returns a new array with the src attribute of imageData updated with the signed url
 */

const getImageObjects = async (imageData, bucketName) => {
  const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region: USER_POOL_REGION,
    sessionToken,
  });

  const s3 = new AWS.S3();

  const imageObjects = imageData.map((img) => {
    return new Promise((resolve, reject) => {
      return s3.getObject(
        {
          Bucket: bucketName,
          Key: img.src.match(new RegExp(`${bucketName}\/(.+)`))[1],
        },
        (err, data) => {
          resolve(data);
        }
      );
    });
  });

  return Promise.all(imageObjects);
};

export default getImageObjects;