import AWS from "aws-sdk";
import { USER_POOL_REGION, PUBLIC_BUCKET_NAME } from "./config";

AWS.config.region = USER_POOL_REGION;

export const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: PUBLIC_BUCKET_NAME },
});

export default AWS;
