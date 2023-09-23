// React
import { useCallback } from "react";
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

  const handlePreviousYear = useCallback(() => {
    dispatch({ type: REDUCER_ACTIONS.SHOW_PREVIOUS_YEAR });
  }, [dispatch]);

  const handlePreviousMonth = useCallback(() => {
    dispatch({ type: REDUCER_ACTIONS.SHOW_PREVIOUS_MONTH });
  }, [dispatch]);

  const handleCurrentMonth = useCallback(() => {
    dispatch({ type: REDUCER_ACTIONS.SHOW_CURRENT_MONTH });
  }, [dispatch]);

  const handleNextMonth = useCallback(() => {
    dispatch({ type: REDUCER_ACTIONS.SHOW_NEXT_MONTH });
  }, [dispatch]);

  const handleNextYear = useCallback(() => {
    dispatch({ type: REDUCER_ACTIONS.SHOW_NEXT_YEAR });
  }, [dispatch]);

  return (
    <header className="header">
      <nav>
        <h2 className="visually-hidden">Wybór miesiąca</h2>
        <button
          className="month-change-btn"
          aria-label="Przewiń do poprzedniego roku"
          onClick={handlePreviousYear}
        >
          &#171;
        </button>
        <button
          className="month-change-btn"
          aria-label="Przewiń o jeden miesiąc wstecz"
          onClick={handlePreviousMonth}
        >
          &#8249;
        </button>

        <button
          className="btn"
          aria-label="Wyświetl aktualny miesiąc"
          onClick={handleCurrentMonth}
        >
          Dzisiaj
        </button>

        <button
          className="month-change-btn"
          aria-label="Przewiń o jeden miesiąc do przodu"
          onClick={handleNextMonth}
        >
          &#8250;
        </button>
        <button
          className="month-change-btn"
          aria-label="Przewiń do następnego roku"
          onClick={handleNextYear}
        >
          &#187;
        </button>
      </nav>
      <h2 className="month-title">{displayedDate}</h2>
    </header>
  );
}
