import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const getInsuranceOptions = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.insurancePlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    res.json(plans);
  } catch (error) {
    console.error('Get insurance options error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPolicySchema = z.object({
  userId: z.string().uuid(),
  planId: z.string().uuid(),
  paymentId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
});

export const createPolicy = async (req: Request, res: Response) => {
  try {
    const data = createPolicySchema.parse(req.body);
    
    // Verify payment exists and is completed
    const payment = await prisma.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const policy = await prisma.insurancePolicy.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        paymentId: data.paymentId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'active',
        metadata: data.metadata,
      },
      include: {
        plan: true,
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

    res.status(201).json(policy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Create policy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
