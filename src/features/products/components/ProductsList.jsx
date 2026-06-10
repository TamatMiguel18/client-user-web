import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getProducts, addToCart } from '../../../shared/api';
import { ProductCard } from './ProductCard';
import { Loader } from '../../../shared/components/ui/Loader';
import { Search, ShoppingBag, AlertCircle } from 'lucide-react';
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
      <div className="max-w-md mx-auto bg-slate-900/60 backdrop-blur-md border border-rose-500/20 text-slate-200 p-8 rounded-3xl text-center shadow-xl my-10">
        <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
        <p className="font-semibold text-lg text-rose-400 mb-2">Error de Carga</p>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <button 
          onClick={fetchProductsList}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-2.5 rounded-xl transition-all duration-300"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Catálogo de Productos</h2>
          <p className="text-slate-400 mt-1.5 text-sm">Explora y adquiere dispositivos y fertilizantes para potenciar tus parcelas.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <Input 
            type="text"
            placeholder="Buscar productos..."
            className="pl-11 py-3 bg-slate-950 border-slate-800 focus:border-emerald-500/50 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-white/5 p-1 bg-slate-950/60 rounded-xl max-w-md gap-1">
        <button
          onClick={() => setTypeFilter('all')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
            typeFilter === 'all'
              ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setTypeFilter('device')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
            typeFilter === 'device'
              ? 'bg-blue-500 text-slate-900 shadow-md shadow-blue-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Dispositivos
        </button>
        <button
          onClick={() => setTypeFilter('fertilizer')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
            typeFilter === 'fertilizer'
              ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Fertilizantes
        </button>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 rounded-[2rem] border border-dashed border-slate-800">
          <ShoppingBag size={54} className="mx-auto text-slate-700 mb-4 stroke-1" />
          <p className="text-slate-400 font-semibold text-lg">No hay productos en esta categoría</p>
          <p className="text-sm text-slate-500 mt-1">Prueba a buscar con otro término o cambia el filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
};
