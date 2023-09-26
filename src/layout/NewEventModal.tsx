// React
import { ChangeEvent, useEffect, useState } from "react";
// Context
import { useCalendar } from "../context/useCalendar";
// Components
import TimeInput from "../Components/TimeInput";
import ColorRadioInput from "../Components/ColorRadioInput";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
import { NewEventType } from "../types/NewEventType";
import { PreviousTimeValuesType } from "../types/NewEventModalTypes";
// date-fns
import format from "date-fns/format";
import pl from "date-fns/locale/pl";
import isValid from "date-fns/isValid";

export default function NewEventModal() {
  const { state, dispatch } = useCalendar();

  const [isModalClosing, setIsModalClosing] = useState(false);

  const { editingEvent, selectedDate, isModalOpen, events } = state;

  const isValidDate = editingEvent
    ? editingEvent.eventDate && isValid(editingEvent.eventDate)
    : isValid(selectedDate);
  const formattedDate = isValidDate
    ? format(editingEvent ? editingEvent.eventDate : selectedDate, "d/L/yy", {
        locale: pl,
      })
    : "";

  const newEventInitState: NewEventType = {
    id: crypto.randomUUID(),
    eventDate: selectedDate,
    eventName: "",
    allDayStatus: false,
    startTime: undefined,
    endTime: undefined,
    eventColor: "blue",
    everyYear: false,
  };

  const [newEvent, setNewEvent] = useState(newEventInitState);

  //? For handling edge case where startTime and endTime are undefined when all-day checkbox is checked and immediately after unchecked
  const [previousTimeValues, setPreviousTimeValues] = useState<PreviousTimeValuesType>({
    startTime: undefined,
    endTime: undefined,
  });

  function closeNewTaskModal() {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalClosing(false);

      setNewEvent(newEventInitState);
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
    }, 250);
  }

  function closeModalOnEscapeKey(e: KeyboardEvent) {
    if (e.key === "Escape") closeNewTaskModal();
  }

  useEffect(() => {
    window.addEventListener("keydown", closeModalOnEscapeKey);

    return () => window.removeEventListener("keydown", closeModalOnEscapeKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  function handleEventNameChange(e: ChangeEvent<HTMLInputElement>) {
    const inputName = e.target.value;
    const sanitizedInputName = inputName.trimStart(); //? Delete space at the beginning of the input name

    if (editingEvent) {
      dispatch({
        type: REDUCER_ACTIONS.EDIT_EVENT_NAME,
        payload: sanitizedInputName,
      });
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        eventName: sanitizedInputName,
        eventDate: selectedDate,
      }));
    }
  }

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

  function handleEventTimeChange(e: ChangeEvent<HTMLInputElement>, fieldName: string) {
    if (editingEvent) {
      dispatch({
        type:
          fieldName === "startTime"
            ? REDUCER_ACTIONS.EDIT_EVENT_START_TIME
            : REDUCER_ACTIONS.EDIT_EVENT_END_TIME,
        payload: e.target.value,
      });
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        [fieldName]: e.target.value,
      }));
    }
  }

  function handleEventColorChange(e: ChangeEvent<HTMLInputElement>) {
    if (editingEvent) {
      dispatch({ type: REDUCER_ACTIONS.EDIT_EVENT_COLOR, payload: e.target.value });
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        eventColor: e.target.value,
      }));
    }
  }

  function addNewEvent() {
    //? Checking to see if a event with the same name already exists in the same day
    const isDuplicateEvent = events.some(
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
    if (!editingEvent) return;

    const isDuplicateEvent = events.some((event) => {
      if (editingEvent) {
        return (
          event.id !== editingEvent.id && //? Checking if it's not currently editing event
          event.eventName === editingEvent.eventName &&
          event.eventDate.toISOString() === editingEvent.eventDate.toISOString()
        );
      }
    });

    if (isDuplicateEvent) {
      alert("Tego dnia istnieje już wydarzenie o takiej samej nazwie!");
    } else {
      dispatch({
        type: REDUCER_ACTIONS.EDIT_EVENT,
      });
      dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });
    }
  }

  function deleteEvent() {
    if (typeof editingEvent !== "undefined") {
      dispatch({ type: REDUCER_ACTIONS.DELETE_EVENT, payload: editingEvent });
    }
  }

  return (
    <>
      {isModalOpen && (
        <article className={`modal${isModalClosing ? " closing" : ""}`}>
          <div
            className="overlay"
            role="presentation"
          ></div>
          <div className="modal-body">
            <header className="modal-title">
              <h2>{editingEvent ? "Edytuj Wydarzenie" : "Dodaj Wydarzenie"}</h2>
              <time
                dateTime={
                  editingEvent
                    ? editingEvent.eventDate.toLocaleDateString()
                    : selectedDate.toLocaleTimeString()
                }
              >
                {editingEvent?.everyYear && "Od "}
                {formattedDate}
              </time>
              <button
                className="close-btn"
                aria-label="Zamknij okno"
                onClick={closeNewTaskModal}
              >
                &times;
              </button>
            </header>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                editingEvent ? editEvent() : addNewEvent();
              }}
            >
              <fieldset className="form-group">
                <legend className="visually-hidden">Nazwa wydarzenia</legend>
                <label htmlFor="name">Nazwa</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  minLength={1}
                  maxLength={50}
                  value={editingEvent ? editingEvent.eventName : newEvent.eventName}
                  onChange={handleEventNameChange}
                />
              </fieldset>

              <fieldset className="checkbox-wrapper">
                <legend className="visually-hidden">Ustawienia Wydarzenia</legend>
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    name="all-day"
                    id="all-day"
                    checked={editingEvent ? editingEvent.allDayStatus : newEvent.allDayStatus}
                    onChange={handleAllDayEventCheckboxChange}
                  />
                  <label htmlFor="all-day">Cały dzień?</label>
                </div>
                {((newEvent && !editingEvent) || editingEvent?.everyYear) && (
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      name="every-year"
                      id="every-year"
                      checked={editingEvent?.everyYear}
                      disabled={editingEvent?.everyYear}
                      onChange={handleEveryYearEventCheckboxChange}
                    />
                    <label htmlFor="every-year">Każdego roku?</label>
                  </div>
                )}
              </fieldset>

              <fieldset className="row">
                <legend className="visually-hidden">Wybór czasu</legend>
                <TimeInput
                  timeType="start"
                  comparedEvent={editingEvent ? editingEvent : newEvent}
                  onChangeFunction={handleEventTimeChange}
                />
                <TimeInput
                  timeType="end"
                  comparedEvent={editingEvent ? editingEvent : newEvent}
                  onChangeFunction={handleEventTimeChange}
                />
              </fieldset>

              <fieldset className="form-group">
                <legend>Kolor</legend>
                <div className="row left">
                  <ColorRadioInput
                    color="blue"
                    comparedValue={newEvent.eventColor}
                    onChangeFunction={handleEventColorChange}
                  />
                  <ColorRadioInput
                    color="red"
                    comparedValue={newEvent.eventColor}
                    onChangeFunction={handleEventColorChange}
                  />
                  <ColorRadioInput
                    color="green"
                    comparedValue={newEvent.eventColor}
                    onChangeFunction={handleEventColorChange}
                  />
                </div>
              </fieldset>

              <div className="row">
                <button
                  className="btn btn-success"
                  type="submit"
                >
                  {editingEvent ? "Edytuj" : "Dodaj"}
                </button>
                {editingEvent && (
                  <button
                    className="btn btn-delete"
                    type="button"
                    onClick={deleteEvent}
                  >
                    Usuń
                  </button>
                )}
              </div>
            </form>
          </div>
        </article>
      )}
    </>
  );
}
