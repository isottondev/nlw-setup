import dayjs from "dayjs";

export function generateDatesFromYear() {

  const firstDatOfYear = dayjs().startOf("year");
  const today = new Date();

  const dates = [];

  let compareDate = firstDatOfYear;

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate());
    compareDate = compareDate.add(1, "day");
  }
  return dates;
}