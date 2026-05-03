import api from "./api";

export const getMyCourses = async () => {
  const res = await api.get("/student/MyCourses");
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

// export const enrollInCourse = async (courseId, courseCode) => {
//   const res = await api.post("/student/Enrollment", {
//     courseId: courseId ? parseInt(courseId) : undefined,
//     courseCode,
//   });
//   return res.data;
// };

export const enrollInCourse = async (courseId, courseCode) => {
  const res = await api.post("/Student/Enrollment", {
    courseId: 9,
  courseCode: "1"
  });

  return res.data;
};


export const getMyAttendanceHistory = async () => {
  const res = await api.get("/student/MyAttendanceHistory");
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export const scanQR = async (token, lat, lng) => {
  const res = await api.post("/student/ScanQr", {
    token,
    studentLatitude: lat || 0,
    studentLongitude: lng || 0,
  });
  return res.data;
};