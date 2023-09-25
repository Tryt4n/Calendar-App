// React
import { createContext, useEffect, useMemo, useReducer } from "react";
// Types
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
  const { currentMonth, events, editingEvent } = state;

  function handleDateChange(date: Date, value = 0) {
    const newDate = addMonths(date, value);
    const newVisibleDate = handleFormat(newDate);
    return {
      ...state,
      currentMonth: newDate,
      visibleDates: newVisibleDate,
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

    case REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL: {
      const newSelectedDate = action.payload;
      return {
        ...state,
        isModalOpen: true,
        selectedDate: newSelectedDate,
      };
    }

    case REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL:
      return {
        ...state,
        isModalOpen: false,
        editingEvent: undefined,
      };

    case REDUCER_ACTIONS.ADD_NEW_EVENT: {
      const newEvent = action.payload;
      return {
        ...state,
        events: [...events, newEvent],
      };
    }

    case REDUCER_ACTIONS.OPEN_EDITED_EVENT: {
      const editingEvent = action.payload;
      return {
        ...state,
        isModalOpen: true,
        editingEvent: editingEvent,
      };
    }

    case REDUCER_ACTIONS.EDIT_EVENT_NAME: {
      const newEventName = action.payload;

      if (!editingEvent) return { ...state };

      const updatedEditingEvent = {
        ...editingEvent,
        eventName: newEventName,
      };

      return {
        ...state,
        editingEvent: updatedEditingEvent,
      };
    }

    case REDUCER_ACTIONS.EDIT_EVENT_ALL_DAY_STATUS: {
      const newEventAllDayStatus = action.payload;

      if (!editingEvent) return { ...state };

      const updatedEditingEvent = {
        ...editingEvent,
        allDayStatus: newEventAllDayStatus.allDayStatus,
        startTime: newEventAllDayStatus.startTime,
        endTime: newEventAllDayStatus.endTime,
      };

      return {
        ...state,
        editingEvent: updatedEditingEvent,
      };
    }

    case REDUCER_ACTIONS.EDIT_EVENT_START_TIME: {
      const newEventStartTime = action.payload;

      if (!editingEvent) return { ...state };

      const updatedEditingEvent = {
        ...editingEvent,
        startTime: newEventStartTime,
      };

      return {
        ...state,
        editingEvent: updatedEditingEvent,
      };
    }

    case REDUCER_ACTIONS.EDIT_EVENT_END_TIME: {
      const newEventEndTime = action.payload;

      if (!editingEvent) return { ...state };

      const updatedEditingEvent = {
        ...editingEvent,
        endTime: newEventEndTime,
      };

      return {
        ...state,
        editingEvent: updatedEditingEvent,
      };
    }

    case REDUCER_ACTIONS.EDIT_EVENT_COLOR: {
      const newEventColor = action.payload;

      if (!editingEvent) return { ...state };

      const updatedEditingEvent = {
        ...editingEvent,
        eventColor: newEventColor,
      };

      return {
        ...state,
        editingEvent: updatedEditingEvent,
      };
    }

    case REDUCER_ACTIONS.EDIT_EVENT: {
      if (!editingEvent) return { ...state };

      const eventIndex = events.findIndex((event) => event.id === editingEvent.id);
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = editingEvent;
      return {
        ...state,
        events: updatedEvents,
        editingEvent: undefined,
      };
    }

    case REDUCER_ACTIONS.DELETE_EVENT: {
      const deletingEvent = action.payload;
      const updatedEvents = state.events.filter((event) => event.id !== deletingEvent.id);
      return {
        ...state,
        events: updatedEvents,
        isModalOpen: false,
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
  selectedDate: new Date(),
  editingEvent: undefined,
};

export function CalendarProvider({ children }: ChildrenType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const contextValues = useMemo(
    () => ({
      state: state,
      dispatch: dispatch,
    }),
    [state, dispatch]
  );

  useEffect(() => {
    try {
      if (!localStorage.getItem("events")) {
        localStorage.setItem("events", "[]");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(state.events));
  }, [state.events]);

  // useEffect(() => console.log(state), [state]);

  return <CalendarContext.Provider value={contextValues}>{children}</CalendarContext.Provider>;
}

export default CalendarContext;
