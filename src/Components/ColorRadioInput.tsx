// React
import { ChangeEvent } from "react";
// Context
import { useCalendar } from "../context/useCalendar";

type ColorRadioInputType = {
  color: string;
  comparedValue: string;
  onChangeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ColorRadioInput({
  color,
  comparedValue,
  onChangeFunction,
}: ColorRadioInputType) {
  const { editedEvent } = useCalendar();

  return (
    <>
      <input
        type="radio"
        name="color"
        value={color}
        id={color}
        className="color-radio"
        checked={editedEvent ? editedEvent.eventColor === color : comparedValue === color}
        onChange={onChangeFunction}
      />
      <label htmlFor={color}>
        <span className="visually-hidden">{color}</span>
      </label>
    </>
  );
}
