import { apiAuthenticated } from './index';

/**
 * Updates the password for the authenticated user.
 *
 * @param {string} currentPassword - The user's current password.
 * @param {string} password - The user's new password.
 * @param {string} confirmPassword - The user's new password confirmation.
 * @returns {Promise<void>} - A promise that resolves when the password is updated.
 * @throws {Promise<string>} - A promise that rejects with an error message if the current password is incorrect.
 * @route - /api/v1//user/me/password
 * @method - PATCH
 * @authentication - required
 * Check if password and currentPassword are different
 */
export async function updatePassword(
  currentPassword: string,
  password: string,
  confirmPassword: string,
): Promise<void> {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  return apiAuthenticated('/api/v1/user/me/password', {
    method: 'PATCH',
    data: JSON.stringify({ currentPassword, password, confirmPassword }),
  });
}

// Update user details for the authenticated user.

/**
 * Updates the details for the authenticated user.
 *
 * @param {string} email - The user's new email address.
 * @param {string} username - The user's new username.
 * @returns {Promise<void>} - A promise that resolves when the user details are updated.
 * @throws {Promise<string>} - A promise that rejects with an error message if the email is invalid.
 * @route - /api/v1/user/me
 * @method - PATCH
 * @authentication - required
 */
