import React from 'react';
import { ShoppingCart, Eye, Sparkles, Check, Flame } from 'lucide-react';
import { Product } from '../../types';
import { formatETB } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductId } = useStore();

  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice! : product.price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {hasDiscount && (
          <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            Dhimis {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-slate-900 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Flame className="w-3 h-3 fill-slate-900" /> Ugu Iibka Badan
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            Cusub
          </span>
        )}
      </div>

      {/* Product Image */}
      <div 
        onClick={() => setSelectedProductId(product.id)}
        className="relative w-full aspect-square bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.nameSo}
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'opacity-50 grayscale' : ''
          }`}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <span className="bg-rose-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-xl shadow-lg">
              Waa Laga Gatay (Out of Stock)
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProductId(product.id);
          }}
          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          title="Fiiri Faahfaahinta"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Stock label */}
          <div className="flex items-center justify-between text-[11px] mb-1.5 text-slate-500">
            <span className="capitalize font-medium">{product.categoryId.replace('-', ' ')}</span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold">Ma taallo</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold">Haray: {product.stock} {product.unit || 'xabbo'}</span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Diyaar
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => setSelectedProductId(product.id)}
            className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 cursor-pointer hover:text-orange-600 transition"
            title={product.nameSo}
          >
            {product.nameSo}
          </h3>

          {/* Somali short excerpt */}
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 hidden sm:block">
            {product.descriptionSo}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              {formatETB(activePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatETB(product.price)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-slate-900 hover:bg-orange-600 text-white shadow-sm hover:shadow'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Waa Laga Gatay' : 'Ku Dar Gaariga'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
