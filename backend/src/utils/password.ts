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