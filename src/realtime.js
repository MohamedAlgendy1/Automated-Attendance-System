const channel = new BroadcastChannel("qr-attend-channel");

export const EVENTS = {
  ATTENDANCE_RECORDED: "ATTENDANCE_RECORDED",
  LECTURE_ADDED: "LECTURE_ADDED",
  LECTURE_DELETED: "LECTURE_DELETED",
  COURSE_ADDED: "COURSE_ADDED",
  COURSE_DELETED: "COURSE_DELETED",
  STUDENT_ENROLLED: "STUDENT_ENROLLED",
};

export const broadcast = (event, data) => {
  channel.postMessage({ event, data, timestamp: Date.now() });
};

export const listen = (callback) => {
  channel.onmessage = (event) => {
    callback(event.data);
  };
};

export const stopListening = () => {
  channel.close();
};