import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  MapPin,
  LogOut,
  PackageCheck,
  LayoutDashboard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const {
    settings,
    cartItemCount,
    currentUser,
    isAuthenticated,
    isAdmin,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsCartDrawerOpen,
    logout,
    categories,
    setActiveCategory,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('products');
    }
  };

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Asc Fuad E-Commerce! Waxaan rabaa inaan wax ka weydiiyo alaabta dukaanka.'
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 bg-orange-600/30 text-orange-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-orange-500/30 uppercase tracking-wider">
              <MapPin className="w-3 h-3" /> Shinile Hub
            </span>
            <span className="truncate max-w-xs sm:max-w-md md:max-w-none text-slate-300 font-medium">
              {settings.headerAnnouncement}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-xs shrink-0">
            <a 
              href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-600/15 hover:bg-orange-600/25 text-orange-300 hover:text-white transition font-bold border border-orange-500/40 shadow-xs active:scale-95 text-xs"
              title="Wac Fuad E-Commerce"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-extrabold tracking-wide text-orange-300 hover:text-white">
                {settings.contactPhone}
              </span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition py-1 px-2 rounded-lg hover:bg-emerald-950/40"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-500/20" />
              <span>WhatsApp</span>
            </a>

            <div className="hidden sm:block">
              <PWAInstallButton mini />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
          <div className="flex items-center justify-between gap-3 md:gap-8">
            
            {/* Logo */}
            <div 
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-orange-500 overflow-hidden relative group">
                <span className="font-extrabold text-lg sm:text-xl text-orange-400 tracking-tighter">F</span>
                <span className="font-bold text-xs text-white">E</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                    FUAD
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-orange-600 tracking-tight leading-none">
                    STORE
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                  Shinile • Somali Region
                </span>
              </div>
            </div>

            {/* Search Bar - Desktop & Tablet */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden sm:flex flex-1 max-w-xl relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Raadi dharka, kabaha, elektaroonigga ama magaca alaabta..."
                className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition active:scale-95"
              >
                Raadi
              </button>
            </form>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              
              {/* WhatsApp Quick Link on Mobile */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Nagala soo xiriir WhatsApp"
                className="sm:hidden p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                title="Gaarigaaga wax iibsiga"
              >
                <ShoppingCart className="w-5 h-5 text-slate-800" />
                <span className="hidden md:inline text-xs font-semibold">Gaariga</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-orange-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-orange-400 font-bold text-xs flex items-center justify-center">
                        {currentUser?.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                        {currentUser?.fullName}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs text-slate-500">Gashay sidii:</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                              <ShieldCheck className="w-3 h-3 text-orange-600" /> Maamulaha Sare
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => {
                              setActiveView('customer-panel');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs md:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-500" />
                            <span>Koontadayda (Customer Panel)</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveView('customer-panel');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs md:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <PackageCheck className="w-4 h-4 text-slate-500" />
                            <span>Dalabyadayda (My Orders)</span>
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => {
                                setActiveView('admin-panel');
                                setIsUserDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-xs md:text-sm font-semibold text-orange-700 hover:bg-orange-50 flex items-center gap-2"
                            >
                              <ShieldCheck className="w-4 h-4 text-orange-600" />
                              <span>Maamulka Dukaanka (Admin Panel)</span>
                            </button>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs md:text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Ka Bax (Logout)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Gal (Login)</span>
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('signup');
                        setIsAuthModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-95"
                    >
                      <span>Diiwaangeli</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>

          {/* Mobile Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="sm:hidden mt-2.5 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Raadi dharka, kabaha, elektaroonigga..."
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-slate-900 text-white text-xs font-semibold rounded-lg"
            >
              Raadi
            </button>
          </form>

        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-slate-200 text-xs sm:text-sm font-medium hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2.5 transition rounded-none border-b-2 font-semibold ${
                activeView === 'home'
                  ? 'border-orange-500 text-white'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Bogga Hore
            </button>

            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveView('products');
              }}
              className={`px-3 py-2.5 transition border-b-2 font-semibold ${
                activeView === 'products' && searchQuery === ''
                  ? 'border-orange-500 text-white'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Dhammaan Alaabta
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveView('products');
                }}
                className="px-3 py-2.5 text-slate-300 hover:text-white transition"
              >
                {cat.nameSo}
              </button>
            ))}

            <button
              onClick={() => setActiveView('contact')}
              className={`px-3 py-2.5 transition border-b-2 ${
                activeView === 'contact' ? 'border-orange-500 text-white' : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Nala Soo Xiriir
            </button>

            <button
              onClick={() => setActiveView('about')}
              className={`px-3 py-2.5 transition border-b-2 ${
                activeView === 'about' ? 'border-orange-500 text-white' : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Nagu Saabsan
            </button>
          </div>

          {/* Quick Tracking Link */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('track-order')}
              className="flex items-center gap-1.5 text-orange-400 hover:text-white text-xs font-bold py-1.5 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/40 shadow-xs transition active:scale-95"
            >
              <PackageCheck className="w-3.5 h-3.5 text-orange-400" />
              <span className="tracking-wide">La Soco Dalabkaaga</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 font-semibold text-white"
            >
              Bogga Hore (Home)
            </button>

            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveView('products');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 font-semibold text-white"
            >
              Dhammaan Alaabta (All Products)
            </button>

            <div className="pt-2 pb-1 text-slate-400 text-[11px] font-bold uppercase tracking-wider px-3">
              Qaybaha Alaabta (Categories)
            </div>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveView('products');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-1.5 px-4 text-xs rounded-lg hover:bg-slate-800 text-slate-300"
              >
                • {cat.nameSo}
              </button>
            ))}

            <button
              onClick={() => {
                setActiveView('track-order');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-orange-400 font-semibold"
            >
              La Soco Dalabka (Order Tracking)
            </button>

            <button
              onClick={() => {
                setActiveView('contact');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              Nala Soo Xiriir (Contact Us)
            </button>

            <button
              onClick={() => {
                setActiveView('about');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              Nagu Saabsan (About Us)
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>
            <PWAInstallButton mini />
          </div>
        </div>
      )}
    </header>
  );
};
