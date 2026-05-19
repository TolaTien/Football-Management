import { prisma } from './src/config/prisma.js';

async function test() {
  const bookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log(bookings.map(b => ({ id: b.bookId, status: b.status, paymentStatus: b.paymentStatus })));
}

test().finally(() => prisma.$disconnect());
