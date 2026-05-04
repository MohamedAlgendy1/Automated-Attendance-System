import api from "./api";


// ---------------- COURSE OVERVIEW ----------------
export const getCourseOverview = async (courseId) => {
  const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
  return res.data;
};

// ---------------- GENERATE QR ----------------
export const generateQR = (data = {}) =>
  api.post("/lecturer/GenerateQR", {
    expiresAt: data.expiresAt,
    courseLectureId: data.courseLectureId,
  });

