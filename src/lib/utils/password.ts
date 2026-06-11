import crypto from "crypto";

/**
 * Hash a password using SHA-256
 * @param password The plain text password
 * @returns The hex string of the SHA-256 hash
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Verify a plain text password against a hash
 * @param password The plain text password
 * @param hash The stored hash
 * @returns True if they match
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
