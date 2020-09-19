import { USER_POOL_REGION } from "../config";

// This function returns a https url for accessing images from a specific bucket in our amazon s3 cloud.
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
