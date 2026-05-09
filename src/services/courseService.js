// import api from "./api";

// // ================= GET ALL =================
// export const getAllCourses = async () => {
//   const res = await api.get("/course/AllCourses", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });

//   const data = res.data;

//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.items)) return data.items;
//   if (Array.isArray(data?.data)) return data.data;

//   return [];
// };

// // ================= GET BY ID =================
// export const getCourseById = async (id) => {
//   const res = await api.get(`/course/GetOne/${id}`);
//   return res.data;
// };

// // ================= CREATE =================
// export const createCourse = (name, code) =>
//   api.post("/course/Create", {
//     name,
//     code
//   });

// // ================= EDIT =================
// export const editCourse = async (id, data) => {
//   // data = { courseCode, courseName }
//   const res = await api.put(`/course/Edit/${id}`, data);
//   return res.data;
// };

// // ================= DELETE =================
// export const deleteCourse = async (id) => {
//   const res = await api.delete(`/course/Delete/${id}`);
//   return res.data;
// };

// import api from "./api";

// export const getAllCourses = async () => {
//   const res = await api.get("/course/AllCourses", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });
//   const data = res.data;
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.items)) return data.items;
//   if (Array.isArray(data?.data)) return data.data;
//   return [];
// };

// export const getCourseById = async (id) => {
//   const res = await api.get(`/course/GetOne/${id}`);
//   return res.data;
// };

// export const createCourse = async (name, code) => {
//   const res = await api.post("/course/Create", { name, code });
//   return res.data;
// };

// // ✅ بيستقبل (id, courseCode, courseName) بشكل صريح
// export const editCourse = async (id, courseCode, courseName) => {
//   const res = await api.put(`/course/Edit/${id}`, {
//     courseCode,
//     courseName,
//   });
//   return res.data;
// };

// export const deleteCourse = async (id) => {
//   const res = await api.delete(`/course/Delete/${id}`);
//   return res.data;
// };

import api, { parseJwt } from "./api";

// ✅ جيب الـ lecturerId (GUID) من الـ token
const getLecturerId = () => {
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token) || {};
  return decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
};

// ✅ جيب كورسات الدكتور بس
export const getAllCourses = async () => {
  const lecturerId = getLecturerId();

  const res = await api.get("/course/AllCourses", {
    params: {
      pagenumber: 1,
      pagesize: 100,
      ...(lecturerId ? { LecturerId: lecturerId } : {}),
    },
  });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// ✅ جيب كورس واحد
export const getCourseById = async (id) => {
  const res = await api.get(`/course/GetOne/${id}`);
  return res.data;
};

// ✅ إنشاء كورس مع إرسال الـ lecturerId كـ GUID string
export const createCourse = async (name, code) => {
  const lecturerId = getLecturerId();

  const res = await api.post("/course/Create", {
    name,
    code,
    lecturerId, // GUID string مش number
  });

  return res.data;
};

// ✅ تعديل كورس
export const editCourse = async (id, code, name) => {
  const res = await api.put(`/course/Edit/${id}`, {
    courseCode: code,
    courseName: name,
  });
  return res.data;
};

// ✅ حذف كورس
export const deleteCourse = async (id) => {
  const res = await api.delete(`/course/Delete/${id}`);
  return res.data;
};