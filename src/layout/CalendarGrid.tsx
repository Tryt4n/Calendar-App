// React
import { useCallback } from "react";
// Context
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";
// Components
import EventButton from "../Components/EventButton";
// date-fns
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import pl from "date-fns/locale/pl";

export default function CalendarGrid() {
  const { state, dispatch, setSelectedDate } = useCalendar();

  function openNewEventModal(date: Date) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL });
    setSelectedDate(date);
  }

  const sortEventsByAllDayStatusAndStartTime = useCallback(
    (a: NewEventType, b: NewEventType): number => {
      //? Sort by `everyYear` first
      if (a.everyYear && !b.everyYear) {
        return -1; //? The first element has `everyYear` true, so it should be first.
      } else if (!a.everyYear && b.everyYear) {
        return 1; //? The second element has `everyYear` true, so it should be the second one.
      }

      //? If both have `everyYear` true or false, then sort by `allDayStatus`
      if (a.allDayStatus && !b.allDayStatus) {
        return -1; //? The first element has `allDayStatus` true, so it should be first.
      } else if (!a.allDayStatus && b.allDayStatus) {
        return 1; //? The second element has `allDayStatus` true, so it should be the second one.
      }

      //? If both have `everyYear` true or false and `allDayStatus` true or false, then sort by startTime
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }

      //? If all else fails, maintain the current order
      return 0;
    },
    []
  );

  return (
    <div className="days">
      {state.visibleDates.map((date, index) => {
        const currentDate = new Date();
        const isCurrentMonth = isSameMonth(date, state.currentMonth);
        const isToday = isSameDay(date, currentDate);
        const formattedDate = format(date, "d");
        const sortedEvents = state.events
          .filter((event) => {
            const eventDate = new Date(event.eventDate);
            return (
              isSameDay(eventDate, date) ||
              //? Creates events every year if they have `event.everyYear`
              (event.everyYear &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate() &&
                eventDate.getFullYear() <= date.getFullYear()) //? Creates events only after `eventDate` year
            );
          })
          .sort(sortEventsByAllDayStatusAndStartTime);

        return (
          <div
            className={`day${!isCurrentMonth ? " non-month-day" : ""}${
              isBefore(date, currentDate) && !isToday ? " old-month-day" : ""
            }`}
            key={date.toISOString()}
          >
            <div className="day-header">
              {index < 7 && <div className="week-name">{format(date, "EEE", { locale: pl })}</div>}
              <div className={`day-number${isToday ? " today" : ""}`}>{formattedDate}</div>
              <button
                className="add-event-btn"
                aria-label="Naciśnij aby dodać nowe wydarzenie."
                onClick={() => openNewEventModal(date)}
              >
                +
              </button>
              {sortedEvents.length > 0 && (
                <div
                  className="events"
                  aria-describedby="sorting-description"
                >
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
      <ol
        id="sorting-description"
        className="visually-hidden"
      >
        <li>
          1. W pierwszej kolejności wyświetlają się wydarzenia całoroczne całodniowe w kolejności
          ich dodania.
        </li>
        <li>
          2. Następnie wyświetlają się wydarzenia całoroczne z określoną godziną rozpoczęcia - od
          najwcześniejszej godziny rozpoczęcia.
        </li>
        <li>3. Potem wyświetlają się wydarzenia całodniowe w kolejności dodania.</li>
        <li>
          4. Na końcu wydarzenia wyświetlają się wydarzenia z określoną godziną rozpoczęcia - od
          najwcześniejszej godziny rozpoczęcia.
        </li>
      </ol>
    </div>
  );
}
