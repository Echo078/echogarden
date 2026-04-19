// Audio upload constraints - shared between client and server
export const AUDIO_UPLOAD_CONSTRAINTS = {
  maxSizeBytes: 25 * 1024 * 1024, // 25MB
  maxSizeMB: 25,
  allowedTypes: ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/aac", "audio/ogg", "audio/webm"],
  allowedExtensions: [".mp3", ".m4a", ".aac", ".ogg", ".webm"],
  recommendedFormat: "MP3 or M4A",
  notAllowed: [".wav", ".flac", ".aiff"], // Explicitly not supported due to size
};

/**
 * Client-side audio file validation (runs in browser, NOT a server action)
 * Use this for immediate feedback when user selects a file
 */
export function validateAudioFileClient(
  file: File
): { valid: boolean; error?: string } {
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
