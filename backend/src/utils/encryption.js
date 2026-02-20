/**
 * Encryption Utilities
 * AES-256-GCM encryption for sensitive data
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

// Get encryption key from environment
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }
  
  if (key.length !== KEY_LENGTH * 2) { // Hex string is 2x length
    throw new Error(`ENCRYPTION_KEY must be ${KEY_LENGTH * 2} hex characters`);
  }
  
  return Buffer.from(key, 'hex');
};

/**
 * Encrypt text using AES-256-GCM
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted data (hex): iv + authTag + encrypted
 */
export const encrypt = (text) => {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return: iv + authTag + encrypted (all in hex)
    return iv.toString('hex') + authTag.toString('hex') + encrypted;
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt text using AES-256-GCM
 * @param {string} encryptedData - Encrypted data (hex)
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedData) => {
  try {
    const key = getEncryptionKey();
    
    // Extract components
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(
      encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2),
      'hex'
    );
    const encrypted = encryptedData.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Generate a random encryption key
 * @returns {string} - 64-character hex string
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
};

/**
 * Hash data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hex hash
 */
export const hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate a secure random token
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} - Hex token
 */
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
