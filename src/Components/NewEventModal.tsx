import { ChangeEvent, useEffect, useState } from "react";
import { useCalendar } from "../context/useCalendar";
import { REDUCER_ACTIONS } from "../types/ContextTypes";

// date-fns
import format from "date-fns/format";
import pl from "date-fns/locale/pl";

type NewEventModalType = {
  selectedDate: object;
  setSelectedDate: React.Dispatch<React.SetStateAction<object>>;
};

export default function NewEventModal({ selectedDate, setSelectedDate }: NewEventModalType) {
  const { state, dispatch } = useCalendar();

  // const formattedDate = format(selectedDate, "d/L/yy", { locale: pl });

  const newEventInitState = {
    name: "",
    allDayStatus: false,
    startTime: undefined,
    endTime: undefined,
    eventColor: "blue",
  };

  const [newEvent, setNewEvent] = useState(newEventInitState);

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
    setNewEvent((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  }

  function handleAllDayCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    setNewEvent((prevState) => ({
      ...prevState,
      allDayStatus: e.target.checked,
    }));
  }

  function handleColorChange(e: ChangeEvent<HTMLInputElement>) {
    setNewEvent((prevState) => ({
      ...prevState,
      eventColor: e.target.value,
    }));
  }

  function addNewEvent() {
    dispatch({
      type: REDUCER_ACTIONS.ADD_NEW_EVENT,
      payload: newEvent,
    });
    dispatch({ type: REDUCER_ACTIONS.CLOSE_NEW_TASK_MODAL });

    setNewEvent(newEventInitState);
  }

  // useEffect(() => {
  //   console.log(newEvent);
  // }, [newEvent]);
  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  return (
    <>
      {state.isModalOpen && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-body">
            <div className="modal-title">
              <div>Add Event</div>
              <small>6/8/23</small>
              {/* <small>{formattedDate}</small> */}
              <button
                className="close-btn"
                onClick={closeNewTaskModal}
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newEvent.name}
                  onChange={handleEventNameChange}
                />
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="all-day"
                  id="all-day"
                  checked={newEvent.allDayStatus}
                  onChange={handleAllDayCheckboxChange}
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
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end-time">End Time</label>
                  <input
                    type="time"
                    name="end-time"
                    id="end-time"
                    disabled={newEvent.allDayStatus}
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
                    onChange={handleColorChange}
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
                    onChange={handleColorChange}
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
                    onChange={handleColorChange}
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
                  onClick={addNewEvent}
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
