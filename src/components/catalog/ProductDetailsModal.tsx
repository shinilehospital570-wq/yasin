import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Plus,
  Minus,
  MapPin,
  Share2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatETB } from '../../utils/formatters';

export const ProductDetailsModal: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    products, 
    addToCart, 
    setIsCartDrawerOpen, 
    setActiveView,
    settings 
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice! : product.price;

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const productWhatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Asc Fuad E-Commerce! Waxaan doonayaa faahfaahin dheeri ah oo ku saabsan alaabta: "${product.nameSo}" (Qiimaha: ${formatETB(activePrice)}).`
  )}`;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductId(null);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Close Bar */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setSelectedProductId(null)}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md flex items-center justify-center transition backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            
            {/* Left: Product Image */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                <img
                  src={product.imageUrl}
                  alt={product.nameSo}
                  className="w-full h-full object-cover object-center"
                />

                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    Dhimis {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                  </span>
                )}
              </div>

              {/* Delivery Hub Trust Note */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span>
                  <strong>Shinile Delivery Hub:</strong> Alaabtan waxaa si degdeg ah looga soo dirayaa Shinile waxaana la gaarsiinayaa meel kasta oo Itoobiya ah.
                </span>
              </div>
            </div>

            {/* Right: Details & Actions */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
                  <span>{product.categoryId.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>ID: {product.id}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.nameSo}
                </h1>
                {product.nameEn && (
                  <p className="text-xs text-slate-400 mt-0.5">{product.nameEn}</p>
                )}

                {/* Price Box */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block mb-0.5">Qiimaha Alaabta:</span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {formatETB(activePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatETB(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block mb-0.5">Xaaladda Bakhaarka:</span>
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Waa Laga Gatay
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3.5 h-3.5" /> Gacanta ku jira ({product.stock} {product.unit || 'xabbo'})
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Faahfaahinta Alaabta (Description):
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.descriptionSo}
                  </p>
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-800">Tirada (Quantity):</span>
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-2 text-xs font-bold text-slate-900 min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">
                      Isugayn: <strong className="text-slate-900">{formatETB(activePrice * quantity)}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4 text-orange-400" />
                    <span>Ku Dar Gaariga</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 shadow-md transition active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <span>Toos u Dalbo Hadda (Buy Now)</span>
                  </button>
                </div>

                {/* WhatsApp Direct Product Inquiry */}
                <a
                  href={productWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Wax Ka Weydii WhatsApp-ka Fuad E-Commerce</span>
                </a>
              </div>
            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-4">
                Alaabooyin Kale oo Qaybtan ah (Related Products)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedProducts.map((relPrd) => (
                  <div
                    key={relPrd.id}
                    onClick={() => {
                      setSelectedProductId(relPrd.id);
                      setQuantity(1);
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:border-orange-500/50 bg-slate-50 cursor-pointer transition flex items-center gap-3"
                  >
                    <img
                      src={relPrd.imageUrl}
                      alt={relPrd.nameSo}
                      className="w-12 h-12 rounded-lg object-cover bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">{relPrd.nameSo}</p>
                      <p className="text-xs font-bold text-orange-600">
                        {formatETB(relPrd.discountPrice ?? relPrd.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
