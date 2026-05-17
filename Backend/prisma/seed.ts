//Note: Fake data

import { v4 as uuidv4 } from 'uuid';
import { fakerVI as faker } from '@faker-js/faker';
import { prisma } from '../src/config/prisma.ts';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Loading...');

  // Seed Pitches
  for (let i = 0; i < 20; i++) {
    await prisma.pitch.create({
      data: {
        pitchId: uuidv4(),
        namePitch: `Sân bóng ${faker.person.lastName()}`,
        status: 'active',
        pitchCategory: faker.helpers.arrayElement([5, 7, 11]),
        address: faker.location.streetAddress(),
      },
    });
  }

  // Seed Users
  const userIds: string[] = [];
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  for (let i = 0; i < 5; i++) {
    const userId = uuidv4();
    userIds.push(userId);
    await prisma.users.create({
      data: {
        userId: userId,
        email: faker.internet.email(),
        password: hashedPassword,
        fullName: faker.person.fullName(),
        role: 'user',
        phone: faker.phone.number(),
      },
    });
  }

  // Seed Posts
  for (let i = 0; i < 10; i++) {
    await prisma.post.create({
      data: {
        postId: uuidv4(),
        hostId: faker.helpers.arrayElement(userIds),
        description: faker.lorem.paragraph(),
        status: 'open',
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
