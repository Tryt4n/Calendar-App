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
  ADD_NEW_EVENT: "addNewEvent";
  OPEN_EDITED_EVENT: "openEditedEvent";
  EDIT_EVENT_NAME: "editEventName";
  EDIT_EVENT_ALL_DAY_STATUS: "editEventAllDayStatus";
  EDIT_EVENT_START_TIME: "editEventStartTime";
  EDIT_EVENT_END_TIME: "editEventEndTime";
  EDIT_EVENT_COLOR: "editEventColor";
  EDIT_EVENT: "editEvent";
  HANDLE_MORE_EVENTS_MODAL_OPEN_STATE: "handleMoreEventsModalOpenState";
  DELETE_EVENT: "deleteEvent";
};

export type ReducerStateType = {
  currentMonth: Date;
  visibleDates: Date[];
  isModalOpen: boolean;
  events: NewEventType[];
  selectedDate: Date;
  editingEvent: NewEventType | undefined;
  isMoreEventsModalOpen: boolean;
  eventsToDisplayInModal: NewEventType[];
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
      payload: Date;
    }
  | {
      type: "closeNewTaskModal";
    }
  | {
      type: "addNewEvent";
      payload: NewEventType;
    }
  | {
      type: "openEditedEvent";
      payload: NewEventType;
    }
  | {
      type: "editEventName";
      payload: string;
    }
  | {
      type: "editEventAllDayStatus";
      payload: {
        allDayStatus: boolean;
        startTime?: string;
        endTime?: string;
      };
    }
  | {
      type: "editEventStartTime";
      payload: string;
    }
  | {
      type: "editEventEndTime";
      payload: string;
    }
  | {
      type: "editEventColor";
      payload: string;
    }
  | {
      type: "editEvent";
    }
  | {
      type: "handleMoreEventsModalOpenState";
      payload: {
        selectedDate?: Date;
        isMoreEventsModalOpen: boolean;
        eventsToDisplayInModal: NewEventType[];
      };
    }
  | {
      type: "deleteEvent";
      payload: NewEventType;
    };

export type ContextType = {
  state: ReducerStateType;
  dispatch: React.Dispatch<ReducerActionsType>;
  newEvent: NewEventType;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEventType>>;
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
  ADD_NEW_EVENT: "addNewEvent",
  OPEN_EDITED_EVENT: "openEditedEvent",
  EDIT_EVENT_NAME: "editEventName",
  EDIT_EVENT_ALL_DAY_STATUS: "editEventAllDayStatus",
  EDIT_EVENT_START_TIME: "editEventStartTime",
  EDIT_EVENT_END_TIME: "editEventEndTime",
  EDIT_EVENT_COLOR: "editEventColor",
  EDIT_EVENT: "editEvent",
  HANDLE_MORE_EVENTS_MODAL_OPEN_STATE: "handleMoreEventsModalOpenState",
  DELETE_EVENT: "deleteEvent",
};
