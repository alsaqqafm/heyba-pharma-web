export const STORE_CONFIG = {
  nameEn: "Heyba Pharma",
  nameAr: "هيبا فارما",
  taglineAr: "توريد الأدوية والمنتجات الصيدلانية والمستلزمات الطبية",
  descriptionAr: "المنصة الإلكترونية الأولى لتصفح المنتجات الصيدلانية والطبية، وإرسال الطلبات مباشرة وصياغتها بدقة عبر WhatsApp.",
  
  // Official Centralized WhatsApp Configuration
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "967736577725",
  whatsappDisplay: "+967 736 577 725",
  
  phoneDisplay: "+967 736 577 725",
  email: "info@heyba-pharma.com",
  locationAr: "الجمهورية اليمنية — المركز الرئيسي للمبيعات",
  workingHoursAr: "السبت - الخميس: 8:00 صباحاً - 10:00 مساءً",
  
  currency: "ر.ي",
  
  categories: [
    { id: "all", label: "جميع المنتجات", icon: "Grid" },
    { id: "pharma", label: "أدوية وصيدلانية", icon: "Pill" },
    { id: "vitamins", label: "فيتامينات ومكملات", icon: "HeartPulse" },
    { id: "supplies", label: "مستلزمات طبية", icon: "Stethoscope" },
    { id: "skincare", label: "عناية وحماية صيدلانية", icon: "Sparkles" }
  ],
  
  noticeDisclaimer: "جميع البيانات والأسعار والبونص في هذا الكتالوج مخصصة للعرض وتسهيل عملية الطلب المباشر عبر الصيدليات والمراكز الطبية المعتمدة."
};
