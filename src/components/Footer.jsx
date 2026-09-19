import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export const Footer = ({ onOpenPrivacy, onOpenTerms }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Description Column */}
          <div className="md:col-span-5 space-y-4">
            <img 
              src="/logo-white.svg" 
              alt="Heyba Pharma Logo" 
              className="h-12 w-auto object-contain" 
            />
            <p className="text-slate-400 leading-relaxed max-w-sm font-normal">
              {STORE_CONFIG.descriptionAr}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>واتساب {STORE_CONFIG.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm">روابط التصفح</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#hero" className="hover:text-teal-400 transition-colors">الرئيسية</a>
              </li>
              <li>
                <a href="#products" className="hover:text-teal-400 transition-colors">المنتجات والكتالوج</a>
              </li>
              <li>
                <a href="#about" className="hover:text-teal-400 transition-colors">من نحن</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-teal-400 transition-colors">تواصل معنا</a>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-sm">سياسات المتجر والخصوصية</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-teal-400 transition-colors text-right">
                  سياسة الخصوصية وحماية البيانات
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-teal-400 transition-colors text-right">
                  الشروط والأحكام ونظام التوريد
                </button>
              </li>
            </ul>
            <div className="pt-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-900">
              {STORE_CONFIG.noticeDisclaimer}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right font-medium">
          <p>
            © {new Date().getFullYear()} <strong>{STORE_CONFIG.nameEn} | {STORE_CONFIG.nameAr}</strong>. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>تم التطوير والتصميم برعونة واحترافية للمجال الطبي</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
