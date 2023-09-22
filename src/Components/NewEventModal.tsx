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

export default function NewEventModal() {
  const { state, dispatch, selectedDate, editedEvent, setEditedEvent } = useCalendar();

  const isValidDate = editedEvent
    ? editedEvent.eventDate && isValid(editedEvent.eventDate)
    : selectedDate && isValid(selectedDate);
  const formattedDate = isValidDate
    ? format(editedEvent ? editedEvent.eventDate : selectedDate, "d/L/yy", { locale: pl })
    : "";

  const newEventInitState: NewEventType = {
    id: crypto.randomUUID(),
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
    if (editedEvent) setEditedEvent(undefined);
    setNewEvent(newEventInitState);
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

    if (editedEvent) {
      setEditedEvent((prevState) => ({
        ...(prevState as NewEventType),
        eventName: sanitizedInputName,
      }));
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        eventName: sanitizedInputName,
        eventDate: selectedDate,
      }));
    }
  }

  function handleAllDayEventCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (editedEvent) {
      if (e.target.checked) {
        //? If the checkbox is checked, keep the previous startTime and endTime values
        setPreviousTimeValues({
          startTime: editedEvent.startTime,
          endTime: editedEvent.endTime,
        });

        //? Reset startTime and endTime
        setEditedEvent((prevState) => ({
          ...(prevState as NewEventType),
          allDayStatus: true,
          startTime: undefined,
          endTime: undefined,
        }));
      } else {
        //? If the checkbox is unchecked, restore the previous startTime and endTime values
        setEditedEvent((prevState) => ({
          ...(prevState as NewEventType),
          allDayStatus: false,
          startTime: previousTimeValues.startTime,
          endTime: previousTimeValues.endTime,
        }));
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

  function handleEventTimeChange(e: ChangeEvent<HTMLInputElement>, fieldName: string) {
    if (editedEvent) {
      setEditedEvent((prevState) => ({
        ...(prevState as NewEventType),
        [fieldName]: e.target.value,
      }));
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        [fieldName]: e.target.value,
      }));
    }
  }

  function handleEventColorChange(e: ChangeEvent<HTMLInputElement>) {
    if (editedEvent) {
      setEditedEvent((prevState) => ({
        ...(prevState as NewEventType),
        eventColor: e.target.value,
      }));
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        eventColor: e.target.value,
      }));
    }
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

  function editEvent() {
    if (!editedEvent) return;

    const isDuplicateEvent = state.events.some(
      (event) =>
        event.eventName === editedEvent.eventName &&
        event.eventDate.toISOString() === editedEvent.eventDate.toISOString()
    );

    if (isDuplicateEvent) {
      alert("Tego dnia istnieje już wydarzenie o takiej samej nazwie!");
    } else {
      dispatch({
        type: REDUCER_ACTIONS.EDIT_EVENT,
        payload: editedEvent,
      });
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
      //? Reset `editedEvent`
      setEditedEvent(undefined);
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
                editedEvent ? editEvent() : addNewEvent();
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
                  value={editedEvent ? editedEvent.eventName : newEvent.eventName}
                  onChange={handleEventNameChange}
                />
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="all-day"
                  id="all-day"
                  checked={editedEvent ? editedEvent.allDayStatus : newEvent.allDayStatus}
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
                    value={editedEvent ? editedEvent.startTime : undefined}
                    disabled={editedEvent ? editedEvent.allDayStatus : newEvent.allDayStatus}
                    required={editedEvent ? !editedEvent.allDayStatus : !newEvent.allDayStatus}
                    onChange={(e) => handleEventTimeChange(e, "startTime")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end-time">End Time</label>
                  <input
                    type="time"
                    name="end-time"
                    id="end-time"
                    value={editedEvent ? editedEvent.endTime : undefined}
                    disabled={editedEvent ? editedEvent.allDayStatus : newEvent.allDayStatus}
                    required={editedEvent ? !editedEvent.allDayStatus : !newEvent.allDayStatus}
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
                    checked={
                      editedEvent
                        ? editedEvent.eventColor === "blue"
                        : newEvent.eventColor === "blue"
                    }
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
                    checked={
                      editedEvent ? editedEvent.eventColor === "red" : newEvent.eventColor === "red"
                    }
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
                    checked={
                      editedEvent
                        ? editedEvent.eventColor === "green"
                        : newEvent.eventColor === "green"
                    }
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
                  {editedEvent ? "Edit" : "Add"}
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
