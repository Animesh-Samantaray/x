import api from "./api";

// Get progress for a specific course (enrolled learner)
export const getCourseProgress = async (courseId) => {
  const response = await api.get(`/progress/course/${courseId}`);
  return response.data;
};

// Get overall learning progress for current learner
export const getMyProgress = async () => {
  const response = await api.get("/progress/my");
  return response.data;
};

// Mark a unit as completed
export const completeUnit = async (courseId, unitId) => {
  const response = await api.post(`/progress/course/${courseId}/unit/${unitId}/complete`);
  return response.data;
};

// Mark a unit as incomplete
export const uncompleteUnit = async (courseId, unitId) => {
  const response = await api.delete(`/progress/course/${courseId}/unit/${unitId}/complete`);
  return response.data;
};

export default {
  getCourseProgress,
  getMyProgress,
  completeUnit,
  uncompleteUnit,
};
