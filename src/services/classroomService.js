import api from "./api";

// Get all classrooms
export const getClassrooms = async (
  pagenumber = 1,
  pagesize = 50,
  Name = "",
  BuildingName = ""
) => {
  const res = await api.get("/classroom/AllClassRoom", {
    params: {
      pagenumber,
      pagesize,
      Name,
      BuildingName,
      SortBy: "id",
      IsDescindeng: false,
    },
  });

  return res.data;
};

// Add classroom
export const addClassroom = async (data) => {
  const res = await api.post("/classroom/CreateClassRoom", data);
  return res.data;
};

// Delete classroom
export const deleteClassroomApi = async (id) => {
  const res = await api.delete(`/classroom/Delete/${id}`);
  return res.data;
};

// Edit classroom
export const editClassroom = async (id, data) => {
  const res = await api.put(`/classroom/Edit/${id}`, data);
  return res.data;
};