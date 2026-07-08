import { S3Client } from "bun";

const BUCKET = process.env.S3_BUCKET || "my-bucket";
const REGION = process.env.S3_REGION || "ap-southeast-1";
const ENDPOINT = process.env.S3_ENDPOINT || `https://${REGION}.digitaloceanspaces.com`;
const PUBLIC_URL = process.env.S3_PUBLIC_URL || `https://${BUCKET}.${REGION}.digitaloceanspaces.com`;

export const s3 = new S3Client({
  accessKeyId: process.env.S3_ACCESS_KEY || "",
  secretAccessKey: process.env.S3_SECRET_KEY || "",
  bucket: BUCKET,
  endpoint: ENDPOINT,
});

export const getPublicUrl = (key: string) => `${PUBLIC_URL}/${key}`;
