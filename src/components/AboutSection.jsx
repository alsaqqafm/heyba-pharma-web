import React from 'react';
import { ShieldCheck, Truck, Clock, Award } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <Award className="w-3.5 h-3.5" />
            <span>نبذة عن هيبا فارما</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            المنصة الرائدة في خدمات التوريد والتسهيلات الصيدلانية
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            تسعى <strong>Heyba Pharma (هيبا فارما)</strong> لإعادة تعريف تجربة طلب الأدوية والمستلزمات الطبية عبر تزويد الصيدليات والمراكز الصحية بكتالوج رقمي حديث، سهل التعامل، وسريع الإرسال عبر محرك WhatsApp المباشر.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 hover:border-teal-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">جودة واعتتمادية دوائية</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              جميع الأصناف والمستلزمات الطبية المدرجة مصنعة وفق المعايير القياسية مع الاهتمام بظروف الحفظ والتخزين الدوائي.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 hover:border-emerald-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">سرعة التوريد والاستجابة</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              تصل طلبيتك فورياً عبر WhatsApp مصاغة ومحسوبة مع كافة تفاصيل البونص والإجمالي دون الحاجة للانتظار الطويل.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 hover:border-cyan-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">دفع نقدي وآجل مرن</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              تسهيلات مالية مرنة لدعم الصيدليات والمراكز الطبية تشمل خياري الدفع النقدي أو الدفع الآجل حسب الاتفاق المعتمد.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
