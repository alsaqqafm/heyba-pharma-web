import { STORE_CONFIG } from "../config/storeConfig";

/**
 * Calculates the exact bonus quantity for an item based on its quantity and bonus rules.
 * e.g., if threshold is 10 and free is 1, quantity 25 gives 2 bonus units.
 */
export const calculateItemBonus = (item) => {
  if (!item.bonusThreshold || !item.bonusFreeQuantity || item.bonusThreshold <= 0) {
    return 0;
  }
  const multiplier = Math.floor((item.quantity || 1) / item.bonusThreshold);
  return multiplier * item.bonusFreeQuantity;
};

/**
 * Builds the structured WhatsApp text message and opens the official WhatsApp chat link.
 */
export const generateWhatsAppOrder = (customerData, cartItems, grandTotal, paymentMethod, creditDetails) => {
  const number = STORE_CONFIG.whatsappNumber;
  const currency = STORE_CONFIG.currency;

  let message = `🧾 *طلب جديد — ${STORE_CONFIG.nameEn} | ${STORE_CONFIG.nameAr}*\n\n`;

  // Customer Information
  message += `👤 *بيانات العميل:*\n`;
  message += `• *الاسم:* ${customerData.fullName || "غير محدد"}\n`;
  message += `• *رقم الهاتف:* ${customerData.phone || "غير محدد"}\n`;
  if (customerData.pharmacyName) {
    message += `• *الصيدلية/المركز:* ${customerData.pharmacyName}\n`;
  }
  message += `• *المدينة:* ${customerData.city || "غير محدد"}\n`;
  if (customerData.district) {
    message += `• *المنطقة:* ${customerData.district}\n`;
  }
  if (customerData.address) {
    message += `• *العنوان:* ${customerData.address}\n`;
  }

  // Payment Method
  message += `\n💳 *طريقة الدفع:*\n`;
  if (paymentMethod === "credit") {
    message += `• *آجل / ائتمان*\n`;
    if (creditDetails?.accountOwner) {
      message += `• *صاحب الحساب/المسؤول:* ${creditDetails.accountOwner}\n`;
    }
    if (creditDetails?.creditNotes) {
      message += `• *ملاحظات الآجل:* ${creditDetails.creditNotes}\n`;
    }
  } else {
    message += `• *نقدي*\n`;
  }

  // Order Items
  message += `\n💊 *تفاصيل الطلب:*\n`;
  let totalBonusCount = 0;

  cartItems.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    const bonusQty = calculateItemBonus(item);
    totalBonusCount += bonusQty;

    message += `${index + 1}. *${item.name}*\n`;
    message += `   • الكمية: ${item.quantity} ${item.unit || "قطع"}\n`;
    message += `   • السعر: ${item.price.toLocaleString()} ${currency}\n`;
    if (bonusQty > 0) {
      message += `   • 🎁 البونص: +${bonusQty} مجاناً (${item.bonus})\n`;
    }
    message += `   • الإجمالي الفرعي: ${itemSubtotal.toLocaleString()} ${currency}\n\n`;
  });

  message += `----------------------------\n`;
  message += `💰 *إجمالي الطلب:* ${grandTotal.toLocaleString()} ${currency}\n`;
  if (totalBonusCount > 0) {
    message += `🎁 *إجمالي البونص المجاني:* ${totalBonusCount} قطعة/وحدة مجانية\n`;
  }

  if (customerData.notes && customerData.notes.trim() !== "") {
    message += `📝 *ملاحظات العميل:* ${customerData.notes}\n`;
  }

  message += `\n*يرجى تأكيد استلام الطلب وتوضيح أي ملاحظات أو تعديلات مطلوبة.*`;

  // Encode message for URI
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://wa.me/${number}?text=${encodedText}`;

  return {
    waUrl,
    message,
    number
  };
};
