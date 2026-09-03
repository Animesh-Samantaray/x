import api from "./api";

export const getMyConversations = async () => {
  const response = await api.get("/conversation/");
  return response.data;
};

export const getCourseConversation = async (courseId) => {
  const response = await api.get(`/conversation/course/${courseId}`);
  return response.data;
};

export const getSessionConversation = async (sessionId) => {
  const response = await api.get(`/conversation/session/${sessionId}`);
  return response.data;
};

export const createCourseConversation = async (courseId) => {
  const response = await api.post(`/conversation/course/${courseId}`);
  return response.data;
};

export const createSessionConversation = async (sessionId) => {
  const response = await api.post(`/conversation/session/${sessionId}`);
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await api.get(`/message/${conversationId}`);
  return response.data;
};

export const sendMessage = async (conversationId, message, file) => {
  const formData = new FormData();
  if (message) {
    formData.append("message", message);
  }
  if (file) {
    formData.append("file", file);
  }

  const response = await api.post(`/message/${conversationId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const markMessageAsRead = async (messageId) => {
  const response = await api.patch(`/message/${messageId}/read`);
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/message/${messageId}`);
  return response.data;
};

export const reactToMessage = async (messageId, emoji) => {
  const response = await api.patch(`/message/${messageId}/reaction`, { emoji });
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/conversation/${conversationId}`);
  return response.data;
};

export default {
  getMyConversations,
  getCourseConversation,
  getSessionConversation,
  createCourseConversation,
  createSessionConversation,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  reactToMessage,
  deleteConversation,
};
