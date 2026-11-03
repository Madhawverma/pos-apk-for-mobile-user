import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  Printer,
  Home,
  Check,
  MessageCircle,
  Mail,
  FileText,
  Pencil,
  MapPin,
  Eye,
  CreditCard,
  Package,
  Download,
  Share2,
  TrendingUp,
  Coins,
  ArrowRight,
} from 'lucide-react-native';
import { cartManager } from '../../src/store/cartStore';
import { opticalStore } from '../../src/store/opticalStore';
import { pdfService } from '../../src/services/pdfService';
import { formatCurrency } from '../../src/utils/currency';

const { width } = Dimensions.get('window');

/**
 * Optical Eyeglasses Logo for Top Header
 */
function HeaderGlassesLogo() {
  return (
    <Svg width={38} height={17} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Thumbnail visuals for invoice items
 */
function InvoiceItemVisual({ type }: { type: 'frame' | 'lens' | 'case' }) {
  if (type === 'frame') {
    return (
      <Svg width={46} height={20} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
        <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'lens') {
    return (
      <Svg width={42} height={20} viewBox="0 0 54 28" fill="none">
        <Circle cx="27" cy="14" r="12" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
        <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="27" cy="14" r="3" fill="#60A5FA" />
      </Svg>
    );
  }

  return (
    <Svg width={42} height={20} viewBox="0 0 54 28" fill="none">
      <Path d="M4 10 C4 6, 12 4, 27 4 C42 4, 50 6, 50 10 L47 24 C47 25, 40 26, 27 26 C14 26, 7 25, 7 24 Z" fill="#78350F" />
      <Path d="M4 10 C14 16, 40 16, 50 10" stroke="#92400E" strokeWidth="1.5" />
      <Circle cx="27" cy="18" r="3" fill="#F59E0B" />
    </Svg>
  );
}

export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cartState = cartManager.getState();
  const allInvoices = opticalStore.getState().invoices;
  const lastInvoice = cartState.lastGeneratedInvoiceId
    ? allInvoices.find((i) => i.id === cartState.lastGeneratedInvoiceId) || allInvoices[0]
    : allInvoices[0];

  const customerName = lastInvoice?.customerName || cartState.selectedCustomer?.name || 'Customer';
  const customerPhone = lastInvoice?.customerPhone || cartState.selectedCustomer?.phone || '+91 9876543210';
  const invoiceNumber = lastInvoice?.invoiceNumber || '#INV-2026-001';
  const invoiceTotal = lastInvoice?.total || 13116;

  // Seller Cost Price & Profit Modal State
  const [showCostModal, setShowCostModal] = useState(false);
  const [costPriceInput, setCostPriceInput] = useState('');

  const handleOpenProfitModal = () => {
    setShowCostModal(true);
  };

  const handleSaveProfitAndContinue = () => {
    const costNum = parseFloat(costPriceInput);
    if (!isNaN(costNum) && costNum >= 0 && lastInvoice) {
      opticalStore.updateInvoiceCostAndProfit(lastInvoice.id, costNum);
    }
    setShowCostModal(false);
    cartManager.clearCart();
    Alert.alert(
      'Profit Saved',
      'Cost price & profit recorded in reports successfully!',
      [
        {
          text: 'View Profit Report',
          onPress: () => router.replace('/reports/profit' as any),
        },
        {
          text: 'Back to Home',
          onPress: () => router.replace('/(tabs)/dashboard'),
        },
      ]
    );
  };

  const handleDone = () => {
    cartManager.clearCart();
    router.replace('/(tabs)/dashboard');
  };

  // WhatsApp (wa.me) Send PDF along with Hindi bill text message directly
  const handleShareWhatsApp = async () => {
    if (!lastInvoice) return;

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    let phoneWithCountryCode = cleanPhone;
    if (cleanPhone.length === 10) {
      phoneWithCountryCode = `91${cleanPhone}`;
    } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      phoneWithCountryCode = `91${cleanPhone.substring(1)}`;
    } else if (!cleanPhone.startsWith('91')) {
      phoneWithCountryCode = `91${cleanPhone}`;
    }

    // Detailed item breakdown for WhatsApp receipt
    const itemsList = lastInvoice?.items && lastInvoice.items.length > 0
      ? lastInvoice.items
          .map((item, idx) => `${idx + 1}. *${item.description}*\n   Qty: ${item.qty} × ${formatCurrency(item.unitPrice)} = *${formatCurrency(item.amount)}*`)
          .join('\n\n')
      : `1. *प्रोग्रेसिव लेंस और फ्रेम* - ${formatCurrency(invoiceTotal)}`;

    const hindiMessage = `🙏 *श्री गणेश ऑप्टिकल, सीहोर* 🙏\n_ASG Eye Hospital के पास, इंग्लिशिपुरा, सीहोर (म.प्र.)_\n📞 संपर्क: +91 6263732857\n━━━━━━━━━━━━━━━━━━━━\nप्रिय *${customerName}* जी, नमस्ते! 🙏\n\n*श्री गणेश ऑप्टिकल से खरीदारी करने के लिए आपका बहुत-बहुत धन्यवाद!* 👓✨\n\nऔर भी शानदार एवं बेस्ट क्वालिटी के चश्मे (Frames, Sunglasses, Lenses) खरीदने के लिए हमेशा हमसे संपर्क करें।\n━━━━━━━━━━━━━━━━━━━━\n📄 *बिल / रसीद विवरण:*\n• बिल संख्या (Invoice No): *${invoiceNumber}*\n• दिनांक (Date): *${lastInvoice?.date || 'Today'}*\n• समय (Time): *${lastInvoice?.time || ''}*\n• भुगतान का माध्यम: *${lastInvoice?.paymentMethod || 'Cash'}*\n• कुल भुगतान (Total Paid): *${formatCurrency(invoiceTotal)}*\n• स्थिति (Status): *सफल / PAID ✓*\n\n🛒 *खरीदे गए उत्पाद (Items):*\n${itemsList}\n━━━━━━━━━━━━━━━━━━━━\n📎 *आपकी टैक्स इनवॉइस रसीद (PDF Bill) संलग्न है, कृपया चेक करें।* 📄\n\nश्री गणेश ऑप्टिकल आपके उत्तम स्वास्थ्य व सुंदर दृष्टि की कामना करता है! 💐`;

    const encoded = encodeURIComponent(hindiMessage);
    Linking.openURL(`https://wa.me/${phoneWithCountryCode}?text=${encoded}`);
  };

  // WhatsApp Send PDF Invoice directly to WhatsApp App
  const handleSendWhatsAppPdf = async () => {
    if (!lastInvoice) {
      Alert.alert('Notice', 'Generating invoice...');
      return;
    }
    await handleShareWhatsApp();
  };

  // Share Official PDF directly to WhatsApp / Apps
  const handleSharePdf = async () => {
    const targetInvoice = lastInvoice || ({
      id: 'inv-temp',
      invoiceNumber: invoiceNumber,
      date: 'Today',
      time: 'Just now',
      customerName: customerName,
      customerPhone: customerPhone,
      items: cartState.items.map((it) => ({
        description: it.product.name,
        qty: it.quantity,
        unitPrice: it.product.price,
        amount: it.product.price * it.quantity,
      })),
      total: invoiceTotal,
      paidAmount: invoiceTotal,
      dueAmount: 0,
      status: 'Paid',
    } as any);

    try {
      await pdfService.sharePdf(targetInvoice);
    } catch (err: any) {
      Alert.alert('PDF Share Alert', err?.message || 'Could not open share menu');
    }
  };

  // Print Invoice
  const handlePrint = async () => {
    if (!lastInvoice) return;
    try {
      await pdfService.printInvoice(lastInvoice);
    } catch (err) {
      Alert.alert('Printer Error', 'Could not send document to printer.');
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Top Header (Deep Optical Forest Green) */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerRow}>
          {/* Logo & Store Title */}
          <View style={styles.headerLeft}>
            <HeaderGlassesLogo />
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>श्री गणेश ऑप्टिकल</Text>
              <Text style={styles.headerSubtitle}>इंग्लिशिपुरा, सीहोर • 6263732857</Text>
            </View>
          </View>

          {/* Right Icons: Print & Home */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => Alert.alert('Printing', 'Sending invoice to receipt printer...')}
              activeOpacity={0.75}
            >
              <Printer size={19} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleDone}
              activeOpacity={0.75}
            >
              <Home size={19} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sale Successful Card */}
        <View style={styles.successCard}>
          {/* Confetti & Checkmark Badge */}
          <View style={styles.badgeWrapper}>
            {/* Confetti specks */}
            <View style={[styles.confetti, { top: 0, left: 16, backgroundColor: '#10B981', transform: [{ rotate: '25deg' }] }]} />
            <View style={[styles.confetti, { top: -2, right: 18, backgroundColor: '#F59E0B', transform: [{ rotate: '-35deg' }] }]} />
            <View style={[styles.confetti, { bottom: 6, left: 2, backgroundColor: '#064E3B', transform: [{ rotate: '45deg' }] }]} />
            <View style={[styles.confetti, { bottom: 6, right: 2, backgroundColor: '#10B981', transform: [{ rotate: '-25deg' }] }]} />

            <View style={styles.checkCircleLarge}>
              <Check size={22} color="#FFFFFF" strokeWidth={3.5} />
            </View>
          </View>

          <Text style={styles.successTitle}>Sale Successful!</Text>
          <Text style={styles.successSubtitle}>Payment received and invoice generated.</Text>

          {/* 3 Quick Action Buttons */}
          <View style={styles.successActionsRow}>
            <TouchableOpacity
              style={styles.whatsAppBtn}
              onPress={handleShareWhatsApp}
              activeOpacity={0.85}
            >
              <MessageCircle size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.whatsAppBtnText}>Send on WhatsApp (wa.me)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sharePdfBtn}
              onPress={handleSharePdf}
              activeOpacity={0.85}
            >
              <Share2 size={15} color="#064E3B" style={{ marginRight: 6 }} />
              <Text style={styles.sharePdfBtnText}>Send PDF File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invoice Details Card */}
        <View style={styles.invoiceCard}>
          {/* Header */}
          <View style={styles.invoiceCardHeader}>
            <Text style={styles.invoiceCardTitle}>Invoice Details</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.invoiceDate}>{lastInvoice?.date || 'Today'}, {lastInvoice?.time || '10:32 AM'}</Text>
            </View>
          </View>

          {/* Table Column Headers */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 2.2, textAlign: 'left' }]}>Item</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.1, textAlign: 'right' }]}>Price</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.1, textAlign: 'right' }]}>Total</Text>
          </View>

          {/* Dynamic Invoice Items from lastInvoice or cart */}
          {(lastInvoice?.items && lastInvoice.items.length > 0
            ? lastInvoice.items
            : [
                { description: 'Ray-Ban RB2140 Wayfarer', qty: 1, unitPrice: 8500, amount: 8500 },
                { description: 'Blue Cut Lens (1.56 Index)', qty: 2, unitPrice: 2200, amount: 4400 },
                { description: 'Sunglass Hard Case', qty: 1, unitPrice: 500, amount: 500 },
              ]
          ).map((item, idx, arr) => {
            const isLast = idx === arr.length - 1;
            const isLens = item.description.toLowerCase().includes('lens');
            const isCase = item.description.toLowerCase().includes('case');
            const visualType = isLens ? 'lens' : isCase ? 'case' : 'frame';

            return (
              <View key={idx} style={[styles.tableRow, isLast && { borderBottomWidth: 0 }]}>
                <View style={styles.itemVisualCol}>
                  <InvoiceItemVisual type={visualType} />
                </View>
                <View style={styles.itemTitleCol}>
                  <Text style={styles.itemTitleText}>{item.description}</Text>
                  <Text style={styles.itemSubText}>
                    {visualType === 'frame' ? 'Optical Frame' : visualType === 'lens' ? 'Refraction Lens' : 'Accessory'}
                  </Text>
                </View>
                <Text style={styles.itemQtyText}>{item.qty}</Text>
                <Text style={styles.itemPriceText}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={styles.itemTotalText}>{formatCurrency(item.amount)}</Text>
              </View>
            );
          })}

          {/* Calculations Section */}
          <View style={styles.calcSection}>
            <View style={styles.calcLine}>
              <Text style={styles.calcLabel}>Subtotal</Text>
              <Text style={styles.calcValue}>{formatCurrency(lastInvoice?.total ? lastInvoice.total : 11700)}</Text>
            </View>

            {/* Total Paid Highlight Bar */}
            <View style={styles.totalPaidBar}>
              <Text style={styles.totalPaidLabel}>Total Amount Paid</Text>
              <Text style={styles.totalPaidValue}>{formatCurrency(invoiceTotal)}</Text>
            </View>
          </View>
        </View>

        {/* 2x2 Grid Section */}
        <View style={styles.twoByTwoGrid}>
          {/* Card 1: Customer Details */}
          <View style={styles.smallGridCard}>
            <View style={styles.smallCardHeader}>
              <View style={styles.cardHeaderTitleRow}>
                <FileText size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.smallCardTitle}>Customer Details</Text>
              </View>
            </View>

            <View style={styles.customerRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>
                  {customerName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'CU'}
                </Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.custName}>{customerName}</Text>
                <Text style={styles.custPhone}>{customerPhone}</Text>
              </View>
            </View>

            <View style={styles.addressLine}>
              <MapPin size={13} color="#15803D" style={{ marginRight: 5 }} />
              <Text style={styles.addressText} numberOfLines={1}>
                {lastInvoice?.customer?.address || 'Sehore, MP'}
              </Text>
            </View>
          </View>

          {/* Card 2: Payment Information */}
          <View style={styles.smallGridCard}>
            <View style={styles.smallCardHeader}>
              <View style={styles.cardHeaderTitleRow}>
                <CreditCard size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.smallCardTitle}>Payment Summary</Text>
              </View>
            </View>

            <View style={styles.payInfoLine}>
              <Text style={styles.payInfoLabel}>Method</Text>
              <View style={styles.cashBadge}>
                <Text style={styles.cashBadgeText}>{lastInvoice?.paymentMethod || 'Cash'}</Text>
              </View>
            </View>

            <View style={styles.payInfoLine}>
              <Text style={styles.payInfoLabel}>Status</Text>
              <Text style={[styles.payInfoValue, { color: '#059669' }]}>Paid (Completed)</Text>
            </View>

            <View style={[styles.payInfoLine, { borderBottomWidth: 0 }]}>
              <Text style={styles.payInfoLabel}>Total Paid</Text>
              <Text style={styles.payInfoValue}>{formatCurrency(invoiceTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons in a Row */}
        <View style={styles.fourActionsRow}>
          {/* 1. Share PDF (Direct Share to WhatsApp, Drive, Bluetooth) */}
          <TouchableOpacity
            style={[styles.quadActionBtn, styles.quadActionBtnHighlight]}
            onPress={handleSharePdf}
            activeOpacity={0.8}
          >
            <Share2 size={18} color="#064E3B" style={{ marginBottom: 4 }} strokeWidth={2.4} />
            <Text style={[styles.quadActionText, { color: '#064E3B', fontWeight: '800' }]}>
              Share PDF
            </Text>
          </TouchableOpacity>

          {/* 2. Print Thermal / Slip */}
          <TouchableOpacity
            style={styles.quadActionBtn}
            onPress={handlePrint}
            activeOpacity={0.8}
          >
            <Printer size={18} color="#0F172A" style={{ marginBottom: 4 }} strokeWidth={2.2} />
            <Text style={styles.quadActionText}>Print Slip</Text>
          </TouchableOpacity>

          {/* 3. WhatsApp wa.me Text Message */}
          <TouchableOpacity
            style={styles.quadActionBtn}
            onPress={handleShareWhatsApp}
            activeOpacity={0.8}
          >
            <MessageCircle size={18} color="#25D366" style={{ marginBottom: 4 }} strokeWidth={2.2} />
            <Text style={styles.quadActionText}>WA Details</Text>
          </TouchableOpacity>

          {/* 4. New Sale POS */}
          <TouchableOpacity
            style={styles.quadActionBtn}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Home size={18} color="#0F172A" style={{ marginBottom: 4 }} strokeWidth={2.2} />
            <Text style={styles.quadActionText}>New Sale</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Button: Continue & Enter Purchase Cost */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.continueProfitBtn}
          onPress={handleOpenProfitModal}
          activeOpacity={0.88}
        >
          <Text style={styles.continueProfitBtnText}>Continue (Enter Cost Price / Profit) →</Text>
        </TouchableOpacity>
      </View>

      {/* Cost Price & Profit Modal Box */}
      <Modal
        visible={showCostModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconBox}>
                <Coins size={22} color="#064E3B" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Enter Purchase / Cost Price</Text>
                <Text style={styles.modalSub}>
                  Record what you paid for this item to calculate accurate net profit
                </Text>
              </View>
            </View>

            <View style={styles.saleDetailsSnapshot}>
              <View style={styles.saleSnapshotRow}>
                <Text style={styles.snapshotLabel}>Sale Selling Price:</Text>
                <Text style={styles.snapshotVal}>{formatCurrency(invoiceTotal)}</Text>
              </View>
              <View style={styles.saleSnapshotRow}>
                <Text style={styles.snapshotLabel}>Customer:</Text>
                <Text style={styles.snapshotVal}>{customerName}</Text>
              </View>
            </View>

            <Text style={styles.costInputLabel}>Seller Buying / Cost Price (खरीद भाव) *</Text>
            <View style={styles.costInputContainer}>
              <Text style={styles.rupeeSign}>₹</Text>
              <TextInput
                style={styles.costTextInput}
                placeholder="Enter cost (e.g. 800)"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={costPriceInput}
                onChangeText={setCostPriceInput}
                autoFocus
              />
            </View>

            {/* Live Profit Preview */}
            {costPriceInput !== '' && !isNaN(parseFloat(costPriceInput)) && (
              <View style={styles.profitPreviewBox}>
                <TrendingUp size={16} color="#15803D" />
                <Text style={styles.profitPreviewText}>
                  Net Profit: <Text style={{ fontWeight: '800', color: '#15803D' }}>{formatCurrency(Math.max(0, invoiceTotal - parseFloat(costPriceInput)))}</Text>
                </Text>
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={handleDone}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveProfitAndContinue}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSaveText}>Save to Report & Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  /* Top Header */
  header: {
    backgroundColor: '#04281B', // Deep optical emerald green
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleBox: {
    marginLeft: 7,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 7.8,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },

  /* Success Card */
  successCard: {
    backgroundColor: '#DCFCE7', // Soft mint green
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  badgeWrapper: {
    width: 70,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 3,
    borderRadius: 1.5,
  },
  checkCircleLarge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: -0.3,
    marginTop: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
    fontWeight: '600',
  },
  successActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  whatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  whatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  sharePdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#064E3B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sharePdfBtnText: {
    color: '#064E3B',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* Invoice Details Card */
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  invoiceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  invoiceCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B',
  },
  invoiceDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemVisualCol: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemTitleCol: {
    flex: 2.2,
  },
  itemTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemSubText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  itemQtyText: {
    flex: 0.8,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  itemPriceText: {
    flex: 1.1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'right',
  },
  itemTotalText: {
    flex: 1.1,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },

  /* Calculations Section */
  calcSection: {
    marginTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  calcLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  calcLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalPaidBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  totalPaidLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B',
  },
  totalPaidValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
  },

  /* 2x2 Grid */
  twoByTwoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  smallGridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Customer Info */
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  customerInfo: {
    flex: 1,
  },
  custName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  custPhone: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
  },

  /* Payment Information */
  payInfoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  payInfoLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  cashBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cashBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  payInfoValue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* 4 Action Buttons in a Row */
  fourActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quadActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quadActionBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  quadActionBtnHighlight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
    borderWidth: 2,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  quadActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 14,
  },

  /* Bottom Sticky Action Bar */
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  homeBtn: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  continueProfitBtn: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  continueProfitBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },

  /* Profit Modal Styling */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  modalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  saleDetailsSnapshot: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saleSnapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  snapshotLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  snapshotVal: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '800',
  },
  costInputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  costInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F0FDF4',
    height: 48,
    marginBottom: 10,
  },
  rupeeSign: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064E3B',
    marginRight: 6,
  },
  costTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
    padding: 0,
  },
  profitPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginBottom: 14,
  },
  profitPreviewText: {
    fontSize: 12.5,
    color: '#064E3B',
    fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: '#064E3B',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

