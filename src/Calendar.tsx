// Components
import CalendarHeader from "./layout/CalendarHeader";
import CalendarGrid from "./layout/CalendarGrid";
import NewEventModal from "./layout/NewEventModal/NewEventModal";
import MoreEventsModal from "./layout/MoreEventsModal";

export default function Calendar() {
  return (
    <main>
      <h1 className="visually-hidden">Kalendarz</h1>
      <CalendarHeader />
      <article className="calendar">
        <h2 className="visually-hidden">Siatka kalendarza</h2>
        <CalendarGrid />
      </article>

      <MoreEventsModal />
      <NewEventModal />
    </main>
  );
}
