import React, { useState } from 'react';
import { X, Pill, Gift, ShoppingBag, Plus, Minus, CheckCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { calculateItemBonus } from '../services/WhatsAppService';
import { STORE_CONFIG } from '../config/storeConfig';

export const ProductModal = () => {
  const { selectedProductDetails, setSelectedProductDetails } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  if (!selectedProductDetails) return null;

  const handleClose = () => {
    setQuantity(1);
    setSelectedProductDetails(null);
  };

  const product = selectedProductDetails;
  const computedBonus = calculateItemBonus({ ...product, quantity });
  const subtotal = product.price * quantity;

  const handleAdd = () => {
    addToCart(product, quantity);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Pill className="w-4 h-4" />
            <span>تفاصيل المنتج الصيدلاني</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Visual Icon Box */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-50 to-teal-50/40 rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center border border-slate-100 mb-4">
                <Pill className="w-12 h-12 text-teal-600" />
              </div>

              {product.bonus && (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>البونص: {product.bonus}</span>
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="md:col-span-7 space-y-3 text-right">
              <div>
                <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  {product.category === 'pharma' ? 'أدوية وصيدلانية' : product.category === 'vitamins' ? 'فيتامينات ومكملات' : product.category === 'supplies' ? 'مستلزمات طبية' : 'عناية صيدلانية'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                  {product.name}
                </h2>
                {product.nameEn && (
                  <p className="text-xs text-slate-400 dir-ltr text-right mt-1 font-sans">
                    {product.nameEn}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold">سعر المفرد:</span>
                <div className="text-xl font-extrabold text-slate-900">
                  {product.price.toLocaleString()} <span className="text-xs text-teal-600">{STORE_CONFIG.currency}</span>
                </div>
              </div>

              {product.unit && (
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="font-bold text-slate-700">الوحدة:</span>
                  <span>{product.unit}</span>
                </div>
              )}

              <div className="text-xs text-slate-600 leading-relaxed pt-2">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <Info className="w-4 h-4 text-teal-600" />
                  <span>الوصف والبيانات:</span>
                </h4>
                <p className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 text-slate-700">
                  {product.description}
                </p>
              </div>

              {product.extraInfo && (
                <div className="text-xs text-slate-500 bg-teal-50/40 p-3 rounded-xl border border-teal-100">
                  <strong className="text-teal-800">معلومات إضافية:</strong> {product.extraInfo}
                </div>
              )}
            </div>

          </div>

          {/* Bonus Calculation Card */}
          {product.bonus && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">حساب البونص التلقائي للكمية المحددة:</div>
                  <div>عند اختيار كمية ({quantity})، تحصل على <strong className="text-emerald-700 text-sm font-black">+{computedBonus} مجاناً</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper & Total Subtotal */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">الكمية المطلوبة:</span>
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-extrabold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-black text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-extrabold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-right sm:text-left">
              <span className="text-xs text-slate-500 font-bold block">إجمالي الصنف:</span>
              <div className="text-2xl font-black text-teal-700">
                {subtotal.toLocaleString()} <span className="text-xs font-normal text-slate-600">{STORE_CONFIG.currency}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Action Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>إضافة {quantity} قطعة إلى طلبية WhatsApp</span>
          </button>
        </div>

        {/* Success Toast */}
        {showToast && (
          <div className="absolute inset-0 bg-emerald-700/95 text-white flex items-center justify-center gap-2 text-base font-bold animate-fadeIn z-30">
            <CheckCircle className="w-6 h-6" />
            <span>تمت إضافة المنتج بنجاح!</span>
          </div>
        )}

      </div>

    </div>
  );
};
