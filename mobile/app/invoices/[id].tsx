import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  MoreVertical,
  Calendar,
  Printer,
  MessageCircle,
  Mail,
  Share2,
  User,
  Phone,
  MapPin,
  ShoppingCart,
  CreditCard,
  Maximize2,
  ShieldCheck,
  FileText,
  Package,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react-native';
import { mockInvoices, Invoice } from '../../src/data/mockInvoices';
import { formatCurrency } from '../../src/utils/currency';
import { pdfService, numberToWords } from '../../src/services/pdfService';
import { opticalStore } from '../../src/store/opticalStore';

const { width } = Dimensions.get('window');

/**
 * Optical Eyeglasses Logo for Header & Invoice Document
 */
function HeaderGlassesLogo({ color = '#FFFFFF', width = 38, height = 18 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke={color} strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke={color} strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Eyeglasses Vector for Frame Item
 */
function FrameThumbnail() {
  return (
    <Svg width={38} height={18} viewBox="0 0 64 28" fill="none">
      <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
      <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
      <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.8" />
      <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.8" />
    </Svg>
  );
}

/**
 * Lens Vector for Lens Item
 */
function LensThumbnail() {
  return (
    <Svg width={36} height={20} viewBox="0 0 60 30" fill="none">
      <Circle cx="20" cy="15" r="13" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
      <Circle cx="38" cy="16" r="13" stroke="#2563EB" strokeWidth="2" fill="#BFDBFE" />
      <Path d="M12 11 C15 9, 25 9, 28 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * QR Code Graphic for Invoice
 */
function InvoiceQrCode() {
  return (
    <Svg width={54} height={54} viewBox="0 0 52 52" fill="none">
      <Rect width="52" height="52" fill="#FFFFFF" rx="4" />
      <Rect x="4" y="4" width="14" height="14" stroke="#0F172A" strokeWidth="2" fill="#FFFFFF" />
      <Rect x="7" y="7" width="8" height="8" fill="#0F172A" />
      <Rect x="34" y="4" width="14" height="14" stroke="#0F172A" strokeWidth="2" fill="#FFFFFF" />
      <Rect x="37" y="7" width="8" height="8" fill="#0F172A" />
      <Rect x="4" y="34" width="14" height="14" stroke="#0F172A" strokeWidth="2" fill="#FFFFFF" />
      <Rect x="7" y="37" width="8" height="8" fill="#0F172A" />
      <Rect x="22" y="5" width="3" height="3" fill="#0F172A" />
      <Rect x="26" y="8" width="3" height="3" fill="#0F172A" />
      <Rect x="22" y="14" width="3" height="3" fill="#0F172A" />
      <Rect x="5" y="22" width="3" height="3" fill="#0F172A" />
      <Rect x="11" y="25" width="3" height="3" fill="#0F172A" />
      <Rect x="15" y="22" width="3" height="3" fill="#0F172A" />
      <Rect x="22" y="22" width="4" height="4" fill="#0F172A" />
      <Rect x="27" y="26" width="3" height="3" fill="#0F172A" />
      <Rect x="34" y="22" width="4" height="3" fill="#0F172A" />
      <Rect x="42" y="25" width="3" height="4" fill="#0F172A" />
      <Rect x="22" y="34" width="3" height="3" fill="#0F172A" />
      <Rect x="26" y="38" width="4" height="3" fill="#0F172A" />
      <Rect x="22" y="44" width="3" height="3" fill="#0F172A" />
      <Rect x="35" y="35" width="4" height="4" fill="#0F172A" />
      <Rect x="42" y="40" width="3" height="4" fill="#0F172A" />
      <Rect x="35" y="44" width="3" height="3" fill="#0F172A" />
    </Svg>
  );
}

export default function InvoiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Subscribe to live optical store
  const [storeState, setStoreState] = useState(() => opticalStore.getState());
  useEffect(() => {
    return opticalStore.subscribe(() => {
      setStoreState(opticalStore.getState());
    });
  }, []);

  const inv: Invoice | null =
    storeState.invoices.find((i) => i.id === id || i.invoiceNumber === id) ||
    (storeState.invoices.length > 0 ? storeState.invoices[0] : null) ||
    mockInvoices.find((i) => i.id === id || i.invoiceNumber === id) ||
    mockInvoices[0] ||
    null;

  if (!inv) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 20, alignItems: 'center', justifyContent: 'center' }]}>
        <FileText size={48} color="#94A3B8" />
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#475569', marginTop: 12 }}>Invoice Not Found</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.back()}>
          <Text style={styles.backHomeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Find linked customer & order if available
  const customerName = inv.customerName || inv.customer?.name || 'Customer';
  const customerPhone = inv.customerPhone || inv.customer?.phone || '6263732857';
  const customerAddress = inv.customer?.address || 'Sehore (M.P.)';
  const customerEmail = inv.customer?.email || 'customer@optical.com';

  const linkedOrder = storeState.orders.find(
    (o) => o.orderNumber === inv.invoiceNumber || o.id === inv.id
  );

  const orderNumber = linkedOrder?.orderNumber || `ORD-${inv.invoiceNumber.replace(/[^0-9]/g, '') || '001'}`;
  const paymentMode = inv.paymentMethod || linkedOrder?.paymentMethod || 'Cash';
  const orderDate = inv.date || 'Today';
  const orderTime = inv.time || '';

  // Calculate pricing breakdown dynamically
  const items = inv.items && inv.items.length > 0 ? inv.items : [
    { description: 'Complete Eyewear Set', qty: 1, unitPrice: inv.total || 0, amount: inv.total || 0 }
  ];

  const totalAmount = inv.total || items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paidAmount = inv.paidAmount !== undefined ? inv.paidAmount : totalAmount;
  const dueAmount = inv.dueAmount !== undefined ? inv.dueAmount : Math.max(0, totalAmount - paidAmount);
  const taxableAmount = Math.round((totalAmount / 1.05) * 100) / 100;
  const gstAmount = Math.round((totalAmount - taxableAmount) * 100) / 100;
  const amountWords = numberToWords(totalAmount);

  // Status badges
  const isPaid = inv.status === 'Paid' || dueAmount === 0;

  const handleDownloadPdf = async () => {
    try {
      await pdfService.sharePdf(inv);
    } catch (err: any) {
      Alert.alert('PDF Error', `Could not share PDF invoice: ${err?.message || 'Error occurred'}`);
    }
  };

  const handlePrint = async () => {
    try {
      await pdfService.printInvoice(inv);
    } catch (err) {
      Alert.alert('Printer Error', 'Could not send document to printer.');
    }
  };

  const handleWhatsApp = () => {
    const rawDigits = customerPhone.replace(/[^0-9]/g, '');
    const phoneWith91 = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
    const itemsSummary = items.map((it, idx) => `${idx + 1}. ${it.description} (x${it.qty}) - ${formatCurrency(it.amount)}`).join('\n');

    const message = encodeURIComponent(
      `🙏 *श्री गणेश ऑप्टिकल, सीहोर* 🙏\n_इंग्लिशपुरा, सीहोर (म.प्र.)_\n📞 संपर्क: +91 6263732857\n━━━━━━━━━━━━━━━━━━━━\nनमस्ते *${customerName}* जी! 🙏\n\nआपकी कस्टमर बिल रसीद (Cash Memo):\n• बिल नंबर: *${inv.invoiceNumber}*\n• दिनांक: *${orderDate} ${orderTime}*\n• कुल राशि: *${formatCurrency(totalAmount)}*\n• भुगतान: *${isPaid ? 'PAID ✓' : formatCurrency(paidAmount)}*\n${dueAmount > 0 ? `• शेष राशि (Due): *${formatCurrency(dueAmount)}*\n` : ''}\n📦 *सामान:* \n${itemsSummary}\n━━━━━━━━━━━━━━━━━━━━\nश्री गणेश ऑप्टिकल से खरीदारी के लिए धन्यवाद! 👓✨`
    );
    Linking.openURL(`https://wa.me/${phoneWith91}?text=${message}`);
  };

  const handleSendEmail = () => {
    Alert.alert('Email Sent', `Invoice receipt sent to ${customerEmail}`);
  };

  const handleShareLink = () => {
    Alert.alert('Share Link Copied', `Shree Ganesh Optical Invoice #${inv.invoiceNumber}`);
  };

  // Get initials for avatar
  const initials = customerName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'C';

  return (
    <View style={styles.screen}>
      {/* Top Large Header (Deep Optical Forest Green) */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View style={styles.headerContent}>
          {/* Back button & Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.8} />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Invoice Details</Text>
              <Text style={styles.headerSubtitle}>
                बिल व इनवॉइस विवरण • {inv.invoiceNumber}
              </Text>
            </View>
          </View>

          {/* Right Brand Badge */}
          <View style={styles.headerRight}>
            <View style={styles.brandBox}>
              <HeaderGlassesLogo color="#FFFFFF" width={32} height={16} />
              <View style={styles.brandTextBox}>
                <Text style={styles.brandTitle}>श्री गणेश ऑप्टिकल</Text>
                <Text style={styles.brandSubtitle}>सीहोर • 6263732857</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.menuIconBtn}
              onPress={() =>
                Alert.alert('Invoice Options', inv.invoiceNumber, [
                  { text: 'Print Bill', onPress: handlePrint },
                  { text: 'Share PDF File', onPress: handleDownloadPdf },
                  { text: 'Send on WhatsApp', onPress: handleWhatsApp },
                  { text: 'Close', style: 'cancel' },
                ])
              }
            >
              <MoreVertical size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Scrollable Area - Full Width Cards */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Number & Action Buttons Bar */}
        <View style={styles.invTopBarCard}>
          <View style={styles.invIdentLeft}>
            <View style={styles.invNumberRow}>
              <View style={styles.invDocIconBox}>
                <FileText size={22} color="#064E3B" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.invNumberText}>{inv.invoiceNumber}</Text>
                  <View style={[styles.paidBadge, !isPaid && styles.pendingBadge]}>
                    <Text style={[styles.paidBadgeText, !isPaid && styles.pendingBadgeText]}>
                      {isPaid ? 'PAID ✓' : 'BALANCE DUE'}
                    </Text>
                  </View>
                </View>
                <View style={styles.invDateRow}>
                  <Calendar size={13} color="#64748B" style={{ marginRight: 5 }} />
                  <Text style={styles.invDateText}>{orderDate} {orderTime ? `• ${orderTime}` : ''}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.invActionsRow}>
            <TouchableOpacity
              style={styles.downloadPdfBtn}
              onPress={handleDownloadPdf}
              activeOpacity={0.85}
            >
              <Share2 size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.downloadPdfBtnText}>Share PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineActionBtn}
              onPress={handlePrint}
              activeOpacity={0.85}
            >
              <Printer size={15} color="#334155" style={{ marginRight: 5 }} />
              <Text style={styles.outlineActionBtnText}>Print</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whatsAppActionBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.85}
            >
              <MessageCircle size={15} color="#16A34A" style={{ marginRight: 5 }} />
              <Text style={styles.whatsAppActionBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Customer Details Card (Prominent & Big) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <User size={18} color="#064E3B" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Customer Details (ग्राहक जानकारी)</Text>
            </View>
            {linkedOrder?.customer?.id && (
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() =>
                  router.push({
                    pathname: '/customers/[id]',
                    params: { id: linkedOrder.customer.id },
                  })
                }
              >
                <Text style={styles.cardActionBtnText}>View Customer</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.customerBodyRow}>
            <View style={styles.customerAvatarBox}>
              <Text style={styles.customerAvatarText}>{initials}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.customerNameRow}>
                <Text style={styles.customerName}>{customerName}</Text>
                <View style={styles.regularBadge}>
                  <Text style={styles.regularBadgeText}>Customer</Text>
                </View>
              </View>

              <View style={styles.custInfoRow}>
                <Phone size={13} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.custInfoText}>{customerPhone}</Text>
              </View>

              <View style={styles.custInfoRow}>
                <MapPin size={13} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.custInfoText}>{customerAddress}</Text>
              </View>

              {customerEmail ? (
                <View style={styles.custInfoRow}>
                  <Mail size={13} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.custInfoText}>{customerEmail}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* 2. Order Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <ShoppingCart size={18} color="#064E3B" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Order Details (ऑर्डर विवरण)</Text>
            </View>
            <View style={styles.orderPill}>
              <Text style={styles.orderPillText}>#{orderNumber}</Text>
            </View>
          </View>

          <View style={styles.keyValList}>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>Invoice / Bill No</Text>
              <Text style={styles.keyValueBold}>{inv.invoiceNumber}</Text>
            </View>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>Date & Time</Text>
              <Text style={styles.keyValue}>{orderDate} {orderTime ? `• ${orderTime}` : ''}</Text>
            </View>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>Payment Mode</Text>
              <Text style={styles.keyValue}>{paymentMode}</Text>
            </View>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>Payment Status</Text>
              <Text style={[styles.keyValueBold, { color: isPaid ? '#15803D' : '#DC2626' }]}>
                {isPaid ? 'Fully Paid' : `Pending (${formatCurrency(dueAmount)})`}
              </Text>
            </View>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>Store / Branch</Text>
              <Text style={styles.keyValue}>श्री गणेश ऑप्टिकल (सीहोर)</Text>
            </View>
          </View>
        </View>

        {/* 3. Items Purchased Card (Dynamic List) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <Package size={18} color="#064E3B" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Purchased Items ({items.length} उत्पाद)</Text>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.purchasedTableHeader}>
            <Text style={[styles.thCell, { width: 24 }]}>#</Text>
            <Text style={[styles.thCell, { flex: 2.2 }]}>Product Description</Text>
            <Text style={[styles.thCell, { width: 36, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Price</Text>
            <Text style={[styles.thCell, { flex: 1.1, textAlign: 'right' }]}>Amount</Text>
          </View>

          {/* Dynamic Rows */}
          {items.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.purchasedTableRow,
                idx === items.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.tdCell, { width: 24 }]}>{idx + 1}</Text>
              <View style={[styles.productCell, { flex: 2.2 }]}>
                {item.description.toLowerCase().includes('lens') ? (
                  <LensThumbnail />
                ) : (
                  <FrameThumbnail />
                )}
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.itemTitleText}>{item.description}</Text>
                  <Text style={styles.itemSubtitleText}>Optics & Eyewear</Text>
                </View>
              </View>
              <Text style={[styles.tdCell, { width: 36, textAlign: 'center', fontWeight: '600' }]}>
                {item.qty}
              </Text>
              <Text style={[styles.tdCell, { flex: 1, textAlign: 'right' }]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[styles.tdCellBold, { flex: 1.1, textAlign: 'right' }]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* 4. Price & Payment Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CreditCard size={18} color="#064E3B" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Price & Payment Summary (भुगतान सारांश)</Text>
          </View>

          <View style={styles.keyValList}>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>Taxable Amount</Text>
              <Text style={styles.keyValue}>{formatCurrency(taxableAmount)}</Text>
            </View>
            <View style={styles.keyValRow}>
              <Text style={styles.keyLabel}>GST (5% Approx)</Text>
              <Text style={styles.keyValue}>{formatCurrency(gstAmount)}</Text>
            </View>

            {/* Total Highlight Box */}
            <View style={styles.totalHighlightBox}>
              <Text style={styles.totalHighlightLabel}>Total Amount (कुल राशि)</Text>
              <Text style={styles.totalHighlightValue}>{formatCurrency(totalAmount)}</Text>
            </View>

            <View style={[styles.keyValRow, { marginTop: 4 }]}>
              <Text style={styles.keyLabel}>Amount Paid (प्राप्त राशि)</Text>
              <Text style={[styles.keyValueBold, { color: '#15803D' }]}>{formatCurrency(paidAmount)}</Text>
            </View>

            {dueAmount > 0 ? (
              <View style={styles.keyValRow}>
                <Text style={[styles.keyLabel, { color: '#DC2626', fontWeight: '700' }]}>Balance Due (बाकी राशि)</Text>
                <Text style={[styles.keyValueBold, { color: '#DC2626' }]}>{formatCurrency(dueAmount)}</Text>
              </View>
            ) : (
              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Balance Due</Text>
                <View style={styles.fullyPaidBadge}>
                  <CheckCircle2 size={12} color="#059669" style={{ marginRight: 4 }} />
                  <Text style={styles.fullyPaidBadgeText}>Fully Settled</Text>
                </View>
              </View>
            )}

            <View style={styles.amountInWordsBox}>
              <Text style={styles.amountInWordsLabel}>Amount in Words:</Text>
              <Text style={styles.amountInWordsText}>{amountWords}</Text>
            </View>
          </View>
        </View>

        {/* 5. Official Printable Retail Bill / Cash Memo Preview (White Paper Sheet) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <FileText size={18} color="#064E3B" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Optical Bill / Cash Memo Preview (रसीद)</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/invoices/preview/' + inv.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Maximize2 size={16} color="#064E3B" />
            </TouchableOpacity>
          </View>

          {/* Printable White Paper Sheet */}
          <View style={styles.invoiceDocPaper}>
            {/* Header: Store Info & Invoice Meta */}
            <View style={styles.docHeaderRow}>
              <View style={styles.docBrandLeft}>
                <HeaderGlassesLogo color="#04281B" width={38} height={18} />
                <Text style={styles.docBrandTitle}>श्री गणेश ऑप्टिकल</Text>
                <Text style={styles.docBrandSubtitle}>SHREE GANESH OPTICAL • SEHORE</Text>
                <Text style={styles.docAddressText}>इंग्लिशपुरा, सीहोर (म.प्र.)</Text>
                <Text style={styles.docAddressText}>📞 +91 6263732857</Text>
              </View>

              <View style={styles.docMetaRight}>
                <Text style={styles.docTaxInvoiceTitle}>CASH MEMO / बिल रसीद</Text>
                <Text style={styles.docInvNumberText}>{inv.invoiceNumber}</Text>
                <Text style={styles.docMetaItem}>Date: {orderDate}</Text>
                <Text style={styles.docMetaItem}>Order: #{orderNumber}</Text>
                <Text style={styles.docMetaItem}>Mode: {paymentMode}</Text>
              </View>
            </View>

            {/* Bill To Section */}
            <View style={styles.docBillToSection}>
              <Text style={styles.docBillToLabel}>BILL TO (ग्राहक विवरण):</Text>
              <Text style={styles.docCustomerName}>{customerName}</Text>
              <Text style={styles.docCustomerAddress}>{customerAddress}</Text>
              <Text style={styles.docCustomerAddress}>📞 +91 {customerPhone.replace(/[^0-9]/g, '').slice(-10)}</Text>
            </View>

            {/* Document Items Table */}
            <View style={styles.docTable}>
              <View style={styles.docTableHeader}>
                <Text style={[styles.docThText, { width: 18 }]}>#</Text>
                <Text style={[styles.docThText, { flex: 2.2 }]}>Product / Description</Text>
                <Text style={[styles.docThText, { width: 32, textAlign: 'center' }]}>Qty</Text>
                <Text style={[styles.docThText, { flex: 1, textAlign: 'right' }]}>Rate</Text>
                <Text style={[styles.docThText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
              </View>

              {items.map((item, idx) => (
                <View key={idx} style={styles.docTableRow}>
                  <Text style={[styles.docTdText, { width: 18 }]}>{idx + 1}</Text>
                  <View style={{ flex: 2.2 }}>
                    <Text style={styles.docItemTitle}>{item.description}</Text>
                    <Text style={styles.docItemSub}>Optical Frame & Lenses</Text>
                  </View>
                  <Text style={[styles.docTdText, { width: 32, textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.docTdText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                  <Text style={[styles.docTdText, { flex: 1, textAlign: 'right', fontWeight: '700' }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Subtotal, Taxable, Total Summary Table */}
            <View style={styles.docTotalsSection}>
              <View style={styles.docTotalRow}>
                <Text style={styles.docTotalLabel}>Taxable Value</Text>
                <Text style={styles.docTotalValue}>{formatCurrency(taxableAmount)}</Text>
              </View>
              <View style={styles.docTotalRow}>
                <Text style={styles.docTotalLabel}>GST</Text>
                <Text style={styles.docTotalValue}>{formatCurrency(gstAmount)}</Text>
              </View>
              <View style={styles.docGrandTotalRow}>
                <Text style={styles.docGrandTotalLabel}>Total Paid</Text>
                <Text style={styles.docGrandTotalValue}>{formatCurrency(totalAmount)}</Text>
              </View>
            </View>

            {/* Amount in Words */}
            <View style={styles.amountInWordsBox}>
              <Text style={styles.amountInWordsLabel}>In Words:</Text>
              <Text style={styles.amountInWordsText}>{amountWords}</Text>
            </View>

            {/* Document Footer: QR Code & Signature */}
            <View style={styles.docFooterRow}>
              <View style={styles.docQrBox}>
                <InvoiceQrCode />
                <Text style={styles.docQrText}>Scan for Digital Copy</Text>
              </View>

              <View style={styles.docSignBox}>
                <Text style={styles.thankYouScript}>Thank You!</Text>
                <Text style={styles.docSignStoreText}>Shree Ganesh Optical, Sehore</Text>
                <View style={styles.docSignLogoRow}>
                  <Text style={styles.docSignTagline}>See Better, Live Brighter</Text>
                  <HeaderGlassesLogo color="#04281B" width={20} height={10} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 6. Terms & Store Policy Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShieldCheck size={18} color="#064E3B" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Terms & Conditions (नियम एवं शर्तें)</Text>
          </View>
          <View style={styles.termsList}>
            <Text style={styles.termItem}>• एक बार बिका हुआ माल वापस नहीं होगा (Goods once sold cannot be returned).</Text>
                        <Text style={styles.termItem}>• डिलीवरी से पहले चश्मे का नंबर व फिटिंग अवश्य जांच लें।</Text>
            <Text style={styles.termItem}>• किसी भी असुविधा के लिए 7 दिनों के भीतर संपर्क करें: +91 6263732857</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#04281B',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTextBox: {
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 15,
  },
  brandSubtitle: {
    fontSize: 8.5,
    color: '#A7F3D0',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // Top Bar Card
  invTopBarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  invIdentLeft: {
    marginBottom: 12,
  },
  invNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  invDocIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invNumberText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  paidBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  pendingBadge: {
    backgroundColor: '#FEE2E2',
  },
  pendingBadgeText: {
    color: '#DC2626',
  },
  invDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  invDateText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  invActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  downloadPdfBtn: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    flex: 1.2,
  },
  downloadPdfBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  outlineActionBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    flex: 1,
  },
  outlineActionBtnText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  whatsAppActionBtn: {
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    flex: 1.2,
  },
  whatsAppActionBtnText: {
    color: '#064E3B',
    fontSize: 13,
    fontWeight: '800',
  },

  // Big Prominent Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  cardActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  cardActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
  },

  // Customer Card
  customerBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatarBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  customerAvatarText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0284C7',
  },
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  regularBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  regularBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  custInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  custInfoText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  // Order Details
  orderPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064E3B',
  },
  keyValList: {
    gap: 8,
  },
  keyValRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyLabel: {
    fontSize: 13.5,
    color: '#64748B',
  },
  keyValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  keyValueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Items Purchased
  purchasedTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
  },
  thCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  purchasedTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tdCell: {
    fontSize: 13,
    color: '#334155',
  },
  tdCellBold: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  productCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemSubtitleText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  // Total Highlight Box
  totalHighlightBox: {
    backgroundColor: '#ECFDF5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  totalHighlightLabel: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  totalHighlightValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
  },
  fullyPaidBadge: {
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fullyPaidBadgeText: {
    color: '#059669',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // Invoice Preview Paper
  invoiceDocPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    marginTop: 4,
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  docBrandLeft: {
    flex: 1.3,
  },
  docBrandTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#04281B',
    marginTop: 3,
  },
  docBrandSubtitle: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  docAddressText: {
    fontSize: 8.5,
    color: '#64748B',
    lineHeight: 12,
  },
  docMetaRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  docTaxInvoiceTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#04281B',
  },
  docInvNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  docMetaItem: {
    fontSize: 9,
    color: '#64748B',
    lineHeight: 13,
  },
  docBillToSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  docBillToLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
  },
  docCustomerName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  docCustomerAddress: {
    fontSize: 9,
    color: '#64748B',
    lineHeight: 13,
  },
  docTable: {
    marginTop: 8,
  },
  docTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  docThText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  docTableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  docTdText: {
    fontSize: 9,
    color: '#334155',
  },
  docItemTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  docItemSub: {
    fontSize: 8,
    color: '#64748B',
  },
  docTotalsSection: {
    width: '65%',
    alignSelf: 'flex-end',
    marginTop: 8,
    gap: 3,
  },
  docTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  docTotalLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  docTotalValue: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F172A',
  },
  docGrandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 3,
  },
  docGrandTotalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#064E3B',
  },
  docGrandTotalValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#064E3B',
  },
  amountInWordsBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  amountInWordsLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
  },
  amountInWordsText: {
    fontSize: 8.5,
    color: '#334155',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  docFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  docQrBox: {
    alignItems: 'center',
  },
  docQrText: {
    fontSize: 7.5,
    color: '#64748B',
    marginTop: 3,
  },
  docSignBox: {
    alignItems: 'flex-end',
  },
  thankYouScript: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    fontStyle: 'italic',
  },
  docSignStoreText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
  },
  docSignLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  docSignTagline: {
    fontSize: 7.5,
    color: '#94A3B8',
  },

  // Terms & Conditions
  termsList: {
    gap: 5,
  },
  termItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },

  backHomeBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
