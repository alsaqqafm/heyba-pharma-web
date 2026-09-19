import React from 'react';
import { X, FileText } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h2 className="font-extrabold text-base">الشروط والأحكام — {STORE_CONFIG.nameAr}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-xs text-slate-700 space-y-4 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-sm">1. طبيعة الخدمة والكتالوج</h3>
          <p>
            تعد منصة <strong>Heyba Pharma | هيبا فارما</strong> كتالوجاً رقمياً تفاعلياً لعرض المنتجات والأصناف الصيدلانية وتسهيل إعداد طلبات التوريد وإرسالها المباشر عبر تطبيق WhatsApp.
          </p>

          <h3 className="font-bold text-slate-900 text-sm">2. نظام البونص والدفع</h3>
          <p>
            يتم حساب البونص التلقائي لكل صنف بناءً على الكميات المحددة وقواعد العرض المعتمدة. يدعم النظام خياري الدفع <strong>النقدي</strong> و <strong>الآجل</strong> بحسب التسهيلات الممنوحة لكل صيدلية أو مركز طبي.
          </p>

          <h3 className="font-bold text-slate-900 text-sm">3. الدعم والتوثيق</h3>
          <p>
            تعتبر جميع الطلبات الصادرة موثقة بعد مراجعتها وتأكيدها المباشر من المبيعات عبر الرقم الرسمي <strong>{STORE_CONFIG.whatsappDisplay}</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
