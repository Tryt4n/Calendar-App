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
// Helpers
import { sortEventsByAllDayStatusAndStartTime } from "../helpers/sortEvents";
// date-fns
import addMonths from "date-fns/addMonths";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import endOfWeek from "date-fns/endOfWeek";
import endOfMonth from "date-fns/endOfMonth";
import startOfMonth from "date-fns/startOfMonth";
import startOfWeek from "date-fns/startOfWeek";

function handleFormat(date: Date) {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  });
}

function handleDateChange(date: Date, value: number, state: ReducerStateType) {
  const newDate = addMonths(date, value);
  const newVisibleDate = handleFormat(newDate);
  return {
    ...state,
    currentMonth: newDate,
    visibleDates: newVisibleDate,
  };
}

function openModal(state: ReducerStateType, payload: Partial<ReducerStateType>) {
  return {
    ...state,
    isModalOpen: true,
    ...payload,
  };
}

function closeModal(state: ReducerStateType) {
  return {
    ...state,
    isModalOpen: false,
    editingEvent: undefined,
  };
}

function addNewEvent(state: ReducerStateType, newEvent: NewEventType) {
  const existingEvents = state.events;
  return {
    ...state,
    events: [...existingEvents, newEvent],
  };
}

function updateEditingEvent(state: ReducerStateType, editedFields: Partial<NewEventType>) {
  if (!state.editingEvent) {
    throw new Error("Editing event is not defined");
  }

  const updatedEditingEvent = {
    ...state.editingEvent,
    ...editedFields,
  };

  return {
    ...state,
    editingEvent: updatedEditingEvent,
  };
}

function editEvent(state: ReducerStateType, editingEvent: NewEventType) {
  if (!editingEvent) {
    throw new Error("Editing event is not defined");
  }

  const updatedEvents = state.events.map((event) => {
    if (event.id === editingEvent.id) {
      return editingEvent;
    }
    return event;
  });

  const updatedEventsToDisplayInModal = state.eventsToDisplayInModal.map((event) => {
    if (event.id === editingEvent.id) {
      return editingEvent;
    }
    return event;
  });

  return {
    ...state,
    events: updatedEvents,
    editingEvent: undefined,
    eventsToDisplayInModal: updatedEventsToDisplayInModal.sort(
      sortEventsByAllDayStatusAndStartTime
    ),
  };
}

function handleMoreEventsModal(state: ReducerStateType, modalStates: Partial<ReducerStateType>) {
  const newState: ReducerStateType = {
    ...state,
    selectedDate:
      modalStates.isMoreEventsModalOpen !== undefined
        ? (modalStates.selectedDate as Date)
        : state.selectedDate,
    isMoreEventsModalOpen:
      modalStates.isMoreEventsModalOpen !== undefined
        ? modalStates.isMoreEventsModalOpen
        : state.isMoreEventsModalOpen,
    eventsToDisplayInModal:
      modalStates.eventsToDisplayInModal !== undefined
        ? modalStates.eventsToDisplayInModal
        : state.eventsToDisplayInModal,
  };

  return newState;
}

function deleteEvent(state: ReducerStateType, deletingEvent: NewEventType) {
  const updatedEvents = state.events.filter((event) => event.id !== deletingEvent.id);

  const updatedEventsToDisplayInModal = state.eventsToDisplayInModal.filter(
    (event) => event.id !== deletingEvent.id
  );

  return {
    ...state,
    events: updatedEvents,
    isModalOpen: false,
    editingEvent: undefined,
    eventsToDisplayInModal: updatedEventsToDisplayInModal.sort(
      sortEventsByAllDayStatusAndStartTime
    ),
  };
}

function reducer(state: ReducerStateType, action: ReducerActionsType) {
  const { type } = action;
  const { currentMonth, editingEvent } = state;

  switch (type) {
    case REDUCER_ACTIONS.SHOW_PREVIOUS_MONTH:
      return handleDateChange(currentMonth, -1, { ...state });

    case REDUCER_ACTIONS.SHOW_NEXT_MONTH:
      return handleDateChange(currentMonth, 1, { ...state });

    case REDUCER_ACTIONS.SHOW_PREVIOUS_YEAR:
      return handleDateChange(currentMonth, -12, { ...state });

    case REDUCER_ACTIONS.SHOW_NEXT_YEAR:
      return handleDateChange(currentMonth, 12, { ...state });

    case REDUCER_ACTIONS.SHOW_CURRENT_MONTH:
      return handleDateChange(new Date(), 0, { ...state });

    case REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL:
      return openModal({ ...state }, { selectedDate: action.payload });

    case REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL:
      return closeModal({ ...state });

    case REDUCER_ACTIONS.ADD_NEW_EVENT:
      return addNewEvent({ ...state }, action.payload);

    case REDUCER_ACTIONS.OPEN_EDITED_EVENT:
      return openModal({ ...state }, { editingEvent: action.payload });

    case REDUCER_ACTIONS.EDIT_EVENT_NAME:
      return updateEditingEvent({ ...state }, { eventName: action.payload });

    case REDUCER_ACTIONS.EDIT_EVENT_ALL_DAY_STATUS:
      return updateEditingEvent({ ...state }, action.payload);

    case REDUCER_ACTIONS.EDIT_EVENT_START_TIME:
      return updateEditingEvent({ ...state }, { startTime: action.payload });

    case REDUCER_ACTIONS.EDIT_EVENT_END_TIME:
      return updateEditingEvent({ ...state }, { endTime: action.payload });

    case REDUCER_ACTIONS.EDIT_EVENT_COLOR:
      return updateEditingEvent({ ...state }, { eventColor: action.payload });

    case REDUCER_ACTIONS.EDIT_EVENT:
      return editEvent({ ...state }, editingEvent as NewEventType);

    case REDUCER_ACTIONS.HANDLE_MORE_EVENTS_MODAL_OPEN_STATE:
      return handleMoreEventsModal({ ...state }, action.payload);

    case REDUCER_ACTIONS.DELETE_EVENT:
      return deleteEvent({ ...state }, action.payload);

    default:
      throw new Error(`Unhandled action type: ${type}`);
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
  isMoreEventsModalOpen: false,
  eventsToDisplayInModal: [],
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
