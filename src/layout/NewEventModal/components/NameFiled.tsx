// React
import { ChangeEvent } from "react";
// Custom Hooks
import { useCalendar } from "../../../hooks/useCalendar";
// Components
import TextInput from "../../../Components/TextInput";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";

export default function NameFiled() {
  const { state, dispatch, newEvent, setNewEvent } = useCalendar();
  const { editingEvent, selectedDate } = state;

  function handleEventNameChange(e: ChangeEvent<HTMLInputElement>) {
    const inputName = e.target.value;
    const sanitizedInputName = inputName.trimStart(); //? Delete space at the beginning of the input name

    if (editingEvent) {
      dispatch({
        type: REDUCER_ACTIONS.EDIT_EVENT_NAME,
        payload: sanitizedInputName,
      });
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        eventName: sanitizedInputName,
        eventDate: selectedDate,
      }));
    }
  }

  return (
    <fieldset className="form-group">
      <legend className="visually-hidden">Nazwa wydarzenia</legend>
      <TextInput
        name="name"
        isRequired
        minLength={1}
        maxLength={50}
        inputValue={editingEvent ? editingEvent.eventName : newEvent.eventName}
        onChangeFunction={handleEventNameChange}
      />
    </fieldset>
  );
}
