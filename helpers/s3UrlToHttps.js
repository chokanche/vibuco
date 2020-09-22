import { USER_POOL_REGION } from "../config";

/**
 * s3UrlToHttps takes in a s3Url (s3://bucket-name/image.jpg) and returns an actual https url
 * @param s3Url {string}
 * @param bucket {string} - The bucket name that the url needs to be generated for
 * @return {string} - Returns a new https url for the image
 */

export default function s3UrlToHttps(s3Url, bucket) {
  const regexp = new RegExp(`${bucket}\/(.+)`);

  const key = s3Url.match(regexp)[1];
  if (!key) {
    throw new Exception(
      "Bucket name is not set up correct, please check if the proper bucket is being passed through for this table"
    );
  }

  return `https://${bucket}.s3.${USER_POOL_REGION}.amazonaws.com/${key}`;
}
