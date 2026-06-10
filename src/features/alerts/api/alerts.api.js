import api from '../../../shared/api/api';

export const getAlertsByUser = async (userId) => {
  return await api.get(`/alerts/user/${userId}`);
};
