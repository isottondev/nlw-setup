import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitsListProps {
  date: Date,
  onCompletedChange: (completed: number) => void
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[],
  completedHabits: string[],
}
export function HabitsList({ date, onCompletedChange }: HabitsListProps) {

  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
  const isDateInPass = dayjs(date).endOf("day").isBefore(new Date());

  useEffect(() => {
    api.get("/day", { params: { date: date.toISOString() } })
      .then(resp => setHabitsInfo(resp.data))
      .catch(() => alert("Erro ao carregar resumo"));
  }, []);

  async function handleToogleHabit(habitId: string) {


    await api.patch(`/habits/${habitId}/toggle`)
      .then(resp => {
        const isCompleted = habitsInfo!.completedHabits.includes(habitId);

        let completedHabits: string[] = [];

        if (isCompleted) {
          completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
        }
        else {
          completedHabits = [...habitsInfo!.completedHabits, habitId];
        }
        setHabitsInfo({
          possibleHabits: habitsInfo!.possibleHabits,
          completedHabits
        });
        onCompletedChange(completedHabits.length);
      })
      .catch(() => alert("Erro ao finalizar hábito"));

  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      {habitsInfo?.possibleHabits.map(habit => (
        <Checkbox.Root
          key={habit.id}
          className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
          checked={habitsInfo.completedHabits.includes(habit.id)}
          disabled={isDateInPass}
          onCheckedChange={() => handleToogleHabit(habit.id)}
        >
          <div className="h-8 w-8 flex items-center justify-center gap-3 rounded-lg transition-colors bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background" >
            <Checkbox.Indicator>
              <Check className="text-white" size={20} />
            </Checkbox.Indicator>
          </div>
          <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400" >{habit.title}</span>
        </Checkbox.Root>
      ))}
    </div>
  );
}