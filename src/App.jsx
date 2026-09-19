import React, { useState } from 'react';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { STORE_CONFIG } from './config/storeConfig';

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const { totalItemsCount } = useCart();

  const handleExploreProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProceedToCheckoutFromCart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-cairo">
      
      {/* Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero onExploreProducts={handleExploreProducts} />
        <ProductGrid />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductModal />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Floating Sticky Actions for Mobile UX */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-3 md:hidden">
        
        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-slate-900 text-white p-3.5 rounded-full shadow-2xl border-2 border-teal-400/50 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="السلة"
        >
          <ShoppingBag className="w-6 h-6 text-teal-400" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {totalItemsCount}
            </span>
          )}
        </button>

        {/* Floating Direct WhatsApp Button */}
        <a
          href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce"
          aria-label="واتساب"
        >
          <MessageCircle className="w-6 h-6 fill-white stroke-none" />
        </a>
      </div>

    </div>
  );
};

export function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
