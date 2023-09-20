// React
import { createContext, useEffect, useReducer } from "react";
//types
import {
  ContextType,
  ChildrenType,
  ReducerStateType,
  ReducerActionsType,
  REDUCER_ACTIONS,
} from "../types/ContextTypes";
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

  switch (type) {
    case REDUCER_ACTIONS.SHOW_PREVIOUS_MONTH: {
      const previousMonth = addMonths(currentMonth, -1);
      const newVisibleDates = handleFormat(previousMonth);
      return {
        ...state,
        currentMonth: previousMonth,
        visibleDates: newVisibleDates,
      };
    }

    case REDUCER_ACTIONS.SHOW_NEXT_MONTH: {
      const nextMonth = addMonths(currentMonth, 1);
      const newVisibleDates = handleFormat(nextMonth);
      return {
        ...state,
        currentMonth: nextMonth,
        visibleDates: newVisibleDates,
      };
    }

    case REDUCER_ACTIONS.OPEN_NEW_TASK_MODAL: {
      return {
        ...state,
        isModalOpen: true,
      };
    }

    case REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL: {
      return {
        ...state,
        isModalOpen: false,
      };
    }

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

const initState: ReducerStateType = {
  currentMonth: currentDate,
  visibleDates: visibleDates,
  isModalOpen: false,
  events: [],
};

export function CalendarProvider({ children }: ChildrenType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const contextValues = {
    state: state,
    dispatch: dispatch,
  };

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  return <CalendarContext.Provider value={contextValues}>{children}</CalendarContext.Provider>;
}

export default CalendarContext;
