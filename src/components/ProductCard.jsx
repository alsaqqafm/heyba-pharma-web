import React, { useState } from 'react';
import { Pill, HeartPulse, Stethoscope, Sparkles, Plus, Minus, ShoppingBag, Eye, Gift, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { STORE_CONFIG } from '../config/storeConfig';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { setSelectedProductDetails } = useProducts();
  const [qty, setQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'pharma':
        return <Pill className="w-8 h-8 text-teal-600" />;
      case 'vitamins':
        return <HeartPulse className="w-8 h-8 text-emerald-600" />;
      case 'supplies':
        return <Stethoscope className="w-8 h-8 text-cyan-600" />;
      case 'skincare':
        return <Sparkles className="w-8 h-8 text-teal-500" />;
      default:
        return <Pill className="w-8 h-8 text-teal-600" />;
    }
  };

  return (
    <div 
      onClick={() => setSelectedProductDetails(product)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-teal-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Badges */}
      <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Bonus Badge */}
        {product.bonus ? (
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Gift className="w-3.5 h-3.5" />
            <span>بونص: {product.bonus}</span>
          </span>
        ) : <div />}

        {/* Stock Status Badge */}
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
          product.stockStatus === 'available'
            ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200'
            : 'bg-amber-50/90 text-amber-700 border-amber-200'
        }`}>
          {product.stockStatus === 'available' ? 'متوفر' : 'كمية محدودة'}
        </span>
      </div>

      <div>
        {/* Product Visual Container */}
        <div className="relative w-full h-44 bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 flex items-center justify-center p-6 border-b border-slate-100 group-hover:from-teal-50/50 group-hover:to-emerald-50/30 transition-colors">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
            {getCategoryIcon(product.category)}
          </div>
          {product.unit && (
            <span className="absolute bottom-2 right-3 text-[11px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60">
              الوحدة: {product.unit}
            </span>
          )}
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-3">
          
          {/* Title & En Name */}
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.nameEn && (
              <p className="text-xs text-slate-400 font-sans font-medium dir-ltr text-right mt-0.5 truncate">
                {product.nameEn}
              </p>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price Tag */}
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-slate-500 font-semibold">السعر المفرد:</span>
            <div className="text-lg font-black text-slate-900">
              {product.price.toLocaleString()} <span className="text-xs font-bold text-teal-600">{STORE_CONFIG.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 space-y-2">
        {/* Quantity Controller & Add Button */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shrink-0">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors font-bold text-sm"
              title="تقليل الكمية"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-extrabold text-slate-800">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors font-bold text-sm"
              title="زيادة الكمية"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إضافة للطلب</span>
          </button>
        </div>

        {/* View details button */}
        <button
          onClick={() => setSelectedProductDetails(product)}
          className="w-full text-center text-xs font-bold text-slate-500 hover:text-teal-700 py-1 flex items-center justify-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>تفاصيل كاملة والمعلومات الإضافية</span>
        </button>
      </div>

      {/* Added Toast Alert inside card */}
      {addedToast && (
        <div className="absolute inset-x-0 bottom-0 bg-emerald-600 text-white text-xs font-bold py-2 text-center animate-fadeIn flex items-center justify-center gap-1 shadow-inner z-20">
          <CheckCircle className="w-4 h-4" />
          <span>تمت الإضافة للسلة (الكمية: {qty})</span>
        </div>
      )}
    </div>
  );
};
