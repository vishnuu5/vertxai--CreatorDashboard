const User = require("../models/User");
const { ApiError } = require("../utils/errorHandler");
const { isValidEmail, validatePassword } = require("../utils/validators");
const { generateToken } = require("../utils/tokenUtils");
const activityService = require("./activityService");

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} Registered user
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Validate input
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new ApiError(400, passwordValidation.message);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
};

/**
 * Authenticate user and generate token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Authentication result with token
 */
const loginUser = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Record login activity
  await activityService.createActivity(user._id, "login");

  // Generate token
  const token = generateToken(user._id);

  return { token };
};

module.exports = {
  registerUser,
  loginUser,
};
