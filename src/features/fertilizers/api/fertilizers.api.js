import api from '../../../shared/api/api';

export const getFertilizers = async () => {
  return await api.get('/fertilizers/');
};

export const getFertilizerById = async (id) => {
  return await api.get(`/fertilizers/${id}`);
};
