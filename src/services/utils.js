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

export const parseJwt = (token) => {
  try {
    if (!token) return null;

    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
};