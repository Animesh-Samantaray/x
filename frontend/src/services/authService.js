import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const register = async (name, email, password, role, adminAccessToken) => {
  const payload = { name, email, password, role };
  if (adminAccessToken) {
    payload.adminAccessToken = adminAccessToken;
  }
  const response = await API.post("/auth/register", payload);
  return response.data;
};

export const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export default {
  register,
  login,
  getMe,
  logout,
};
