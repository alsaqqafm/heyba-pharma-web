import React, { useState } from 'react';
import { X, CreditCard, Banknote, Building2, User, Phone, MessageCircle, ArrowRight, Gift, Printer, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateWhatsAppOrder } from '../services/WhatsAppService';
import { STORE_CONFIG } from '../config/storeConfig';
import { printInvoicePDF, exportOrderToExcel } from '../services/ExportService';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, grandTotal, totalBonusUnits, customerInfo, setCustomerInfo, paymentMethod, setPaymentMethod, creditDetails, setCreditDetails, clearCart } = useCart();
  const [step, setStep] = useState(1); // Step 1: Form & Payment | Step 2: Review & Send WhatsApp
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCreditChange = (field, value) => {
    setCreditDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!customerInfo.fullName || customerInfo.fullName.trim() === '') {
      errors.fullName = 'يرجى إدخال اسم العميل';
    }
    if (!customerInfo.phone || customerInfo.phone.trim() === '') {
      errors.phone = 'يرجى إدخال رقم الهاتف';
    }
    if (paymentMethod === 'credit' && (!customerInfo.pharmacyName || customerInfo.pharmacyName.trim() === '')) {
      errors.pharmacyName = 'اسم الصيدلية/المركز مطلوب عند اختيار الدفع الآجل';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToReview = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleSendWhatsApp = () => {
    const result = generateWhatsAppOrder(
      customerInfo,
      cart,
      grandTotal,
      paymentMethod,
      creditDetails
    );

    // Save order snapshot locally for history
    try {
      const pastOrders = JSON.parse(localStorage.getItem('heyba_pharma_orders_log_v1') || '[]');
      const newOrderLog = {
        id: Date.now(),
        customer: customerInfo,
        paymentMethod,
        creditDetails,
        cart,
        total: grandTotal,
        date: new Date().toISOString()
      };
      localStorage.setItem('heyba_pharma_orders_log_v1', JSON.stringify([newOrderLog, ...pastOrders]));
    } catch (e) {
      console.warn("Local order log failed", e);
    }

    // Open WhatsApp
    window.open(result.waUrl, '_blank');
    clearCart();
    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-6 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                {step === 1 ? 'نموذج طلب المنتج ودفع الحساب' : 'مراجعة الطلب وتأكيد الإرسال'}
              </h2>
              <p className="text-xs text-slate-300">
                {step === 1 ? 'أدخل البيانات ثم اختر طريقة الدفع' : 'تأكد من البيانات قبل التوجيه لـ WhatsApp'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {step === 1 ? (
            /* STEP 1: FORM & PAYMENT METHOD */
            <div className="space-y-6">
              
              {/* Customer Information Block */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-teal-600" />
                  <span>بيانات العميل والتوصيل</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      اسم العميل / المستلم <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="مثال: د. أحمد علي"
                        className={`w-full bg-slate-50 text-slate-900 text-xs font-semibold py-3 pr-9 pl-3 rounded-xl border outline-none transition-all ${
                          formErrors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-teal-500'
                        }`}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                    {formErrors.fullName && <p className="text-[11px] font-bold text-red-500">{formErrors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      رقم الهاتف للتواصل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="مثال: 771234567"
                        className={`w-full bg-slate-50 text-slate-900 text-xs font-semibold py-3 pr-9 pl-3 rounded-xl border outline-none transition-all ${
                          formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-teal-500'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                    {formErrors.phone && <p className="text-[11px] font-bold text-red-500">{formErrors.phone}</p>}
                  </div>

                  {/* Pharmacy / Center Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      اسم الصيدلية / المركز الطبي {paymentMethod === 'credit' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerInfo.pharmacyName}
                        onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
                        placeholder="مثال: صيدلية الشفاء الحديثة"
                        className={`w-full bg-slate-50 text-slate-900 text-xs font-semibold py-3 pr-9 pl-3 rounded-xl border outline-none transition-all ${
                          formErrors.pharmacyName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-teal-500'
                        }`}
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                    {formErrors.pharmacyName && <p className="text-[11px] font-bold text-red-500">{formErrors.pharmacyName}</p>}
                  </div>

                  {/* City & District */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">المدينة</label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="صنعاء، عدن، تعز..."
                      className="w-full bg-slate-50 text-slate-900 text-xs font-semibold py-3 px-3 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">المنطقة / المديرية</label>
                    <input
                      type="text"
                      value={customerInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="مثال: شارع الزبيري"
                      className="w-full bg-slate-50 text-slate-900 text-xs font-semibold py-3 px-3 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
                    />
                  </div>

                  {/* Detailed Address */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">العنوان التفصيلي</label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="بجوار..."
                      className="w-full bg-slate-50 text-slate-900 text-xs font-semibold py-3 px-3 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector (Conditional Rendering) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>طريقة الدفع المعتمدة للطلب</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Cash Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">💵</span>
                    <span className="font-extrabold text-sm">نقدي (Cash)</span>
                    <span className="text-[11px] text-slate-500">سداد مباشر عند الاستلام</span>
                  </button>

                  {/* Credit / Deferred Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      paymentMethod === 'credit'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">🧾</span>
                    <span className="font-extrabold text-sm">آجل / ائتمان</span>
                    <span className="text-[11px] text-slate-500">حسابات التسهيلات للعملاء</span>
                  </button>

                </div>

                {/* Conditional Credit Fields (Shown only when Deferred / Credit is selected) */}
                {paymentMethod === 'credit' && (
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3 animate-fadeIn">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span>بيانات وتسهيلات الطلب الآجل:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                          اسم صاحب الحساب / المسؤول
                        </label>
                        <input
                          type="text"
                          value={creditDetails.accountOwner}
                          onChange={(e) => handleCreditChange('accountOwner', e.target.value)}
                          placeholder="مثال: د. إبراهيم (المدير)"
                          className="w-full bg-white text-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                          ملاحظات التسهيلات أو رقم الفاتورة الآجلة
                        </label>
                        <input
                          type="text"
                          value={creditDetails.creditNotes}
                          onChange={(e) => handleCreditChange('creditNotes', e.target.value)}
                          placeholder="مثال: سداد خلال 30 يوم"
                          className="w-full bg-white text-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-emerald-300 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">ملاحظات إضافية للطلبية</label>
                  <textarea
                    rows={2}
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي تعليمات تود إضافتها مع الطلبية..."
                    className="w-full bg-slate-50 text-slate-900 text-xs font-semibold p-3 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
                  />
                </div>

              </div>

            </div>
          ) : (
            /* STEP 2: REVIEW ORDER SUMMARY BEFORE WHATSAPP DISPATCH */
            <div className="space-y-6">
              
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold text-sm">تفاصيل الطلبية جاهزة للتوجيه إلى WhatsApp</div>
                <div>سيتم فتح تطبيق WhatsApp تلقائياً ورسالة منسقة موجهة إلى الرقم: <strong>{STORE_CONFIG.whatsappDisplay}</strong></div>
              </div>

              {/* Customer Review Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-1">
                  بيانات العميل وطريقة الدفع:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><strong>الاسم:</strong> {customerInfo.fullName}</div>
                  <div><strong>الهاتف:</strong> {customerInfo.phone}</div>
                  {customerInfo.pharmacyName && <div><strong>الصيدلية:</strong> {customerInfo.pharmacyName}</div>}
                  <div><strong>المدينة:</strong> {customerInfo.city} {customerInfo.district && `(${customerInfo.district})`}</div>
                  <div className="col-span-2">
                    <strong>طريقة الدفع:</strong> 
                    <span className={`me-2 px-2 py-0.5 rounded font-extrabold ${paymentMethod === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'}`}>
                      {paymentMethod === 'credit' ? 'آجل / ائتمان' : 'نقدي (Cash)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Table Summary */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm">جدول المنتجات والكميات ({cart.length} اصناف):</h4>
                
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-white font-bold">
                      <tr>
                        <th className="p-3">المنتج</th>
                        <th className="p-3">الكمية</th>
                        <th className="p-3">البونص</th>
                        <th className="p-3">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {cart.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{item.name}</td>
                          <td className="p-3 font-semibold">{item.quantity} {item.unit || "قطعة"}</td>
                          <td className="p-3 font-bold text-emerald-600">
                            {item.bonus ? `+${item.quantity * 0.1 || 1} مجاناً` : 'لا يوجد'}
                          </td>
                          <td className="p-3 font-black text-slate-900">
                            {(item.price * item.quantity).toLocaleString()} {STORE_CONFIG.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">إجمالي الطلب الكلي:</div>
                  {totalBonusUnits > 0 && (
                    <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>يتضمن +{totalBonusUnits} قطعة بونص مجاني</span>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {grandTotal.toLocaleString()} <span className="text-xs text-white font-normal">{STORE_CONFIG.currency}</span>
                </div>
              </div>

              {/* PDF & Excel Export Bar */}
              <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-teal-900 font-bold">
                  📄 هل ترغب بحفظ الفاتورة أو تصديرها كملف Excel؟
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => printInvoicePDF({
                      customer: customerInfo,
                      cart,
                      total: grandTotal,
                      paymentMethod,
                      creditDetails,
                      id: Date.now()
                    })}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3.5 rounded-xl shadow transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-400" />
                    <span>حفظ / طباعة PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportOrderToExcel({
                      customer: customerInfo,
                      cart,
                      total: grandTotal,
                      paymentMethod,
                      creditDetails,
                      id: Date.now()
                    })}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl shadow transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير Excel</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleProceedToReview}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow transition-all text-xs"
              >
                <span>مراجعة الطلبية قبل الإرسال</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                العودة للتعديل
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3.5 px-6 rounded-xl shadow-lg transition-all text-sm animate-pulse-glow"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                <span>🟢 إرسال الطلب عبر WhatsApp ({STORE_CONFIG.whatsappDisplay})</span>
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
};
