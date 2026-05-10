// import { useEffect } from "react";
// import { listen, stopListening } from "../realtime";

// export const useRealtime = (eventName, callback) => {
//   useEffect(() => {
//     if (!eventName || !callback) return;

//     listen(eventName, callback);

//     return () => stopListening(eventName, callback);
//   }, [eventName, callback]);
// };

import { useEffect, useRef } from "react";
import { listen, stopListening } from "../realtime";

export const useRealtime = (eventName, callback) => {
  const callbackRef = useRef(callback);

  // ✅ بنحدث الـ ref جوه useEffect مش في الـ render
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!eventName) return;

    const handler = (data) => callbackRef.current(data);

    listen(eventName, handler);
    return () => stopListening(eventName, handler);

  }, [eventName]);
};