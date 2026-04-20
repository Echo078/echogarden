import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "echo-garden";
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL || "";

// Max file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Generate a presigned URL for direct-to-R2 upload
 * This allows the client to upload directly to R2, bypassing the server
 * and avoiding any request body size limits
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, fileSize } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    // Validate file size
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate file type (audio files only)
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/aac", "audio/ogg", "audio/webm"];
    const isAudioType = allowedTypes.includes(fileType) || fileType.startsWith("audio/");
    if (!isAudioType) {
      return NextResponse.json(
        { success: false, error: "Only audio files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique key for the file
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `music/${timestamp}-${randomSuffix}-${sanitizedFileName}`;

    // Create presigned URL for PUT operation (valid for 10 minutes)
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    // Construct the public URL that will be used after upload
    const publicUrl = PUBLIC_URL_BASE 
      ? `${PUBLIC_URL_BASE}/${key}`
      : `https://${BUCKET_NAME}.r2.cloudflarestorage.com/${key}`;

    console.log("[v0] Generated presigned URL for:", key);

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("[v0] Error generating presigned URL:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
