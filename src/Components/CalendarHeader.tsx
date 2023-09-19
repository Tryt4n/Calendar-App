//Context
import { useCalendar } from "../context/useCalendar";
import { REDUCER_ACTIONS } from "../context/ContextTypes";

// date-fns
import format from "date-fns/format";
import pl from "date-fns/locale/pl";

export default function CalendarHeader() {
  const { state, dispatch } = useCalendar();

  const displayedDate = format(state.currentMonth, "LLLL yyyy", { locale: pl });

  return (
    <div className="header">
      <button className="btn">Today</button>
      <div>
        <button
          className="month-change-btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_PREVIOUS_MONTH })}
        >
          &lt;
        </button>
        <button
          className="month-change-btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_NEXT_MONTH })}
        >
          &gt;
        </button>
      </div>
      <span className="month-title">{displayedDate}</span>
    </div>
  );
}
