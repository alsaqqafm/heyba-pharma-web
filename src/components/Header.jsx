import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Menu, X, ShieldCheck, Phone, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../config/storeConfig';

export const Header = ({ onOpenCart, onOpenAdmin }) => {
  const { totalItemsCount, grandTotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel shadow-sm transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-slate-200 py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-teal-900/50">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
        <span>منصة <strong className="text-teal-300">Heyba Pharma | هيبا فارما</strong> — توريد وتسهيل طلبيات الصيدليات عبر WhatsApp</span>
        <span className="hidden md:inline-block text-slate-500">|</span>
        <a 
          href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
        >
          <Phone className="w-3 h-3" />
          {STORE_CONFIG.whatsappDisplay}
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group focus:outline-none">
              <img 
                src="/logo.svg" 
                alt="Heyba Pharma Logo" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <button onClick={() => scrollToSection('hero')} className="hover:text-teal-600 transition-colors py-2">
              الرئيسية
            </button>
            <button onClick={() => scrollToSection('products')} className="hover:text-teal-600 transition-colors py-2">
              المنتجات والكتالوج
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-teal-600 transition-colors py-2">
              من نحن
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-teal-600 transition-colors py-2">
              تواصل معنا
            </button>
          </nav>

          {/* Action Buttons: Cart & WhatsApp & Admin */}
          <div className="flex items-center gap-3">
            
            {/* Admin Dashboard Button */}
            <button
              onClick={onOpenAdmin}
              title="لوحة الإدارة"
              className="p-2.5 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-slate-900 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right text-xs">
                <span className="text-slate-300 font-normal">سلة الطلب</span>
                <span className="font-bold text-emerald-400">{grandTotal.toLocaleString()} {STORE_CONFIG.currency}</span>
              </div>
            </button>

            {/* Quick WhatsApp Direct Button */}
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>واتساب مباشر</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => scrollToSection('hero')}
            className="block w-full text-right py-2.5 px-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            الرئيسية
          </button>
          <button
            onClick={() => scrollToSection('products')}
            className="block w-full text-right py-2.5 px-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            المنتجات والكتالوج
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-right py-2.5 px-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            من نحن
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-right py-2.5 px-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            تواصل معنا
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
            className="block w-full text-right py-2.5 px-3 rounded-lg text-base font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            ⚙️ لوحة الإدارة والتحكم
          </button>

          <div className="pt-2 border-t border-slate-100">
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-xl shadow w-full"
            >
              <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              <span>تواصل مع المبيعات {STORE_CONFIG.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
