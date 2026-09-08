import api from "./api";

export const createReport = async (reportData) => {
  const response = await api.post("/reports", reportData);
  return response.data;
};

export const getMyReports = async (page = 1, limit = 10) => {
  const response = await api.get("/reports/my", {
    params: { page, limit },
  });
  return response.data;
};

export const getAllReportsAdmin = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data;
};

export const getReportByIdAdmin = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const updateReportStatusAdmin = async (id, status, adminNote) => {
  const response = await api.put(`/reports/${id}/status`, {
    status,
    adminNote,
  });
  return response.data;
};

export const takeModerationActionAdmin = async (id, action, adminNote) => {
  const response = await api.put(`/reports/${id}/action`, {
    action,
    adminNote,
  });
  return response.data;
};

export default {
  createReport,
  getMyReports,
  getAllReportsAdmin,
  getReportByIdAdmin,
  updateReportStatusAdmin,
  takeModerationActionAdmin,
};
