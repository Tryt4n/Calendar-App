import { NewEventType } from "../types/NewEventType";

export function sortEventsByAllDayStatusAndStartTime(a: NewEventType, b: NewEventType): number {
  //? Sort by `everyYear` first
  if (a.everyYear && !b.everyYear) {
    return -1; //? The first element has `everyYear` true, so it should be first.
  } else if (!a.everyYear && b.everyYear) {
    return 1; //? The second element has `everyYear` true, so it should be the second one.
  }

  //? If both have `everyYear` true or false, then sort by `allDayStatus`
  if (a.allDayStatus && !b.allDayStatus) {
    return -1; //? The first element has `allDayStatus` true, so it should be first.
  } else if (!a.allDayStatus && b.allDayStatus) {
    return 1; //? The second element has `allDayStatus` true, so it should be the second one.
  }

  //? If both have `everyYear` true or false and `allDayStatus` true or false, then sort by startTime
  if (a.startTime && b.startTime) {
    return a.startTime.localeCompare(b.startTime);
  }

  //? If all else fails, maintain the current order
  return 0;
}
