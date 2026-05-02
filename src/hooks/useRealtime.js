import { useEffect, useCallback } from "react";
import { listen, stopListening } from "../realtime";



// ✅ Hook بيستمع للأحداث ويعمل callback
export const useRealtime = (onEvent) => {
  const handleEvent = useCallback(
    (msg) => {
      if (onEvent) onEvent(msg);
    },
    [onEvent]
  );

  useEffect(() => {
    listen(handleEvent);
    return () => stopListening();
  }, [handleEvent]);
};

