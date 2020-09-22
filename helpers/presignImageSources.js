import AWS from "../aws.config";
import { USER_POOL_REGION } from "../config";

/**
 * presignImageSources will convert an image data array and replace the src with a presigned url
 * @param imageData {array} - The data array coming from DynamoDB
 * @param bucketName {string} - The bucket name that the signed urls need to be generated for
 * @return {array} - Returns a new array with the src attribute of imageData updated with the signed url
 */

const presignImageSources = async (imageData, bucketName) => {
  const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region: USER_POOL_REGION,
    sessionToken,
  });

  const s3 = new AWS.S3();

  const imageDataWithSignedUrls = imageData.map((img) => ({
    ...img,
    src: s3.getSignedUrl("getObject", {
      Bucket: bucketName,
      Key: img.src.match(new RegExp(`${bucketName}\/(.+)`))[1],
    }),
  }));

  return imageDataWithSignedUrls;
};

export default presignImageSources;
