// Context
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";
// Components
import EventButton from "./EventButton";
// date-fns
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import pl from "date-fns/locale/pl";

function sortEvents(a: NewEventType, b: NewEventType): number {
  if (a.allDayStatus && !b.allDayStatus) {
    return -1; //? The first element has allDayStatus true, so it should be first.
  } else if (!a.allDayStatus && b.allDayStatus) {
    return 1; //? The second element has allDayStatus true, so it should be the second one.
  } else if (!a.allDayStatus && !b.allDayStatus && a.startTime && b.startTime) {
    return a.startTime.localeCompare(b.startTime); //? Both items have allDayStatus false, so sort by startTime.
  } else {
    return 0; //? Both elements have allDayStatus true, so keep their current order.
  }
}

export default function CalendarGrid() {
  const { state, dispatch, setSelectedDate } = useCalendar();

  function openNewEventModal(date: Date) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL });
    setSelectedDate(date);
  }

  return (
    <div className="days">
      {state.visibleDates.map((date, index) => {
        const isCurrentMonth = isSameMonth(date, state.currentMonth);
        const isToday = isSameDay(date, new Date());
        const formattedDate = format(date, "d");
        const eventsForDate = state.events.filter((event) => isSameDay(event.eventDate, date));
        const sortedEvents = [...eventsForDate].sort(sortEvents);

        return (
          <div
            className={`day${!isCurrentMonth ? " non-month-day" : ""}${
              isBefore(date, new Date()) && !isSameDay(date, new Date()) ? " old-month-day" : ""
            }`}
            key={date.toISOString()}
          >
            <div className="day-header">
              {index < 7 && <div className="week-name">{format(date, "EEE", { locale: pl })}</div>}
              <div className={`day-number${isToday ? " today" : ""}`}>{formattedDate}</div>
              <button
                className="add-event-btn"
                onClick={() => openNewEventModal(date)}
              >
                +
              </button>
              {sortedEvents.length > 0 && (
                <div className="events">
                  {sortedEvents.map((event) => (
                    <EventButton
                      key={event.eventName}
                      event={event}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
