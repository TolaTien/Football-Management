import { BookingService } from './src/modules/booking/booking.service.js';
import { prisma } from './src/config/prisma.js';
import { v4 as uuidv4 } from 'uuid';

async function testCancel() {
  const user = await prisma.users.findFirst({ where: { role: 'user' } });
  const pitch = await prisma.pitch.findFirst();

  if (!user || !pitch) {
    console.log("No user or pitch found");
    return;
  }

  console.log("Creating booking for user:", user.userId);
  
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 48); // 48 hours in future
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);

  // 1. Create booking
  const booking = await BookingService.bookPitchForUser({
    pitchId: pitch.pitchId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    paymentMethod: 'cash',
    pitchPriceAtBooking: 100000,
    service: []
  } as any, user.userId);

  console.log("Created booking:", booking.bookId);

  // 2. Cancel booking
  try {
    const res = await BookingService.cancelBookingForUser(
      { bookId: booking.bookId, content: "Test cancel" },
      user.userId
    );
    console.log("Cancel success!");
  } catch (err) {
    console.error("Error during cancel:", err);
  }
}

testCancel().finally(() => prisma.$disconnect());
