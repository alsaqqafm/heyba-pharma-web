import React from 'react';
import { Pill, Sparkles, MessageCircle, ArrowLeft, HeartPulse, CheckCircle2 } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export const Hero = ({ onExploreProducts }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 text-right space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-500/40 text-teal-300 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>المنصة الرسمية لتوريد المنتجات الطبية الصيدلانية</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              <span className="text-teal-400">{STORE_CONFIG.nameEn}</span>
              <br />
              <span className="text-white">{STORE_CONFIG.nameAr}</span>
              <span className="block text-2xl sm:text-3xl font-bold text-slate-300 mt-3">
                منتجات دوائية وطلبات أسهل وأسرع
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              منصتك الدوائية الشاملة لتصفح كتالوج الأدوية والمستلزمات الطبية بحسابات البونص الفورية، ودعم نظام الدفع النقدي والآجل، وإرسال طلبيتك بضغط زر واحدة مباشرة إلى WhatsApp.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-teal-900/40 hover:shadow-teal-900/60 transition-all transform hover:-translate-y-0.5 text-base"
              >
                <Pill className="w-5 h-5" />
                <span>تصفح المنتجات والكتالوج</span>
                <ArrowLeft className="w-5 h-5 me-1" />
              </button>

              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all text-base"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                <span>اطلب عبر WhatsApp ({STORE_CONFIG.whatsappDisplay})</span>
              </a>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>دفع نقدي وآجل 🧾</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>نظام البونص المباشر 🎁</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>صياغة طلبيات فورية ⚡</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>خدمة مخصصة للصيدليات 🏥</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Display Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-950/80">
              
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <HeartPulse className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Heyba Pharma Card</h3>
                    <p className="text-xs text-slate-400">توريد وتسهيلات دوائية</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  متوفر للطلب
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-black text-sm">
                      17+
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">منتجات متنوعة</div>
                      <div className="text-xs text-slate-400">أدوية، فيتامينات ومستلزمات</div>
                    </div>
                  </div>
                  <span className="text-xs text-teal-400 font-semibold">جاهز للطلب</span>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-950 flex items-center justify-center text-teal-400 font-black text-xs">
                      10+1
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">نظام البونص التلقائي</div>
                      <div className="text-xs text-slate-400">حساب المجانيات فورياً</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">احتساب تلقائي</span>
                </div>

                <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-4 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                  💡 <strong>ملاحظة للمستخدم:</strong> اختر المنتجات، حدد الكمية، وستقوم منصة <strong>هيبا فارما</strong> بإنشاء رسالة WhatsApp معنونة بالبونص والإجمالي.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
