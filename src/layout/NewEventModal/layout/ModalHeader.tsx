// Custom hooks
import { useCalendar } from "../../../hooks/useCalendar";
import { useEscapeKeyHandler } from "../../../hooks/useEscapeKeyHandler";
import { useNewEventInitState } from "../../../hooks/useNewEventInitState";
// Components
import ClosingBtn from "../../../Components/ClosingBtn";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";
// date-fns
import isValid from "date-fns/isValid";
import format from "date-fns/format";
import pl from "date-fns/locale/pl";

type ModalHeaderPropsType = {
  setIsModalClosing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ModalHeader({ setIsModalClosing }: ModalHeaderPropsType) {
  const { state, dispatch, setNewEvent } = useCalendar();
  const newEventInitState = useNewEventInitState();

  const { editingEvent, selectedDate } = state;

  const isValidDate = editingEvent
    ? editingEvent.eventDate && isValid(editingEvent.eventDate)
    : isValid(selectedDate);
  const formattedDate = isValidDate
    ? format(editingEvent ? editingEvent.eventDate : selectedDate, "d/L/yy", {
        locale: pl,
      })
    : "";

  function closeNewTaskModal() {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalClosing(false);

      setNewEvent(newEventInitState);
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
    }, 250);
  }

  useEscapeKeyHandler(closeNewTaskModal);

  return (
    <header className="modal-title">
      <h2>{editingEvent ? "Edytuj Wydarzenie" : "Dodaj Wydarzenie"}</h2>
      <time
        dateTime={
          editingEvent
            ? editingEvent.eventDate.toLocaleDateString()
            : selectedDate.toLocaleTimeString()
        }
      >
        {editingEvent?.everyYear && "Od "}
        {formattedDate}
      </time>
      <ClosingBtn onClickFunction={closeNewTaskModal} />
    </header>
  );
}
