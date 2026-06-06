import api from '../../../shared/api/api';

export const getFieldsByUser = async (userId) => {
  return await api.get(`/fields/user/${userId}`);
};

export const createField = async (data) => {
  return await api.post('/fields/', data);
};

export const updateField = async (id, data) => {
  return await api.put(`/fields/${id}`, data);
};

export const deactivateField = async (id) => {
  return await api.put(`/fields/deactivate/${id}`);
};

export const activateField = async (id) => {
  return await api.put(`/fields/activate/${id}`);
};
