export const eventColors = ["blue", "red", "green"] as const;

export type AllowedColorsType = (typeof eventColors)[number];

export type NewEventType = {
  id: string;
  eventDate: Date;
  eventName: string;
  allDayStatus: boolean;
  startTime?: string;
  endTime?: string;
  eventColor: AllowedColorsType;
  everyYear?: boolean;
};
