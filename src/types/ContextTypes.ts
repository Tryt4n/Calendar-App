import { ReactElement } from "react";
import { NewEventType } from "./NewEventType";

// Types
type ActionsType = {
  SHOW_PREVIOUS_MONTH: "showPreviousMonth";
  SHOW_NEXT_MONTH: "showNextMonth";
  SHOW_PREVIOUS_YEAR: "showPreviousYear";
  SHOW_NEXT_YEAR: "showNextYear";
  SHOW_CURRENT_MONTH: "showCurrentMonth";
  OPEN_NEW_TASK_MODAL: "openNewTaskModal";
  CLOSE_NEW_TASK_MODAL: "closeNewTaskModal";
  EDIT_EVENT: "editEvent";
  ADD_NEW_EVENT: "addNewEvent";
  DELETE_EVENT: "deleteEvent";
};

export type ReducerStateType = {
  currentMonth: Date;
  visibleDates: Date[];
  isModalOpen: boolean;
  events: NewEventType[];
};

export type ReducerActionsType =
  | {
      type: "showPreviousMonth";
    }
  | {
      type: "showNextMonth";
    }
  | {
      type: "showPreviousYear";
    }
  | {
      type: "showNextYear";
    }
  | {
      type: "showCurrentMonth";
    }
  | {
      type: "openNewTaskModal";
    }
  | {
      type: "closeNewTaskModal";
    }
  | {
      type: "editEvent";
      payload: NewEventType;
    }
  | {
      type: "addNewEvent";
      payload: NewEventType;
    }
  | {
      type: "deleteEvent";
      payload: NewEventType;
    };

export type ContextType = {
  state: ReducerStateType;
  dispatch: React.Dispatch<ReducerActionsType>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  editedEvent: undefined | NewEventType;
  setEditedEvent: React.Dispatch<React.SetStateAction<undefined | NewEventType>>;
};

export type ChildrenType = { children?: ReactElement | ReactElement[] };

// ACTIONS
export const REDUCER_ACTIONS: ActionsType = {
  SHOW_PREVIOUS_MONTH: "showPreviousMonth",
  SHOW_NEXT_MONTH: "showNextMonth",
  SHOW_PREVIOUS_YEAR: "showPreviousYear",
  SHOW_NEXT_YEAR: "showNextYear",
  SHOW_CURRENT_MONTH: "showCurrentMonth",
  OPEN_NEW_TASK_MODAL: "openNewTaskModal",
  CLOSE_NEW_TASK_MODAL: "closeNewTaskModal",
  EDIT_EVENT: "editEvent",
  ADD_NEW_EVENT: "addNewEvent",
  DELETE_EVENT: "deleteEvent",
};
