export type NewEventType = {
  id: string;
  eventDate: Date;
  eventName: string;
  allDayStatus: boolean;
  everyYear: boolean;
  startTime?: string;
  endTime?: string;
  eventColor: string;
};
