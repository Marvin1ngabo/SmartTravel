// Quick test script to verify payment creation
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPayment() {
  try {
    console.log('Testing database connection...');
    
    // Get first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error('No users found in database. Please create a user first.');
      return;
    }
    
    console.log('Found user:', user.email);
    
    // Create test payment
    console.log('Creating test payment...');
    const payment = await prisma.payment.create({
      data: {
        amount: 50,
        currency: 'USD',
        userId: user.id,
        status: 'completed',
        metadata: { method: 'Test Payment' },
      },
    });
    
    console.log('Payment created successfully!');
    console.log('Payment ID:', payment.id);
    console.log('Amount:', payment.amount);
    console.log('Status:', payment.status);
    
    // Get all payments for this user
    const userPayments = await prisma.payment.findMany({
      where: { userId: user.id },
    });
    
    console.log(`\nTotal payments for ${user.email}:`, userPayments.length);
    console.log('Total amount:', userPayments.reduce((sum, p) => sum + p.amount, 0));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPayment();
