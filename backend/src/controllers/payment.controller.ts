import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().optional().default('USD'),
  method: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    console.log('Create payment request:', { userId, body: req.body });
    
    const data = createPaymentSchema.parse(req.body);
    
    console.log('Parsed payment data:', data);
    
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        currency: data.currency || 'USD',
        userId: userId,
        status: 'completed', // Mark as completed for now (TODO: integrate Stripe)
        metadata: data.metadata || { method: data.method || 'Online Payment' },
      },
    });

    console.log('Payment created successfully:', payment.id);

    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
    }
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        policy: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        metadata: true,
        createdAt: true,
      },
    });

    // Calculate total paid
    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      payments,
      totalPaid,
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
