// Context
import { CalendarProvider } from "./context/CalendarContext";
// Components
import CalendarHeader from "./layout/CalendarHeader";
import CalendarGrid from "./layout/CalendarGrid";
import NewEventModal from "./layout/NewEventModal";
import MoreEventsModal from "./layout/MoreEventsModal";

export default function App() {
  return (
    <CalendarProvider>
      <main>
        <h1 className="visually-hidden">Kalendarz</h1>
        <CalendarHeader />
        <article className="calendar">
          <h2 className="visually-hidden">Siatka kalendarza</h2>
          <CalendarGrid />
        </article>

        <NewEventModal />
        {/* <MoreEventsModal /> */}
      </main>
    </CalendarProvider>
  );
}
