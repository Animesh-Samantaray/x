import api from "./api";

export const getResources = async () => {
  const response = await api.get("/resource");
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resource/${id}`);
  return response.data;
};

export const getMyResources = async () => {
  const response = await api.get("/resource/my");
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post("/resource", data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`/resource/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resource/${id}`);
  return response.data;
};

export const publishResource = async (id) => {
  const response = await api.patch(`/resource/${id}/publish`);
  return response.data;
};

export const archiveResource = async (id) => {
  const response = await api.patch(`/resource/${id}/archive`);
  return response.data;
};

export const getAllResourcesAdmin = async () => {
  const response = await api.get("/resource/admin/all");
  return response.data;
};

export default {
  getResources,
  getResourceById,
  getMyResources,
  createResource,
  updateResource,
  deleteResource,
  publishResource,
  archiveResource,
  getAllResourcesAdmin,
};
