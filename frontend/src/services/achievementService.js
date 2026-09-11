import api from "./api";


export const getAllAchievements = async () => {
  const response = await api.get("/achievements");
  return response.data;
};


export const getMyAchievements = async () => {
  const response = await api.get("/achievements/my");
  return response.data;
};


export const getAchievementById = async (id) => {
  const response = await api.get(`/achievements/${id}`);
  return response.data;
};

export default {
  getAllAchievements,
  getMyAchievements,
  getAchievementById,
};
