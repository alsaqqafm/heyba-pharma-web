import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Gift, ArrowLeft, Pill } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateItemBonus } from '../services/WhatsAppService';
import { STORE_CONFIG } from '../config/storeConfig';

export const CartDrawer = ({ isOpen, onClose, onProceedToCheckout }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, grandTotal, totalBonusUnits, totalItemsCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 dir-rtl">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-slate-200">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base">سلة الطلبية الصيدلانية</h2>
                <p className="text-xs text-slate-300">يوجد {totalItemsCount} صنف مختار</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => {
                const bonusCount = calculateItemBonus(item);
                const subtotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2 relative group hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-teal-600 font-bold text-xs">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            السعر: {item.price.toLocaleString()} {STORE_CONFIG.currency} / {item.unit || "وحدة"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bonus highlight if applicable */}
                    {bonusCount > 0 && (
                      <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>البونص المجاني: +{bonusCount} مجاناً ({item.bonus})</span>
                      </div>
                    )}

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <div className="flex items-center bg-white rounded-xl border border-slate-300 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-left font-black text-sm text-slate-900">
                        {subtotal.toLocaleString()} <span className="text-xs font-normal text-teal-600">{STORE_CONFIG.currency}</span>
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              /* Empty Cart View */
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">السلة فارغة حالياً</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  تصفح المنتجات وأضف الأصناف المطلوبة لإعداد رسالة الطلب عبر WhatsApp.
                </p>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              
              {/* Total Summary */}
              <div className="space-y-2">
                {totalBonusUnits > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      إجمالي الوحدات المجانية (البونص):
                    </span>
                    <span className="text-sm font-black">+{totalBonusUnits} قطعة</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm font-bold text-slate-700">إجمالي الطلبية:</span>
                  <div className="text-2xl font-black text-slate-900">
                    {grandTotal.toLocaleString()} <span className="text-xs text-teal-600 font-bold">{STORE_CONFIG.currency}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all"
                >
                  <span>متابعة نموذج الطلب (نقدي / آجل)</span>
                  <ArrowLeft className="w-4 h-4 me-1" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-red-600 py-1 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إفراغ السلة بالكامل</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
