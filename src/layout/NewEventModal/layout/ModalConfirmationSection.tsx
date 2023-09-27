// Custom Hooks
import { useCalendar } from "../../../hooks/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";

export default function ModalConfirmationSection() {
  const { state, dispatch } = useCalendar();
  const { editingEvent } = state;

  function deleteEvent() {
    if (typeof editingEvent !== "undefined") {
      dispatch({ type: REDUCER_ACTIONS.DELETE_EVENT, payload: editingEvent });
    }
  }

  return (
    <div className="row">
      <button
        className="btn btn-success"
        type="submit"
      >
        {editingEvent ? "Edytuj" : "Dodaj"}
      </button>
      {editingEvent && (
        <button
          className="btn btn-delete"
          type="button"
          onClick={deleteEvent}
        >
          Usuń
        </button>
      )}
    </div>
  );
}
