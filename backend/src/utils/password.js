/**
 * Password Security Utilities
 * Password hashing, validation, and strength checking
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Increased from 10 for production

// Common passwords to reject
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'passw0rd', 'shadow', '123123', '654321'
];

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Password hashing error:', error.message);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
export const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error.message);
    return false;
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} userInfo - User information to check against
 * @returns {Object} - Validation result
 */
export const validatePasswordStrength = (password, userInfo = {}) => {
  const errors = [];
  const warnings = [];
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Character type checks
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Common password check
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger password');
  }
  
  // User info check
  if (userInfo.name && password.toLowerCase().includes(userInfo.name.toLowerCase())) {
    errors.push('Password should not contain your name');
  }
  
  if (userInfo.email) {
    const emailParts = userInfo.email.split('@')[0].toLowerCase();
    if (password.toLowerCase().includes(emailParts)) {
      errors.push('Password should not contain your email');
    }
  }
  
  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Avoid repeating characters');
  }
  
  // Sequential numbers check
  if (/012|123|234|345|456|567|678|789/.test(password)) {
    warnings.push('Avoid sequential numbers');
  }
  
  // Calculate strength score
  const strength = calculatePasswordStrength(password);
  
  return {
    valid: errors.length === 0,
    strength,
    errors,
    warnings,
    feedback: generatePasswordFeedback(strength, errors, warnings)
  };
};

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} - Strength score and label
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length bonus
  score += Math.min(password.length * 4, 40);
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
  
  // Complexity bonus
  const uniqueChars = new Set(password).size;
  score += uniqueChars * 2;
  
  // Penalties
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeating characters
  if (/012|123|234|345|456|567|678|789/.test(password)) score -= 10; // Sequential
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) score -= 30;
  
  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Determine label
  let label;
  if (score < 30) label = 'weak';
  else if (score < 60) label = 'fair';
  else if (score < 80) label = 'good';
  else label = 'strong';
  
  return { score, label };
};

/**
 * Generate user-friendly feedback
 * @param {Object} strength - Strength score object
 * @param {Array} errors - Validation errors
 * @param {Array} warnings - Validation warnings
 * @returns {string} - Feedback message
 */
const generatePasswordFeedback = (strength, errors, warnings) => {
  if (errors.length > 0) {
    return errors[0]; // Return first error
  }
  
  if (strength.label === 'weak') {
    return 'Your password is weak. Consider making it longer and more complex.';
  }
  
  if (strength.label === 'fair') {
    return 'Your password is fair. Add more variety to make it stronger.';
  }
  
  if (strength.label === 'good') {
    return 'Your password is good. Well done!';
  }
  
  return 'Your password is strong. Excellent!';
};

/**
 * Check if password has been compromised (future enhancement)
 * Uses Have I Been Pwned API
 * @param {string} password - Password to check
 * @returns {Promise<boolean>} - True if compromised
 */
export const checkPasswordBreach = async (password) => {
  // TODO: Implement HIBP API check
  // For now, just check against common passwords
  return COMMON_PASSWORDS.includes(password.toLowerCase());
};
