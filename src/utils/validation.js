// Input validation and sanitization utilities
// Provides comprehensive validation for user inputs to prevent XSS and data corruption

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags and content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags and content
    .replace(/<[^>]+>/g, '') // Remove all remaining HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length to prevent abuse
};

/**
 * Validate and sanitize email address
 * @param {string} email - Email to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, sanitized: '', error: 'Email must be less than 254 characters' };
  }

  // Enhanced email regex - requires at least one dot (TLD)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Please enter a valid email address' };
  }

  return { isValid: true, sanitized: trimmed, error: '' };
};

/**
 * Validate and sanitize name
 * @param {string} name - Name to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Name is required' };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Name is required' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, sanitized: '', error: 'Name must be at least 2 characters (minimum 2, maximum 50)' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, sanitized: '', error: 'Name must be less than 50 characters (minimum 2, maximum 50)' };
  }

  // Allow letters (including Unicode/international), spaces, hyphens, and apostrophes only
  const nameRegex = /^[\p{L}\s\-']+$/u;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, sanitized: trimmed, error: '' };
};

/**
 * Validate and sanitize US ZIP code
 * @param {string} zipCode - ZIP code to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateZipCode = (zipCode) => {
  if (!zipCode || typeof zipCode !== 'string') {
    return { isValid: false, sanitized: '', error: 'ZIP code is required' };
  }

  // Remove any non-digit characters
  const sanitized = zipCode.replace(/\D/g, '');
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'ZIP code is required' };
  }

  if (sanitized.length !== 5) {
    return { isValid: false, sanitized: '', error: 'ZIP code must be exactly 5 digits (numbers only)' };
  }

  // ZIP code must be 5 digits (00501-99999)
  // Note: 00501 is a valid ZIP code (Holtsville, NY)
  return { isValid: true, sanitized, error: '' };
};

/**
 * Validate and sanitize password
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, sanitized: '', error: 'Password is required' };
  }

  const sanitized = password.trim();
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Password is required' };
  }

  if (sanitized.length < 6) {
    return { isValid: false, sanitized: '', error: 'Password must be at least 6 characters (minimum 6, maximum 128)' };
  }

  if (sanitized.length > 128) {
    return { isValid: false, sanitized: '', error: 'Password must be less than 128 characters (minimum 6, maximum 128)' };
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(sanitized.toLowerCase())) {
    return { isValid: false, sanitized: '', error: 'Please choose a stronger password' };
  }

  return { isValid: true, sanitized, error: '' };
};

/**
 * Validate and sanitize garden name
 * @param {string} gardenName - Garden name to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateGardenName = (gardenName) => {
  if (!gardenName || typeof gardenName !== 'string') {
    return { isValid: false, sanitized: '', error: 'Garden name is required' };
  }

  const trimmed = gardenName.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Garden name is required' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, sanitized: '', error: 'Garden name must be at least 2 characters (minimum 2, maximum 50)' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, sanitized: '', error: 'Garden name must be less than 50 characters (minimum 2, maximum 50)' };
  }

  // Allow letters, numbers, spaces, hyphens, apostrophes, and #
  const gardenNameRegex = /^[a-zA-Z0-9\s\-'#]+$/;
  if (!gardenNameRegex.test(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Garden name can only contain letters, numbers, spaces, hyphens, apostrophes, and #' };
  }

  // Sanitize to prevent XSS (strip HTML if present)
  const sanitized = sanitizeString(trimmed);
  
  return { isValid: true, sanitized, error: '' };
};

/**
 * Validate and sanitize task title
 * @param {string} title - Task title to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateTaskTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, sanitized: '', error: 'Task title is required' };
  }

  const sanitized = sanitizeString(title);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Task title is required' };
  }

  if (sanitized.length < 2) {
    return { isValid: false, sanitized: '', error: 'Task title must be at least 2 characters (minimum 2, maximum 100)' };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized: '', error: 'Task title must be less than 100 characters (minimum 2, maximum 100)' };
  }

  return { isValid: true, sanitized, error: '' };
};

/**
 * Validate and sanitize task notes
 * @param {string} notes - Task notes to validate
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateTaskNotes = (notes) => {
  if (!notes || typeof notes !== 'string') {
    return { isValid: true, sanitized: '', error: '' }; // Notes are optional
  }

  const sanitized = sanitizeString(notes);
  
  if (sanitized.length > 500) {
    return { isValid: false, sanitized: '', error: 'Notes must be less than 500 characters (maximum 500)' };
  }

  return { isValid: true, sanitized, error: '' };
};

/**
 * Comprehensive form validation
 * @param {object} formData - Form data to validate
 * @param {boolean} isSignup - Whether this is a signup form
 * @returns {object} - {isValid: boolean, errors: object, sanitizedData: object}
 */
export const validateForm = (formData, isSignup = false) => {
  const errors = {};
  const sanitizedData = {};

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  } else {
    sanitizedData.email = emailValidation.sanitized;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  } else {
    sanitizedData.password = passwordValidation.sanitized;
  }

  // Validate password confirmation for signup
  if (isSignup) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
    } else {
      sanitizedData.name = nameValidation.sanitized;
    }

    // Validate ZIP code
    const zipValidation = validateZipCode(formData.zipCode);
    if (!zipValidation.isValid) {
      errors.zipCode = zipValidation.error;
    } else {
      sanitizedData.zipCode = zipValidation.sanitized;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};
