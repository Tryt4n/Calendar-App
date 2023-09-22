// import { useState } from "react";
import { CalendarProvider } from "./context/CalendarContext";
// Types
// import { NewEventType } from "./types/NewEventType";
// Components
import CalendarHeader from "./Components/CalendarHeader";
import CalendarGrid from "./Components/CalendarGrid";
import NewEventModal from "./Components/NewEventModal";

export default function App() {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [editedEvent, setEditedEvent] = useState<undefined | NewEventType>();

  return (
    <CalendarProvider>
      <div className="calendar">
        <CalendarHeader />
        <CalendarGrid
        // setSelectedDate={setSelectedDate}
        // setEditedEvent={setEditedEvent}
        />
      </div>

      <NewEventModal
      // selectedDate={selectedDate}
      // editedEvent={editedEvent}
      // setEditedEvent={setEditedEvent}
      />
    </CalendarProvider>
  );
}
