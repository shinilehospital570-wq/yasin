/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailsModal } from './components/catalog/ProductDetailsModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutView } from './components/checkout/CheckoutView';
import { CustomerPanel } from './components/customer/CustomerPanel';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';
import { ReceiptModal } from './components/receipt/ReceiptModal';
import { 
  AboutView, 
  ContactView, 
  TrackOrderView, 
  TermsView, 
  PrivacyView 
} from './components/pages/StaticPages';

const MainAppContent: React.FC = () => {
  const { activeView } = useStore();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {(activeView === 'products' || activeView === 'categories') && <CatalogView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'customer-panel' && <CustomerPanel />}
        {activeView === 'admin-panel' && <AdminPanel />}
        {activeView === 'track-order' && <TrackOrderView />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'terms' && <TermsView />}
        {activeView === 'privacy' && <PrivacyView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation (Visible on Android & Mobile) */}
      <MobileNav />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <ProductDetailsModal />
      <AuthModal />
      <ReceiptModal />
      <ToastContainer />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
