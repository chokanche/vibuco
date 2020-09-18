import AWS from "../aws.config";
import { USER_POOL_REGION } from "../config";

const presignImageSources = async (imageData, bucketName, auth) => {
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
