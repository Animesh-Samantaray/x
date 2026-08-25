import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/category", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/category/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/category/${id}`);
  return response.data;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
