import axios from 'axios';
import { prisma } from './src/config/prisma.js';

async function testHttpCancel() {
  const user = await prisma.users.findFirst({ where: { role: 'user' } });
  const pitch = await prisma.pitch.findFirst();

  if (!user || !pitch) {
    console.log("No user or pitch found");
    return;
  }

  const { generateToken } = await import('./src/utils/jwt.js');
  const token = generateToken({ userId: user.userId, role: 'user' } as any);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { Authorization: `Bearer ${token}` }
  });

  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 48);
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);

  try {
    console.log("Creating booking via HTTP...");
    const createRes = await api.post('/booking/booking-pitch-user', {
      pitchId: pitch.pitchId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      paymentMethod: 'cash',
      pitchPriceAtBooking: 100000,
      service: []
    });

    const bookId = createRes.data.data.bookId;
    console.log("Created booking:", bookId);

    console.log("Cancelling booking via HTTP...");
    const cancelRes = await api.post('/booking/cancel-booking-user', {
      bookId,
      content: "Test HTTP cancel"
    });

    console.log("Cancel HTTP response:", cancelRes.status, cancelRes.data);

  } catch (err: any) {
    console.error("HTTP Error:", err.response?.data || err.message);
  }
}

testHttpCancel().finally(() => prisma.$disconnect());
