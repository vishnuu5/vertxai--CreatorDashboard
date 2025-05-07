const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {string} userId - User ID to encode in token
 * @param {Object} options - Token options
 * @returns {string} JWT token
 */
const generateToken = (userId, options = {}) => {
  const secret = process.env.JWT_SECRET || "secret123";
  const expiresIn = options.expiresIn || "30d";

  return jwt.sign({ id: userId }, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "secret123";

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header
 * @returns {string|null} Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
};
