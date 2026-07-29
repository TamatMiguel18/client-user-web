import api from '../../../shared/api/api';

export const getCrops = async () => {
  return await api.get('/cultivos/');
};

export const getCropByName = async (nombreCultivo) => {
  return await api.get(`/cultivos/${encodeURIComponent(nombreCultivo)}`);
};
