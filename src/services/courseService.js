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
//   const all = Array.isArray(data) ? data
//     : Array.isArray(data?.items) ? data.items
//     : Array.isArray(data?.data) ? data.data
//     : [];

//   console.log("COURSE SAMPLE:", all[0]); // 👈
//   return all;
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


import api from "./api";

// ✅ جيب كورسات الدكتور بس من الـ endpoint الجديد
export const getAllCourses = async () => {
  const res = await api.get("/lecturer/MyCourses", {
    params: { pagenumber: 1, pagesize: 100 },
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