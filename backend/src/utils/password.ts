import bcrypt from "bcryptjs";

/**
 * Number of salt rounds used for hashing passwords.
 * Higher value = stronger security but slower hashing.
 */
const SALT_ROUNDS = 12;

/**
 * Hash a plain text password.
 *
 * @param password User password
 * @returns Hashed password
 */
export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain password with hashed password.
 *
 * @param password Plain password
 * @param hashedPassword Hashed password from database
 * @returns true if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// -----------------------------------------------------------------------
// BEFORE (vulnerable) - Finding 5: Weak Password Policy Enabling
// Unauthorized Account Access
// No password strength check existed anywhere in the codebase — any
// string, including "123456" or "password", was accepted by register().
// -----------------------------------------------------------------------
// AFTER (fixed): isStrongPassword() enforces 8+ characters with at least
// one uppercase letter, one lowercase letter, one digit, and one symbol.
/**
 * @param password Plain password to validate
 * @returns true if the password meets the minimum complexity requirements
 */
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const isStrongPassword = (password: string): boolean => {
  return STRONG_PASSWORD_REGEX.test(password);
};