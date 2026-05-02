// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://attendtrack.runasp.net/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ================= REQUEST INTERCEPTOR =================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ================= RESPONSE INTERCEPTOR =================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("isLoggedIn");

//       window.location.href = "/";
//     }

//     return Promise.reject(error);
//   }
// );

// // ================= ERROR HANDLER =================
// export const getErrorMessage = (err) => {
//   const data = err.response?.data;

//   if (!data) return "Network error";

//   if (typeof data === "string") return data;

//   if (data.message) return data.message;

//   if (data.title) return data.title;

//   if (data.errors) {
//     return Object.values(data.errors).flat().join(" ");
//   }

//   return "Unexpected error occurred";
// };

// // ================= JWT PARSER =================
// export const parseJwt = (token) => {
//   try {
//     if (!token) return null;

//     const base64Payload = token.split(".")[1];
//     return JSON.parse(atob(base64Payload));
//   } catch  {
//     return null;
//   }
// };

// export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://attendtrack.runasp.net/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ================= REQUEST INTERCEPTOR =================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ================= RESPONSE INTERCEPTOR =================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("isLoggedIn");

//       window.location.href = "/";
//     }

//     return Promise.reject(error);
//   }
// );

// // ================= ERROR HANDLER =================
// export const getErrorMessage = (err) => {
//   const data = err.response?.data;

//   if (!data) return "Network error";

//   if (typeof data === "string") return data;

//   if (data.message) return data.message;

//   if (data.title) return data.title;

//   if (data.errors) {
//     return Object.values(data.errors).flat().join(" ");
//   }

//   return "Unexpected error occurred";
// };

// // ================= JWT PARSER =================
// export const parseJwt = (token) => {
//   try {
//     if (!token) return null;

//     const base64Payload = token.split(".")[1];
//     return JSON.parse(atob(base64Payload));
//   } catch {
//   return null;
// }
// };

// // ================= GET USER ID FROM TOKEN =================
// export const getUserIdFromToken = () => {
//   const token = localStorage.getItem("token");

//   if (!token) return null;

//   const payload = parseJwt(token);

//   if (!payload) return null;

//   return (
//     payload.userId ||
//     payload.userid ||
//     payload.id ||
//     payload.sub ||
//     payload[
//       "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//     ] ||
//     null
//   );
// };

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: "http://attendtrack.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

// ================= ERROR HANDLER =================
export const getErrorMessage = (err) => {
  const data = err.response?.data;

  if (!data) return "Network error";

  if (typeof data === "string") return data;

  if (data.message) return data.message;

  if (data.title) return data.title;

  if (data.errors) {
    return Object.values(data.errors).flat().join(" ");
  }

  return "Unexpected error occurred";
};

// ================= JWT PARSER =================
export const parseJwt = (token) => {
  try {
    if (!token) return null;

    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
};

// ================= GET USER ID =================
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = parseJwt(token);
  if (!payload) return null;

  return (
    payload.nameid || // .NET
    payload.sub ||    // standard JWT
    payload.id ||
    payload.userId ||
    null
  );
};

// ================= GET FULL TOKEN DATA =================
export const getTokenData = () => {
  const token = localStorage.getItem("token");
  return parseJwt(token);
};

export default api;