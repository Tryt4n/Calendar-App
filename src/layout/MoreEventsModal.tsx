// React
import { useState } from "react";
// Custom Hooks
import { useCalendar } from "../hooks/useCalendar";
import { useEscapeKeyHandler } from "../hooks/useEscapeKeyHandler";
// Components
import ClosingBtn from "../Components/ClosingBtn";
import EventButton from "../Components/EventButton";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
// date-fns
import format from "date-fns/format";
import pl from "date-fns/locale/pl";

export default function MoreEventsModal() {
  const { state, dispatch } = useCalendar();
  const [isModalClosing, setIsModalClosing] = useState(false);

  const formattedDate = state.selectedDate
    ? format(state.selectedDate, "d/L/yy", { locale: pl })
    : "";

  function closeModal() {
    if (!state.isModalOpen) {
      setIsModalClosing(true);
      setTimeout(() => {
        setIsModalClosing(false);

        dispatch({
          type: REDUCER_ACTIONS.HANDLE_MORE_EVENTS_MODAL_OPEN_STATE,
          payload: {
            isMoreEventsModalOpen: false,
            eventsToDisplayInModal: [],
          },
        });
      }, 250);
    }
  }
  useEscapeKeyHandler(closeModal);

  return (
    <>
      {state.isMoreEventsModalOpen && (
        <article className={`modal${isModalClosing ? " closing" : ""}`}>
          <h2 className="visually-hidden">Więcej wydarzeń</h2>
          <div
            className="overlay"
            role="presentation"
          ></div>
          <div className="modal-body">
            <div className="modal-title">
              {formattedDate}
              <ClosingBtn onClickFunction={closeModal} />
            </div>
            <div className="events">
              {state.eventsToDisplayInModal.map((event) => (
                <EventButton
                  key={event.eventName}
                  event={event}
                />
              ))}
            </div>
          </div>
        </article>
      )}
    </>
  );
}
