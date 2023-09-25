// React
import { useCallback } from "react";
// Context
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";

type EventButtonType = {
  event: NewEventType;
};

export default function EventButton({ event }: EventButtonType) {
  // const { dispatch, setEditedEvent } = useCalendar();
  const { dispatch } = useCalendar();

  const openEditEventModal = useCallback(
    (event: NewEventType) => {
      // dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL });
      dispatch({ type: REDUCER_ACTIONS.OPEN_EDITED_EVENT, payload: event });
      // setEditedEvent(event);
    },
    // [dispatch, setEditedEvent]
    [dispatch]
  );

  return (
    <button
      className={`event ${event.eventColor}${event.allDayStatus ? " all-day-event" : ""}${
        event.everyYear ? " every-year" : ""
      }`}
      aria-label={`Naciśnij aby edytować. ${
        event.everyYear ? "To wydarzenie powtarza się co roku." : ""
      }`}
      onClick={() => openEditEventModal(event)}
    >
      {!event.allDayStatus && (
        <>
          <div className={`color-dot ${event.eventColor}`}></div>
          <div className="event-time">{event.startTime}</div>
        </>
      )}
      <div className="event-name">{event.eventName}</div>
    </button>
  );
}
