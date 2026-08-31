import api from "./api";

export const getCourseReviews = async (courseId) => {
  const response = await api.get(`/reviews/course/${courseId}`);
  return response.data;
};


export const getMyCourseReview = async (courseId) => {
  const response = await api.get(`/reviews/course/${courseId}/my`);
  return response.data;
};


export const createReview = async (courseId, { rating, comment }) => {
  const response = await api.post(`/reviews/course/${courseId}`, {
    rating,
    comment,
  });
  return response.data;
};

export const updateReview = async (reviewId, { rating, comment }) => {
  const response = await api.put(`/reviews/${reviewId}`, {
    rating,
    comment,
  });
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export default {
  getCourseReviews,
  getMyCourseReview,
  createReview,
  updateReview,
  deleteReview,
};
