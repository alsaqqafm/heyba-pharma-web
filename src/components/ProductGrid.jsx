import React from 'react';
import { Search, X, PackageX, Pill } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';

export const ProductGrid = () => {
  const { filteredProducts, products, searchQuery, setSearchQuery } = useProducts();

  return (
    <section id="products" className="py-12 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-100/70 px-3 py-1 rounded-full">
              <Pill className="w-3.5 h-3.5" />
              <span>كتالوج الأدوية والمستلزمات</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              المنتجات الصيدلانية المتاحة للطلب
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              تصفح أصناف هيبا فارما المختارة مع حسّاب البونص التلقائي لكل كمية.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="w-full md:w-80 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم المنتج، الصنف، أو الوصف..."
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium py-3 pr-10 pl-10 rounded-2xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 text-slate-400 hover:text-slate-700 p-1"
                  title="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <CategoryFilter />

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>
            عرض <strong className="text-teal-700">{filteredProducts.length}</strong> من أصل {products.length} صنف صيدلاني
          </span>
          {searchQuery && (
            <span>نتائج البحث عن: "<strong className="text-slate-800">{searchQuery}</strong>"</span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-sm my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              عذراً، لم نجد أي منتج يطابق بحثك
            </h3>
            <p className="text-xs text-slate-500">
              تأكد من كتابة اسم صيدلاني صحيح أو اختبر البحث باسم الصنف.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
            >
              <X className="w-4 h-4" />
              <span>إلغاء تصفية البحث</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
