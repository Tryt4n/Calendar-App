// React
import React, { ChangeEvent } from "react";
// Context
import { useCalendar } from "../context/useCalendar";
//Types
import { NewEventType } from "../types/NewEventType";
// date-fns
import isValid from "date-fns/isValid";
import addMinutes from "date-fns/addMinutes";
import parse from "date-fns/parse";
import format from "date-fns/format";
import pl from "date-fns/locale/pl";

interface TimeInputProps {
  timeType: "start" | "end";
  comparedEvent: NewEventType;
  min?: string;
  onChangeFunction: (e: ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ timeType, comparedEvent, onChangeFunction }) => {
  const { editedEvent } = useCalendar();

  const label = timeType === "start" ? "Początek" : "Koniec";
  const name = timeType === "start" ? "start-time" : "end-time";
  const onChangeName = timeType === "start" ? "startTime" : "endTime";

  //? Formats newEvent.endTime to one minute greater than newEvent.startTime
  const formatNewEndTimeDate = (stringDate: string) => {
    if (isValid(parse(stringDate, "HH:mm", new Date()))) {
      const newEndTime = addMinutes(parse(stringDate, "HH:mm", new Date()), 1);
      const formattedNewEndTime = format(newEndTime, "HH:mm", { locale: pl });
      return formattedNewEndTime;
    }
  };

  const minEndValue =
    timeType === "end" && typeof comparedEvent.startTime === "string"
      ? formatNewEndTimeDate(comparedEvent.startTime)
      : undefined;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="time"
        name={name}
        id={name}
        value={timeType === "start" ? editedEvent?.startTime : editedEvent?.endTime}
        disabled={editedEvent ? editedEvent.allDayStatus : comparedEvent.allDayStatus}
        required={editedEvent ? !editedEvent.allDayStatus : !comparedEvent.allDayStatus}
        min={minEndValue}
        onChange={(e) => onChangeFunction(e, onChangeName)}
      />
    </div>
  );
};

export default TimeInput;
