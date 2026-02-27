import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  userId: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const data = createPaymentSchema.parse(req.body);
    
    // TODO: Integrate with payment provider (Stripe)
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        userId: data.userId,
        status: 'pending',
        metadata: data.metadata,
      },
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

    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
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
