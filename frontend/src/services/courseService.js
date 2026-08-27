import api from "./api";

export const isCourseEnrolled = (course, user) => {
  if (!course || !user) return false;
  const userIdStr = String(user._id || user.id || user).trim();
  if (!userIdStr) return false;

  return Boolean(
    course.enrolledStudents?.some((student) => {
      if (!student) return false;
      const studentIdStr = String(student._id || student.id || student).trim();
      return studentIdStr === userIdStr;
    })
  );
};

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

export const getMyEnrolledCourses = async () => {
  const response = await api.get("/courses/my-enrolled");
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

export const enrollInCourse = async (id) => {
  const response = await api.post(`/courses/${id}/enroll`);
  return response.data;
};

export const unenrollFromCourse = async (id) => {
  const response = await api.delete(`/courses/${id}/enroll`);
  return response.data;
};

export const getEnrolledStudents = async (id) => {
  const response = await api.get(`/courses/${id}/students`);
  return response.data;
};

export default {
  isCourseEnrolled,
  getAllCourses,
  getCourseById,
  getMyCourses,
  getMyEnrolledCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledStudents,
};
