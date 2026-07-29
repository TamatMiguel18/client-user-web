import api from './api';

// OBTENER DISPOSITIVOS POR USUARIO
export const getDevicesByUser = async (userId) => {
  return await api.get(`/devices/user/${userId}`);
};

// REGISTRAR NUEVO DISPOSITIVO
export const registerDevice = async ({ name, description, userId, deviceId }) => {
  return await api.post('/devices/register', { name, description, userId, deviceId });
};
