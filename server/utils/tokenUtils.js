const jwt = require("jsonwebtoken");


const generateToken = (userId, options = {}) => {
  const secret = process.env.JWT_SECRET || "secret123";
  const expiresIn = options.expiresIn || "30d";

  return jwt.sign({ id: userId }, secret, { expiresIn });
};


const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "secret123";

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};


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
