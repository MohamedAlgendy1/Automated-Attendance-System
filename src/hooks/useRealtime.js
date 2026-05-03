import { useEffect, useCallback } from "react";
import { listen, stopListening } from "../realtime";



export const useRealtime = (eventName, onEvent) => {
  const handleEvent = useCallback((data) => {
    if (onEvent) onEvent(data);
  }, [onEvent]);

  useEffect(() => {
    listen(eventName, handleEvent);

    return () => stopListening(eventName, handleEvent);
  }, [eventName, handleEvent]);
};
