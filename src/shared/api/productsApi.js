import api from './api';

// GET ALL ACTIVE PRODUCTS
export const getProducts = async () => {
  return await api.get('/products');
};

// GET ACTIVE PRODUCTS BY TYPE (device / fertilizer)
export const getProductsByType = async (productType) => {
  return await api.get(`/products/type/${productType}`);
};
