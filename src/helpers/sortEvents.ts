import { NewEventType } from "../types/NewEventType";

export function sortEvents(a: NewEventType, b: NewEventType): number {
  //? Sort by `everyYear` first
  const aEveryYear = a.everyYear ?? false;
  const bEveryYear = b.everyYear ?? false;
  if (aEveryYear && !bEveryYear) {
    return -1; //? The first element has `everyYear` true, so it should be first.
  } else if (!aEveryYear && bEveryYear) {
    return 1; //? The second element has `everyYear` true, so it should be the second one.
  }

  //? If both have `everyYear` true or false, then sort by `allDayStatus`
  const aAllDayStatus = a.allDayStatus ?? false;
  const bAllDayStatus = b.allDayStatus ?? false;
  if (aAllDayStatus && !bAllDayStatus) {
    return -1; //? The first element has `allDayStatus` true, so it should be first.
  } else if (!aAllDayStatus && bAllDayStatus) {
    return 1; //? The second element has `allDayStatus` true, so it should be the second one.
  }

  //? If both have `everyYear` true or false and `allDayStatus` true or false, then sort by startTime
  if (a.startTime && b.startTime) {
    return a.startTime.localeCompare(b.startTime);
  }

  //? If all else fails, maintain the current order
  return 0;
}
