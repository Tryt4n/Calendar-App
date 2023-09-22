import React from "react";
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";
// date-fns
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import pl from "date-fns/locale/pl";

export default function CalendarGrid() {
  const { state, dispatch, setSelectedDate, setEditedEvent } = useCalendar();

  function openNewEventModal(date: Date) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL });
    setSelectedDate(date);
  }

  function openEditEventModal(event: NewEventType) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL });
    setEditedEvent(event);
  }

  return (
    <div className="days">
      {state.visibleDates.map((date, index) => (
        <div
          className={`day${!isSameMonth(date, state.currentMonth) ? " non-month-day" : ""}${
            isBefore(date, new Date()) && !isSameDay(date, new Date()) ? " old-month-day" : ""
          }`}
          key={date.toISOString()}
        >
          <div className="day-header">
            {index < 7 && <div className="week-name">{format(date, "EEE", { locale: pl })}</div>}
            <div className={`day-number${isSameDay(date, new Date()) ? " today" : ""}`}>
              {format(date, "d")}
            </div>
            <button
              className="add-event-btn"
              onClick={() => openNewEventModal(date)}
            >
              +
            </button>

            {state.events.length > 0 &&
              state.events.some((event) => isSameDay(event.eventDate as Date, date)) && (
                <div className="events">
                  {state.events
                    .filter((event) => isSameDay(event.eventDate as Date, date))
                    .sort((a, b) => {
                      if (a.allDayStatus && !b.allDayStatus) {
                        return -1; //? The first element has allDayStatus true, so it should be first.
                      } else if (!a.allDayStatus && b.allDayStatus) {
                        return 1; //? The second element has allDayStatus true, so it should be the second one.
                      } else if (!a.allDayStatus && !b.allDayStatus && a.startTime && b.startTime) {
                        return a.startTime.localeCompare(b.startTime); //? Both items have allDayStatus false, so sort by startTime.
                      } else {
                        return 0; //? Both elements have allDayStatus true, so keep their current order.
                      }
                    })
                    .map((task) => (
                      <React.Fragment key={task.eventName}>
                        <button
                          className={`event ${task.eventColor}${
                            task.allDayStatus ? " all-day-event" : ""
                          }`}
                          onClick={() => openEditEventModal(task)}
                        >
                          {!task.allDayStatus && (
                            <>
                              <div className={`color-dot ${task.eventColor}`}></div>
                              <div className="event-time">{task.startTime}</div>
                            </>
                          )}
                          <div className="event-name">{task.eventName}</div>
                        </button>
                      </React.Fragment>
                    ))}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
