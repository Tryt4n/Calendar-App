//Context
import { useCalendar } from "../context/useCalendar";
// Types
import { REDUCER_ACTIONS } from "../types/ContextTypes";
// date-fns
import format from "date-fns/format";
import pl from "date-fns/locale/pl";

export default function CalendarHeader() {
  const { state, dispatch } = useCalendar();

  const displayedDate = format(state.currentMonth, "LLLL yyyy", { locale: pl });

  return (
    <div className="header">
      <div>
        <button
          className="month-change-btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_PREVIOUS_YEAR })}
        >
          &#171;
        </button>
        <button
          className="month-change-btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_PREVIOUS_MONTH })}
        >
          &#8249;
        </button>

        <button
          className="btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_CURRENT_MONTH })}
        >
          Today
        </button>

        <button
          className="month-change-btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_NEXT_MONTH })}
        >
          &#8250;
        </button>
        <button
          className="month-change-btn"
          onClick={() => dispatch({ type: REDUCER_ACTIONS.SHOW_NEXT_YEAR })}
        >
          &#187;
        </button>
      </div>
      <span className="month-title">{displayedDate}</span>
    </div>
  );
}
