import { useEffect } from "react";

export function useEscapeKeyHandler(callback: () => void) {
  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        callback();
      }
    }

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [callback]);
}
