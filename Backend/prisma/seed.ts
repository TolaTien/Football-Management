import { v4 as uuidv4 } from 'uuid';
import { fakerVI as faker } from '@faker-js/faker';
import { prisma } from '../src/config/prisma.ts';

async function main() {
  console.log('Loading...');

  // Clear existing bookings, price rules, and pitches to prevent key conflicts
  await prisma.booking.deleteMany({});
  await prisma.pitchprice.deleteMany({});
  await prisma.pitch.deleteMany({});

  for (let i = 0; i < 20; i++) {
    const pitchId = uuidv4();
    const isHaNoi = i % 2 === 0;
    await prisma.pitch.create({
      data: {
        pitchId: pitchId,
        namePitch: isHaNoi ? `Sân Hà Nội ${Math.floor(i/2) + 1}` : `Sân Hồ Chí Minh ${Math.floor(i/2) + 1}`,
        status: 'active',
        pitchCategory: faker.helpers.arrayElement([5, 7, 11]),
        address: isHaNoi ? 'Hà Nội' : 'Hồ Chí Minh',
      },
    });

    // Create realistic pricing configs for each pitch
    const now = new Date();
    
    // Normal hours: 06:00 - 16:00 (300,000 VNĐ)
    const startTimeNormal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0);
    const endTimeNormal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0);

    // Peak hours (Golden Hours): 16:00 - 22:30 (500,000 VNĐ)
    const startTimePeak = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0);
    const endTimePeak = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 30);

    await prisma.pitchprice.createMany({
      data: [
        {
          id: uuidv4(),
          pitchId: pitchId,
          startTime: startTimeNormal,
          endTime: endTimeNormal,
          price: 300000
        },
        {
          id: uuidv4(),
          pitchId: pitchId,
          startTime: startTimePeak,
          endTime: endTimePeak,
          price: 500000
        }
      ]
    });
  }

  console.log('Success!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
