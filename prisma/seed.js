require('dotenv').config();

const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

const TEST_PASSWORD = 'password123';

const EVENT_IDS = {
  techSummit: '00000000-0000-4000-8000-000000000101',
  acousticNight: '00000000-0000-4000-8000-000000000102',
  badminton: '00000000-0000-4000-8000-000000000103',
};

const daysFromNow = (days, hour) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, 0, 0, 0);
  return date;
};

async function main() {
  console.log('Seeding database...');

  const [music, tech, sports] = await prisma.$transaction([
    prisma.category.upsert({
      where: { slug: 'music' },
      update: { name: 'Music' },
      create: { name: 'Music', slug: 'music' },
    }),
    prisma.category.upsert({
      where: { slug: 'tech' },
      update: { name: 'Technology' },
      create: { name: 'Technology', slug: 'tech' },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: { name: 'Sports' },
      create: { name: 'Sports', slug: 'sports' },
    }),
  ]);

  const password = await bcrypt.hash(TEST_PASSWORD, 12);

  const [organizer] = await prisma.$transaction([
    prisma.user.upsert({
      where: { email: 'organizer@test.com' },
      update: { password, name: 'Test Organizer', role: 'ORGANIZER' },
      create: {
        email: 'organizer@test.com',
        password,
        name: 'Test Organizer',
        role: 'ORGANIZER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'attendee@test.com' },
      update: { password, name: 'Test Attendee', role: 'ATTENDEE' },
      create: {
        email: 'attendee@test.com',
        password,
        name: 'Test Attendee',
        role: 'ATTENDEE',
      },
    }),
  ]);

  const events = [
    {
      id: EVENT_IDS.techSummit,
      title: 'Ho Chi Minh City Tech Summit',
      description: 'Annual tech conference: AI, cloud, and startup ecosystem.',
      date: daysFromNow(30, 9),
      venue: 'GEM Center, District 1, Ho Chi Minh City',
      capacity: 500,
      price: 500000,
      categoryId: tech.id,
      organizerId: organizer.id,
    },
    {
      id: EVENT_IDS.acousticNight,
      title: 'Acoustic Night - Hanoi Edition',
      description: 'Intimate acoustic sessions by local indie artists.',
      date: daysFromNow(45, 12),
      venue: 'Hanoi Social Club, Hoan Kiem, Hanoi',
      capacity: 80,
      price: 150000,
      categoryId: music.id,
      organizerId: organizer.id,
    },
    {
      id: EVENT_IDS.badminton,
      title: 'Vietnam Open Badminton Championship',
      description: 'National-level competition open to amateur players.',
      date: daysFromNow(60, 8),
      venue: 'Phu Tho Stadium, District 11, Ho Chi Minh City',
      capacity: 200,
      price: 50000,
      categoryId: sports.id,
      organizerId: organizer.id,
    },
  ];

  await prisma.$transaction(
    events.map(({ id, ...data }) =>
      prisma.event.upsert({
        where: { id },
        update: data,
        create: { id, ...data },
      })
    )
  );

  console.log('Seed completed.');
  console.log(`Organizer: organizer@test.com / ${TEST_PASSWORD}`);
  console.log(`Attendee: attendee@test.com / ${TEST_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });