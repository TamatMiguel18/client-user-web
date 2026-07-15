/**
 * @module ProductCard
 * @description Rediseño premium E-commerce con insignias flotantes, imágenes asimétricas interactivas, 
 * y botones de acción con barra de escaneo dinámica animada (scale-x).
 */
import React, { useState } from 'react';
import { ShoppingCart, Check, Box } from 'lucide-react';

export const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { name, description, price, stock, productType, image, isActive } = product;

  const handleAddClick = async () => {
    if (stock <= 0) return;
    setIsAdding(true);
    try {
      await onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = stock <= 0;
  const isDevice = productType === 'device';
  
  // Colores Sci-Fi dinámicos según tipo
  const mainColor = isDevice ? 'cyan' : 'emerald';
  const glowColor = isDevice ? 'rgba(6,182,212,0.3)' : 'rgba(16,185,129,0.3)';
  const gradientClass = isDevice ? 'from-cyan-500 to-blue-500' : 'from-emerald-500 to-green-500';
  const textClass = isDevice ? 'text-cyan-400' : 'text-emerald-400';

  return (
    <div className={`group relative bg-white/80 dark:bg-[#121827]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-1 flex flex-col transition-all duration-700 hover:-translate-y-2 
      rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-2xl rounded-br-2xl overflow-hidden cursor-default`}
      style={{ boxShadow: `0 20px 60px -15px ${glowColor}` }}
    >
      {/* Glow Hover Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-2xl rounded-br-2xl`} style={{ padding: '1px' }}>
        <div className="w-full h-full bg-white/95 dark:bg-[#121827]/95 backdrop-blur-3xl rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-2xl rounded-br-2xl" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-4">
        
        {/* Type Badge */}
        <div className="mb-2">
          <span className={`text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#090D17]/80 backdrop-blur-md ${textClass} shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
            {isDevice ? 'Hardware' : 'Bio-Químico'}
          </span>
        </div>

        {/* Content */}
        <div className="flex justify-between items-start mb-3 gap-2 mt-2">
          <h3 className="text-xl font-black text-slate-800 dark:text-white capitalize line-clamp-1 tracking-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors" title={name}>
            {name}
          </h3>
          <span className="bg-slate-100 dark:bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white font-black text-lg whitespace-nowrap shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            Q {price?.toFixed(2)}
          </span>
        </div>

        {/* Console Log Description */}
        <div className="bg-slate-50 dark:bg-black/40 rounded-xl p-3 mb-5 flex-grow border border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradientClass} opacity-50`} />
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2 font-mono pl-2">
            &gt; {description || 'Descripción no indexada.'}
          </p>
        </div>

        {/* Stock & Action */}
        <div className="mt-auto relative z-10 flex flex-col gap-3">
          
          {/* Stock Meter */}
          <div className="bg-slate-100/50 dark:bg-white/5 backdrop-blur-md rounded-xl p-3 border border-slate-200 dark:border-white/5 flex items-center justify-between">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unidades Disponibles</span>
             <div className="flex items-center gap-2">
               <span className={`text-sm font-black ${isOutOfStock ? 'text-rose-500' : stock <= 5 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                 {isOutOfStock ? 'Agotado' : stock}
               </span>
               {!isOutOfStock && <span className={`w-2 h-2 rounded-full ${stock <= 5 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />}
             </div>
          </div>

          {/* Sci-Fi Add to Cart Button */}
          <button
            onClick={handleAddClick}
            disabled={isOutOfStock || isAdding}
            className={`relative overflow-hidden w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest transition-all duration-300 border
              ${added 
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                : isOutOfStock 
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500/50 border-rose-500/10 cursor-not-allowed'
                  : `bg-gradient-to-r ${gradientClass} text-white dark:text-slate-900 border-transparent shadow-md hover:shadow-lg dark:shadow-[0_0_20px_${glowColor}] dark:hover:shadow-[0_0_40px_${glowColor}]`
              } group/btn`}
          >
            {added ? (
              <>
                <Check size={18} strokeWidth={3} className="text-emerald-400" />
                <span>Enlazado al Carrito</span>
              </>
            ) : isOutOfStock ? (
              <span>Sin Stock</span>
            ) : (
              <>
                {/* Boton animado scale-x */}
                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                <ShoppingCart size={18} strokeWidth={2.5} className="relative z-10" />
                <span className="relative z-10">Adquirir Suministro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
