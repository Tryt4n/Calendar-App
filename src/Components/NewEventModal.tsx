import { ChangeEvent, useEffect, useState } from "react";
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";
import { PreviousTimeValuesType } from "../types/NewEventModalTypes";
// date-fns
import format from "date-fns/format";
import pl from "date-fns/locale/pl";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import addMinutes from "date-fns/addMinutes";

type NewEventModalPropsType = {
  selectedDate: Date;
};

export default function NewEventModal({ selectedDate }: NewEventModalPropsType) {
  const { state, dispatch } = useCalendar();

  const isValidDate = selectedDate instanceof Date && isValid(selectedDate);
  // const formattedDate = isValidDate ? format(selectedDate, "d/L/yy", { locale: pl }) : "";
  const formattedDate = isValidDate ? format(selectedDate, "d/L/yy", { locale: pl }) : "";

  const newEventInitState: NewEventType = {
    eventDate: selectedDate,
    eventName: "",
    allDayStatus: false,
    startTime: undefined,
    endTime: undefined,
    eventColor: "blue",
  };

  const [newEvent, setNewEvent] = useState(newEventInitState);
  //? For handling edge case where startTime and endTime are undefined when all-day checkbox is checked and immediately after unchecked
  const [previousTimeValues, setPreviousTimeValues] = useState<PreviousTimeValuesType>({
    startTime: undefined,
    endTime: undefined,
  });

  function closeNewTaskModal() {
    dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
  }

  function closeModalOnEscapeKey(e: KeyboardEvent) {
    if (e.key === "Escape") closeNewTaskModal();
  }

  useEffect(() => {
    window.addEventListener("keydown", closeModalOnEscapeKey);

    return () => window.removeEventListener("keydown", closeModalOnEscapeKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isModalOpen]);

  function handleEventNameChange(e: ChangeEvent<HTMLInputElement>) {
    const inputName = e.target.value;
    const sanitizedInputName = inputName.trimStart(); //? Delete space at the beginning of the input name

    setNewEvent((prevState) => ({
      ...prevState,
      eventName: sanitizedInputName,
      eventDate: selectedDate,
    }));
  }

  function handleAllDayEventCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
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

  function handleEventTimeChange(e: ChangeEvent<HTMLInputElement>, fieldName: string) {
    setNewEvent((prevState) => ({
      ...prevState,
      [fieldName]: e.target.value,
    }));
  }

  function handleEventColorChange(e: ChangeEvent<HTMLInputElement>) {
    setNewEvent((prevState) => ({
      ...prevState,
      eventColor: e.target.value,
    }));
  }

  function addNewEvent() {
    //? Checking to see if a event with the same name already exists in the same day
    const isDuplicateEvent = state.events.some(
      (event) =>
        event.eventName === newEvent.eventName &&
        event.eventDate.toISOString() === newEvent.eventDate.toISOString()
    );

    if (isDuplicateEvent) {
      alert("Tego dnia istnieje już wydarzenie o takiej samej nazwie!");
    } else {
      dispatch({
        type: REDUCER_ACTIONS.ADD_NEW_EVENT,
        payload: newEvent,
      });
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
      //? Reset `newEvent`
      setNewEvent(newEventInitState);
    }
  }

  //? Formats newEvent.endTime to one minute greater than newEvent.startTime
  function formatNewEndTimeDate(stringDate: string) {
    if (isValid(parse(stringDate, "HH:mm", new Date()))) {
      const newEndTime = addMinutes(parse(stringDate, "HH:mm", new Date()), 1);
      const formattedNewEndTime = format(newEndTime, "HH:mm", { locale: pl });
      return formattedNewEndTime;
    }
  }

  return (
    <>
      {state.isModalOpen && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-body">
            <div className="modal-title">
              <div>Add Event</div>
              <small>{formattedDate}</small>
              <button
                className="close-btn"
                onClick={closeNewTaskModal}
              >
                &times;
              </button>
            </div>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                addNewEvent();
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  minLength={1}
                  value={newEvent.eventName}
                  onChange={handleEventNameChange}
                />
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="all-day"
                  id="all-day"
                  checked={newEvent.allDayStatus}
                  onChange={handleAllDayEventCheckboxChange}
                />
                <label htmlFor="all-day">All Day?</label>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="start-time">Start Time</label>
                  <input
                    type="time"
                    name="start-time"
                    id="start-time"
                    disabled={newEvent.allDayStatus}
                    required={!newEvent.allDayStatus}
                    onChange={(e) => handleEventTimeChange(e, "startTime")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end-time">End Time</label>
                  <input
                    type="time"
                    name="end-time"
                    id="end-time"
                    disabled={newEvent.allDayStatus}
                    required={!newEvent.allDayStatus}
                    min={formatNewEndTimeDate(newEvent.startTime as string)}
                    onChange={(e) => handleEventTimeChange(e, "endTime")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="row left">
                  <input
                    type="radio"
                    name="color"
                    value="blue"
                    id="blue"
                    className="color-radio"
                    checked={newEvent.eventColor === "blue"}
                    onChange={handleEventColorChange}
                  />
                  <label htmlFor="blue">
                    <span className="sr-only">Blue</span>
                  </label>
                  <input
                    type="radio"
                    name="color"
                    value="red"
                    id="red"
                    className="color-radio"
                    checked={newEvent.eventColor === "red"}
                    onChange={handleEventColorChange}
                  />
                  <label htmlFor="red">
                    <span className="sr-only">Red</span>
                  </label>
                  <input
                    type="radio"
                    name="color"
                    value="green"
                    id="green"
                    className="color-radio"
                    checked={newEvent.eventColor === "green"}
                    onChange={handleEventColorChange}
                  />
                  <label htmlFor="green">
                    <span className="sr-only">Green</span>
                  </label>
                </div>
              </div>
              <div className="row">
                <button
                  className="btn btn-success"
                  type="submit"
                >
                  Add
                </button>
                <button
                  className="btn btn-delete"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
