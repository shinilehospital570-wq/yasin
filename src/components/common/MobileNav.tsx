import React from 'react';
import { Home, Grid, ShoppingCart, PackageCheck, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartItemCount, 
    setIsCartDrawerOpen, 
    isAuthenticated,
    setIsAuthModalOpen,
    setAuthModalMode,
    setActiveCategory
  } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home */}
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-1 transition ${
            activeView === 'home' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Hore</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => {
            setActiveCategory('all');
            setActiveView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-1 transition ${
            activeView === 'products' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Alaabta</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center py-1 px-1 text-slate-500 hover:text-slate-800 transition"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Gaariga</span>
        </button>

        {/* Track / Orders */}
        <button
          onClick={() => {
            if (isAuthenticated) {
              setActiveView('customer-panel');
            } else {
              setActiveView('track-order');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-1 transition ${
            activeView === 'track-order' || (activeView === 'customer-panel') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dalabyada</span>
        </button>

        {/* Account */}
        <button
          onClick={() => {
            if (isAuthenticated) {
              setActiveView('customer-panel');
            } else {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-1 transition ${
            activeView === 'customer-panel' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isAuthenticated ? 'Koontada' : 'Gal'}</span>
        </button>
      </div>
    </div>
  );
};
