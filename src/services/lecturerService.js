import api from "./api";

// ---------------- ATTENDANCE REPORT ----------------
export const getAttendanceReport = async (courseId) => {
  const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
  return res.data;
};
// ---------------- COURSE OVERVIEW ----------------
export const getCourseOverview = (courseId) =>
  api.get(`/lecturer/CourseOverview/${courseId}`);

// ---------------- GENERATE QR ----------------
export const generateQR = (data = {}) =>
  api.post("/lecturer/GenerateQR", {
    expiresAt: data.expiresAt,
    courseLectureId: data.courseLectureId,
  });


// import api from "./api";

// export const getLecturesByCourse = async (courseId) => {
//   const res = await api.get("/courselecture/AllCourseLectures", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });
//   const data = res.data;
//   const all = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//   return all.filter((l) => l.courseId === parseInt(courseId));
// };

// export const createLecture = async (title, startTime, endTime, courseId, classRoomId) => {
//   const res = await api.post("/courselecture/Create", {
//     title,
//     startTime,
//     endTime,
//     courseId: parseInt(courseId),
//     classRoomId: parseInt(classRoomId),
//   });
//   return res.data;
// };

// export const editLecture = async (id, title, startTime, endTime, courseId, classRoomId) => {
//   const res = await api.put(`/courselecture/Edit/${id}`, {
//     title,
//     startTime,
//     endTime,
//     courseId: parseInt(courseId),
//     classRoomId: parseInt(classRoomId),
//   });
//   return res.data;
// };

// export const deleteLecture = async (id) => {
//   const res = await api.delete(`/courselecture/Delete/${id}`);
//   return res.data;
// };

// export const generateQR = async (courseLectureId) => {
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
//   const res = await api.post("/lecturer/GenerateQR", {
//     expiresAt,
//     courseLectureId: parseInt(courseLectureId),
//   });
//   return res.data;
// };

// export const getAttendanceReport = async (courseId) => {
//   const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
//   return res.data;
// };

// export const getCourseOverview = async (courseId) => {
//   const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
//   return res.data;
// };

// import api from "./api";

// // ---------------- GET COURSE BY ID ----------------
// export const getCourseById = (id) =>
//   api.get(`/course/GetOne/${id}`).then(res => res.data);

// // ---------------- GET ALL COURSES ----------------
// export const getAllCourses = () =>
//   api.get("/course/AllCourses").then(res => res.data);

// // ---------------- GET LECTURES BY COURSE ----------------
// export const getLecturesByCourse = (courseId) =>
//   api.get("/courselecture/AllCourseLectures", {
//     params: {
//       courseId: courseId,
//       pagenumber: 1,
//       pagesize: 100,
//     },
//   }).then(res => res.data);

// // ---------------- CREATE LECTURE ----------------
// export const createLecture = (title, startTime, endTime, courseId, classRoomId) =>
//   api.post("/courselecture/Create", {
//     title,
//     startTime,
//     endTime,
//     courseId,
//     classRoomId,
//   }).then(res => res.data);

// // ---------------- EDIT LECTURE ----------------
// export const editLecture = (id, title, startTime, endTime, courseId, classRoomId) =>
//   api.put(`/courselecture/Edit/${id}`, {
//     title,
//     startTime,
//     endTime,
//     courseId,
//     classRoomId,
//   }).then(res => res.data);

// // ---------------- DELETE LECTURE ----------------
// export const deleteLecture = (id) =>
//   api.delete(`/courselecture/Delete/${id}`).then(res => res.data);

// // ---------------- GENERATE QR ----------------
// export const generateQR = (lectureId) =>
//   api.post("/lecturer/GenerateQR", {
//     courseLectureId: lectureId,
//     expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
//   }).then(res => res.data);

// // ---------------- ATTENDANCE REPORT ----------------
// export const getAttendanceReport = (courseId) =>
//   api.get(`/attendance/GetCourseAttendance/${courseId}`).then(res => res.data);

