import { Invoice } from '../data/mockInvoices';
import { formatCurrency } from '../utils/currency';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Linking, Alert } from 'react-native';
import { SHREE_GANESH_LOGO_BASE64 } from '../assets/logoBase64';

// Number to Words in Indian English / Hindi format
export function numberToWords(num: number): string {
  const a = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
    'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ];
  const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  const n = Math.floor(num);
  if (n === 0) return 'ZERO RUPEES ONLY';

  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' THOUSAND' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' LAKH' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' CRORE' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  }

  return convert(n) + ' RUPEES ONLY';
}

export const pdfService = {
  generateInvoiceHtml(invoice: Invoice): string {
    const customer = invoice.customer || {
      name: invoice.customerName || 'माधव वर्मा (madhaw verma)',
      phone: invoice.customerPhone || '8770152422',
      address: 'माधव वर्मा (MADHAW VERMA)',
    };

    const customerName = invoice.customerName || customer.name || 'माधव वर्मा (madhaw verma)';
    const customerPhone = invoice.customerPhone || customer.phone || '8770152422';
    const customerAddress = customer.address || 'माधव वर्मा (MADHAW VERMA)';
    const now = new Date();
    const currentDateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const currentTimeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const invNumber = invoice.invoiceNumber || 'MG-2627-0001';
    const invDate = invoice.date || currentDateFormatted;
    const invTime = invoice.time || currentTimeFormatted;
    const salesPerson = 'अंकित वर्मा (Ankit Verma)';
    const memNo = 'MEM-2414';

    const items = invoice.items && invoice.items.length > 0
      ? invoice.items
      : [
          {
            id: '1',
            description: 'प्रोग्रेसिव लेंस और फ्रेम / PROGRESSIVE LENS & FRAME',
            qty: 1,
            unitPrice: 1000.0,
            amount: 1000.0,
          },
        ];

    // Compute sums dynamically based on the exact invoice data set by admin
    const totalQty = items.reduce((acc, i) => acc + (i.qty || 1), 0);
    const grossTotal = items.reduce((acc, i) => acc + (i.amount || (i.unitPrice || 0) * (i.qty || 1)), 0);
    const grandTotal = typeof invoice.total === 'number' && invoice.total >= 0 ? invoice.total : grossTotal;
    const paidAmount = typeof invoice.paidAmount === 'number' ? invoice.paidAmount : (invoice.status === 'Paid' ? grandTotal : 0);
    const dueAmount = typeof invoice.dueAmount === 'number' ? invoice.dueAmount : Math.max(0, grandTotal - paidAmount);
    const paymentMethod = invoice.paymentMethod || 'Cash';
    const invoiceStatus = invoice.status || (dueAmount === 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Pending'));

    // Accurate GST breakdown calculation (inclusive or added according to total)
    const taxableTotal = Math.max(0, Math.round(grandTotal / 1.18 * 100) / 100);
    const totalGst = Math.max(0, Math.round((grandTotal - taxableTotal) * 100) / 100);
    const cgstVal = Math.round(totalGst / 2 * 100) / 100;
    const sgstVal = Math.round(totalGst / 2 * 100) / 100;

    const amountInWords = numberToWords(grandTotal);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invNumber}</title>
        <style>
          @page { size: A4; margin: 12mm 10mm; }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            margin: 0;
            padding: 8px;
            font-size: 11px;
            line-height: 1.25;
          }
          .main-wrapper {
            border: 2px solid #1e293b;
            padding: 12px 14px 14px 14px;
            background: #ffffff;
            max-width: 820px;
            margin: auto;
          }

          /* 1. Header Section Exact Match */
          .shop-header {
            text-align: center;
            margin-bottom: 8px;
            padding-bottom: 2px;
          }
          .logo-img {
            width: 72px;
            height: 72px;
            object-fit: contain;
            margin: 0 auto 4px auto;
            display: block;
          }
          .shop-title {
            font-size: 18px;
            font-weight: 900;
            color: #000000;
            margin: 2px 0 1px 0;
            letter-spacing: 0.2px;
          }
          .shop-sub {
            font-size: 10px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 2px;
          }
          .shop-address {
            font-size: 10px;
            color: #000000;
            line-height: 1.35;
          }
          .gst-line {
            font-size: 10.5px;
            font-weight: 800;
            color: #000000;
            margin-top: 2px;
          }

          /* 2. Invoice Number & Date Top Bar */
          .invoice-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #000000;
            border-bottom: 1px solid #000000;
            padding: 6px 4px;
            margin-bottom: 8px;
          }
          .inv-left {
            border: 1px dashed #64748b;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 800;
            color: #000000;
            background: #ffffff;
          }
          .inv-right {
            text-align: right;
            font-size: 10.5px;
            line-height: 1.4;
          }
          .inv-right strong {
            font-weight: 800;
          }

          /* 3. Dual Customer Info Box (Exact Match) */
          .dual-customer-box {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
          }
          .cust-col {
            flex: 1;
            border: 1px solid #000000;
            padding: 6px 8px;
            font-size: 10px;
            line-height: 1.4;
          }
          .cust-heading {
            font-size: 10px;
            font-weight: 900;
            text-decoration: underline;
            margin-bottom: 4px;
            color: #000000;
          }
          .cust-row {
            margin-bottom: 1.5px;
          }
          .cust-label {
            font-weight: 800;
            color: #000000;
          }

          /* 4. Main 14-Column Table Exact Match */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            border: 1px solid #000000;
          }
          .items-table th {
            border: 1px solid #000000;
            background-color: #ffffff;
            font-size: 9.5px;
            font-weight: 800;
            text-align: center;
            padding: 5px 2px;
            color: #000000;
            line-height: 1.15;
          }
          .items-table td {
            border: 1px solid #000000;
            padding: 6px 4px;
            font-size: 9.5px;
            vertical-align: middle;
            color: #000000;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: 800; }
          .item-desc {
            font-weight: 800;
            font-size: 10px;
            color: #000000;
          }
          .item-sub {
            font-size: 8.5px;
            color: #334155;
            margin-top: 2px;
            line-height: 1.25;
          }
          .grand-total-row td {
            background-color: #ffffff;
            font-weight: 800;
            font-size: 10px;
          }

          /* 5. Finance Section Split */
          .finance-split {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
          }
          .finance-left {
            flex: 1.15;
          }
          .words-box {
            font-size: 10px;
            margin-bottom: 6px;
          }
          .words-label {
            font-weight: 800;
            text-decoration: underline;
          }
          .words-val {
            font-weight: 800;
            color: #000000;
            margin-top: 2px;
          }
          .payment-box {
            border: 1px solid #000000;
            padding: 6px 8px;
            margin-bottom: 6px;
            font-size: 10px;
            line-height: 1.45;
          }
          .pay-title {
            font-weight: 900;
            text-decoration: underline;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
          }
          .pay-badge {
            background: #ffffff;
            border: 1px solid #000000;
            padding: 1px 6px;
            border-radius: 3px;
            font-weight: 800;
          }
          .pay-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          .loyalty-text {
            color: #059669;
            font-weight: 800;
            font-size: 10px;
          }

          /* Financial Right Box (Totals) */
          .finance-right {
            flex: 0.95;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .totals-table-box {
            border: 1px solid #000000;
            padding: 6px 8px;
            font-size: 10px;
            line-height: 1.45;
          }
          .tot-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          .grand-total-banner {
            border: 2px solid #000000;
            padding: 6px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            margin-top: 6px;
          }
          .grand-total-label {
            font-size: 11px;
            font-weight: 900;
            color: #000000;
            line-height: 1.25;
          }
          .grand-total-val {
            font-size: 17px;
            font-weight: 900;
            color: #000000;
          }

          /* 6. Tax Breakup Table & Signature */
          .tax-and-signature-row {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 8px;
          }
          .tax-breakup-col {
            display: none !important;
            flex: 1.2;
          }
          .tax-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000000;
          }
          .tax-table th {
            border: 1px solid #000000;
            background: #ffffff;
            font-size: 9px;
            font-weight: 800;
            padding: 4px 2px;
            text-align: center;
          }
          .tax-table td {
            border: 1px solid #000000;
            font-size: 9.5px;
            padding: 4px 3px;
            text-align: center;
          }
          .signature-col {
            flex: 1;
            text-align: center;
            padding-top: 10px;
          }
          .sign-store-title {
            font-size: 11px;
            font-weight: 900;
            color: #000000;
            margin-bottom: 24px;
          }
          .sign-line {
            font-size: 10px;
            font-weight: 800;
            border-top: 1px solid #000000;
            padding-top: 4px;
            display: inline-block;
            width: 85%;
          }

          /* 7. Terms & Conditions Box Exact Match */
          .terms-box {
            border: 1px solid #000000;
            padding: 6px 8px;
            font-size: 9px;
            line-height: 1.35;
            margin-bottom: 6px;
          }
          .terms-heading {
            font-size: 9.5px;
            font-weight: 900;
            text-decoration: underline;
            margin-bottom: 4px;
          }
          .terms-columns {
            display: flex;
            gap: 10px;
          }
          .terms-col {
            flex: 1;
          }
          .terms-col-heading {
            font-weight: 800;
            text-decoration: underline;
            margin-bottom: 2px;
          }
          ul.terms-list {
            margin: 0;
            padding-left: 12px;
          }
          ul.terms-list li {
            margin-bottom: 1.5px;
          }

          /* 8. Bottom Thank You */
          .bottom-thank-you {
            text-align: center;
            font-size: 10px;
            font-weight: 800;
            color: #000000;
            padding-top: 4px;
          }
        </style>
      </head>
      <body>
        <div class="main-wrapper">
          <!-- 1. Header Section Exact Match -->
          <div class="shop-header">
            <img src="${SHREE_GANESH_LOGO_BASE64}" class="logo-img" alt="Shree Ganesh Optical Logo" />
            <div class="shop-title">श्री गणेश ऑप्टिकल / SHREE GANESH OPTICAL</div>
            <div class="shop-sub">चश्मे, लेंस एवं फ्रेम के विक्रेता / Dealer in Eyeglasses, Lenses & Frames</div>
            <div class="shop-address">इंग्लिशपुरा, सीहोर (म.प्र.)<br><strong>📞 संपर्क / Contact: +91 6263732857</strong></div>
            <div style="font-size: 13px; font-weight: 900; margin-top: 6px; letter-spacing: 1px; color: #04281B; text-transform: uppercase; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; padding: 3px 0;">
              कस्टमर बिल रसीद / CASH MEMO / RETAIL INVOICE
            </div>
          </div>

          <!-- 2. Invoice & Sales Info Bar -->
          <div class="invoice-top-bar">
            <div class="inv-left">
              बिल नंबर / Bill No : <strong>${invNumber}</strong>
            </div>
            <div class="inv-right">
              दिनांक / Date : <strong>${invDate}</strong> &nbsp; समय / Time : <strong>${invTime}</strong><br>
              विक्रेता / Sales Person : <strong>${salesPerson}</strong>
            </div>
          </div>

          <!-- 3. Dual Customer Info Box -->
          <div class="dual-customer-box">
            <!-- Billed To -->
            <div class="cust-col">
              <div class="cust-heading">ग्राहक का विवरण / DETAILS OF RECEIVER (BILLED TO)</div>
              <div class="cust-row"><span class="cust-label">ग्राहक नाम / Name :</span> <strong>${customerName}</strong></div>
              <div class="cust-row"><span class="cust-label">सदस्यता संख्या / Mem No :</span> ${memNo}</div>
              <div class="cust-row"><span class="cust-label">मोबाइल / Mobile :</span> <strong>${customerPhone}</strong></div>
              <div class="cust-row"><span class="cust-label">पता / Address :</span> ${customerAddress}</div>
            </div>

            <!-- Shipped To -->
            <div class="cust-col">
              <div class="cust-heading">प्राप्तकर्ता विवरण / DETAILS OF CONSIGNEE (SHIPPED TO)</div>
              <div class="cust-row"><span class="cust-label">ग्राहक नाम / Name :</span> <strong>${customerName}</strong></div>
              <div class="cust-row"><span class="cust-label">सदस्यता संख्या / Mem No :</span> ${memNo}</div>
              <div class="cust-row"><span class="cust-label">मोबाइल / Mobile :</span> <strong>${customerPhone}</strong></div>
              <div class="cust-row"><span class="cust-label">पता / Address :</span> ${customerAddress}</div>
            </div>
          </div>

          <!-- 4. Items Table (Simple Clean Table) -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%;">क्र.<br>S.NO.</th>
                <th style="width: 52%;">सामग्री विवरण /<br>DESCRIPTION OF GOODS</th>
                <th style="width: 12%;">मात्रा /<br>QTY</th>
                <th style="width: 14%;">भाव /<br>RATE</th>
                <th style="width: 14%;">योग /<br>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, idx) => {
                const itemRate = item.unitPrice || 1000.0;
                const itemQty = item.qty || 1;
                const itemTotal = itemRate * itemQty;

                return `
                  <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td>
                      <div class="item-desc">${item.description}</div>
                      <div class="item-sub">Optical Quality Verified</div>
                    </td>
                    <td class="text-center bold">${itemQty}</td>
                    <td class="text-right">₹ ${itemRate.toFixed(2)}</td>
                    <td class="text-right bold">₹ ${itemTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
              <tr class="grand-total-row">
                <td colspan="2" class="text-right">कुल योग / TOTAL ITEMS</td>
                <td class="text-center bold">${totalQty}</td>
                <td></td>
                <td class="text-right bold">₹ ${grossTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- 5. Finance Section Split -->
          <div class="finance-split">
            <!-- Left: Amount in Words + Payment Details -->
            <div class="finance-left">
              <div class="words-box">
                <span class="words-label">कुल राशि शब्दों में (AMOUNT IN WORDS):</span><br>
                <div class="words-val">${amountInWords} (लगभग)</div>
              </div>

              <div class="payment-box">
                <div class="pay-title">
                  <span>भुगतान विवरण (PAYMENT DETAILS):</span>
                  <span class="pay-badge">${paymentMethod.toUpperCase()} (${invoiceStatus.toUpperCase()})</span>
                </div>
                <div class="pay-row">
                  <span>प्राप्त राशि (Paid / Advance)</span>
                  <strong>: ₹ ${paidAmount.toFixed(2)}</strong>
                </div>
                ${dueAmount > 0 ? `
                <div class="pay-row" style="color: #b91c1c; font-weight: bold;">
                  <span>बकाया राशि (Balance Due)</span>
                  <strong>: ₹ ${dueAmount.toFixed(2)}</strong>
                </div>
                ` : `
                <div class="pay-row" style="color: #15803d; font-weight: bold;">
                  <span>भुगतान स्थिति (Status)</span>
                  <strong>: Full Paid (पूर्ण भुगतान)</strong>
                </div>
                `}
                <div class="pay-row">
                  <span>Cashier / Collected by</span>
                  <span>: Admin</span>
                </div>
                <div class="pay-row">
                  <span class="loyalty-text">भुगतान मोड (Mode)</span>
                  <span class="loyalty-text">: ${paymentMethod}</span>
                </div>
              </div>
            </div>

            <!-- Right: Gross & Total Payable -->
            <div class="finance-right">
              <div class="totals-table-box">
                <div class="tot-row">
                  <span>सकल राशि (Gross Total)</span>
                  <strong>₹ ${grossTotal.toFixed(2)}</strong>
                </div>
                ${paidAmount > 0 ? `
                <div class="tot-row" style="color: #15803d; font-weight: bold;">
                  <span>जमा राशि (Received)</span>
                  <span>₹ ${paidAmount.toFixed(2)}</span>
                </div>
                ` : ''}
                ${dueAmount > 0 ? `
                <div class="tot-row" style="color: #b91c1c; font-weight: bold;">
                  <span>बाकी उधार (Due Balance)</span>
                  <span>₹ ${dueAmount.toFixed(2)}</span>
                </div>
                ` : ''}
              </div>

              <!-- Grand Total Banner Box -->
              <div class="grand-total-banner">
                <div class="grand-total-label">
                  कुल देय राशि<br>NET PAYABLE
                </div>
                <div class="grand-total-val">₹ ${grandTotal.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <!-- 6. Store Seal & Signature Row -->
          <div class="tax-and-signature-row" style="justify-content: flex-end;">
            <!-- Signature Column -->
            <div class="signature-col" style="min-width: 260px;">
              <div class="sign-store-title">श्री गणेश ऑप्टिकल / SHREE GANESH OPTICAL</div>
              <div class="sign-line" style="margin-top: 36px;">अधिकृत हस्ताक्षरकर्ता / AUTHORISED SIGNATORY</div>
            </div>
          </div>

          <!-- 7. Terms & Conditions Box Exact Match -->
          <div class="terms-box">
            <div class="terms-heading">दुकान के नियम एवं शर्तें / TERMS & CONDITIONS :</div>
            <div class="terms-columns">
              <!-- Left Terms Column -->
              <div class="terms-col">
                <div class="terms-col-heading">• 7-दिन एक्सचेंज नीति (7-Day Exchange Policy)</div>
                <ul class="terms-list">
                  <li>लेंस या फ्रेम टूटा हुआ नहीं होना चाहिए (Lens or frame must not be broken/damaged)</li>
                  <li>केवल एक्सचेंज उपलब्ध है, नकद वापसी नहीं (Exchange only, no cash refund)</li>
                  <li>लॉयल्टी पॉइंट्स 6 माह में समाप्त होंगे (Loyalty Points expire in 6 months).</li>
                </ul>
                <div class="terms-col-heading" style="margin-top: 4px;">• फ्री सर्विसिंग एवं स्क्रू टाइटनिंग (Free servicing and screw tightening)</div>
                <ul class="terms-list">
                  <li>चश्मा सामान्य स्थिति में होना चाहिए।</li>
                </ul>
              </div>

              <!-- Right Maintenance Column -->
              <div class="terms-col">
                <div class="terms-col-heading">• चश्मे की देखभाल के टिप्स (Eyewear Care Tips)</div>
                <ul class="terms-list">
                  <li>चश्मे को हमेशा दोनों हाथों से पहनें व उतारें</li>
                  <li>लेंस को सॉफ्ट माइक्रोफाइबर कपड़े से ही साफ करें</li>
                  <li>लेंस को कभी भी खुरदरी सतह या नीचे की ओर न रखें</li>
                  <li>चश्मे को हमेशा केस (डिब्बे) में सुरक्षित रखें</li>
                  <li>फ्रेम पर 6 महीने की वारंटी (6 Months warranty on frames, terms apply)</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 8. Bottom Thank You Exact Match -->
          <div class="bottom-thank-you">
            ** हमारे साथ खरीदारी करने के लिए आपका हार्दिक धन्यवाद • THANK YOU FOR SHOPPING WITH US **
          </div>
        </div>
      </body>
      </html>
    `;
  },

  async createPdfFile(invoice: Invoice): Promise<string> {
    const html = this.generateInvoiceHtml(invoice);
    // Request base64 output as well to ensure safe storage in app cache accessible by Android FileProvider
    const printResult = await Print.printToFileAsync({ html, base64: true });
    
    try {
      if (printResult.base64 && FileSystem.cacheDirectory) {
        const safeInvNum = (invoice.invoiceNumber || 'receipt').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `Invoice_${safeInvNum}.pdf`;
        const destUri = `${FileSystem.cacheDirectory}${filename}`;
        
        await FileSystem.writeAsStringAsync(destUri, printResult.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return destUri;
      }
    } catch (e) {
      console.warn('Error saving PDF to cache directory, using default uri:', e);
    }
    return printResult.uri;
  },

  async sharePdf(invoice: Invoice): Promise<string> {
    try {
      const uri = await this.createPdfFile(invoice);

      // Check if native sharing is supported on this platform
      const isAvailable = await Sharing.isAvailableAsync().catch(() => false);
      if (isAvailable && uri) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share Invoice ${invoice.invoiceNumber || 'Invoice'}`,
          UTI: '.pdf',
        });
        return uri;
      }

      // Safe Fallback: If Android file provider rejects raw file URL, trigger WhatsApp
      const phone = invoice.customerPhone || invoice.customer?.phone || '';
      const cleanDigits = phone.replace(/[^0-9]/g, '');
      const targetPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
      if (targetPhone) {
        const msg = encodeURIComponent(
          `श्री गणेश ऑप्टिकल (Shree Ganesh Optical) - Bill #${invoice.invoiceNumber || ''} of Rs ${invoice.total || ''} for ${invoice.customerName || 'Customer'}.`
        );
        Linking.openURL(`https://wa.me/${targetPhone}?text=${msg}`);
      }
      return uri;
    } catch (err: any) {
      console.warn('PDF Sharing error:', err);
      // Fallback on error to ensure user flow is never blocked
      const phone = invoice.customerPhone || invoice.customer?.phone || '';
      const cleanDigits = phone.replace(/[^0-9]/g, '');
      const targetPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
      if (targetPhone) {
        const msg = encodeURIComponent(
          `श्री गणेश ऑप्टिकल (Shree Ganesh Optical) - Bill #${invoice.invoiceNumber || ''} of Rs ${invoice.total || ''} for ${invoice.customerName || 'Customer'}.`
        );
        Linking.openURL(`https://wa.me/${targetPhone}?text=${msg}`);
      }
      return '';
    }
  },

  async shareDirectToWhatsApp(invoice: Invoice, phone?: string, messageText?: string): Promise<string> {
    try {
      const uri = await this.createPdfFile(invoice);
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Share Invoice ${invoice.invoiceNumber || 'MG-2627-0001'}`,
        });
      }
      return uri;
    } catch (err) {
      // Fallback: If share is rejected by OS, open WhatsApp with text details
      if (phone) {
        const cleanDigits = phone.replace(/[^0-9]/g, '');
        const targetPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
        const msg = messageText ? encodeURIComponent(messageText) : '';
        Linking.openURL(`https://wa.me/${targetPhone}?text=${msg}`);
      }
      return '';
    }
  },

  async printInvoice(invoice: Invoice) {
    const html = this.generateInvoiceHtml(invoice);
    await Print.printAsync({ html });
  },
};
