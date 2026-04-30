import axios from "axios";

const api = axios.create({
  baseURL: "http://attendtrack.runasp.net/api",
});

// ✅ Token interceptor (بدون Bearer)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // 👈 مهم

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});
// ================= JWT HELPERS =================
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ]?.toLowerCase() || null;
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ] || null;
};

export const getEmailFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
  ] || null;
};

// ✅ Error handler
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