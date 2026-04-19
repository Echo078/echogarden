"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// Audio upload constraints
export const AUDIO_UPLOAD_CONSTRAINTS = {
  maxSizeBytes: 25 * 1024 * 1024, // 25MB
  maxSizeMB: 25,
  allowedTypes: ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/aac", "audio/ogg", "audio/webm"],
  allowedExtensions: [".mp3", ".m4a", ".aac", ".ogg", ".webm"],
  recommendedFormat: "MP3 or M4A",
  notAllowed: [".wav", ".flac", ".aiff"], // Explicitly not supported due to size
};

/**
 * Validate audio file before upload
 */
export async function validateAudioFile(
  file: File
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > AUDIO_UPLOAD_CONSTRAINTS.maxSizeBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${sizeMB}MB). Maximum size is ${AUDIO_UPLOAD_CONSTRAINTS.maxSizeMB}MB. Consider converting to MP3.`,
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
  if (AUDIO_UPLOAD_CONSTRAINTS.notAllowed.includes(extension)) {
    return {
      valid: false,
      error: `${extension.toUpperCase()} files are not supported due to large file sizes. Please convert to MP3 or M4A.`,
    };
  }

  // Check MIME type
  const isAllowedType = AUDIO_UPLOAD_CONSTRAINTS.allowedTypes.some(
    (type) => file.type === type || file.type.startsWith("audio/")
  );
  if (!isAllowedType && !file.type.startsWith("audio/")) {
    return {
      valid: false,
      error: "Invalid file type. Please upload an audio file (MP3, M4A, AAC, OGG, or WebM).",
    };
  }

  return { valid: true };
}

/**
 * Upload file directly from server action (avoids CORS issues)
 */
export async function uploadToR2(
  formData: FormData
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file before upload
    const validation = await validateAudioFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique key with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `audio/${timestamp}-${sanitizedFilename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    const publicUrl = `${PUBLIC_URL}/${key}`;

    return { success: true, publicUrl };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return { success: false, error: error instanceof Error ? error.message : "Upload failed" };
  }
}

/**
 * Generate a presigned URL for uploading a file directly to R2
 */
export async function getUploadPresignedUrl(
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  // Generate unique key with timestamp
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `audio/${timestamp}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<{ success: boolean }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return { success: false };
  }
}

/**
 * Extract key from R2 public URL
 */
export async function extractKeyFromUrl(url: string): Promise<string | null> {
  if (!url.startsWith(PUBLIC_URL)) return null;
  return url.replace(`${PUBLIC_URL}/`, "");
}
