import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from './apiError.js';

const secretToken = process.env.SECRET_TOKEN;

const generateAccessToken = (userId) => {
  if (!secretToken) {
    throw new Error('Secret token is not defined');
  }

  // Generate JWT token with user ID
  return jwt.sign({ _id: userId }, secretToken);
};

const generateRefreshToken = (userId) => {
  if (!secretToken) {
    throw new Error('Secret token is not defined');
  }

  // Generate JWT refresh token with user ID
  return jwt.sign({ _id: userId }, secretToken);
};

const saveTokensToDatabase = async (userId, refreshToken) => {
  if (!secretToken) {
    throw new Error('Secret token is not defined');
  }

  // Save access and refresh tokens to database (for example, in a 'tokens' collection)
  // const token = new User({ _id: userId, refreshToken });
  const token = await User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { new: true }
  )

};

const generateAndSaveTokens = async (userId) => {
  try {
    // Generate access and refresh tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    // Save tokens to database
    await saveTokensToDatabase(userId, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating and saving tokens:', error);
    throw new ApiError(500, 'Error generating and saving tokens');
  }
};

export default generateAndSaveTokens;
