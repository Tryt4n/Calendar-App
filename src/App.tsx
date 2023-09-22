import { CalendarProvider } from "./context/CalendarContext";
// Components
import CalendarHeader from "./Components/CalendarHeader";
import CalendarGrid from "./Components/CalendarGrid";
import NewEventModal from "./Components/NewEventModal";

export default function App() {
  return (
    <CalendarProvider>
      <div className="calendar">
        <CalendarHeader />
        <CalendarGrid />
      </div>

      <NewEventModal />
    </CalendarProvider>
  );
}
