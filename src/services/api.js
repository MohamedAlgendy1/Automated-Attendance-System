import axios from "axios";

const api = axios.create({
  baseURL: "http://attendtrack.runasp.net/api",
});

// ✅ Helper عشان تجيب الـ error message دايماً كـ string
export const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (!data) return "Something went wrong";
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.errors) return Object.values(data.errors).flat().join(" ");
  if (data.title) return data.title;
  return "Something went wrong";
};

export default api;