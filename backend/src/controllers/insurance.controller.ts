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

const createPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  coverage: z.array(z.string()),
  duration: z.number().positive(),
});

export const createInsurancePlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const data = createPlanSchema.parse(req.body);
    
    const plan = await prisma.insurancePlan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        coverage: data.coverage,
        duration: data.duration,
        isActive: true,
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Create insurance plan error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateInsurancePlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const data = createPlanSchema.partial().parse(req.body);
    
    const plan = await prisma.insurancePlan.update({
      where: { id },
      data,
    });

    res.json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Update insurance plan error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteInsurancePlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    
    // Soft delete by setting isActive to false
    const plan = await prisma.insurancePlan.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Insurance plan deactivated', plan });
  } catch (error) {
    console.error('Delete insurance plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const users = await prisma.user.findMany({
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
        createdAt: true,
        selectedPlan: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        payments: {
          where: { status: 'completed' },
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate total paid for each user
    const usersWithTotals = users.map(u => ({
      ...u,
      totalPaid: u.payments.reduce((sum, p) => sum + p.amount, 0),
    }));

    res.json(usersWithTotals);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { policyNumber } = req.params;
    
    console.log('Verifying certificate:', policyNumber);
    
    // Extract user ID from policy number (format: VS-YEAR-USERID)
    const parts = policyNumber.split('-');
    if (parts.length < 3) {
      return res.status(404).json({ error: 'Invalid policy number format' });
    }
    
    const userId = parts.slice(2).join('-'); // Handle UUIDs with dashes
    
    // Get user with their selected plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        selectedPlan: true,
        payments: {
          where: { status: 'completed' },
          select: {
            amount: true,
          },
        },
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    // Check if user has completed onboarding and has a plan
    if (!user.hasCompletedOnboarding || !user.selectedPlan) {
      return res.status(404).json({ error: 'Certificate not issued yet' });
    }
    
    // Calculate total paid
    const totalPaid = user.payments.reduce((sum, p) => sum + p.amount, 0);
    const required = user.selectedPlan.price;
    
    // Check if fully paid
    if (totalPaid < required) {
      return res.status(400).json({ error: 'Certificate not valid - payment incomplete' });
    }
    
    // Calculate dates
    const issueDate = user.createdAt;
    const travelDate = user.travelDate ? new Date(user.travelDate) : new Date();
    const expiryDate = new Date(travelDate);
    expiryDate.setDate(expiryDate.getDate() + user.selectedPlan.duration);
    
    // Build certificate data
    const certificate = {
      policyNumber,
      holderName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      destination: user.destination,
      purpose: user.purpose,
      providerName: user.selectedPlan.name,
      coverageAmount: user.selectedPlan.price,
      duration: user.selectedPlan.duration,
      issueDate: issueDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: 'active',
      verified: true,
      verifiedAt: new Date().toISOString(),
    };
    
    res.json(certificate);
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
