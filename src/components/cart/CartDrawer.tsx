import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatETB } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartItemCount,
    setActiveView,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Gaarigaaga Wax Iibsiga
              </h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                {cartItemCount} xabbo
              </span>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Gaarigaagu waa maran yahay</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Weli wax alaab ah kuma aadan darin gaarigaaga wax iibsiga.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveView('products');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition shadow-sm"
                >
                  Bilow Wax Iibsiga →
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const product = item.product;
                const activePrice = product.discountPrice ?? product.price;
                const isMaxStock = item.quantity >= product.stock;

                return (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    {/* Item Image */}
                    <img
                      src={product.imageUrl}
                      alt={product.nameSo}
                      className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                            {product.nameSo}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-slate-400 hover:text-rose-600 transition"
                            title="Ka saar gaariga"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-extrabold text-orange-600 mt-0.5">
                          {formatETB(activePrice)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                          <button
                            onClick={() => updateQuantity(product.id, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, item.quantity + 1)}
                            disabled={isMaxStock}
                            className="p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-800">
                          {formatETB(activePrice * item.quantity)}
                        </span>
                      </div>

                      {isMaxStock && (
                        <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> Waa inta ugu badan ee bakhaarka ku jirta ({product.stock})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Totals & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Wadarta Alaabta (Subtotal):</span>
                  <span className="font-bold text-slate-900">{formatETB(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Kharashka Gaarsiinta (Delivery):</span>
                  <span className="text-slate-600 font-medium">Waxaa lagu xisaabinayaa checkout</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Wadarta Guud (ETB):</span>
                  <span className="text-orange-600">{formatETB(cartSubtotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition active:scale-95"
                >
                  <span>U Gudub Bixinta (Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    Faaruqi Gaariga
                  </button>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Sii wad wax iibsiga
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
