import api from "./api";

export const createBookmark = async (courseId, unitId, attachmentId) => {
  const response = await api.post("/bookmarks", {
    courseId,
    unitId,
    attachmentId,
  });
  return response.data;
};

export const deleteBookmark = async (bookmarkId) => {
  const response = await api.delete(`/bookmarks/${bookmarkId}`);
  return response.data;
};

export const getMyBookmarks = async () => {
  const response = await api.get("/bookmarks");
  return response.data;
};

export const getCourseBookmarks = async (courseId) => {
  const response = await api.get(`/bookmarks/course/${courseId}`);
  return response.data;
};

export default {
  createBookmark,
  deleteBookmark,
  getMyBookmarks,
  getCourseBookmarks,
};
