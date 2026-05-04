import api from "./api";


export const getMyCourses = async () => {
  const res = await api.get("/student/MyCourses");
  const data = res.data;

  //console.log("RAW DATA:", data); // 👈 مهم للتأكد

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.courses)) return data.courses; // ✅ الصح
  return [];
};


export const enrollInCourse = async (courseCode) => {
  const res = await api.post(
    "/student/Enrollment",
    { courseCode },
    {
      headers: {
        Accept: "application/octet-stream", // 👈 مهم جدًا
      },
    }
  );
  return res.data;
};

// export const getMyAttendanceHistory = async () => {
//   const res = await api.get("/student/MyAttendanceHistory");
//   const data = res.data;
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.items)) return data.items;
//   return [];
// };

export const getMyAttendanceHistory = async () => {
  const res = await api.get("/student/MyAttendanceHistory");
  const data = res.data;

  // 👇 الحل هنا
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.history)) return data.history;

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