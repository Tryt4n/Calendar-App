// React
import { useCallback, useEffect, useState } from "react";
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
  const { state, dispatch } = useCalendar();

  const [maxEventButtons, setMaxEventButtons] = useState<number>();

  function calculateMaxEventButtons() {
    const eventsContainer = document.querySelector(".events");
    const eventButton = document.querySelector(".event");

    const eventsContainerHeight = eventsContainer?.clientHeight || 0;
    const evenButtonClientRect = eventButton?.getBoundingClientRect();
    const actualButtonHeight = evenButtonClientRect
      ? evenButtonClientRect.bottom - evenButtonClientRect.top
      : 0;
    const eventButtonHeight = actualButtonHeight + 3; //? 3 is the number of event gap that is 2 plus 1px to show element only when it's should

    return Math.ceil(eventsContainerHeight / eventButtonHeight);
  }

  useEffect(() => {
    //? Calculates and sets the maxEventButtons after page load
    const initialMaxEventButtons = calculateMaxEventButtons();
    setMaxEventButtons(initialMaxEventButtons);

    function handleResize() {
      const newMaxEventButtons = calculateMaxEventButtons();
      setMaxEventButtons(newMaxEventButtons);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [state]);

  function openNewEventModal(date: Date) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL, payload: date });
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

        function showMoreEventModal() {
          const displayedSortedEvents = sortedEvents.slice(0, maxEventButtons);

          const eventsToDisplayInModal = sortedEvents.filter(
            (event) => !displayedSortedEvents.includes(event)
          );

          return eventsToDisplayInModal;
        }

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
            </div>
            {sortedEvents.length > 0 && (
              <div
                className="events"
                aria-describedby="sorting-description"
              >
                {sortedEvents.slice(0, maxEventButtons).map((event) => (
                  <EventButton
                    key={event.eventName}
                    event={event}
                  />
                ))}
              </div>
            )}
            {maxEventButtons && sortedEvents.length > maxEventButtons ? (
              <button
                className="events-view-more-btn"
                onClick={() => showMoreEventModal()}
              >{`+${sortedEvents.length - maxEventButtons} Więcej`}</button>
            ) : (
              ""
            )}
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
