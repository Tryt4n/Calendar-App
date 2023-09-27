// React
import { ChangeEvent } from "react";
// Custom Hooks
import { useCalendar } from "../../../hooks/useCalendar";
// Components
import TimeInput from "../../../Components/TimeInput";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";

export default function TimeSelect() {
  const { state, dispatch, newEvent, setNewEvent } = useCalendar();
  const { editingEvent } = state;

  function handleEventTimeChange(e: ChangeEvent<HTMLInputElement>, fieldName: string) {
    if (editingEvent) {
      dispatch({
        type:
          fieldName === "startTime"
            ? REDUCER_ACTIONS.EDIT_EVENT_START_TIME
            : REDUCER_ACTIONS.EDIT_EVENT_END_TIME,
        payload: e.target.value,
      });
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        [fieldName]: e.target.value,
      }));
    }
  }

  return (
    <fieldset className="row">
      <legend className="visually-hidden">Wybór czasu</legend>
      <TimeInput
        timeType="start"
        comparedEvent={editingEvent ? editingEvent : newEvent}
        onChangeFunction={handleEventTimeChange}
      />
      <TimeInput
        timeType="end"
        comparedEvent={editingEvent ? editingEvent : newEvent}
        onChangeFunction={handleEventTimeChange}
      />
    </fieldset>
  );
}
