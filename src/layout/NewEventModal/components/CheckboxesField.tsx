// React
import { ChangeEvent, useState } from "react";
// Custom Hooks
import { useCalendar } from "../../../hooks/useCalendar";
// Components
import CheckboxInput from "../../../Components/CheckboxInput";
// Types
import { REDUCER_ACTIONS } from "../../../types/ContextTypes";

type PreviousTimeValuesType = {
  startTime?: string;
  endTime?: string;
};

export default function CheckboxesField() {
  const { state, dispatch, newEvent, setNewEvent } = useCalendar();
  const { editingEvent } = state;

  //? For handling edge case where startTime and endTime are undefined when all-day checkbox is checked and immediately after unchecked
  const [previousTimeValues, setPreviousTimeValues] = useState<PreviousTimeValuesType>({
    startTime: undefined,
    endTime: undefined,
  });

  function handleAllDayEventCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (editingEvent) {
      if (e.target.checked) {
        //? If the checkbox is checked, keep the previous startTime and endTime values
        setPreviousTimeValues({
          startTime: editingEvent.startTime,
          endTime: editingEvent.endTime,
        });

        //? Reset startTime and endTime
        dispatch({
          type: REDUCER_ACTIONS.EDIT_EVENT_ALL_DAY_STATUS,
          payload: {
            allDayStatus: true,
            startTime: undefined,
            endTime: undefined,
          },
        });
      } else {
        //? If the checkbox is unchecked, restore the previous startTime and endTime values
        dispatch({
          type: REDUCER_ACTIONS.EDIT_EVENT_ALL_DAY_STATUS,
          payload: {
            allDayStatus: false,
            startTime: previousTimeValues.startTime,
            endTime: previousTimeValues.endTime,
          },
        });
      }
    } else {
      if (e.target.checked) {
        //? If the checkbox is checked, keep the previous startTime and endTime values
        setPreviousTimeValues({
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
        });

        //? Reset startTime and endTime
        setNewEvent((prevState) => ({
          ...prevState,
          allDayStatus: true,
          startTime: undefined,
          endTime: undefined,
        }));
      } else {
        //? If the checkbox is unchecked, restore the previous startTime and endTime values
        setNewEvent((prevState) => ({
          ...prevState,
          allDayStatus: false,
          startTime: previousTimeValues.startTime,
          endTime: previousTimeValues.endTime,
        }));
      }
    }
  }

  function handleEveryYearEventCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setNewEvent((prevState) => ({
        ...prevState,
        everyYear: true,
      }));
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        everyYear: false,
      }));
    }
  }

  return (
    <fieldset className="checkbox-wrapper">
      <legend className="visually-hidden">Ustawienia Wydarzenia</legend>
      <CheckboxInput
        name="all-day"
        checkedStatus={editingEvent ? editingEvent.allDayStatus : newEvent.allDayStatus}
        onChangeFunction={handleAllDayEventCheckboxChange}
      />
      {((newEvent && !editingEvent) || editingEvent?.everyYear) && (
        <CheckboxInput
          name="every-year"
          checkedStatus={editingEvent?.everyYear}
          disabledStatus={editingEvent?.everyYear}
          onChangeFunction={handleEveryYearEventCheckboxChange}
        />
      )}
    </fieldset>
  );
}
