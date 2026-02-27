import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create insurance plans
  const basicPlan = await prisma.insurancePlan.upsert({
    where: { id: 'basic-plan-id' },
    update: {},
    create: {
      id: 'basic-plan-id',
      name: 'Basic Coverage',
      description: 'Essential travel insurance for budget travelers',
      price: 50,
      duration: 30,
      coverage: [
        'Medical emergencies up to $50,000',
        'Trip cancellation',
        'Emergency evacuation',
      ],
    },
  });

  const premiumPlan = await prisma.insurancePlan.upsert({
    where: { id: 'premium-plan-id' },
    update: {},
    create: {
      id: 'premium-plan-id',
      name: 'Premium Coverage',
      description: 'Comprehensive protection for worry-free travel',
      price: 150,
      duration: 30,
      coverage: [
        'Medical emergencies up to $250,000',
        'Trip cancellation and interruption',
        'Lost or delayed baggage',
        'Emergency evacuation',
        '24/7 travel assistance',
        'Adventure sports coverage',
      ],
    },
  });

  const luxuryPlan = await prisma.insurancePlan.upsert({
    where: { id: 'luxury-plan-id' },
    update: {},
    create: {
      id: 'luxury-plan-id',
      name: 'Luxury Coverage',
      description: 'Premium protection with exclusive benefits',
      price: 300,
      duration: 30,
      coverage: [
        'Medical emergencies up to $1,000,000',
        'Trip cancellation and interruption',
        'Lost or delayed baggage',
        'Emergency evacuation',
        '24/7 concierge service',
        'Adventure sports coverage',
        'Rental car coverage',
        'Cancel for any reason',
      ],
    },
  });

  console.log('Seeded insurance plans:', { basicPlan, premiumPlan, luxuryPlan });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
