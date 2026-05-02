import api from "./api";

export const register = (data) =>
  api.post("/account/Register", data);

export const login = (data) =>
  api.post("/account/Login", data);

export const confirmEmail = (email, code) =>
  api.post("/account/Confirmation", {
    email,
    code,
  });

export const forgetPassword = (email) =>
  api.post("/account/ForgetPassword", {
    email,
  });

export const resetPassword = (data) =>
  api.post("/account/ResetPassword", data);

export const resendConfirmation = (email) =>
  api.post("/account/ResendConfirmationEmail", {
    email,
  });

