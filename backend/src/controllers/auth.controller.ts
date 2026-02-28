import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { EmailService } from '../services/email.service.js';

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24); // Expires in 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isEmailVerified: false,
        verificationCode,
        verificationCodeExpiry,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        destination: true,
        travelDate: true,
        purpose: true,
        selectedPlanId: true,
        paymentPlan: true,
        hasCompletedOnboarding: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await EmailService.sendVerificationEmail(user.email, verificationCode, user.firstName || undefined);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({ user, token, message: 'Registration successful. Please check your email for verification code.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        destination: user.destination,
        travelDate: user.travelDate,
        purpose: user.purpose,
        selectedPlanId: user.selectedPlanId,
        paymentPlan: user.paymentPlan,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      token,
    };

    console.log('Login response:', JSON.stringify(response.user, null, 2));
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        destination: true,
        travelDate: true,
        purpose: true,
        selectedPlanId: true,
        paymentPlan: true,
        hasCompletedOnboarding: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = verifyEmailSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Check if code matches
    if (user.verificationCode !== data.code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if code expired
    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        destination: true,
        travelDate: true,
        purpose: true,
        selectedPlanId: true,
        paymentPlan: true,
        hasCompletedOnboarding: true,
        createdAt: true,
      },
    });

    // Send welcome email
    try {
      await EmailService.sendWelcomeEmail(updatedUser.email, updatedUser.firstName || undefined);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.json({ user: updatedUser, message: 'Email verified successfully!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Verify email error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24);

    // Update user with new code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpiry,
      },
    });

    // Send email
    try {
      await EmailService.sendVerificationEmail(user.email, verificationCode, user.firstName || undefined);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
