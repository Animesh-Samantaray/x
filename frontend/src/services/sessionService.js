import api from "./api";

export const getAllSessions = async () => {
  const response = await api.get("/session");
  return response.data;
};

export const getMySessions = async () => {
  const response = await api.get("/session/my-sessions");
  return response.data;
};

export const getSessionById = async (id) => {
  const response = await api.get(`/session/${id}`);
  return response.data;
};

export const createSession = async (data) => {
  const response = await api.post("/session", data);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await api.put(`/session/${id}`, data);
  return response.data;
};

export const requestSession = async (id) => {
  const response = await api.post(`/session/${id}/request`);
  return response.data;
};

export const acceptLearner = async (sessionId, learnerId) => {
  const response = await api.put(`/session/${sessionId}/learners/${learnerId}/accept`);
  return response.data;
};

export const rejectLearner = async (sessionId, learnerId) => {
  const response = await api.put(`/session/${sessionId}/learners/${learnerId}/reject`);
  return response.data;
};

export const cancelSession = async (id) => {
  const response = await api.put(`/session/${id}/cancel`);
  return response.data;
};

export const completeSession = async (id) => {
  const response = await api.put(`/session/${id}/complete`);
  return response.data;
};

export default {
  getAllSessions,
  getMySessions,
  getSessionById,
  createSession,
  updateSession,
  requestSession,
  acceptLearner,
  rejectLearner,
  cancelSession,
  completeSession,
};
