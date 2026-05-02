import api from "./api";

// ================= GET ALL =================
export const getAllCourses = async () => {
  const res = await api.get("/course/AllCourses", {
    params: { pagenumber: 1, pagesize: 100 },
  });

  const data = res.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

// ================= GET BY ID =================
export const getCourseById = async (id) => {
  const res = await api.get(`/course/GetOne/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createCourse = async (data) => {
  // data = { name, code, lecturerId }
  const res = await api.post("/course/Create", data);
  return res.data;
};

// ================= EDIT =================
export const editCourse = async (id, data) => {
  // data = { courseCode, courseName }
  const res = await api.put(`/course/Edit/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteCourse = async (id) => {
  const res = await api.delete(`/course/Delete/${id}`);
  return res.data;
};