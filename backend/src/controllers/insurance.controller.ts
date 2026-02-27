import { Request, Response } from 'express';
import { z } from 'zod';

export const getInsuranceOptions = async (req: Request, res: Response) => {
  // TODO: Fetch from database
  const options = [
    {
      id: 'basic',
      name: 'Basic Coverage',
      price: 50,
      coverage: ['Medical emergencies', 'Trip cancellation'],
    },
    {
      id: 'premium',
      name: 'Premium Coverage',
      price: 150,
      coverage: ['Medical emergencies', 'Trip cancellation', 'Lost baggage', '24/7 support'],
    },
  ];

  res.json(options);
};

const createPolicySchema = z.object({
  userId: z.string(),
  planId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const createPolicy = async (req: Request, res: Response) => {
  try {
    const data = createPolicySchema.parse(req.body);
    
    // TODO: Save to database
    const policy = {
      id: `pol_${Date.now()}`,
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(policy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
