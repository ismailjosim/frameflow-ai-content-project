import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "ENCRYPTION_SECRET_KEY is not defined in environment variables",
    );
  }

  // If provided as 64-char hex string, convert to 32 bytes buffer
  if (secret.length === 64) {
    return Buffer.from(secret, "hex");
  }
  // Otherwise, hash it to ensure 32 bytes (256 bits)
  return crypto.createHash("sha256").update(secret).digest();
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts a sensitive string (API Key) using AES-256-GCM.
 */
export function encryptApiKey(plainText: string): EncryptedData {
  if (!plainText || typeof plainText !== "string") {
    throw new Error("Invalid plainText supplied for encryption");
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    ciphertext: encrypted,
    iv: iv.toString("hex"),
    authTag,
  };
}

/**
 * Decrypts an encrypted API Key using AES-256-GCM.
 */
export function decryptApiKey(encryptedData: EncryptedData): string {
  const { ciphertext, iv, authTag } = encryptedData;
  if (!ciphertext || !iv || !authTag) {
    throw new Error("Missing ciphertext, IV, or authTag for decryption");
  }

  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Masks an API key for safe frontend display (e.g. sk-proj...7x92)
 */
export function maskApiKey(plainText: string): string {
  if (!plainText) return "";
  const trimmed = plainText.trim();
  if (trimmed.length <= 8) return "••••••••";
  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  return `${prefix}••••••••${suffix}`;
}
