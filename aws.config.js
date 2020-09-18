import AWS from "aws-sdk";
import { USER_POOL_REGION } from "./config";

AWS.config.region = USER_POOL_REGION;

export default AWS;
