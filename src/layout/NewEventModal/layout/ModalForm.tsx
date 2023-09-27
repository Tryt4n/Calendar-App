// Custom Hooks
import { useCalendar } from "../../../hooks/useCalendar";
import { useNewEventInitState } from "../../../hooks/useNewEventInitState";
// Components
import NameFiled from "../components/NameFiled";
import CheckboxesField from "../components/CheckboxesField";
import TimeSelect from "../components/TimeSelect";
import ColorSelect from "../components/ColorSelect";
import ModalConfirmationSection from "./ModalConfirmationSection";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";

export default function ModalForm() {
  const { state, dispatch, newEvent, setNewEvent } = useCalendar();
  const newEventInitState = useNewEventInitState();

  const { editingEvent, events } = state;

  function addNewEvent() {
    //? Checking to see if a event with the same name already exists in the same day
    const isDuplicateEvent = events.some(
      (event) =>
        event.eventName === newEvent.eventName &&
        event.eventDate.toISOString() === newEvent.eventDate.toISOString()
    );

    if (isDuplicateEvent) {
      alert("Tego dnia istnieje już wydarzenie o takiej samej nazwie!");
    } else {
      dispatch({
        type: REDUCER_ACTIONS.ADD_NEW_EVENT,
        payload: newEvent,
      });
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
      //? Reset `newEvent`
      setNewEvent(newEventInitState);
    }
  }

  function editEvent() {
    if (!editingEvent) return;

    const isDuplicateEvent = events.some((event) => {
      if (editingEvent) {
        return (
          event.id !== editingEvent.id && //? Checking if it's not currently editing event
          event.eventName === editingEvent.eventName &&
          event.eventDate.toISOString() === editingEvent.eventDate.toISOString()
        );
      }
    });

    if (isDuplicateEvent) {
      alert("Tego dnia istnieje już wydarzenie o takiej samej nazwie!");
    } else {
      dispatch({
        type: REDUCER_ACTIONS.EDIT_EVENT,
      });
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
    }
  }

  return (
    <form
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        editingEvent ? editEvent() : addNewEvent();
      }}
    >
      <NameFiled />

      <CheckboxesField />

      <TimeSelect />

      <ColorSelect />

      <ModalConfirmationSection />
    </form>
  );
}
