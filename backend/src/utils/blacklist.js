const blacklistedTokens = new Set();

export function addTokenToBlacklist(token) {
  blacklistedTokens.add(token);
}

/**
 * Checks if a token is blacklisted.
 * @param {string} token - The token to check.
 * @returns {boolean} - Returns true if the token is blacklisted, otherwise false.
 */
export function isTokenBlacklisted(token) {
  const isBlacklisted = blacklistedTokens.has(token);
  return isBlacklisted;
}
