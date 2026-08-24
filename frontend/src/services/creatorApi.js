import api from "./api";

export const getCreatorProfile = async () => {
  const response = await api.get("/creator/profile");
  return response.data;
};

export const updateCreatorProfile = async (data) => {
  const response = await api.put("/creator/profile", data);
  return response.data;
};

export const deleteCreatorProfile = async () => {
  const response = await api.delete("/creator/profile");
  return response.data;
};

export const getAllCreators = async () => {
  const response = await api.get("/creator");
  return response.data;
};

export const getCreatorById = async (id) => {
  const response = await api.get(`/creator/${id}`);
  return response.data;
};
