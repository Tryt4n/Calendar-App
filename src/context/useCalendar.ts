import { useContext } from "react";
import CalendarContext from "./CalendarContext";

export function useCalendar() {
  const calendarContext = useContext(CalendarContext);

  if (calendarContext == null) {
    throw new Error("Must use within Provider");
  }

  return calendarContext;
}
