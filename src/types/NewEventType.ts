export type NewEventType = {
  eventDate: Date | object;
  eventName: string;
  allDayStatus: boolean;
  startTime?: string;
  endTime?: string;
  eventColor: string;
};
