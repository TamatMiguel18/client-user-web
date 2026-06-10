import api from './api';

// CREATE ORDER FROM CART
export const createOrder = async ({ userId, shippingAddress }) => {
  return await api.post('/orders', { userId, shippingAddress });
};
