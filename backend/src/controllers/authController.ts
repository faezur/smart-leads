import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../utils/AppError';
import { sendSuccess } from '../utils/responseHelper';
import { RegisterBody, LoginBody, JwtPayload } from '../types';

// Generate JWT token
const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new AppError('JWT secret not configured', 500);
  }

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

// Register new user
export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create new user
    const user = await User.create({ name, email, password, role: 'sales' });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    sendSuccess(
      res,
      'Registration successful',
      { user, token },
      201
    );
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    sendSuccess(res, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

// Get current logged in user
export const getMe = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, 'User fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};
