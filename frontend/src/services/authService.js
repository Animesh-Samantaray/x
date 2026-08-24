import * as authApi from "./authApi.js";

export const register = authApi.register;
export const login = authApi.login;
export const getMe = authApi.getMe;
export const logout = authApi.logout;
export const sendResetPasswordOtp = authApi.sendResetPasswordOtp;
export const verifyResetPasswordOtp = authApi.verifyResetPasswordOtp;
export const changePassword = authApi.changePassword;

export default {
  register,
  login,
  getMe,
  logout,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  changePassword,
};
