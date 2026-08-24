import api from "./api";

export const getLearnerProfile = async () => {
  const response = await api.get("/learner/profile");
  return response.data;
};

export const updateLearnerProfile = async (data) => {
  const response = await api.put("/learner/profile", data);
  return response.data;
};

export const deleteLearnerProfile = async () => {
  const response = await api.delete("/learner/profile");
  return response.data;
};

export const getAllLearners = async () => {
  const response = await api.get("/learner");
  return response.data;
};

export const getLearnerById = async (id) => {
  const response = await api.get(`/learner/${id}`);
  return response.data;
};
