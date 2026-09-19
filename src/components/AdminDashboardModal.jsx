import React, { useState } from 'react';
import { X, Settings, Plus, Edit2, Trash2, RefreshCw, Lock, Download, Printer, Eye, EyeOff, LogOut, KeyRound, ShieldCheck, AlertCircle, Save } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { printInvoicePDF, exportOrderToExcel, exportAllOrdersToExcel } from '../services/ExportService';

export const AdminDashboardModal = ({ isOpen, onClose }) => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaultProducts } = useProducts();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'settings'

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('heyba_admin_auth_v1') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState(STORE_CONFIG.adminEmail);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    nameEn: '',
    category: 'pharma',
    price: '',
    unit: 'علبة',
    bonus: '10 + 1 مجاناً',
    bonusThreshold: 10,
    bonusFreeQuantity: 1,
    description: '',
    extraInfo: '',
    stockStatus: 'available'
  });

  // Edit Product Modal State
  const [editingProd, setEditingProd] = useState(null);

  // Orders Log
  const ordersLog = JSON.parse(localStorage.getItem('heyba_pharma_orders_log_v1') || '[]');

  if (!isOpen) return null;

  // Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const targetEmail = STORE_CONFIG.adminEmail.trim().toLowerCase();
    const targetPassword = STORE_CONFIG.adminPassword.trim();

    if (
      loginEmail.trim().toLowerCase() === targetEmail &&
      loginPassword.trim() === targetPassword
    ) {
      sessionStorage.setItem('heyba_admin_auth_v1', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('heyba_admin_auth_v1');
    setIsAuthenticated(false);
    setLoginPassword('');
    setAuthError('');
  };

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    addProduct({
      ...newProd,
      price: Number(newProd.price),
      bonusThreshold: Number(newProd.bonusThreshold) || 10,
      bonusFreeQuantity: Number(newProd.bonusFreeQuantity) || 1
    });
    setShowAddForm(false);
    setNewProd({
      name: '',
      nameEn: '',
      category: 'pharma',
      price: '',
      unit: 'علبة',
      bonus: '10 + 1 مجاناً',
      bonusThreshold: 10,
      bonusFreeQuantity: 1,
      description: '',
      extraInfo: '',
      stockStatus: 'available'
    });
  };

  // Handle Edit Product Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProd || !editingProd.name || !editingProd.price) return;

    updateProduct(editingProd.id, {
      ...editingProd,
      price: Number(editingProd.price),
      bonusThreshold: Number(editingProd.bonusThreshold) || 10,
      bonusFreeQuantity: Number(editingProd.bonusFreeQuantity) || 1
    });

    setEditingProd(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-6 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Dashboard Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">لوحة إدارة متجر Heyba Pharma</h2>
              <p className="text-xs text-slate-300">إدارة الكتالوج، تعديل الأسعار، البونص وسجل الطلبات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-red-500/30"
                title="تسجيل الخروج من لوحة الإدارة"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION SCREEN IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="p-8 space-y-6 flex-1 flex flex-col items-center justify-center text-slate-800 my-4">
            
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner border border-teal-100">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1.5 max-w-sm">
              <h3 className="text-xl font-black text-slate-900">تسجيل الدخول إلى لوحة الإدارة</h3>
              <p className="text-xs text-slate-500">
                أدخل بريد المدير الإلكتروني وكلمة المرور للوصول لإعدادات وإدارة كتالوج {STORE_CONFIG.nameAr}.
              </p>
            </div>

            {authError && (
              <div className="w-full max-w-sm bg-red-50 text-red-700 p-3.5 rounded-2xl border border-red-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 text-xs font-medium">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">البريد الإلكتروني للإدارة</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="mohammed.f.saqqaf@gmail.com"
                  className="w-full bg-slate-50 p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">كلمة المرور</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 p-3 pl-10 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 text-slate-400 hover:text-slate-700 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm pt-3"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>دخول لوحة التحكم</span>
              </button>

            </form>

            <div className="text-[11px] text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              🔒 محمي ومخصص فقط لإدارة <strong>{STORE_CONFIG.nameAr}</strong>
            </div>

          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD CONTENT */
          <>
            {/* Dashboard Navigation Tabs */}
            <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-4 text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-4 rounded-xl transition-all ${
                  activeTab === 'products' ? 'bg-white text-teal-700 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                💊 إدارة المنتجات ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-4 rounded-xl transition-all ${
                  activeTab === 'orders' ? 'bg-white text-teal-700 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                🧾 سجل الطلبات المحفوظة ({ordersLog.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-4 rounded-xl transition-all ${
                  activeTab === 'settings' ? 'bg-white text-teal-700 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                ⚙️ إعدادات المتجر و WhatsApp
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* TAB 1: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h3 className="font-bold text-slate-900 text-sm">قائمة المنتجات الصيدلانية ({products.length} منتج)</h3>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowAddForm(!showAddForm);
                          setEditingProd(null);
                        }}
                        className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة منتج جديد</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("هل ترغب بإعادة ضبط المنتجات إلى القائمة البادئة الأصلية؟")) {
                            resetToDefaultProducts();
                          }
                        }}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300"
                        title="إعادة الضبط الافتراضي"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>إعادة ضبط</span>
                      </button>
                    </div>
                  </div>

                  {/* EDIT PRODUCT MODAL / FORM */}
                  {editingProd && (
                    <form onSubmit={handleEditSubmit} className="bg-amber-50/80 p-5 rounded-2xl border border-amber-300 space-y-4 animate-fadeIn text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
                          <Edit2 className="w-4 h-4 text-amber-700" />
                          <span>تعديل تفاصيل المنتج: {editingProd.name}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProd(null)}
                          className="text-slate-400 hover:text-slate-700 font-bold"
                        >
                          إلغاء التعديل ✕
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">اسم المنتج باللغة العربية *</label>
                          <input
                            type="text"
                            required
                            value={editingProd.name || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">الاسم بالإنجليزية</label>
                          <input
                            type="text"
                            value={editingProd.nameEn || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, nameEn: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none dir-ltr text-right"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">السعر (ر.ي) *</label>
                          <input
                            type="number"
                            required
                            value={editingProd.price || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, price: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">الوحدة</label>
                          <input
                            type="text"
                            value={editingProd.unit || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, unit: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">نص البونص</label>
                          <input
                            type="text"
                            value={editingProd.bonus || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, bonus: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none text-emerald-700 font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">التصنيف</label>
                          <select
                            value={editingProd.category || 'pharma'}
                            onChange={(e) => setEditingProd({ ...editingProd, category: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          >
                            <option value="pharma">أدوية وصيدلانية</option>
                            <option value="vitamins">فيتامينات ومكملات</option>
                            <option value="supplies">مستلزمات طبية</option>
                            <option value="skincare">عناية صيدلانية</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">الوصف والبيانات</label>
                          <textarea
                            rows={2}
                            value={editingProd.description || ''}
                            onChange={(e) => setEditingProd({ ...editingProd, description: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProd(null)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                        >
                          <Save className="w-4 h-4" />
                          <span>حفظ التعديلات</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Add New Product Form */}
                  {showAddForm && (
                    <form onSubmit={handleAddSubmit} className="bg-teal-50/70 p-5 rounded-2xl border border-teal-200 space-y-4 animate-fadeIn text-xs">
                      <h4 className="font-extrabold text-teal-900 text-sm">إضافة صنف صيدلاني جديد للكتالوج:</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">اسم المنتج باللغة العربية *</label>
                          <input
                            type="text"
                            required
                            value={newProd.name}
                            onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                            placeholder="مثال: أسبرين 100 ملجم"
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">الاسم بالإنجليزية (اختياري)</label>
                          <input
                            type="text"
                            value={newProd.nameEn}
                            onChange={(e) => setNewProd({ ...newProd, nameEn: e.target.value })}
                            placeholder="Aspirin 100mg"
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none dir-ltr text-right"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">السعر (ر.ي) *</label>
                          <input
                            type="number"
                            required
                            value={newProd.price}
                            onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                            placeholder="2500"
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">الوحدة</label>
                          <input
                            type="text"
                            value={newProd.unit}
                            onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                            placeholder="علبة / باكيت / شريط"
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">نص البونص</label>
                          <input
                            type="text"
                            value={newProd.bonus}
                            onChange={(e) => setNewProd({ ...newProd, bonus: e.target.value })}
                            placeholder="مثال: 10 + 1 مجاناً"
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">التصنيف</label>
                          <select
                            value={newProd.category}
                            onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          >
                            <option value="pharma">أدوية وصيدلانية</option>
                            <option value="vitamins">فيتامينات ومكملات</option>
                            <option value="supplies">مستلزمات طبية</option>
                            <option value="skincare">عناية صيدلانية</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">الوصف المختصر</label>
                          <textarea
                            rows={2}
                            value={newProd.description}
                            onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                            placeholder="وصف المنتج والاستخدام الدوائي العام..."
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl shadow"
                        >
                          حفظ وتضمين المنتج
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Existing Products Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-900 text-white font-bold">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">المنتج</th>
                          <th className="p-3">السعر (ر.ي)</th>
                          <th className="p-3">الوحدة</th>
                          <th className="p-3">البونص</th>
                          <th className="p-3">التوفر</th>
                          <th className="p-3 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {products.map((p, index) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-slate-400 font-bold">{index + 1}</td>
                            <td className="p-3 font-bold text-slate-900">
                              <div>{p.name}</div>
                              {p.nameEn && <div className="text-[10px] text-slate-400 dir-ltr text-right">{p.nameEn}</div>}
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                value={p.price}
                                onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                                className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-extrabold text-slate-900"
                              />
                            </td>
                            <td className="p-3 text-slate-600 font-medium">{p.unit || '-'}</td>
                            <td className="p-3 text-emerald-600 font-bold">{p.bonus || 'لا يوجد'}</td>
                            <td className="p-3">
                              <button
                                onClick={() => updateProduct(p.id, {
                                  stockStatus: p.stockStatus === 'available' ? 'out' : 'available'
                                })}
                                className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-colors ${
                                  p.stockStatus === 'available' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {p.stockStatus === 'available' ? 'متوفر' : 'غير متوفر'}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingProd(p);
                                    setShowAddForm(false);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-amber-600 transition-colors"
                                  title="تعديل تفاصيل المنتج"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`هل أنت تأكد من حذف ${p.name}؟`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                                  title="حذف المنتج"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 2: SAVED ORDERS LOG */}
              {activeTab === 'orders' && (
                <div className="space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">سجل الطلبات المستلمة على هذا الجهاز:</h3>
                      <p className="text-slate-500 text-[11px]">يمكنك تحويل الفواتير إلى PDF للطباعة أو تصدير الجدول إلى ملف Excel.</p>
                    </div>

                    {ordersLog.length > 0 && (
                      <button
                        onClick={() => exportAllOrdersToExcel(ordersLog)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl shadow transition-all shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تصدير كل الطلبات Excel</span>
                      </button>
                    )}
                  </div>
                  
                  {ordersLog.length > 0 ? (
                    <div className="space-y-3">
                      {ordersLog.map((order) => (
                        <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-teal-300 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-2 font-bold border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-[11px]">#{order.id}</span>
                              <span className="text-slate-900 font-extrabold">{order.customer?.fullName || 'عميل'}</span>
                              {order.customer?.pharmacyName && (
                                <span className="text-slate-500 text-[11px]">({order.customer.pharmacyName})</span>
                              )}
                            </div>
                            <span className="text-teal-700 text-[11px]">
                              {new Date(order.date).toLocaleString('ar-YE', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600">
                            <div>
                              <span>الهاتف: <strong>{order.customer?.phone || 'غير مدخل'}</strong></span>
                              <span className="mx-2">•</span>
                              <span>طريقة الدفع: <strong className={order.paymentMethod === 'credit' ? 'text-amber-700' : 'text-emerald-700'}>{order.paymentMethod === 'credit' ? 'آجل / ائتمان' : 'نقدي'}</strong></span>
                              <span className="mx-2">•</span>
                              <span>الإجمالي: <strong className="text-slate-900 text-sm">{order.total.toLocaleString()} {STORE_CONFIG.currency}</strong></span>
                            </div>

                            {/* Order Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => printInvoicePDF(order)}
                                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition-colors"
                                title="طباعة وتحميل PDF"
                              >
                                <Printer className="w-3.5 h-3.5 text-teal-400" />
                                <span>فاتورة PDF</span>
                              </button>

                              <button
                                onClick={() => exportOrderToExcel(order)}
                                className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-1.5 px-3 rounded-lg text-[11px] transition-colors"
                                title="تصدير إلى Excel CSV"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Excel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 py-8 text-center bg-slate-50 rounded-2xl">
                      لا توجد طلبات سابقة مسجلة على هذا الجهاز بعد.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 3: STORE CONFIGURATION & WHATSAPP SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-teal-600" />
                      <span>الإعدادات المركزية للمتجر ورقم WhatsApp:</span>
                    </h4>

                    <div className="space-y-2 text-slate-700">
                      <div><strong>اسم العلامة التجاريه:</strong> Heyba Pharma | هيبا فارما</div>
                      <div><strong>بريد الإدارة المعتمد:</strong> <span className="text-teal-700 font-bold">{STORE_CONFIG.adminEmail}</span></div>
                      <div><strong>رقم WhatsApp الرسمي لاستقبال الطلبات:</strong> <span className="dir-ltr text-emerald-700 font-black">{STORE_CONFIG.whatsappDisplay}</span></div>
                      <div><strong>المصدر المركزي لبيئة العمل:</strong> <code className="bg-slate-200 px-2 py-0.5 rounded font-mono">import.meta.env.VITE_WHATSAPP_NUMBER</code></div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
          >
            إغلاق لوحة الإدارة
          </button>
        </div>

      </div>

    </div>
  );
};
