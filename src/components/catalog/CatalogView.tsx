import React, { useMemo, useState } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  X, 
  Search, 
  Sparkles, 
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';
import { ProductCard } from './ProductCard';
import { formatETB } from '../../utils/formatters';

export const CatalogView: React.FC = () => {
  const { 
    products, 
    categories, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery 
  } = useStore();

  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'best-seller'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.categoryId !== activeCategory) {
          return false;
        }

        // Search query filter (Somali title, English title, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNameSo = p.nameSo.toLowerCase().includes(q);
          const matchNameEn = p.nameEn?.toLowerCase().includes(q);
          const matchDesc = p.descriptionSo.toLowerCase().includes(q);
          const matchCategory = p.categoryId.toLowerCase().includes(q);
          if (!matchNameSo && !matchNameEn && !matchDesc && !matchCategory) {
            return false;
          }
        }

        // Price filter
        const price = p.discountPrice ?? p.price;
        if (price > maxPrice) {
          return false;
        }

        // In-stock filter
        if (onlyAvailable && (!p.isAvailable || p.stock <= 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'best-seller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, activeCategory, searchQuery, maxPrice, onlyAvailable, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeCategory === 'all' 
                ? 'Dhammaan Alaabta Dukaanka' 
                : categories.find((c) => c.id === activeCategory)?.nameSo || 'Alaabta'}
            </h1>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredProducts.length} Alaab
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Alaab tayo leh oo lagu iibinayo Lacagta Birr-ka Itoobiya (ETB). Gaarsiinta Shinile ilaa meel kasta.
          </p>
        </div>

        {/* Search status or mobile filter toggle */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {searchQuery && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800">
              <span>Raadinta: "<strong>{searchQuery}</strong>"</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="hover:text-rose-600 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">Ugu Cusub (Newest)</option>
              <option value="price-asc">Qiimaha: Ugu Jaban (Low to High)</option>
              <option value="price-desc">Qiimaha: Ugu Qaalisan (High to Low)</option>
              <option value="best-seller">Ugu Caansan (Best Sellers)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition active:scale-95 ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Dhammaan (All)
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition active:scale-95 ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.nameSo}
          </button>
        ))}
      </div>

      {/* Filter Bar (Price Slider & In Stock toggle) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
            />
            <span>Kaliya Alaabta Taalla (In Stock)</span>
          </label>
        </div>

        <div className="flex items-center gap-3 w-full md:w-80">
          <span className="text-slate-500 whitespace-nowrap">
            Qiimaha ugu sarreeya: <strong>{formatETB(maxPrice)}</strong>
          </span>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-orange-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Wax alaab ah lama helin</h3>
          <p className="text-xs text-slate-500 mb-6">
            Lama helin alaab ku habboon shaandhadaada ama ereyga aad raadisay.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setMaxPrice(10000);
              setOnlyAvailable(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            Dib u Bilow Shaandhada (Reset)
          </button>
        </div>
      )}

    </div>
  );
};
