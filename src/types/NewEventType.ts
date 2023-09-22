export type NewEventType = {
  id: string;
  eventDate: Date;
  eventName: string;
  allDayStatus: boolean;
  startTime?: string;
  endTime?: string;
  eventColor: string;
};
