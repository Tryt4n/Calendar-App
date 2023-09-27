// React
import { ChangeEvent } from "react";
// Custom Hooks
import { useCalendar } from "../hooks/useCalendar";

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
  const { state } = useCalendar();

  return (
    <>
      <input
        type="radio"
        name="color"
        value={color}
        id={color}
        className="color-radio"
        checked={
          state.editingEvent ? state.editingEvent.eventColor === color : comparedValue === color
        }
        onChange={onChangeFunction}
      />
      <label htmlFor={color}>
        <span className="visually-hidden">{color}</span>
      </label>
    </>
  );
}
