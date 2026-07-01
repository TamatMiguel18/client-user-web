/**
 * @module ProductsList
 * @description Transformación de la vista de tienda a un aspecto de "Terminal E-Commerce Holográfico", 
 * implementando filtros tipo tabs iluminados y sombras de profundidad extrema.
 */
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getProducts, addToCart } from '../../../shared/api';
import { ProductCard } from './ProductCard';
import { Loader } from '../../../shared/components/ui/Loader';
import { Search, ShoppingBag, AlertCircle, ShoppingCart } from 'lucide-react';
import { Input } from '../../../shared/components/ui/Input';
import { useAuthStore } from '../../auth/store/authStore';

export const ProductsList = () => {
  const { user } = useAuthStore();
  const { refreshCart } = useOutletContext() || {};
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'device', 'fertilizer'

  const fetchProductsList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      if (response && response.success) {
        setProducts(response.data || []);
      } else {
        setError('No se pudo cargar la lista de productos.');
      }
    } catch (err) {
      setError(err.message || 'Error al obtener los productos del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleAddToCart = async (product) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    
    try {
      const result = await addToCart({
        userId: String(userId),
        productId: product._id || product.id,
        quantity: 1
      });
      
      if (result && result.success) {
        // Trigger UserLayout to refresh its cart items counter
        if (refreshCart) {
          await refreshCart();
        }
      } else {
        throw new Error(result.message || 'Error al agregar al carrito');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error de red al agregar el producto.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || product.productType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-3xl text-center max-w-lg mx-auto mt-20 backdrop-blur-xl">
        <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
        <p className="font-bold">{error}</p>
        <button 
          onClick={fetchProductsList}
          className="mt-4 bg-rose-500/20 px-6 py-2 rounded-full font-bold hover:bg-rose-500/30 transition-colors"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-white p-4 sm:p-8 rounded-[3rem] relative overflow-hidden font-sans border border-white/5 shadow-2xl animate-fadeIn">
      {/* Sci-Fi Global Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* Header HUD */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px]">
              <div className="w-full h-full bg-[#090D17] rounded-[1.4rem] flex items-center justify-center">
                <ShoppingCart className="text-cyan-400" size={28} />
              </div>
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 rounded-full" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Terminal de Suministros
              </h2>
              <p className="text-[11px] text-cyan-400/80 font-bold tracking-widest uppercase mt-1">
                Equipamiento y Mejoras Agrícolas
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Filter Tabs Glassmorphism */}
            <div className="flex border border-white/10 p-1 bg-[#090D17]/80 backdrop-blur-md rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setTypeFilter('all')}
                className={`flex-1 sm:px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  typeFilter === 'all'
                    ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setTypeFilter('device')}
                className={`flex-1 sm:px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  typeFilter === 'device'
                    ? 'bg-blue-500 text-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Hardware
              </button>
              <button
                onClick={() => setTypeFilter('fertilizer')}
                className={`flex-1 sm:px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  typeFilter === 'fertilizer'
                    ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Bio-Químicos
              </button>
            </div>
            
            {/* Search Input HUD */}
            <div className="relative w-full sm:w-64 group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-[#090D17]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                <div className="pl-5">
                  <Search size={18} className="text-cyan-500" />
                </div>
                <Input 
                  type="text"
                  placeholder="ID de Suministro..."
                  className="w-full bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:ring-0 py-4 pl-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32 relative bg-[#121827]/40 backdrop-blur-md rounded-[3rem] border border-white/5">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none rounded-[3rem]" />
             <div className="relative z-10">
               <ShoppingBag size={64} className="mx-auto text-slate-700 mb-6" />
               <h3 className="text-3xl font-black text-slate-200 mb-2">Inventario Vacío</h3>
               <p className="text-slate-400 font-medium">No hay suministros disponibles con los parámetros actuales.</p>
             </div>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
