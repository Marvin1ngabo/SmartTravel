import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create insurance plans with real company names
  const britamBasic = await prisma.insurancePlan.upsert({
    where: { id: 'britam-basic-id' },
    update: {},
    create: {
      id: 'britam-basic-id',
      name: 'Britam Travel Insurance',
      description: 'Comprehensive travel protection from Britam',
      price: 180,
      duration: 30,
      coverage: [
        'Medical emergencies up to $50,000',
        'Trip cancellation and interruption',
        'Lost or delayed baggage',
        'Emergency evacuation',
        '24/7 travel assistance',
      ],
    },
  });

  const primeInsurance = await prisma.insurancePlan.upsert({
    where: { id: 'prime-insurance-id' },
    update: {},
    create: {
      id: 'prime-insurance-id',
      name: 'Prime Insurance Travel Cover',
      description: 'Reliable travel insurance for peace of mind',
      price: 220,
      duration: 30,
      coverage: [
        'Medical emergencies up to $100,000',
        'Trip cancellation and interruption',
        'Lost or delayed baggage',
        'Emergency evacuation',
        '24/7 travel assistance',
        'Adventure sports coverage',
      ],
    },
  });

  const apaInsurance = await prisma.insurancePlan.upsert({
    where: { id: 'apa-insurance-id' },
    update: {},
    create: {
      id: 'apa-insurance-id',
      name: 'APA Insurance Travel Plan',
      description: 'Trusted travel insurance solutions',
      price: 200,
      duration: 30,
      coverage: [
        'Medical emergencies up to $75,000',
        'Trip cancellation',
        'Lost baggage protection',
        'Emergency evacuation',
        'Travel delay compensation',
      ],
    },
  });

  const jubileeInsurance = await prisma.insurancePlan.upsert({
    where: { id: 'jubilee-insurance-id' },
    update: {},
    create: {
      id: 'jubilee-insurance-id',
      name: 'Jubilee Insurance Travel Shield',
      description: 'Premium travel protection for global travelers',
      price: 280,
      duration: 30,
      coverage: [
        'Medical emergencies up to $150,000',
        'Trip cancellation and interruption',
        'Lost or delayed baggage',
        'Emergency evacuation',
        '24/7 concierge service',
        'Adventure sports coverage',
        'Rental car coverage',
      ],
    },
  });

  const madisonInsurance = await prisma.insurancePlan.upsert({
    where: { id: 'madison-insurance-id' },
    update: {},
    create: {
      id: 'madison-insurance-id',
      name: 'Madison Insurance Travel Plus',
      description: 'Affordable and comprehensive travel coverage',
      price: 160,
      duration: 30,
      coverage: [
        'Medical emergencies up to $40,000',
        'Trip cancellation',
        'Emergency evacuation',
        'Lost baggage protection',
      ],
    },
  });

  const gaInsurance = await prisma.insurancePlan.upsert({
    where: { id: 'ga-insurance-id' },
    update: {},
    create: {
      id: 'ga-insurance-id',
      name: 'GA Insurance Travel Secure',
      description: 'Complete travel insurance for worry-free journeys',
      price: 250,
      duration: 30,
      coverage: [
        'Medical emergencies up to $120,000',
        'Trip cancellation and interruption',
        'Lost or delayed baggage',
        'Emergency evacuation',
        '24/7 travel assistance',
        'Personal liability coverage',
      ],
    },
  });

  console.log('Seeded insurance plans:', { 
    britamBasic, 
    primeInsurance, 
    apaInsurance, 
    jubileeInsurance,
    madisonInsurance,
    gaInsurance
  });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
