// const channel = new BroadcastChannel("qr-attend-channel");

// export const EVENTS = {
//   ATTENDANCE_RECORDED: "ATTENDANCE_RECORDED",
//   LECTURE_ADDED: "LECTURE_ADDED",
//   LECTURE_DELETED: "LECTURE_DELETED",
//   COURSE_ADDED: "COURSE_ADDED",
//   COURSE_DELETED: "COURSE_DELETED",
//   STUDENT_ENROLLED: "STUDENT_ENROLLED",
// };

// export const broadcast = (event, data) => {
//   channel.postMessage({ event, data, timestamp: Date.now() });
// };

// export const listen = (callback) => {
//   channel.onmessage = (event) => {
//     callback(event.data);
//   };
// };

// export const stopListening = () => {
//   channel.close();
// };


// realtime.js

// let channel = null;

// const getChannel = () => {
//   if (!channel || channel.closed) {
//     channel = new BroadcastChannel("qr-attend-channel");
//   }
//   return channel;
// };

// // EVENTS
// export const EVENTS = {
//   ATTENDANCE_RECORDED: "ATTENDANCE_RECORDED",
//   LECTURE_ADDED: "LECTURE_ADDED",
//   LECTURE_DELETED: "LECTURE_DELETED",
//   COURSE_ADDED: "COURSE_ADDED",
//   COURSE_DELETED: "COURSE_DELETED",
// };

// إرسال
// export const broadcast = (event, data = {}) => {
//   try {
//     getChannel().postMessage({
//       event,
//       data,
//       timestamp: Date.now(),
//     });
//   } catch (err) {
//     console.warn("Broadcast failed:", err);
//   }
// };

// export const broadcast = (event, data) => {
//   console.log("broadcast called", event, data);

//   try {
//     channel.postMessage({ event, data });
//     console.log("broadcast success");
//   } catch (err) {
//     console.error("broadcast error:", err);
//   }
// };

// // استماع
// export const listen = (callback) => {
//   getChannel().onmessage = (msg) => callback(msg.data);
// };

// // إيقاف
// export const stopListening = () => {
//   if (channel) {
//     channel.onmessage = null;
//   }
// };

// // غلق كامل
// export const closeRealtime = () => {
//   if (channel) {
//     channel.close();
//     channel = null;
//   }
// };


let channel = null;

// إنشاء أو إعادة فتح الشانل
const getChannel = () => {
  if (!channel) {
    channel = new BroadcastChannel("qr-attend-channel");
  }
  return channel;
};

// ================= EVENTS =================
export const EVENTS = {
  ATTENDANCE_RECORDED: "ATTENDANCE_RECORDED",
  LECTURE_ADDED: "LECTURE_ADDED",
  LECTURE_DELETED: "LECTURE_DELETED",
  COURSE_ADDED: "COURSE_ADDED",
  COURSE_DELETED: "COURSE_DELETED",
};

// ================= إرسال =================
export const broadcast = (event, data = {}) => {
  try {
    const currentChannel = getChannel();

    currentChannel.postMessage({
      event,
      data,
      timestamp: Date.now(),
    });

    console.log("Broadcast Success:", event);
  } catch (err) {
    console.error("Broadcast Error:", err);

    // إعادة فتح لو قفل
    channel = null;
  }
};

// ================= استماع =================
export const listen = (callback) => {
  try {
    getChannel().onmessage = (msg) => {
      callback(msg.data);
    };
  } catch (err) {
    console.error("Listen Error:", err);
  }
};

// ================= إيقاف الاستماع فقط =================
export const stopListening = () => {
  if (channel) {
    channel.onmessage = null;
  }
};

// ================= غلق كامل =================
export const closeRealtime = () => {
  if (channel) {
    channel.close();
    channel = null;
  }
};