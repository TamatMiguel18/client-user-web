import api from '../../../shared/api/api';

export const calculateRecommendation = async (data) => {
  return await api.post('/fertility/calculate', data);
};

export const calculateAIRecommendation = async (data) => {
  return await api.post('/fertility/calculate-ai', data);
};
