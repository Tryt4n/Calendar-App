// React
import { createContext, useEffect, useReducer, useState } from "react";
//types
import {
  ContextType,
  ChildrenType,
  ReducerStateType,
  ReducerActionsType,
  REDUCER_ACTIONS,
} from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";
// date-fns
import addMonths from "date-fns/addMonths";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import startOfMonth from "date-fns/startOfMonth";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import endOfMonth from "date-fns/endOfMonth";

function handleFormat(date: Date) {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  });
}

function reducer(state: ReducerStateType, action: ReducerActionsType) {
  const { type } = action;
  const { currentMonth, events } = state;

  // let updatedEvent: NewEventType;
  let updatedEvents: NewEventType[];

  function handleDateChange(date: Date, value = 0) {
    const newDate = addMonths(date, value);
    const newVisibleDate = handleFormat(newDate);
    return {
      ...state,
      currentMonth: newDate,
      visibleDates: newVisibleDate,
    };
  }

  function handleNewTaskModalOpen(boolean: boolean) {
    return {
      ...state,
      isModalOpen: boolean,
    };
  }

  switch (type) {
    case REDUCER_ACTIONS.SHOW_PREVIOUS_MONTH:
      return handleDateChange(currentMonth, -1);

    case REDUCER_ACTIONS.SHOW_NEXT_MONTH:
      return handleDateChange(currentMonth, 1);

    case REDUCER_ACTIONS.SHOW_PREVIOUS_YEAR:
      return handleDateChange(currentMonth, -12);

    case REDUCER_ACTIONS.SHOW_NEXT_YEAR:
      return handleDateChange(currentMonth, 12);

    case REDUCER_ACTIONS.SHOW_CURRENT_MONTH:
      return handleDateChange(new Date());

    case REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL:
      return handleNewTaskModalOpen(true);

    case REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL:
      return handleNewTaskModalOpen(false);

    case REDUCER_ACTIONS.EDIT_EVENT:
      // updatedEvent = action.payload;
      updatedEvents = events.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
      return {
        ...state,
        // isModalOpen: false,
        events: updatedEvents,
      };

    case REDUCER_ACTIONS.ADD_NEW_EVENT: {
      const newEvent = action.payload;
      return {
        ...state,
        events: [...events, newEvent],
      };
    }

    default:
      return state;
  }
}

const CalendarContext = createContext<ContextType | null>(null);

const currentDate = new Date();
const visibleDates = handleFormat(currentDate);

//? Get events from localStorage and parse for each event `eventDate`from string to Date
const storedEventsString = localStorage.getItem("events");
const storedEvents = storedEventsString ? JSON.parse(storedEventsString) : [];

//? Convert all eventDate to Date objects
const eventsWithDateAsDate = storedEvents.map((event: NewEventType) => ({
  ...event,
  eventDate: new Date(event.eventDate),
}));

const initState: ReducerStateType = {
  currentMonth: currentDate,
  visibleDates: visibleDates,
  isModalOpen: false,
  events: eventsWithDateAsDate,
};

export function CalendarProvider({ children }: ChildrenType) {
  const [state, dispatch] = useReducer(reducer, initState);

  //!
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editedEvent, setEditedEvent] = useState<NewEventType>();
  //!

  const contextValues = {
    state: state,
    dispatch: dispatch,
    selectedDate: selectedDate,
    setSelectedDate: setSelectedDate,
    editedEvent: editedEvent,
    setEditedEvent: setEditedEvent,
  };

  useEffect(() => {
    if (!localStorage.getItem("events")) {
      localStorage.setItem("events", "[]");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(state.events));
  }, [state.events]);

  // useEffect(() => console.log(state), [state]);

  return <CalendarContext.Provider value={contextValues}>{children}</CalendarContext.Provider>;
}

export default CalendarContext;
