import * as authApi from "./authApi.js";

export const register = authApi.register;
export const login = authApi.login;
export const getMe = authApi.getMe;
export const logout = authApi.logout;
export const sendResetPasswordOtp = authApi.sendResetPasswordOtp;
export const verifyResetPasswordOtp = authApi.verifyResetPasswordOtp;
export const changePassword = authApi.changePassword;
export const verify2FA = authApi.verify2FA;
export const resend2FA = authApi.resend2FA;
export const update2FA = authApi.update2FA;

export default {
  register,
  login,
  getMe,
  logout,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  changePassword,
  verify2FA,
  resend2FA,
  update2FA,
};

