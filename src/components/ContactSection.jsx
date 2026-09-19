import React from 'react';
import { MessageCircle, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
            تواصل مباشر وحظي
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            نحن هنا لخدمتكم واستقبال الطلبيات
          </h2>
          <p className="text-slate-300 text-sm">
            لأي استفسار عن الأصناف الصيدلانية، التوريد، أو متابعة الطلبات، يسعدنا تواصلكم عبر WhatsApp أو الاتصال.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          
          {/* Main WhatsApp Banner Card */}
          <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950/90 p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 fill-emerald-400/20" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg">واتساب المبيعات الرسمي</h3>
                <p className="text-xs text-emerald-200">متاح لاستقبال الطلبات الفورية</p>
              </div>
            </div>

            <div className="dir-ltr text-right">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                {STORE_CONFIG.whatsappDisplay}
              </div>
            </div>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-lg transition-all text-sm"
            >
              <span>بدء محادثة WhatsApp الآن</span>
              <ArrowLeft className="w-4 h-4 me-1" />
            </a>
          </div>

          {/* Contact Details List */}
          <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 space-y-5 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5 text-sm">مقر المبيعات:</strong>
                <span>{STORE_CONFIG.locationAr}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-700/60 pt-4">
              <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5 text-sm">ساعات العمل:</strong>
                <span>{STORE_CONFIG.workingHoursAr}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-700/60 pt-4">
              <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5 text-sm">البريد الإلكتروني:</strong>
                <span className="font-mono text-slate-300">{STORE_CONFIG.email}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
