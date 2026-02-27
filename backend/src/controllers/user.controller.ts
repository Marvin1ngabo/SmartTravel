import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const updateOnboardingSchema = z.object({
  destination: z.string(),
  travelDate: z.string().datetime(),
  purpose: z.string(),
  selectedPlanId: z.string().uuid(),
  paymentPlan: z.enum(['gradual', 'full']),
});

export const updateOnboarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const data = updateOnboardingSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        destination: data.destination,
        travelDate: new Date(data.travelDate),
        purpose: data.purpose,
        selectedPlanId: data.selectedPlanId,
        paymentPlan: data.paymentPlan,
        hasCompletedOnboarding: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        destination: true,
        travelDate: true,
        purpose: true,
        selectedPlanId: true,
        paymentPlan: true,
        hasCompletedOnboarding: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Update onboarding error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
