import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h2 className="font-extrabold text-base">سياسة الخصوصية — {STORE_CONFIG.nameAr}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-xs text-slate-700 space-y-4 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-sm">1. جمع البيانات وتخصيص استخدامها</h3>
          <p>
            تلتزم منصة <strong>{STORE_CONFIG.nameAr} ({STORE_CONFIG.nameEn})</strong> بحماية خصوصية عملائها من الصيدليات، المراكز الطبية، والمستلمين. البيانات المدخلة في نموذج الطلب (كالاسم، رقم الهاتف، واسم الصيدلية) تُستخدم فقط لغرض صياغة رسالة الطلب المباشر عبر WhatsApp وإنجاز عملية التوصيل وتسهيلات الدفع.
          </p>

          <h3 className="font-bold text-slate-900 text-sm">2. حماية وتخزين البيانات</h3>
          <p>
            لا يتم مشاركة بيانات العملاء أو بيعها لأي أطراف ثالثة. يتم حفظ بيانات السلة المؤقتة محلياً في متصفح المستخدم (LocalStorage) لسهولة التجربة واستكمال الطلبية دون الحاجة لإنشاء حسابات معقدة.
          </p>

          <h3 className="font-bold text-slate-900 text-sm">3. التواصل والتنسيق</h3>
          <p>
            يتم التنسيق النهائي واعتماد أسعار وتفاصيل الطلبية عبر رقم WhatsApp المعتمد للمتجر: <strong>{STORE_CONFIG.whatsappDisplay}</strong>.
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
