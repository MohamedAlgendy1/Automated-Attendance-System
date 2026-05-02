import api from "./api";

export const getLecturers = (data = {}) =>
  api.get("/admin/GetLecturers", {
    params: {
      pagenumber: data.pagenumber || 1,
      pagesize: data.pagesize || 100,
      name: data.name || "",
      sortBy: data.sortBy || "",
      isDescindeng: data.isDescindeng ?? true,
    },
  });

export const addLecturer = (data) =>
  api.post("/admin/AddLecturer", {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  });

export const closeAccount = (id) =>
  api.put(`/admin/CloseAccount/${id}`);

export const getSystemDashboard = () =>
  api.get("/admin/SystemDashboard");

