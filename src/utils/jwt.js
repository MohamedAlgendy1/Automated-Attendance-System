export const parseJwt = (token) => {
  try {
    if (!token) return null;

    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};