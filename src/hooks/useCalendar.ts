import { useContext } from "react";
import CalendarContext from "../context/CalendarContext";

export function useCalendar() {
  const calendarContext = useContext(CalendarContext);

  if (calendarContext == null) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }

  return calendarContext;
}
