import api from '../../../shared/api/api';

export const calculateRecommendation = async (data) => {
  return await api.post('/fertility/calculate', data);
};
