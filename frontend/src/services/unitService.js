import api from "./api";

// Get all units for a course
export const getUnitsByCourse = async (courseId) => {
  const response = await api.get(`/units/course/${courseId}`);
  return response.data;
};

// Get single unit by ID
export const getUnitById = async (unitId) => {
  const response = await api.get(`/units/${unitId}`);
  return response.data;
};

// Create a new unit (formData can be FormData or regular object)
export const createUnit = async (data) => {
  const response = await api.post("/units", data);
  return response.data;
};

// Update an existing unit (formData can be FormData or regular object)
export const updateUnit = async (unitId, data) => {
  const response = await api.put(`/units/${unitId}`, data);
  return response.data;
};

// Delete a unit by ID
export const deleteUnit = async (unitId) => {
  const response = await api.delete(`/units/${unitId}`);
  return response.data;
};

export default {
  getUnitsByCourse,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};
