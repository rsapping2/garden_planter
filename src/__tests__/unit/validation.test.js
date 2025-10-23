import {
  sanitizeString,
  validateEmail,
  validateName,
  validateZipCode,
  validatePassword,
  validateGardenName,
  validateTaskTitle,
  validateTaskNotes,
  validateForm
} from '../../utils/validation';

describe('sanitizeString', () => {
  test('should strip HTML tags', () => {
    expect(sanitizeString('<script>alert("xss")</script>Hello')).toBe('Hello');
    expect(sanitizeString('<b>Bold</b> text')).toBe('Bold text');
    expect(sanitizeString('<img src="x" onerror="alert(1)">')).toBe('');
  });

  test('should remove javascript: protocol', () => {
    expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeString('JAVASCRIPT:void(0)')).toBe('void(0)');
  });

  test('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
    expect(sanitizeString('\n\ttest\n\t')).toBe('test');
  });

  test('should handle empty and null values', () => {
    expect(sanitizeString('')).toBe('');
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
  });
});

describe('validateEmail', () => {
  test('should accept valid email addresses', () => {
    const validEmails = [
      'user@example.com',
      'test.user@example.com',
      'user+tag@example.co.uk',
      'user_name@example-domain.com'
    ];
    
    validEmails.forEach(email => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(email.toLowerCase().trim());
    });
  });

  test('should reject invalid email addresses', () => {
    const invalidEmails = [
      'invalid',
      'invalid@',
      '@example.com',
      'user @example.com',
      'user@example',
      ''
    ];
    
    invalidEmails.forEach(email => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should reject emails exceeding length limit', () => {
    const longEmail = 'a'.repeat(255) + '@example.com';
    const result = validateEmail(longEmail);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('254 characters');
  });

  test('should sanitize email addresses', () => {
    const result = validateEmail('  USER@EXAMPLE.COM  ');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('user@example.com');
  });

  test('should block XSS attempts in email', () => {
    const result = validateEmail('<script>alert(1)</script>@example.com');
    expect(result.isValid).toBe(false);
  });
});

describe('validateName', () => {
  test('should accept valid names', () => {
    const validNames = [
      'John Doe',
      "Mary O'Connor",
      'Jean-Pierre',
      'Anne Marie',
      'José García'
    ];
    
    validNames.forEach(name => {
      const result = validateName(name);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBeTruthy();
    });
  });

  test('should reject invalid names', () => {
    const invalidNames = [
      'A', // too short
      '123', // numbers only
      'User@Name', // invalid characters
      'a'.repeat(51), // too long
      '',
      null
    ];
    
    invalidNames.forEach(name => {
      const result = validateName(name);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should reject HTML tags in names', () => {
    const result = validateName('<script>John</script> Doe');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('letters');
  });

  test('should enforce character limits', () => {
    const shortName = validateName('A');
    expect(shortName.isValid).toBe(false);
    expect(shortName.error).toContain('minimum 2');

    const longName = validateName('A'.repeat(51));
    expect(longName.isValid).toBe(false);
    expect(longName.error).toContain('maximum 50');
  });
});

describe('validateZipCode', () => {
  test('should accept valid 5-digit ZIP codes', () => {
    const validZips = ['12345', '90210', '00001', '99999'];
    
    validZips.forEach(zip => {
      const result = validateZipCode(zip);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(zip);
    });
  });

  test('should reject invalid ZIP codes', () => {
    const invalidZips = [
      '1234', // too short
      '123456', // too long
      'abcde', // letters (no digits)
      '12 34', // space (results in too short after sanitization)
      '',
      null
    ];
    
    invalidZips.forEach(zip => {
      const result = validateZipCode(zip);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should strip non-digits and validate length', () => {
    const result = validateZipCode('  12345  ');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('12345');
  });

  test('should sanitize XSS in ZIP code and validate', () => {
    const result = validateZipCode('<script>12345</script>');
    expect(result.isValid).toBe(true); // HTML is stripped, leaving valid digits
    expect(result.sanitized).toBe('12345');
  });
});

describe('validatePassword', () => {
  test('should accept valid passwords', () => {
    const validPasswords = [
      'SecurePass123',
      'MyP@ssw0rd!',
      'aaaaaa',
      'a'.repeat(128)
    ];
    
    validPasswords.forEach(password => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(password.trim());
    });
  });

  test('should reject invalid passwords', () => {
    const invalidPasswords = [
      '12345', // too short
      'a'.repeat(129), // too long
      '',
      null
    ];
    
    invalidPasswords.forEach(password => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should enforce length limits', () => {
    const shortPassword = validatePassword('12345');
    expect(shortPassword.isValid).toBe(false);
    expect(shortPassword.error).toContain('minimum 6');

    const longPassword = validatePassword('a'.repeat(129));
    expect(longPassword.isValid).toBe(false);
    expect(longPassword.error).toContain('maximum 128');
  });
});

describe('validateGardenName', () => {
  test('should accept valid garden names', () => {
    const validNames = [
      'Vegetable Garden',
      'My Garden',
      "Grandma's Garden",
      'Garden-2025',
      'Herb Garden #1'
    ];
    
    validNames.forEach(name => {
      const result = validateGardenName(name);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBeTruthy();
    });
  });

  test('should reject invalid garden names', () => {
    const invalidNames = [
      'A', // too short
      'a'.repeat(51), // too long
      '',
      null
    ];
    
    invalidNames.forEach(name => {
      const result = validateGardenName(name);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should sanitize HTML in garden names', () => {
    const result = validateGardenName('<b>Veggie</b> Garden');
    expect(result.isValid).toBe(false); // Rejected because <b> contains invalid chars
    expect(result.error).toContain('letters');
  });

  test('should enforce character limits', () => {
    const shortName = validateGardenName('A');
    expect(shortName.isValid).toBe(false);
    expect(shortName.error).toContain('minimum 2');

    const longName = validateGardenName('A'.repeat(51));
    expect(longName.isValid).toBe(false);
    expect(longName.error).toContain('maximum 50');
  });
});

describe('validateTaskTitle', () => {
  test('should accept valid task titles', () => {
    const validTitles = [
      'Water plants',
      'Harvest tomatoes',
      'Task #1',
      'a'.repeat(100)
    ];
    
    validTitles.forEach(title => {
      const result = validateTaskTitle(title);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBeTruthy();
    });
  });

  test('should reject invalid task titles', () => {
    const invalidTitles = [
      'A', // too short
      'a'.repeat(101), // too long
      '',
      null
    ];
    
    invalidTitles.forEach(title => {
      const result = validateTaskTitle(title);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should sanitize HTML in task titles', () => {
    const result = validateTaskTitle('<script>alert(1)</script>Water plants');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Water plants');
  });

  test('should enforce character limits', () => {
    const shortTitle = validateTaskTitle('A');
    expect(shortTitle.isValid).toBe(false);
    expect(shortTitle.error).toContain('minimum 2');

    const longTitle = validateTaskTitle('A'.repeat(101));
    expect(longTitle.isValid).toBe(false);
    expect(longTitle.error).toContain('maximum 100');
  });
});

describe('validateTaskNotes', () => {
  test('should accept valid task notes', () => {
    const validNotes = [
      '',
      'Some notes about the task',
      'a'.repeat(500),
      null // optional field
    ];
    
    validNotes.forEach(notes => {
      const result = validateTaskNotes(notes);
      expect(result.isValid).toBe(true);
    });
  });

  test('should reject notes exceeding length limit', () => {
    const result = validateTaskNotes('a'.repeat(501));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('maximum 500');
  });

  test('should sanitize HTML in task notes', () => {
    const result = validateTaskNotes('<script>alert(1)</script>Notes here');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Notes here');
  });
});

describe('validateForm', () => {
  test('should validate complete signup form', () => {
    const validFormData = {
      email: 'user@example.com',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
      name: 'John Doe',
      zipCode: '12345'
    };
    
    const result = validateForm(validFormData, true); // true = signup mode
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  test('should validate complete login form', () => {
    const validFormData = {
      email: 'user@example.com',
      password: 'SecurePass123'
    };
    
    const result = validateForm(validFormData, false); // false = login mode
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  test('should detect password mismatch', () => {
    const formData = {
      email: 'user@example.com',
      password: 'SecurePass123',
      confirmPassword: 'DifferentPass456',
      name: 'John Doe',
      zipCode: '12345'
    };
    
    const result = validateForm(formData, true); // true = signup mode (confirms passwords)
    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBeDefined();
    expect(result.errors.confirmPassword).toContain('do not match');
  });

  test('should validate all fields in signup mode', () => {
    const invalidFormData = {
      email: 'invalid-email',
      password: '123',
      confirmPassword: '123',
      name: 'A',
      zipCode: '123'
    };
    
    const result = validateForm(invalidFormData, true); // true = signup mode
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.name).toBeDefined();
    expect(result.errors.zipCode).toBeDefined();
  });

  test('should only validate email and password in login mode', () => {
    const formData = {
      email: 'user@example.com',
      password: 'SecurePass123',
      name: '', // should be ignored in login mode
      zipCode: '' // should be ignored in login mode
    };
    
    const result = validateForm(formData, false); // false = login mode (not signup)
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
    expect(result.sanitizedData.email).toBe('user@example.com');
    expect(result.sanitizedData.password).toBe('SecurePass123');
  });
});

describe('XSS Prevention', () => {
  const xssPayloads = [
    '<script>alert("xss")</script>',
    '<img src=x onerror="alert(1)">',
    '<svg onload="alert(1)">',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)">',
    '<body onload="alert(1)">',
    '<input onfocus="alert(1)" autofocus>'
  ];

  test('should sanitize XSS in all validation functions', () => {
    xssPayloads.forEach(payload => {
      const nameResult = validateName(`John ${payload}`);
      expect(nameResult.sanitized).not.toContain('<');
      expect(nameResult.sanitized).not.toContain('javascript:');

      const gardenResult = validateGardenName(`Garden ${payload}`);
      expect(gardenResult.sanitized).not.toContain('<');

      const taskResult = validateTaskTitle(`Task ${payload}`);
      expect(taskResult.sanitized).not.toContain('<');

      const notesResult = validateTaskNotes(`Notes ${payload}`);
      expect(notesResult.sanitized).not.toContain('<');
    });
  });
});

describe('SQL Injection Prevention', () => {
  const sqlPayloads = [
    "'; DROP TABLE users; --",
    "1' OR '1'='1",
    "admin'--",
    "' OR 1=1--"
  ];

  test('should handle SQL injection attempts safely', () => {
    sqlPayloads.forEach(payload => {
      // These should be sanitized and not cause issues
      const nameResult = validateName(payload);
      // Even if invalid, should not crash and should sanitize
      if (nameResult.isValid) {
        expect(nameResult.sanitized).toBeTruthy();
      }

      const taskResult = validateTaskTitle(payload);
      if (taskResult.isValid) {
        expect(taskResult.sanitized).toBeTruthy();
      }
    });
  });
});

