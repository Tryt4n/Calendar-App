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
  OPEN_EXISTING_TASK_MODAL: "openExistingTaskModal";
  ADD_NEW_EVENT: "addNewEvent";
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
      type: "openExistingTaskModal";
      payload: NewEventType;
    }
  | {
      type: "addNewEvent";
      payload: NewEventType;
    };

export type ContextType = {
  state: ReducerStateType;
  dispatch: React.Dispatch<ReducerActionsType>;
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
  OPEN_EXISTING_TASK_MODAL: "openExistingTaskModal",
  ADD_NEW_EVENT: "addNewEvent",
};
