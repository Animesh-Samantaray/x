import api from "./api";

export const getExpertProfile = async () => {
  const response = await api.get("/expert/profile");
  return response.data;
};

export const updateExpertProfile = async (data) => {
  const response = await api.put("/expert/profile", data);
  return response.data;
};

export const deleteExpertProfile = async () => {
  const response = await api.delete("/expert/profile");
  return response.data;
};

export const getAllExperts = async () => {
  const response = await api.get("/expert");
  return response.data;
};

export const getExpertById = async (id) => {
  const response = await api.get(`/expert/${id}`);
  return response.data;
};
