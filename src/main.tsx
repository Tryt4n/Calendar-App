import React from "react";
import ReactDOM from "react-dom/client";
import Calendar from "./Calendar.tsx";
import { CalendarProvider } from "./context/CalendarContext.tsx";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CalendarProvider>
      <Calendar />
    </CalendarProvider>
  </React.StrictMode>
);
