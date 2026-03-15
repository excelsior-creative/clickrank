// Common weak passwords to block
const COMMON_PASSWORDS = [
  'password',
  'password123',
  'admin',
  'admin123',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'qwerty123',
  'welcome',
  'welcome123',
  'letmein',
  'monkey',
  'dragon',
  'master',
  'sunshine',
  'princess',
  'football',
  'baseball',
  'superman',
  'iloveyou',
  'trustno1',
  'abc123',
  'password1',
  'passw0rd',
]

export type PasswordValidationResult = {
  valid: boolean
  error?: string
}

export function validatePassword(password: string): PasswordValidationResult {
  // Minimum 12 characters
  if (password.length < 12) {
    return {
      valid: false,
      error: 'Password must be at least 12 characters long',
    }
  }

  // At least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter',
    }
  }

  // At least 1 lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one lowercase letter',
    }
  }

  // At least 1 number
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one number',
    }
  }

  // At least 1 special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one special character',
    }
  }

  // Check against common passwords (case-insensitive)
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    return {
      valid: false,
      error: 'This password is too common. Please choose a more secure password',
    }
  }

  // Check for sequential characters (e.g., "abcdef", "123456")
  const hasSequentialChars = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(
    password
  )
  if (hasSequentialChars) {
    return {
      valid: false,
      error: 'Password cannot contain sequential characters',
    }
  }

  // Check for repeated characters (e.g., "aaa", "111")
  if (/(.)\1{2,}/.test(password)) {
    return {
      valid: false,
      error: 'Password cannot contain more than 2 repeated characters in a row',
    }
  }

  return { valid: true }
}
