// Context
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";

type EventButtonType = {
  event: NewEventType;
};

export default function EventButton({ event }: EventButtonType) {
  const { dispatch, setEditedEvent } = useCalendar();

  function openEditEventModal(event: NewEventType) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL });
    setEditedEvent(event);
  }

  return (
    <button
      className={`event ${event.eventColor}${event.allDayStatus ? " all-day-event" : ""}${
        event.everyYear ? " every-year" : ""
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
