import api from "./api";

export const register = async (name, email, password, role, adminAccessToken) => {
  const payload = { name, email, password, role };
  if (adminAccessToken) {
    payload.adminAccessToken = adminAccessToken;
  }
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const sendResetPasswordOtp = async (email) => {
  const response = await api.post("/auth/send-reset-password-otp", { email });
  return response.data;
};

export const verifyResetPasswordOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-reset-password-otp", { email, otp });
  return response.data;
};

export const changePassword = async (email, inputOtp, newPassword) => {
  const response = await api.post("/auth/change-password", {
    email,
    inputOtp,
    newPassword,
  });
  return response.data;
};

export const verify2FA = async (email, otp) => {
  const response = await api.post("/auth/verify-2fa", { email, otp });
  return response.data;
};

export const resend2FA = async (email) => {
  const response = await api.post("/auth/resend-2fa", { email });
  return response.data;
};

export const update2FA = async (enabled) => {
  const response = await api.put("/auth/2fa", { enabled });
  return response.data;
};

