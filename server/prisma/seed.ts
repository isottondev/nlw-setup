import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.habitWeekDays.deleteMany();
  await prisma.habitDay.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  const userId = "ga1a1bcf-3d87-4626-8c0d-d7fd1255ac00";
  const firstHabitId = "la1a1bcf-3d87-4626-8c0d-d7fd1255ac00";
  const secondHabitId = "ta1a1bcf-3d87-4626-8c0d-d7fd1255ac00";

  await prisma.user.create({
    data: {
      id: userId,
      name: "admin",
      email: "admin"
    }
  });

  await Promise.all([
    prisma.habit.create({
      data: {
        id: firstHabitId,
        title: "Beber 2l de água",
        user_id: userId,
        HabitWeekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    }),
    prisma.habit.create({
      data: {
        id: secondHabitId,
        title: "treinar 1h na academia",
        user_id: userId,
        HabitWeekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    })
  ]);

  await Promise.all([
    prisma.habitDay.create({
      data: {
        habit_id: firstHabitId,
        date: new Date()
      }
    }),
    prisma.habitDay.create({
      data: {
        habit_id: secondHabitId,
        date: new Date()
      }
    })
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })