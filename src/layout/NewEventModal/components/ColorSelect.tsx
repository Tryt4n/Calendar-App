// React
import { ChangeEvent } from "react";
// Custom Hooks
import { useCalendar } from "../../../hooks/useCalendar";
// Components
import ColorRadioInput from "../../../Components/ColorRadioInput";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";
import { AllowedColorsType } from "../../../types/NewEventType";

export default function ColorSelect() {
  const { state, dispatch, newEvent, setNewEvent } = useCalendar();
  const { editingEvent } = state;

  function handleEventColorChange(e: ChangeEvent<HTMLInputElement>) {
    if (editingEvent) {
      dispatch({
        type: REDUCER_ACTIONS.EDIT_EVENT_COLOR,
        payload: e.target.value as AllowedColorsType,
      });
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        eventColor: e.target.value as AllowedColorsType,
      }));
    }
  }

  return (
    <fieldset className="form-group">
      <legend>Kolor</legend>
      <div className="row left">
        <ColorRadioInput
          color="blue"
          comparedValue={newEvent.eventColor}
          onChangeFunction={handleEventColorChange}
        />
        <ColorRadioInput
          color="red"
          comparedValue={newEvent.eventColor}
          onChangeFunction={handleEventColorChange}
        />
        <ColorRadioInput
          color="green"
          comparedValue={newEvent.eventColor}
          onChangeFunction={handleEventColorChange}
        />
      </div>
    </fieldset>
  );
}
