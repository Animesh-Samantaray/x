import api from "./api";

export const getAdminProfile = async () => {
  const response = await api.get("/admin/profile");
  return response.data;
};

export const updateAdminProfile = async (data) => {
  const response = await api.put("/admin/profile", data);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};
