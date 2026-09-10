import api from "./api";

export const askAIQuestion = async (question) => {
  try {
    const response = await api.post("/ai", { question });
    return response.data;
  } catch (error) {
    console.error("Error asking AI:", error);
    throw error?.response?.data || new Error("Failed to get AI response.");
  }
};
