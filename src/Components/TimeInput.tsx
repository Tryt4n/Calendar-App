// React
import { ChangeEvent } from "react";
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

function TimeInput({ timeType, comparedEvent, onChangeFunction }: TimeInputProps) {
  const { state } = useCalendar();
  const { editingEvent } = state;

  const isStartTime = timeType === "start";
  const label = isStartTime ? "Początek" : "Koniec";
  const name = isStartTime ? "start-time" : "end-time";
  const onChangeName = isStartTime ? "startTime" : "endTime";

  //? Formats newEvent.endTime to one minute greater than newEvent.startTime
  const formatNewEndTimeDate = (stringDate: string) => {
    if (isValid(parse(stringDate, "HH:mm", new Date()))) {
      const newEndTime = addMinutes(parse(stringDate, "HH:mm", new Date()), 1);
      const formattedNewEndTime = format(newEndTime, "HH:mm", { locale: pl });
      return formattedNewEndTime;
    }
  };

  const minEndValue =
    !isStartTime && typeof comparedEvent.startTime === "string"
      ? formatNewEndTimeDate(comparedEvent.startTime)
      : undefined;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="time"
        name={name}
        id={name}
        value={isStartTime ? editingEvent?.startTime : editingEvent?.endTime}
        disabled={editingEvent ? editingEvent.allDayStatus : comparedEvent.allDayStatus}
        required={editingEvent ? !editingEvent.allDayStatus : !comparedEvent.allDayStatus}
        min={minEndValue}
        onChange={(e) => onChangeFunction(e, onChangeName)}
      />
    </div>
  );
}

export default TimeInput;
