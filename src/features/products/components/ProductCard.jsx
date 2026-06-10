import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { ShoppingCart, Check, Info, Box } from 'lucide-react';

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

  // Visual variants depending on product type
  const isDevice = productType === 'device';
  const typeBadgeStyles = isDevice
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  const cardBorderColor = isDevice ? 'border-t-blue-500' : 'border-t-emerald-500';

  return (
    <Card hover className={`flex flex-col h-full border-t-4 ${cardBorderColor} transition-all duration-300 relative overflow-hidden`}>
      {/* Decorative top-right blur highlight */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${isDevice ? 'bg-blue-500/5' : 'bg-emerald-500/5'} blur-2xl rounded-full pointer-events-none`} />

      {/* Product Image or Placeholder */}
      <div className="relative w-full h-44 rounded-xl bg-slate-950/60 border border-white/5 mb-4 flex items-center justify-center overflow-hidden group">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Box size={40} className="stroke-1" />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${typeBadgeStyles}`}>
          {isDevice ? 'Dispositivo' : 'Fertilizante'}
        </span>
      </div>

      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-lg font-bold text-slate-200 capitalize line-clamp-1" title={name}>
          {name}
        </h3>
        <span className="text-amber-400 font-extrabold text-lg whitespace-nowrap">
          Q {price?.toFixed(2)}
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
        {description || 'Sin descripción disponible.'}
      </p>

      {/* Stock level info */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
        <span>Disponibles:</span>
        <span className={`font-bold ${isOutOfStock ? 'text-rose-500' : stock <= 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
          {isOutOfStock ? 'Agotado' : `${stock} unidades`}
        </span>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleAddClick}
        disabled={isOutOfStock || isAdding}
        isLoading={isAdding}
        variant={added ? 'secondary' : 'primary'}
        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all duration-300"
      >
        {added ? (
          <>
            <Check size={16} className="text-emerald-400" />
            <span>¡Agregado!</span>
          </>
        ) : isOutOfStock ? (
          <span>Sin stock</span>
        ) : (
          <>
            <ShoppingCart size={16} />
            <span>Agregar al carrito</span>
          </>
        )}
      </Button>
    </Card>
  );
};
