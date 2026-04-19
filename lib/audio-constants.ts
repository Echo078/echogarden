// Audio upload constraints - shared between client and server
export const AUDIO_UPLOAD_CONSTRAINTS = {
  maxSizeBytes: 25 * 1024 * 1024, // 25MB
  maxSizeMB: 25,
  allowedTypes: ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/aac", "audio/ogg", "audio/webm"],
  allowedExtensions: [".mp3", ".m4a", ".aac", ".ogg", ".webm"],
  recommendedFormat: "MP3 or M4A",
  notAllowed: [".wav", ".flac", ".aiff"], // Explicitly not supported due to size
};
