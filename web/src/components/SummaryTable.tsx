import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYear } from "../utils/generateDatesFromYear";
import { HabitDay } from "./HabitDay";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const summaryDates = generateDatesFromYear();
const minimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable() {

  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get("/summary")
      .then(resp => setSummary(resp.data))
      .catch(() => alert("Erro ao carregar resumo"));
  }, []);

  return (
    <div className="w-full flex ">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, x) => (
          <div
            key={`weekDay${x}`}
            className="text-zinc-400 text-xl h-10 w-14 flex items-center justify-start font-bold">
            {weekDay}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map(date => {
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.date, "day");
          })

          return (
            <HabitDay
              key={date.toString()}
              defaultCompleted={dayInSummary?.completed}
              amount={dayInSummary?.amount}
              date={date}
            />
          )
        })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
            />
          ))
        }
      </div>
    </div>
  );
}