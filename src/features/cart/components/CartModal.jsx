import React, { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Trash2, Plus, Minus, ShoppingCart, MapPin } from 'lucide-react';

export const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  const handleQtyChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    await onUpdateQuantity(productId, newQty);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    setIsSubmitting(true);
    try {
      await onCheckout(shippingAddress);
      setShippingAddress('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tu Carrito de Compras">
      {isEmpty ? (
        <div className="text-center py-12 flex flex-col items-center gap-4 text-slate-400">
          <div className="w-16 h-16 bg-slate-950/40 rounded-full flex items-center justify-center border border-white/5">
            <ShoppingCart size={28} className="text-slate-600" />
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-300">Tu carrito está vacío</p>
            <p className="text-sm text-slate-500 mt-1">Explora nuestro catálogo para agregar productos.</p>
          </div>
          <Button variant="primary" onClick={onClose} className="mt-4 rounded-xl">
            Volver a la tienda
          </Button>
        </div>
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Items List */}
          <div className="space-y-3.5">
            {items.map((item) => {
              const product = item.productId || {};
              const pId = product._id || product.id || item.productId;
              
              return (
                <div 
                  key={pId} 
                  className="flex items-center gap-4 bg-slate-950/45 p-4 rounded-2xl border border-white/5 transition-all duration-300 hover:border-white/10"
                >
                  {/* Product Image or Icon */}
                  <div className="w-16 h-16 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600 font-bold uppercase">Prod</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-slate-200 text-sm truncate capitalize" title={product.name}>
                      {product.name || 'Producto'}
                    </h4>
                    <p className="text-xs text-slate-400 font-light truncate mt-0.5">
                      {product.description || 'Sin descripción'}
                    </p>
                    <p className="text-xs text-amber-400 font-extrabold mt-1.5">
                      Q {item.unitPrice?.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {/* Delete button */}
                    <button 
                      onClick={() => onRemoveItem(pId)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 gap-1">
                      <button 
                        type="button"
                        onClick={() => handleQtyChange(pId, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-slate-200 px-2 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleQtyChange(pId, item.quantity, 1)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="bg-slate-950/65 rounded-2xl p-4 border border-white/5 space-y-2.5">
            <div className="flex justify-between text-xs text-slate-400 font-light">
              <span>Cantidad de artículos:</span>
              <span className="font-semibold text-slate-300">
                {items.reduce((sum, item) => sum + item.quantity, 0)} unidades
              </span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-300">Total a pagar:</span>
              <span className="text-lg font-black text-amber-400">
                Q {cart?.total?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-500" />
                Dirección de Envío
              </label>
              <Input
                type="text"
                placeholder="Escribe la dirección exacta para la entrega..."
                className={`bg-slate-950 border-slate-800 rounded-xl text-sm ${addressError ? 'border-rose-500/50 focus:border-rose-500' : 'focus:border-emerald-500/50'}`}
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                  if (e.target.value.trim()) setAddressError(false);
                }}
              />
              {addressError && (
                <p className="text-xs text-rose-500 font-medium mt-1">La dirección de envío es requerida para continuar.</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="flex-1 rounded-xl py-2.5"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="flex-1 rounded-xl py-2.5"
                isLoading={isSubmitting}
              >
                Aceptar Compra
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
