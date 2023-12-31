// React
import { useEffect, useRef, useState } from "react";
// Custom Hooks
import { useCalendar } from "../hooks/useCalendar";
import useWindowSize from "../hooks/useWindowSize";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
// Components
import EventButton from "../Components/EventButton";
// Helpers
import { sortEvents } from "../helpers/sortEvents";
// date-fns
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import pl from "date-fns/locale/pl";

export default function CalendarGrid() {
  const { state, dispatch } = useCalendar();
  const { width } = useWindowSize();
  const [maxEventButtons, setMaxEventButtons] = useState<number>();
  const currentDate = new Date();

  const containerRef = useRef<HTMLDivElement>(null);

  function calculateMaxEventButtons() {
    const eventsContainer = document.querySelector(".events");
    const eventButton = document.querySelector(".event");

    const eventsContainerHeight = eventsContainer?.clientHeight || 0;
    const evenButtonClientRect = eventButton?.getBoundingClientRect();
    const actualButtonHeight = evenButtonClientRect
      ? evenButtonClientRect.bottom - evenButtonClientRect.top
      : 0;
    const eventButtonHeight = actualButtonHeight + 3; //? 2px is the event bottom gap and 1px to show element only when it's should

    return Math.ceil(eventsContainerHeight / eventButtonHeight);
  }

  useEffect(() => {
    let initialMaxEventButtons: number;

    if (width >= 840) {
      initialMaxEventButtons = calculateMaxEventButtons();
    } else {
      initialMaxEventButtons = 2;
    }

    setMaxEventButtons(initialMaxEventButtons);

    function handleResize() {
      let newMaxEventButtons: number;

      if (width >= 840) {
        newMaxEventButtons = calculateMaxEventButtons();
      } else {
        newMaxEventButtons = 2;
      }

      setMaxEventButtons(newMaxEventButtons);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [state, width]);

  function sortAllEvents(date: Date) {
    return state.events
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
      .sort(sortEvents);
  }

  function openNewEventModal(date: Date) {
    dispatch({ type: REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL, payload: date });
  }

  function showMoreEventsModal(date: Date) {
    const allEvents = sortAllEvents(date);

    return dispatch({
      type: REDUCER_ACTIONS.HANDLE_MORE_EVENTS_MODAL_OPEN_STATE,
      payload: {
        selectedDate: date,
        isMoreEventsModalOpen: true,
        eventsToDisplayInModal: allEvents,
      },
    });
  }

  return (
    <div
      className="days"
      ref={containerRef}
    >
      {state.visibleDates.map((date, index) => {
        const isCurrentMonth = isSameMonth(date, state.currentMonth);
        const isToday = isSameDay(date, currentDate);
        const formattedDate = format(date, "d");
        const sortedEvents = sortAllEvents(date);

        const dayClasses = [
          "day",
          !isCurrentMonth && "non-month-day",
          isBefore(date, currentDate) && !isToday && "old-month-day",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            className={dayClasses}
            key={date.toISOString()}
          >
            <div className="day-header">
              {(index < 7 || width < 840) && (
                <div className="week-name">{format(date, "EEE", { locale: pl })}</div>
              )}
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
                aria-label="Naciśnij aby wyświetlić wszystkie wydarzenia tego dnia."
                onClick={() => showMoreEventsModal(date)}
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
