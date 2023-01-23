import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "./prisma";

export async function appRoutes(app: FastifyInstance) {

  app.get('/', () => {
    return "home"
  });

  app.get('/habits', async () => {
    const habits = await prisma.habit.findMany();
    return habits;
  });

  app.post('/habits', async (request) => {
    // request = body, params, query
    const createHabitBody = z.object({
      title: z.string(),
      user_id: z.string(),
      HabitWeekDays: z.array(z.number().min(0).max(6))
    });
    const { title, HabitWeekDays, user_id } = createHabitBody.parse(request.body);
    const today = dayjs().startOf('day').toDate();
    await prisma.habit.create({
      data: {
        title,
        user_id,
        created_at: today,
        HabitWeekDays: {
          create: HabitWeekDays.map(weekDay => {
            return {
              week_day: weekDay
            }
          })

        }
      }
    });
  });

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date() // coerce = converter string to date
    });

    const { date } = getDayParams.parse(request.query);
    const parsedDate = dayjs(date).startOf('day').toDate();
    const weekDay = dayjs(parsedDate).get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: parsedDate,
        },
        HabitWeekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    });
    const dayHabits = await prisma.habitDay.findMany({
      where: {
        date: parsedDate
      }
    });

    const completedHabits = dayHabits.map(dayHabit => {
      return dayHabit.habit_id;
    }) ?? [];

    return { possibleHabits, completedHabits };
  });

  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitParams = z.object({
      id: z.string()
    });
    const { id } = toggleHabitParams.parse(request.params);
    const today = dayjs().startOf('day').toDate();

    const dayHabit = await prisma.habitDay.findUnique({
      where: {
        date_habit_id: {
          date: today,
          habit_id: id
        }
      }
    });

    if (dayHabit) {
      await prisma.habitDay.delete({
        where: {
          id: dayHabit.id
        }
      });
    }
    else {
      await prisma.habitDay.create({
        data: {
          date: today,
          habit_id: id
        }
      });
    }
  });

  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`
      SELECT dh.id,
             dh.date,
             (SELECT cast(count(*) AS float)
                FROM habit_days
               WHERE habit_days.date = dh.date
             ) AS completed,
             (SELECT cast(count(*) AS float)
                FROM habit_week_days AS hwd
                JOIN habits AS h
                  ON h.id = hwd.habit_id
               WHERE hwd.week_day = cast(strftime('%w', dh.date/1000.0, 'unixepoch') AS int)
                 AND h.created_at <= dh.date
             ) AS amount
        FROM habit_days AS dh
    `;
    return summary;
  });
}