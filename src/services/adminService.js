import api from "./api";

// ================= GET LECTURERS =================
export const getLecturers = async (filters = {}) => {
  const res = await api.get("/admin/GetLecturers", {
    params: {
      pagenumber: filters.pagenumber ?? 1,
      pagesize: filters.pagesize ?? 100,
      name: filters.name ?? "",
      sortBy: filters.sortBy ?? "id",
      isDescindeng: filters.isDescindeng ?? false,
    },
  });

  return res.data;
};

// ================= ADD LECTURER =================
export const addLecturer = async (data) => {
  const res = await api.post("/admin/AddLecturer", data);
  return res.data;
};

// ================= CLOSE ACCOUNT =================
export const closeAccount = async (id, userId) => {
  const res = await api.put(
    `/admin/CloseAccount/${id}?userid=${userId}`,
    {}
  );
  return res.data;
};