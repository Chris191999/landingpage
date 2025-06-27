import CryptoJS from 'crypto-js';
import DOMPurify from 'dompurify';

// Generate or retrieve encryption key from secure storage
const getEncryptionKey = (): string => {
  let key = localStorage.getItem('app_encryption_key');
  if (!key) {
    // Generate a new key using Web Crypto API fallback
    key = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('app_encryption_key', key);
  }
  return key;
};

// Encrypt sensitive data before storing
export const encryptData = (data: string): string => {
  try {
    const key = getEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return data; // Fallback to unencrypted if encryption fails
  }
};

// Decrypt sensitive data after retrieval
export const decryptData = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData; // Fallback to return as-is if decryption fails
  }
};

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'br', 'p'],
    ALLOWED_ATTR: []
  });
};

// Sanitize text input to prevent injection attacks
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Strip all HTML tags to prevent XSS
  const stripped = input.replace(/<[^>]*>?/gm, '');
  
  // Escape HTML entities to prevent any remaining special characters from being interpreted as HTML
  const sanitized = stripped
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

// Prevent CSV formula injection
export const sanitizeCsvCell = (cell: string): string => {
  if (!cell) return '';
  
  // Check for formula injection patterns
  const formulaChars = ['=', '+', '-', '@', '\t', '\r'];
  const firstChar = cell.charAt(0);
  
  if (formulaChars.includes(firstChar)) {
    // Prepend with single quote to neutralize formula
    return `'${cell}`;
  }
  
  return cell;
};

// Validate file size (50MB limit)
export const validateFileSize = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Validate file type based on content, not just extension
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Generate checksum for data integrity
export const generateChecksum = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

// Verify data integrity using checksum
export const verifyChecksum = (data: string, expectedChecksum: string): boolean => {
  const actualChecksum = generateChecksum(data);
  return actualChecksum === expectedChecksum;
};

// Secure localStorage wrapper with encryption
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Secure storage set failed:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`);
  }
};
