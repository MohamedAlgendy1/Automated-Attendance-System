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

// ✅ جيب اسم الدكتور من الـ token
const getLecturerName = () => {
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token) || {};
  return (
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    decoded?.["name"] ||
    null
  );
};

// ✅ جيب كورسات الدكتور بس عن طريق فلترة lecturerName
export const getAllCourses = async () => {
  const res = await api.get("/course/AllCourses", {
    params: { pagenumber: 1, pagesize: 100 },
  });

  const data = res.data;
  let courses = [];
  if (Array.isArray(data)) courses = data;
  else if (Array.isArray(data?.items)) courses = data.items;
  else if (Array.isArray(data?.data)) courses = data.data;

  // فلتر بالاسم مؤقتاً لحد ما الـ Backend يتعدل
  const lecturerName = getLecturerName();
  if (lecturerName) {
    courses = courses.filter(
      (c) => c.lecturerName?.toLowerCase() === lecturerName.toLowerCase()
    );
  }

  return courses;
};

// ✅ جيب كورس واحد
export const getCourseById = async (id) => {
  const res = await api.get(`/course/GetOne/${id}`);
  return res.data;
};

// ✅ إنشاء كورس
export const createCourse = async (name, code) => {
  const res = await api.post("/course/Create", { name, code });
  return res.data;
};

// ✅ تعديل كورس
export const editCourse = async (id, courseCode, courseName) => {
  const res = await api.put(`/course/Edit/${id}`, { courseCode, courseName });
  return res.data;
};

// ✅ حذف كورس
export const deleteCourse = async (id) => {
  const res = await api.delete(`/course/Delete/${id}`);
  return res.data;
};