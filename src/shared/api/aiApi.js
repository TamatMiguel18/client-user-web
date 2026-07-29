import api from './api';

export const sendChatMessage = async (message, chatId, userId) => {
  try {
    const response = await api.post('/ai-assistant/chat', { message, chatId, userId });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getChatHistory = async (userId) => {
  try {
    const response = await api.get(`/ai-assistant/chats?userId=${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getChatById = async (chatId, userId) => {
  try {
    const response = await api.get(`/ai-assistant/chats/${chatId}/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
