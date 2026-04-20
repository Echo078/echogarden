import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

// Route segment config for App Router
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Environment variables - use same names as lib/r2.ts
const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Initialize S3 client for R2 - same config as lib/r2.ts
const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    console.log("[API/upload] Received upload request");
    console.log("[API/upload] R2_ENDPOINT:", R2_ENDPOINT ? "set" : "NOT SET");
    console.log("[API/upload] R2_BUCKET_NAME:", R2_BUCKET_NAME ? "set" : "NOT SET");
    
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.log("[API/upload] No file in request");
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("[API/upload] File received:", file.name, "Size:", (file.size / (1024 * 1024)).toFixed(2), "MB", "Type:", file.type);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.log("[API/upload] File too large:", file.size);
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is 50MB.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `audio/${timestamp}-${originalName}`;

    console.log("[API/upload] Uploading to R2 with key:", key);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || "audio/mpeg",
    });

    await s3Client.send(command);

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    console.log("[API/upload] Upload successful:", publicUrl);

    return NextResponse.json({
      success: true,
      publicUrl,
      key,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("[API/upload] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
