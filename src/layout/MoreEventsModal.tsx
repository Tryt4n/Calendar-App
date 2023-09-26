// React
import { useEffect, useState } from "react";
// Context
import { useCalendar } from "../context/useCalendar";
// Components
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

  function closeModalOnEscapeKey(e: KeyboardEvent) {
    if (e.key === "Escape") closeModal();
  }

  useEffect(() => {
    window.addEventListener("keydown", closeModalOnEscapeKey);

    return () => window.removeEventListener("keydown", closeModalOnEscapeKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isMoreEventsModalOpen]);

  return (
    <>
      {state.isMoreEventsModalOpen && (
        <article className={`modal${isModalClosing ? " closing" : ""}`}>
          <div
            className="overlay"
            role="presentation"
          ></div>
          <div className="modal-body">
            <div className="modal-title">
              {formattedDate}
              <button
                className="close-btn"
                onClick={closeModal}
              >
                &times;
              </button>
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
