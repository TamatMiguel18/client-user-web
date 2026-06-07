import api from '../../../shared/api/api';

export const getAlerts = async () => {
  return await api.get('/alerts/');
};
