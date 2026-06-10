import api from './api';

// GET USER CART
export const getCart = async (userId) => {
  return await api.get(`/cart/${userId}`);
};

// ADD PRODUCT TO CART
export const addToCart = async ({ userId, productId, quantity }) => {
  return await api.post('/cart/add', { userId, productId, quantity });
};

// UPDATE ITEM QUANTITY IN CART
export const updateCartItem = async ({ userId, productId, quantity }) => {
  return await api.put('/cart/update', { userId, productId, quantity });
};

// REMOVE ITEM FROM CART
export const removeFromCart = async (userId, productId) => {
  return await api.delete(`/cart/remove/${userId}/${productId}`);
};

// CLEAR CART
export const clearCart = async (userId) => {
  return await api.delete(`/cart/clear/${userId}`);
};
