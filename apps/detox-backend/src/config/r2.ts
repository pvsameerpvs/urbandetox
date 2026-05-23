import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./env";

let _client: S3Client | null = null;

function createR2Client(): S3Client {
  const accountId = ENV.R2_ACCOUNT_ID;
  const accessKeyId = ENV.R2_ACCESS_KEY_ID;
  const secretAccessKey = ENV.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY must be set"
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/** Lazy singleton — only creates the client when first used. */
export function getR2Client(): S3Client {
  if (!_client) {
    _client = createR2Client();
  }
  return _client;
}
