//Note: Fake data

import { v4 as uuidv4 } from 'uuid';
import { fakerVI as faker } from '@faker-js/faker';
import { prisma } from '../src/config/prisma.ts';


async function main() {
  console.log('Loading...');

  for (let i = 0; i < 20; i++) {
    await prisma.pitch.create({
      data: {
        pitchId: uuidv4(),
        namePitch: `Sân bóng ${faker.person.lastName()}`,
        status: 'active',
        pitchCategory: faker.helpers.arrayElement(['five', 'seven', 'eleven']),
        address: faker.location.streetAddress(),
      },
    });
  }

  console.log('Sucess!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
