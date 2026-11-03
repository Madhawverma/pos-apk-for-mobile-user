import React, { useState } from 'react';
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
  Pencil,
  Printer,
  MoreHorizontal,
  Phone,
  MessageCircle,
  User,
  Check,
  CheckCircle2,
  ShoppingCart,
  Receipt,
  Eye,
  Disc,
  CreditCard,
  Truck,
  FileEdit,
  Clock,
  Store,
} from 'lucide-react-native';
import { mockOrders } from '../../src/data/mockOrders';
import { opticalStore } from '../../src/store/opticalStore';
import { Order, OrderStatus } from '../../src/types/order';
import { formatCurrency } from '../../src/utils/currency';

const { width } = Dimensions.get('window');

/**
 * Optical Eyeglasses Logo for Top Header
 */
function HeaderGlassesLogo() {
  return (
    <Svg width={36} height={16} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Eyeglasses Vector for Item 1
 */
function BlackFrameThumbnail() {
  return (
    <Svg width={42} height={20} viewBox="0 0 64 28" fill="none">
      <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
      <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
      <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.8" />
      <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.8" />
    </Svg>
  );
}

/**
 * Progressive Lens Vector for Item 2
 */
function BlueCutLensThumbnail() {
  return (
    <Svg width={40} height={22} viewBox="0 0 60 30" fill="none">
      <Circle cx="20" cy="15" r="13" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
      <Circle cx="38" cy="16" r="13" stroke="#2563EB" strokeWidth="2" fill="#BFDBFE" />
      <Path d="M12 11 C15 9, 25 9, 28 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find order from live store or mockOrders
  const [order, setOrder] = useState<Order | null>(() => {
    const list = opticalStore.getState().orders;
    return list.find((o) => o.id === id || o.orderNumber === id) || mockOrders.find((o) => o.id === id || o.orderNumber === id) || null;
  });

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(() => {
    return order?.orderStatus || 'Processing';
  });

  React.useEffect(() => {
    const unsub = opticalStore.subscribe(() => {
      const list = opticalStore.getState().orders;
      const found = list.find((o) => o.id === id || o.orderNumber === id) || null;
      if (found) {
        setOrder(found);
        setCurrentStatus(found.orderStatus);
      }
    });
    return unsub;
  }, [id]);

  if (!order) {
    return (
      <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20), paddingHorizontal: 20 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginLeft: 12 }}>Order Details</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={48} color="#94A3B8" />
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 12 }}>Order Not Found</Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>This order does not exist or has been removed.</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#064E3B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginTop: 16 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Back to Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isCancelled = currentStatus === 'Cancelled';
  const isReady = currentStatus === 'Ready' || currentStatus === 'Ready for Pickup';
  const isDelivered = currentStatus === 'Delivered';

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    opticalStore.updateOrderStatus(order.id, newStatus);
    Alert.alert('Status Updated', `Order #${order.orderNumber} is now "${newStatus}".`);
  };

  const handlePrint = () => {
    Alert.alert('Print Order Bill', `Printing invoice for ${order.orderNumber}...`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${order.customer.phone}`);
  };

  const handleWhatsApp = () => {
    const rawDigits = order.customer.phone.replace(/[^0-9]/g, '');
    let phoneWith91 = rawDigits;
    if (rawDigits.length === 10) {
      phoneWith91 = `91${rawDigits}`;
    } else if (rawDigits.startsWith('0') && rawDigits.length === 11) {
      phoneWith91 = `91${rawDigits.substring(1)}`;
    } else if (!rawDigits.startsWith('91')) {
      phoneWith91 = `91${rawDigits}`;
    }

    Linking.openURL(
      `https://wa.me/${phoneWith91}?text=Hello%20${encodeURIComponent(
        order.customer.name
      )},%20regarding%20your%20Order%20${order.orderNumber}...`
    );
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerContent}>
          {/* Back button & Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Order Details</Text>
              <Text style={styles.headerSubtitle}>
                View complete order information and status
              </Text>
            </View>
          </View>

          {/* Right Brand & Menu */}
          <View style={styles.headerRight}>
            <View style={styles.brandBox}>
              <HeaderGlassesLogo />
              <View style={styles.brandTextBox}>
                <Text style={styles.brandTitle}>Goggles Shop</Text>
                <Text style={styles.brandSubtitle}>OPTICAL STORE POS</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.menuIconBtn}
              onPress={() =>
                Alert.alert('Order Options', `#${order.orderNumber}`, [
                  { text: 'Duplicate Order', onPress: () => {} },
                  { text: 'Send SMS Notification', onPress: () => {} },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <MoreVertical size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Scrollable Body */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Identifier & Top Action Buttons */}
        <View style={styles.orderTopBarCard}>
          <View style={styles.orderIdentLeft}>
            <View style={styles.orderNumberRow}>
              <Text style={styles.orderNumber}>{order.orderNumber}</Text>
              <View
                style={[
                  styles.statusBadge,
                  currentStatus === 'Processing' && { backgroundColor: '#EFF6FF' },
                  currentStatus === 'Ready' && { backgroundColor: '#ECFDF5' },
                  currentStatus === 'Delivered' && { backgroundColor: '#ECFDF5' },
                  currentStatus === 'Cancelled' && { backgroundColor: '#FEE2E2' },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    currentStatus === 'Processing' && { color: '#2563EB' },
                    currentStatus === 'Ready' && { color: '#059669' },
                    currentStatus === 'Delivered' && { color: '#059669' },
                    currentStatus === 'Cancelled' && { color: '#DC2626' },
                  ]}
                >
                  {currentStatus}
                </Text>
              </View>
            </View>

            <View style={styles.orderDateRow}>
              <Calendar size={13} color="#64748B" style={{ marginRight: 5 }} />
              <Text style={styles.orderDateText}>{order.createdAt}</Text>
            </View>
          </View>

          {/* Right Action Buttons */}
          <View style={styles.orderTopActions}>
            <TouchableOpacity
              style={styles.editOrderBtn}
              onPress={() => router.push('/(tabs)/pos')}
              activeOpacity={0.8}
            >
              <Pencil size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
              <Text style={styles.editOrderBtnText}>Edit Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineActionBtn}
              onPress={handlePrint}
              activeOpacity={0.8}
            >
              <Printer size={13} color="#334155" style={{ marginRight: 4 }} />
              <Text style={styles.outlineActionBtnText}>Print Bill</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineActionBtn}
              onPress={() =>
                Alert.alert(
                  'More Actions',
                  'Download Invoice PDF, Send WhatsApp Receipt, or Add Tag',
                  [
                    { text: 'Download PDF', onPress: () => {} },
                    { text: 'Send WhatsApp Receipt', onPress: handleWhatsApp },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                )
              }
              activeOpacity={0.8}
            >
              <MoreHorizontal size={14} color="#334155" style={{ marginRight: 3 }} />
              <Text style={styles.outlineActionBtnText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Profile Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerAvatarBox}>
            <Text style={styles.customerAvatarText}>AS</Text>
          </View>

          <View style={styles.customerInfoCol}>
            <View style={styles.customerNameRow}>
              <Text style={styles.customerName}>{order.customer.name}</Text>
              <View style={styles.regularBadge}>
                <Text style={styles.regularBadgeText}>Regular Customer</Text>
              </View>
            </View>

            <View style={styles.customerDetailRow}>
              <Phone size={12} color="#059669" style={{ marginRight: 5 }} />
              <Text style={styles.customerDetailText}>{order.customer.phone}</Text>
            </View>

            <View style={styles.customerDetailRow}>
              <Receipt size={12} color="#64748B" style={{ marginRight: 5 }} />
              <Text style={styles.customerDetailText}>
                {order.customer.email || 'amit@email.com'}
              </Text>
            </View>

            <View style={styles.customerDetailRow}>
              <Truck size={12} color="#64748B" style={{ marginRight: 5 }} />
              <Text style={styles.customerDetailText}>
                {order.customer.address || 'Vijay Nagar, Indore, MP'}
              </Text>
            </View>
          </View>

          {/* Right Quick Action Links */}
          <View style={styles.customerActionsCol}>
            <TouchableOpacity
              style={styles.custActionBtn}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Phone size={13} color="#16A34A" style={{ marginRight: 4 }} />
              <Text style={styles.custActionText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.custActionBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <MessageCircle size={13} color="#16A34A" style={{ marginRight: 4 }} />
              <Text style={styles.custActionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.custActionBtn}
              onPress={() =>
                router.push({
                  pathname: '/customers/[id]',
                  params: { id: order.customer.id || 'cust-amit-sharma' },
                })
              }
              activeOpacity={0.7}
            >
              <User size={13} color="#475569" style={{ marginRight: 4 }} />
              <Text style={[styles.custActionText, { color: '#475569' }]}>
                View Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4-Stage Horizontal Stepper */}
        <View style={styles.stepperCard}>
          <View style={styles.stepperRow}>
            {/* Step 1: Order Placed */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotDone]}>
                <Check size={11} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={styles.stepTitleDone}>Order Placed</Text>
              <Text style={styles.stepSubDone}>28 Oct, 10:30 AM</Text>
            </View>

            {/* Connecting Line 1 */}
            <View style={[styles.stepLine, styles.stepLineDone]} />

            {/* Step 2: Lens Fitting */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  !isCancelled && styles.stepDotDone,
                  isCancelled && { backgroundColor: '#EF4444', borderColor: '#EF4444' },
                ]}
              >
                <Check size={11} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={[styles.stepTitleDone, isCancelled && { color: '#EF4444' }]}>
                Lens Fitting
              </Text>
              <Text style={styles.stepSubDone}>29 Oct, 11:00 AM</Text>
            </View>

            {/* Connecting Line 2 */}
            <View
              style={[
                styles.stepLine,
                (isReady || isDelivered) && styles.stepLineDone,
              ]}
            />

            {/* Step 3: Ready for Delivery */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  (isReady || isDelivered) && styles.stepDotDone,
                ]}
              >
                {(isReady || isDelivered) && (
                  <Check size={11} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
              <Text
                style={[
                  styles.stepTitlePending,
                  (isReady || isDelivered) && styles.stepTitleDone,
                ]}
              >
                Ready for Delivery
              </Text>
            </View>

            {/* Connecting Line 3 */}
            <View style={[styles.stepLine, isDelivered && styles.stepLineDone]} />

            {/* Step 4: Delivered */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, isDelivered && styles.stepDotDone]}>
                {isDelivered && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text
                style={[
                  styles.stepTitlePending,
                  isDelivered && styles.stepTitleDone,
                ]}
              >
                Delivered
              </Text>
            </View>
          </View>
        </View>

        {/* 2-Column Split: Row 1 (Order Items & Order Summary) */}
        <View style={styles.twoColRow}>
          {/* Left Column: Order Items */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeader}>
              <ShoppingCart size={15} color="#064E3B" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Order Items</Text>
            </View>

            {/* Item 1: Ray-Ban RB2140 */}
            <View style={styles.itemBox}>
              <View style={styles.itemThumbBox}>
                <BlackFrameThumbnail />
              </View>
              <View style={styles.itemDetailsCol}>
                <Text style={styles.itemTitle}>Ray-Ban RB2140</Text>
                <Text style={styles.itemSubtitle}>Frame (Black)</Text>
                <View style={styles.itemPillsRow}>
                  <View style={styles.bluePill}>
                    <Text style={styles.bluePillText}>Ray-Ban</Text>
                  </View>
                  <View style={styles.grayPill}>
                    <Text style={styles.grayPillText}>Frame Only</Text>
                  </View>
                </View>
              </View>
              <View style={styles.itemPriceCol}>
                <Text style={styles.itemPriceText}>₹5,800</Text>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyBadgeText}>1</Text>
                </View>
                <Text style={styles.itemTotalText}>₹5,800</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            {/* Item 2: Progressive Lenses */}
            <View style={styles.itemBox}>
              <View style={styles.itemThumbBox}>
                <BlueCutLensThumbnail />
              </View>
              <View style={styles.itemDetailsCol}>
                <Text style={styles.itemTitle}>Progressive Lenses</Text>
                <Text style={styles.itemSubtitle}>1.56 Anti-Glare Blue Cut</Text>
                <View style={styles.itemPillsRow}>
                  <View style={styles.bluePill}>
                    <Text style={styles.bluePillText}>Progressive</Text>
                  </View>
                  <View style={styles.bluePill}>
                    <Text style={styles.bluePillText}>Blue Cut</Text>
                  </View>
                </View>
              </View>
              <View style={styles.itemPriceCol}>
                <Text style={styles.itemPriceText}>₹2,700</Text>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyBadgeText}>1</Text>
                </View>
                <Text style={styles.itemTotalText}>₹2,700</Text>
              </View>
            </View>
          </View>

          {/* Right Column: Order Summary */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeader}>
              <Receipt size={15} color="#064E3B" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Order Summary</Text>
            </View>

            <View style={styles.summaryTable}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹8,500</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryValue}>- ₹0</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (GST 5%)</Text>
                <Text style={styles.summaryValue}>₹0</Text>
              </View>

              {/* Total Amount Green Highlight Box */}
              <View style={styles.totalHighlightBox}>
                <Text style={styles.totalHighlightLabel}>Total Amount</Text>
                <Text style={styles.totalHighlightValue}>₹8,500</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Advance Paid</Text>
                <Text style={[styles.summaryValue, { color: '#059669', fontWeight: '700' }]}>
                  ₹4,000
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Remaining Balance</Text>
                <Text style={[styles.summaryValue, { color: '#DC2626', fontWeight: '800' }]}>
                  ₹4,500
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2-Column Split: Row 2 (Eye Prescription & Lens Details) */}
        <View style={styles.twoColRow}>
          {/* Left Column: Eye Prescription */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeaderBetween}>
              <View style={styles.cardHeader}>
                <Eye size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Eye Prescription</Text>
              </View>
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() =>
                  router.push({
                    pathname: '/customers/prescription/[id]',
                    params: { id: order.customer.id || 'cust-amit-sharma' },
                  })
                }
              >
                <Text style={styles.cardActionBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>

            {/* Compact Prescription Matrix */}
            <View style={styles.prescMatrix}>
              <View style={styles.prescHeaderRow}>
                <Text style={[styles.prescHeadCol, { flex: 1.5 }]}>Eye</Text>
                <Text style={styles.prescHeadCol}>SPH</Text>
                <Text style={styles.prescHeadCol}>CYL</Text>
                <Text style={styles.prescHeadCol}>Axis</Text>
                <Text style={styles.prescHeadCol}>ADD</Text>
                <Text style={styles.prescHeadCol}>PD</Text>
              </View>

              {/* Right Eye (OD) */}
              <View style={styles.prescDataRow}>
                <Text style={[styles.prescDataCol, { flex: 1.5, fontWeight: '600' }]}>
                  Right (OD)
                </Text>
                <Text style={styles.prescDataCol}>-1.25</Text>
                <Text style={styles.prescDataCol}>-0.50</Text>
                <Text style={styles.prescDataCol}>180</Text>
                <Text style={styles.prescDataCol}>+1.00</Text>
                <Text style={styles.prescDataCol}>30</Text>
              </View>

              {/* Left Eye (OS) */}
              <View style={styles.prescDataRow}>
                <Text style={[styles.prescDataCol, { flex: 1.5, fontWeight: '600' }]}>
                  Left (OS)
                </Text>
                <Text style={styles.prescDataCol}>-1.50</Text>
                <Text style={styles.prescDataCol}>-0.75</Text>
                <Text style={styles.prescDataCol}>175</Text>
                <Text style={styles.prescDataCol}>+1.00</Text>
                <Text style={styles.prescDataCol}>31</Text>
              </View>
            </View>

            {/* Bottom Prescription Meta */}
            <View style={styles.prescMetaRow}>
              <Text style={styles.prescMetaText}>Type: Progressive</Text>
              <Text style={styles.prescMetaText}>Valid Till: 28 Oct 2028</Text>
              <Text style={styles.prescMetaText}>Doctor: Dr. R. Mehta</Text>
            </View>
          </View>

          {/* Right Column: Lens Details */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeader}>
              <Disc size={15} color="#064E3B" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Lens Details</Text>
            </View>

            <View style={styles.keyValList}>
              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Lens Type</Text>
                <Text style={styles.keyValue}>Progressive</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Lens Material</Text>
                <Text style={styles.keyValue}>1.56 Index</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Coating</Text>
                <Text style={styles.keyValue}>Anti-Glare + Blue Cut</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Brand</Text>
                <Text style={styles.keyValue}>Essilor</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Warranty</Text>
                <Text style={styles.keyValue}>2 Years</Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Expected Delivery</Text>
                <Text style={styles.keyValue}>01 Nov 2026</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2-Column Split: Row 3 (Payment History & Delivery Details) */}
        <View style={styles.twoColRow}>
          {/* Left Column: Payment History */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeaderBetween}>
              <View style={styles.cardHeader}>
                <CreditCard size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Payment History</Text>
              </View>
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() =>
                  Alert.alert('Add Payment', 'Record cash, UPI, or card payment for this order.')
                }
              >
                <Text style={styles.cardActionBtnText}>+ Add Payment</Text>
              </TouchableOpacity>
            </View>

            {/* Payment History Matrix */}
            <View style={styles.prescMatrix}>
              <View style={styles.prescHeaderRow}>
                <Text style={[styles.prescHeadCol, { flex: 1.4 }]}>Date</Text>
                <Text style={[styles.prescHeadCol, { flex: 1.2 }]}>Amount</Text>
                <Text style={styles.prescHeadCol}>Mode</Text>
                <Text style={[styles.prescHeadCol, { flex: 1.3 }]}>Reference</Text>
                <Text style={styles.prescHeadCol}>Status</Text>
              </View>

              {/* Payment Row 1 */}
              <View style={styles.prescDataRow}>
                <Text style={[styles.prescDataCol, { flex: 1.4 }]}>28 Oct 2026</Text>
                <Text style={[styles.prescDataCol, { flex: 1.2, fontWeight: '700' }]}>
                  ₹4,000
                </Text>
                <Text style={styles.prescDataCol}>UPI</Text>
                <Text style={[styles.prescDataCol, { flex: 1.3, fontSize: 9.5 }]}>
                  #TXN123456
                </Text>
                <View style={[styles.prescDataCol, { alignItems: 'center' }]}>
                  <View style={styles.paidPill}>
                    <Text style={styles.paidPillText}>Paid</Text>
                  </View>
                </View>
              </View>

              {/* Payment Row 2 (Pending) */}
              <View style={styles.prescDataRow}>
                <Text style={[styles.prescDataCol, { flex: 1.4 }]}>-</Text>
                <Text style={[styles.prescDataCol, { flex: 1.2, fontWeight: '700' }]}>
                  ₹4,500
                </Text>
                <Text style={styles.prescDataCol}>-</Text>
                <Text style={[styles.prescDataCol, { flex: 1.3 }]}>-</Text>
                <View style={[styles.prescDataCol, { alignItems: 'center' }]}>
                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingPillText}>Pending</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right Column: Delivery Details */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeaderBetween}>
              <View style={styles.cardHeader}>
                <Truck size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Delivery Details</Text>
              </View>
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() =>
                  Alert.alert('Update Delivery', 'Update expected delivery date or pickup details.')
                }
              >
                <Text style={styles.cardActionBtnText}>Update</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.keyValList}>
              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Expected Date</Text>
                <View style={styles.valWithIcon}>
                  <Calendar size={12} color="#475569" style={{ marginRight: 4 }} />
                  <Text style={styles.keyValue}>01 Nov 2026</Text>
                </View>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Delivery Method</Text>
                <View style={styles.valWithIcon}>
                  <Store size={12} color="#475569" style={{ marginRight: 4 }} />
                  <Text style={styles.keyValue}>Store Pickup</Text>
                </View>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Status</Text>
                <View style={styles.valWithIcon}>
                  <Clock size={12} color="#D97706" style={{ marginRight: 4 }} />
                  <Text style={styles.keyValue}>In Progress</Text>
                </View>
              </View>

              <View style={styles.keyValRow}>
                <Text style={styles.keyLabel}>Notes</Text>
                <Text style={[styles.keyValue, { color: '#64748B' }]}>
                  Call customer before delivery.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2-Column Split: Row 4 (Order Notes & Timeline / Activity Log) */}
        <View style={styles.twoColRow}>
          {/* Left Column: Order Notes */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeaderBetween}>
              <View style={styles.cardHeader}>
                <FileEdit size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Order Notes</Text>
              </View>
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() => Alert.alert('Edit Note', 'Edit internal optical instructions.')}
              >
                <Text style={styles.cardActionBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Amber Note Container */}
            <View style={styles.amberNoteBox}>
              <View style={styles.noteTopRow}>
                <FileEdit size={13} color="#D97706" style={{ marginRight: 6, marginTop: 2 }} />
                <Text style={styles.amberNoteText}>
                  Customer wants lightweight frame. Use blue cut lenses. Call before delivery.
                  Customer prefers evening pickup.
                </Text>
              </View>
              <Text style={styles.amberNoteFooter}>28 Oct 2026 • Staff: Admin</Text>
            </View>
          </View>

          {/* Right Column: Timeline / Activity Log */}
          <View style={[styles.card, styles.colFlex]}>
            <View style={styles.cardHeaderBetween}>
              <View style={styles.cardHeader}>
                <Clock size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Timeline / Activity Log</Text>
              </View>
              <TouchableOpacity
                style={styles.cardActionBtn}
                onPress={() => Alert.alert('Activity Log', 'Full history of Order #ORD-2026-001')}
              >
                <Text style={styles.cardActionBtnText}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Vertical Activity Timeline */}
            <View style={styles.activityList}>
              {/* Item 1: Order Created */}
              <View style={styles.activityItem}>
                <View style={styles.activityDotCol}>
                  <View style={[styles.activityDot, { backgroundColor: '#2563EB' }]} />
                  <View style={styles.activityLine} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTime}>28 Oct 2026, 10:30 AM</Text>
                  <Text style={styles.activityDesc}>Order created by Admin</Text>
                </View>
              </View>

              {/* Item 2: Lens Fitting Started */}
              <View style={styles.activityItem}>
                <View style={styles.activityDotCol}>
                  <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
                  <View style={styles.activityLine} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTime}>29 Oct 2026, 11:00 AM</Text>
                  <Text style={styles.activityDesc}>Lens fitting started</Text>
                </View>
              </View>

              {/* Item 3: Ready for delivery (Pending) */}
              <View style={styles.activityItem}>
                <View style={styles.activityDotCol}>
                  <View
                    style={[
                      styles.activityDot,
                      { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderWidth: 2 },
                    ]}
                  />
                  <View style={styles.activityLine} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTime, { color: '#94A3B8' }]}>-</Text>
                  <Text style={[styles.activityDesc, { color: '#64748B' }]}>
                    Ready for delivery (Pending)
                  </Text>
                </View>
              </View>

              {/* Item 4: Delivered (Pending) */}
              <View style={styles.activityItem}>
                <View style={styles.activityDotCol}>
                  <View
                    style={[
                      styles.activityDot,
                      { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderWidth: 2 },
                    ]}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTime, { color: '#94A3B8' }]}>-</Text>
                  <Text style={[styles.activityDesc, { color: '#64748B' }]}>
                    Delivered (Pending)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Sticky Bottom Bar with 3 Actions */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() =>
            Alert.alert(
              'Cancel Order',
              'Are you sure you want to cancel this order?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes, Cancel',
                  style: 'destructive',
                  onPress: () => handleStatusChange('Cancelled'),
                },
              ]
            )
          }
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>Cancel Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.readyBtn}
          onPress={() => handleStatusChange('Ready')}
          activeOpacity={0.8}
        >
          <Text style={styles.readyBtnText}>Mark as Ready</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deliveredBtn}
          onPress={() => handleStatusChange('Delivered')}
          activeOpacity={0.85}
        >
          <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.deliveredBtnText}>Mark as Delivered</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#04281B',
    paddingBottom: 14,
    paddingHorizontal: 14,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#A7F3D0',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 7.5,
    color: '#A7F3D0',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  menuIconBtn: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },

  // Order Top Bar Card
  orderTopBarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  orderIdentLeft: {
    flex: 1,
  },
  orderNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  orderTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editOrderBtn: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  editOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  outlineActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
  },
  outlineActionBtnText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
  },

  // Customer Card
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  customerAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customerAvatarText: {
    color: '#0284C7',
    fontSize: 16,
    fontWeight: '800',
  },
  customerInfoCol: {
    flex: 1,
  },
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  regularBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  regularBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },
  customerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  customerDetailText: {
    fontSize: 11,
    color: '#64748B',
  },
  customerActionsCol: {
    gap: 5,
    alignItems: 'flex-end',
  },
  custActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  custActionText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#16A34A',
  },

  // Stepper Card
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: 72,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotDone: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  stepTitleDone: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },
  stepSubDone: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
  },
  stepTitlePending: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
    marginHorizontal: -4,
  },
  stepLineDone: {
    backgroundColor: '#059669',
  },

  // 2-Column Responsive Split
  twoColRow: {
    flexDirection: width > 700 ? 'row' : 'row',
    gap: 10,
    marginBottom: 10,
  },
  colFlex: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  cardActionBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#334155',
  },

  // Items List
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumbBox: {
    width: 44,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemDetailsCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  itemPillsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  bluePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  bluePillText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '700',
  },
  grayPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  grayPillText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
  },
  itemPriceCol: {
    alignItems: 'flex-end',
  },
  itemPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  qtyBadge: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    marginVertical: 2,
  },
  qtyBadgeText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#475569',
  },
  itemTotalText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },

  // Order Summary Table
  summaryTable: {
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  totalHighlightBox: {
    backgroundColor: '#ECFDF5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginVertical: 2,
  },
  totalHighlightLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  totalHighlightValue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#064E3B',
  },

  // Prescription Table
  prescMatrix: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  prescHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  prescHeadCol: {
    flex: 1,
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  prescDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4.5,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  prescDataCol: {
    flex: 1,
    fontSize: 9.5,
    color: '#1E293B',
    textAlign: 'center',
  },
  prescMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  prescMetaText: {
    fontSize: 8.5,
    color: '#64748B',
    fontWeight: '500',
  },

  // Key-Value List
  keyValList: {
    gap: 5.5,
  },
  keyValRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  keyValue: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  valWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Paid / Pending Pills
  paidPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  paidPillText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#059669',
  },
  pendingPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  pendingPillText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Amber Note Box
  amberNoteBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 8,
  },
  noteTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  amberNoteText: {
    flex: 1,
    fontSize: 10,
    color: '#92400E',
    lineHeight: 14,
  },
  amberNoteFooter: {
    fontSize: 9,
    color: '#B45309',
    marginTop: 5,
    fontWeight: '600',
  },

  // Activity Log
  activityList: {
    gap: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityDotCol: {
    alignItems: 'center',
    width: 14,
    marginRight: 6,
    marginTop: 2,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityLine: {
    width: 1.5,
    height: 18,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 2,
  },
  activityTime: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  activityDesc: {
    fontSize: 9.5,
    color: '#64748B',
  },

  // Sticky Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
  readyBtn: {
    flex: 1.1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  deliveredBtn: {
    flex: 1.4,
    backgroundColor: '#064E3B',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveredBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
