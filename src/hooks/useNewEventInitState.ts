// Types
import { NewEventType } from "../types/NewEventType";

export function useNewEventInitState(selectedDate = new Date()) {
  const newEventInitState: NewEventType = {
    id: crypto.randomUUID(),
    eventDate: selectedDate,
    eventName: "",
    allDayStatus: false,
    startTime: undefined,
    endTime: undefined,
    eventColor: "blue",
    everyYear: false,
  };

  return newEventInitState;
}
