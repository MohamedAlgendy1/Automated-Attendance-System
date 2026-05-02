import api from "./api";

// ---------------- GET ONE ----------------
export const getClassroom = (id) =>
  api.get(`/classroom/GetOne/${id}`);

// ---------------- GET ALL ----------------
export const getAllClassrooms = (params = {}) =>
  api.get("/classroom/AllClassRoom", { params });

// ---------------- CREATE ----------------
export const createClassroom = (data = {}) =>
  api.post("/classroom/CreateClassRoom", {
    name: data.name,
    buildingName: data.buildingName ?? data.building,
    latitude: Number(data.latitude ?? data.lat),
    longitude: Number(data.longitude ?? data.lng),
    radiusOfAcceptanceMeter: Number(
      data.radiusOfAcceptanceMeter ?? data.radius
    ),
  });

// ---------------- EDIT ----------------
export const editClassroom = (id, data = {}) =>
  api.put(`/classroom/Edit/${id}`, {
    name: data.name,
    buildingName: data.buildingName ?? data.building,
    latitude: Number(data.latitude ?? data.lat),
    longitude: Number(data.longitude ?? data.lng),
    radiusOfAcceptanceMeter: Number(
      data.radiusOfAcceptanceMeter ?? data.radius
    ),
  });

// ---------------- DELETE ----------------
export const deleteClassroom = (id) =>
  api.delete(`/classroom/Delete/${id}`);