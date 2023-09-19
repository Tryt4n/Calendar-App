import { ReactElement } from "react";

// Types
type ActionsType = {
  SHOW_PREVIOUS_MONTH: "showPreviousMonth";
  SHOW_NEXT_MONTH: "showNextMonth";
};

export type ReducerStateType = {
  currentMonth: Date;
  visibleDates: Date[];
};

export type ReducerActionsType =
  | {
      type: "showPreviousMonth";
    }
  | {
      type: "showNextMonth";
    };

export type ContextType = {
  state: ReducerStateType;
  dispatch: React.Dispatch<ReducerActionsType>;
};

export type ChildrenType = { children?: ReactElement };

// ACTIONS
export const REDUCER_ACTIONS: ActionsType = {
  SHOW_PREVIOUS_MONTH: "showPreviousMonth",
  SHOW_NEXT_MONTH: "showNextMonth",
};
