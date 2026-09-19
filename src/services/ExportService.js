import { STORE_CONFIG } from "../config/storeConfig";
import { calculateItemBonus } from "./WhatsAppService";

/**
 * Downloads a UTF-8 encoded CSV file with BOM so Arabic characters display perfectly in Microsoft Excel.
 */
export const exportOrderToExcel = (orderData) => {
  const { customer, cart, total, paymentMethod, creditDetails, id, date } = orderData;
  const currency = STORE_CONFIG.currency;

  let csvContent = "\uFEFF"; // UTF-8 BOM for Excel Arabic support

  // Header Section
  csvContent += `فاتورة طلبية — ${STORE_CONFIG.nameAr} (${STORE_CONFIG.nameEn})\n`;
  csvContent += `رقم الطلبية,${id || Date.now()}\n`;
  csvContent += `التاريخ,${new Date(date || Date.now()).toLocaleString('ar-YE')}\n`;
  csvContent += `اسم العميل,${customer.fullName || 'غير محدد'}\n`;
  csvContent += `الصيدلية / المركز,${customer.pharmacyName || 'غير محدد'}\n`;
  csvContent += `رقم الهاتف,${customer.phone || 'غير محدد'}\n`;
  csvContent += `المدينة والمنطقة,${customer.city || ''} ${customer.district ? '- ' + customer.district : ''}\n`;
  csvContent += `طريقة الدفع,${paymentMethod === 'credit' ? 'آجل (ائتمان)' : 'نقدي'}\n`;
  if (paymentMethod === 'credit' && creditDetails?.accountOwner) {
    csvContent += `صاحب الحساب/المسؤول,${creditDetails.accountOwner}\n`;
  }
  csvContent += `\n`;

  // Items Table Header
  csvContent += `م,اسم المنتج,الكمية المطلوبة,البونص المجاني,الوحدة,سعر المفرد (${currency}),الإجمالي الفرعي (${currency})\n`;

  // Items Rows
  cart.forEach((item, index) => {
    const bonus = calculateItemBonus(item);
    const itemSubtotal = item.price * item.quantity;
    const nameSanitized = `"${(item.name || '').replace(/"/g, '""')}"`;
    const unitSanitized = `"${(item.unit || '').replace(/"/g, '""')}"`;

    csvContent += `${index + 1},${nameSanitized},${item.quantity},${bonus > 0 ? '+' + bonus : '0'},${unitSanitized},${item.price},${itemSubtotal}\n`;
  });

  csvContent += `\n`;
  csvContent += `,,,إجمالي الطلبية,,${total} ${currency}\n`;

  // Download Trigger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `طلب_هيبا_فارما_${id || Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports multiple orders log to Excel CSV sheet
 */
export const exportAllOrdersToExcel = (ordersLog) => {
  if (!ordersLog || ordersLog.length === 0) return;

  const currency = STORE_CONFIG.currency;
  let csvContent = "\uFEFF"; // UTF-8 BOM

  csvContent += `سجل طلبات متجر ${STORE_CONFIG.nameAr} - ${new Date().toLocaleDateString('ar-YE')}\n\n`;
  csvContent += `رقم الطلب,التاريخ,اسم العميل,الصيدلية/المركز,رقم الهاتف,المدينة,طريقة الدفع,عدد الأصناف,إجمالي الطلب (${currency})\n`;

  ordersLog.forEach((order) => {
    const cust = order.customer || {};
    const itemsCount = (order.cart || []).length;
    const dateFormatted = new Date(order.date).toLocaleString('ar-YE');
    const payMethod = order.paymentMethod === 'credit' ? 'آجل' : 'نقدي';

    csvContent += `${order.id},"${dateFormatted}","${cust.fullName || ''}","${cust.pharmacyName || ''}","${cust.phone || ''}","${cust.city || ''}","${payMethod}",${itemsCount},${order.total}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `سجل_طلبات_هيبا_فارما_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Opens a styled printable HTML invoice window that triggers the browser's PDF save/print.
 */
export const printInvoicePDF = (orderData) => {
  const { customer, cart, total, paymentMethod, creditDetails, id, date } = orderData;
  const currency = STORE_CONFIG.currency;
  const invoiceNumber = id || Date.now();
  const invoiceDate = new Date(date || Date.now()).toLocaleDateString('ar-YE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let totalBonusCount = 0;
  cart.forEach(item => {
    totalBonusCount += calculateItemBonus(item);
  });

  const printWindow = window.open('', '_blank', 'width=900,height=900');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لفتح الفاتورة للطباعة وحفظها كـ PDF');
    return;
  }

  const itemsHtml = cart.map((item, idx) => {
    const bonus = calculateItemBonus(item);
    const subtotal = item.price * item.quantity;
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">
          <div style="font-weight: bold; color: #0f172a;">${item.name}</div>
          ${item.nameEn ? `<div style="font-size: 11px; color: #64748b;">${item.nameEn}</div>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${item.quantity} ${item.unit || ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">
          ${bonus > 0 ? `+${bonus} مجاناً` : '-'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.price.toLocaleString()} ${currency}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: bold; color: #0f172a;">${subtotal.toLocaleString()} ${currency}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة طلبية رقم #${invoiceNumber} - ${STORE_CONFIG.nameAr}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
        body { margin: 0; padding: 25px; color: #1e293b; background: #fff; font-size: 13px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; }
        .logo-box { text-align: right; }
        .logo-title { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; }
        .logo-sub { font-size: 12px; color: #0d9488; font-weight: 700; margin-top: 2px; }
        .invoice-details { text-align: left; background: #f8fafc; padding: 12px 18px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .invoice-details h2 { margin: 0; font-size: 16px; color: #0f172a; }
        .invoice-details p { margin: 3px 0 0 0; font-size: 12px; color: #64748b; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
        .card-title { font-size: 12px; font-weight: 800; color: #0d9488; margin-bottom: 8px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
        .card-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        th { background: #0f172a; color: #ffffff; padding: 10px; font-size: 12px; font-weight: 700; }
        th:first-child { border-radius: 0 8px 8px 0; }
        th:last-child { border-radius: 8px 0 0 8px; }
        
        .summary-box { display: flex; justify-content: space-between; align-items: flex-start; background: #f0fdf4; border: 1px solid #a7f3d0; padding: 15px; border-radius: 12px; margin-bottom: 25px; }
        .summary-total { text-align: left; }
        .grand-price { font-size: 22px; font-weight: 900; color: #047857; }
        
        .footer-note { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; }
        .stamp-box { display: flex; justify-content: space-between; margin-top: 30px; padding: 0 30px; }
        .stamp { text-align: center; font-size: 12px; color: #475569; font-weight: 700; }
        .stamp-line { width: 140px; border-bottom: 2px dashed #94a3b8; margin-top: 40px; }

        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>

      <div class="no-print" style="background: #e0f2fe; border: 1px solid #bae6fd; color: #0369a1; padding: 10px 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; font-weight: bold;">
        💡 اضغط زر "طباعة / حفظ كـ PDF" بالأسفل أو من خيارات المتصفح (Ctrl + P) لحفظ الفاتورة بصيغة PDF.
        <br>
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 8px;">
          🖨️ طباعة / حفظ كـ PDF الآن
        </button>
      </div>

      <!-- Invoice Header -->
      <div class="header">
        <div class="logo-box">
          <h1 class="logo-title">${STORE_CONFIG.nameAr}</h1>
          <div class="logo-sub">${STORE_CONFIG.taglineAr}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">الواتساب المباشر: ${STORE_CONFIG.whatsappDisplay}</div>
        </div>
        <div class="invoice-details">
          <h2>فاتورة طلبية رسمية</h2>
          <p><strong>رقم الفاتورة:</strong> #${invoiceNumber}</p>
          <p><strong>تاريخ الإصدار:</strong> ${invoiceDate}</p>
        </div>
      </div>

      <!-- Customer & Payment Info -->
      <div class="info-grid">
        <div class="card">
          <div class="card-title">👤 بيانات الصيدلية / العميل</div>
          <div class="card-row"><span>اسم العميل:</span> <strong>${customer.fullName || 'غير محدد'}</strong></div>
          <div class="card-row"><span>الصيدلية / المركز:</span> <strong>${customer.pharmacyName || 'غير محدد'}</strong></div>
          <div class="card-row"><span>رقم التواصل:</span> <strong>${customer.phone || 'غير محدد'}</strong></div>
          <div class="card-row"><span>المنطقة / العنوان:</span> <strong>${customer.city || ''} ${customer.district ? '- ' + customer.district : ''}</strong></div>
        </div>

        <div class="card">
          <div class="card-title">💳 تفاصيل الدفع والائتمان</div>
          <div class="card-row"><span>طريقة الدفع:</span> <strong>${paymentMethod === 'credit' ? 'آجل (حساب ائتماني)' : 'دفع نقدي'}</strong></div>
          ${paymentMethod === 'credit' && creditDetails?.accountOwner ? `<div class="card-row"><span>صاحب الحساب/المسؤول:</span> <strong>${creditDetails.accountOwner}</strong></div>` : ''}
          ${paymentMethod === 'credit' && creditDetails?.creditNotes ? `<div class="card-row"><span>ملاحظات الآجل:</span> <strong>${creditDetails.creditNotes}</strong></div>` : ''}
          <div class="card-row"><span>حالة الطلب:</span> <strong style="color: #0d9488;">مرسل ومسجل عبر WhatsApp</strong></div>
        </div>
      </div>

      <!-- Items Table -->
      <table>
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th style="text-align: right;">الصنف الصيدلاني / المنتج</th>
            <th style="width: 100px;">الكمية</th>
            <th style="width: 110px;">البونص</th>
            <th style="width: 110px;">سعر المفرد</th>
            <th style="width: 120px; text-align: left;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Summary -->
      <div class="summary-box">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: #065f46; margin-bottom: 4px;">🎁 ملخص البونص والتجهيز:</div>
          <div style="font-size: 12px; color: #047857;">
            ${totalBonusCount > 0 ? `تم إضافة <strong>+${totalBonusCount} قطعة/وحدة مجانية</strong> بونص تلقائي مع الطلبية.` : 'لا يوجد بونص مجاني مضاف لهذه الطلبية.'}
          </div>
          ${customer.notes ? `<div style="font-size: 11px; color: #475569; margin-top: 6px;"><strong>ملاحظات العميل:</strong> ${customer.notes}</div>` : ''}
        </div>
        
        <div class="summary-total">
          <div style="font-size: 12px; font-weight: 700; color: #475569;">إجمالي الفاتورة المستحق:</div>
          <div class="grand-price">${total.toLocaleString()} ${currency}</div>
        </div>
      </div>

      <!-- Signatures -->
      <div class="stamp-box">
        <div class="stamp">
          توقيع واستلام العميل
          <div class="stamp-line"></div>
        </div>
        <div class="stamp">
          ختم وتوقيع إداري — ${STORE_CONFIG.nameAr}
          <div class="stamp-line"></div>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="footer-note" style="margin-top: 40px;">
        ${STORE_CONFIG.noticeDisclaimer}
        <br>
        شكراً لتعاملكم مع <strong>${STORE_CONFIG.nameAr} (${STORE_CONFIG.nameEn})</strong> — للتواصل: ${STORE_CONFIG.phoneDisplay}
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 600);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
