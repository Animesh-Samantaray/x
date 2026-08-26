import api from "./api";

export const getAllCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const getMyCourses = async () => {
  const response = await api.get("/courses/my-courses");
  return response.data;
};

export const createCourse = async (data) => {
  const response = await api.post("/courses", data);
  return response.data;
};

export const updateCourse = async (id, data) => {
  const response = await api.put(`/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

export const getEnrolledStudents = async (id) => {
  const response = await api.get(`/courses/${id}/students`);
  return response.data;
};

export default {
  getAllCourses,
  getCourseById,
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getEnrolledStudents,
};
