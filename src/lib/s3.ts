import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.NEXT_PUBLIC_SUPABASE_REGION!,
  endpoint: process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT_URL!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_SUPABASE_SECRET_ACCESS_KEY!,
  },
});
export const uploadToS3 = async (file: File, key: string) => {
  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_SUPABASE_S3_BUCKET!,
    Key: key, // The name of the file in the S3 bucket
    Body: file,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_S3_BUCKET}/${uploadParams.Key}`;
    return imageUrl;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw err;
  }
};
