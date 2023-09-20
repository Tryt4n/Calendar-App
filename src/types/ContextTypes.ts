import { ReactElement } from "react";
import { NewEventType } from "./NewEventType";

// Types
type ActionsType = {
  SHOW_PREVIOUS_MONTH: "showPreviousMonth";
  SHOW_NEXT_MONTH: "showNextMonth";
  OPEN_NEW_TASK_MODAL: "openNewTaskModal";
  CLOSE_NEW_TASK_MODAL: "closeNewTaskModal";
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
      type: "openNewTaskModal";
    }
  | {
      type: "closeNewTaskModal";
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
  OPEN_NEW_TASK_MODAL: "openNewTaskModal",
  CLOSE_NEW_TASK_MODAL: "closeNewTaskModal",
  ADD_NEW_EVENT: "addNewEvent",
};
