import { useEffect } from "react";
import { listen, stopListening } from "../realtime";

export const useRealtime = (eventName, callback) => {
  useEffect(() => {
    if (!eventName || !callback) return;

    listen(eventName, callback);

    return () => stopListening(eventName, callback);
  }, [eventName, callback]);
};