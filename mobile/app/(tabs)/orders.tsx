import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  ChevronRight,
  Check,
  X,
  Phone,
} from 'lucide-react-native';
import { opticalStore } from '../../src/store/opticalStore';
import { Order } from '../../src/types/order';
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
 * High Detail Product Thumbnails for Orders
 */
function OrderProductVisual({ orderId }: { orderId: string }) {
  if (orderId === 'ord-2026-001') {
    // Ray-Ban RB2140 Black Frame
    return (
      <Svg width={54} height={26} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
        <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.8" />
        <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (orderId === 'ord-2026-002') {
    // Oakley Sunglasses
    return (
      <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
        <Path d="M28 7 L36 7" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
        <Path d="M3 7 L0 6" stroke="#92400E" strokeWidth="2.8" />
        <Path d="M61 7 L64 6" stroke="#92400E" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (orderId === 'ord-2026-003') {
    // Blue Cut Lenses (Dual pair)
    return (
      <Svg width={50} height={26} viewBox="0 0 60 30" fill="none">
        <Circle cx="20" cy="15" r="13" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
        <Circle cx="38" cy="16" r="13" stroke="#2563EB" strokeWidth="2" fill="#BFDBFE" />
        <Path d="M12 11 C15 9, 25 9, 28 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (orderId === 'ord-2026-004') {
    // Vogue Frame (Brown / Tortoise)
    return (
      <Svg width={54} height={26} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#D97706" strokeWidth="2.8" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
        <Path d="M3 8 L0 8" stroke="#D97706" strokeWidth="2.8" />
        <Path d="M61 8 L64 8" stroke="#D97706" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (orderId === 'ord-2026-005') {
    // Acuvue Contact Lens box
    return (
      <Svg width={54} height={26} viewBox="0 0 64 28" fill="none">
        <Rect x="2" y="3" width="60" height="22" rx="4" stroke="#60A5FA" strokeWidth="1.6" fill="#FFFFFF" />
        <Path d="M2 10 L62 10" stroke="#3B82F6" strokeWidth="1.2" />
        <Path d="M8 7 L20 7" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
        <Path d="M28 17 C38 13, 50 15, 56 8" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      </Svg>
    );
  }

  if (orderId === 'ord-2026-006') {
    // Titan Frame (Clear Grey)
    return (
      <Svg width={54} height={26} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.6" fill="#F8FAFC" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.6" fill="#F8FAFC" />
        <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
        <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
      </Svg>
    );
  }

  // Photochromic single lens
  return (
    <Svg width={50} height={26} viewBox="0 0 54 28" fill="none">
      <Circle cx="27" cy="14" r="12" stroke="#64748B" strokeWidth="2" fill="#E2E8F0" />
      <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * 4-Step Stepper Timeline for Optical Lens Orders
 */
function OrderTimelineStepper({
  stage = 2,
  isCancelled = false,
  fittingLabel = 'Lens Fitting',
}: {
  stage?: number;
  isCancelled?: boolean;
  fittingLabel?: string;
}) {
  if (isCancelled) {
    return (
      <View style={styles.stepperContainer}>
        {/* Step 1: Order (Done) */}
        <View style={styles.stepNodeBox}>
          <View style={[styles.stepDot, styles.stepDotDone]}>
            <Check size={9} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={[styles.stepText, styles.stepTextDone]}>Order</Text>
        </View>

        {/* Red Line */}
        <View style={[styles.stepLine, { backgroundColor: '#EF4444' }]} />

        {/* Step 2: Cancelled */}
        <View style={styles.stepNodeBox}>
          <View style={[styles.stepDot, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}>
            <X size={9} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={[styles.stepText, { color: '#EF4444', fontWeight: '800' }]}>
            Cancelled
          </Text>
        </View>

        {/* Gray Line */}
        <View style={styles.stepLine} />

        {/* Step 3: Ready */}
        <View style={styles.stepNodeBox}>
          <View style={styles.stepDot} />
          <Text style={styles.stepText}>Ready</Text>
        </View>

        {/* Gray Line */}
        <View style={styles.stepLine} />

        {/* Step 4: Delivered */}
        <View style={styles.stepNodeBox}>
          <View style={styles.stepDot} />
          <Text style={styles.stepText}>Delivered</Text>
        </View>
      </View>
    );
  }

  // Normal flow: stages 1 to 4
  const isOrderDone = stage >= 1;
  const isFittingDone = stage >= 2;
  const isReadyDone = stage >= 3;
  const isDeliveredDone = stage >= 4;

  return (
    <View style={styles.stepperContainer}>
      {/* Step 1: Order */}
      <View style={styles.stepNodeBox}>
        <View style={[styles.stepDot, isOrderDone && styles.stepDotDone]}>
          <Check size={9} color="#FFFFFF" strokeWidth={3} />
        </View>
        <Text style={[styles.stepText, isOrderDone && styles.stepTextDone]}>Order</Text>
      </View>

      {/* Line 1 */}
      <View style={[styles.stepLine, isFittingDone && styles.stepLineDone]} />

      {/* Step 2: Fitting */}
      <View style={styles.stepNodeBox}>
        <View style={[styles.stepDot, isFittingDone && styles.stepDotDone]}>
          {isFittingDone && <Check size={9} color="#FFFFFF" strokeWidth={3} />}
        </View>
        <Text style={[styles.stepText, isFittingDone && styles.stepTextDone]}>
          {fittingLabel}
        </Text>
      </View>

      {/* Line 2 */}
      <View style={[styles.stepLine, isReadyDone && styles.stepLineDone]} />

      {/* Step 3: Ready */}
      <View style={styles.stepNodeBox}>
        <View style={[styles.stepDot, isReadyDone && styles.stepDotDone]}>
          {isReadyDone && <Check size={9} color="#FFFFFF" strokeWidth={3} />}
        </View>
        <Text style={[styles.stepText, isReadyDone && styles.stepTextDone]}>Ready</Text>
      </View>

      {/* Line 3 */}
      <View style={[styles.stepLine, isDeliveredDone && styles.stepLineDone]} />

      {/* Step 4: Delivered */}
      <View style={styles.stepNodeBox}>
        <View style={[styles.stepDot, isDeliveredDone && styles.stepDotDone]}>
          {isDeliveredDone && <Check size={9} color="#FFFFFF" strokeWidth={3} />}
        </View>
        <Text style={[styles.stepText, isDeliveredDone && styles.stepTextDone]}>
          Delivered
        </Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [ordersList, setOrdersList] = useState<Order[]>(() => {
    return opticalStore.getState().orders || [];
  });

  useEffect(() => {
    const unsubscribe = opticalStore.subscribe(() => {
      setOrdersList(opticalStore.getState().orders || []);
    });
    return unsubscribe;
  }, []);

  const totalCount = ordersList.length;
  const processingCount = ordersList.filter(
    (o) => o.orderStatus === 'Processing' || o.orderStatus === 'Fitting' || o.orderStatus === 'Fitting in Lab'
  ).length;
  const readyCount = ordersList.filter(
    (o) => o.orderStatus === 'Ready' || o.orderStatus === 'Ready for Pickup'
  ).length;
  const deliveredCount = ordersList.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledCount = ordersList.filter((o) => o.orderStatus === 'Cancelled').length;

  const dynamicFilterTabs = [
    { key: 'all', label: `All Orders (${totalCount})` },
    { key: 'processing', label: `Processing (${processingCount})` },
    { key: 'ready', label: `Ready (${readyCount})` },
    { key: 'delivered', label: `Delivered (${deliveredCount})` },
    { key: 'cancelled', label: `Cancelled (${cancelledCount})` },
  ];

  const filteredOrders = ordersList.filter((o) => {
    // Search matching
    const orderNo = o.orderNumber || '';
    const custName = o.customer?.name || '';
    const custPhone = o.customer?.phone || '';
    const matchesSearch =
      orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custPhone.includes(searchQuery);

    if (!matchesSearch) return false;

    // Filter matching
    if (selectedFilter === 'processing')
      return o.orderStatus === 'Processing' || o.orderStatus === 'Fitting' || o.orderStatus === 'Fitting in Lab';
    if (selectedFilter === 'ready')
      return o.orderStatus === 'Ready' || o.orderStatus === 'Ready for Pickup';
    if (selectedFilter === 'delivered') return o.orderStatus === 'Delivered';
    if (selectedFilter === 'cancelled') return o.orderStatus === 'Cancelled';
    return true;
  });

  const getCustomerInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Processing':
        return { bg: '#EFF6FF', text: '#2563EB' };
      case 'Ready':
        return { bg: '#ECFDF5', text: '#059669' };
      case 'Delivered':
        return { bg: '#ECFDF5', text: '#059669' };
      case 'Fitting':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Cancelled':
      default:
        return { bg: '#FEE2E2', text: '#DC2626' };
    }
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerContent}>
          {/* Left Title */}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Orders</Text>
            <Text style={styles.headerSubtitle}>
              Manage sales orders, lens processing and delivery
            </Text>
          </View>

          {/* Right Brand Logo */}
          <View style={styles.brandContainer}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandTitle}>Goggles Shop</Text>
              <Text style={styles.brandSubtitle}>OPTICAL STORE POS</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 4 Metric KPI Cards Row */}
        <View style={styles.metricsRow}>
          {/* Total Orders */}
          <View style={[styles.metricCard, { backgroundColor: '#F0F9FF' }]}>
            <ShoppingCart size={17} color="#2563EB" />
            <Text style={styles.metricNumber}>{totalCount}</Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
          </View>

          {/* Processing */}
          <View style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
            <Clock size={17} color="#D97706" />
            <Text style={styles.metricNumber}>{processingCount}</Text>
            <Text style={styles.metricLabel}>Processing</Text>
          </View>

          {/* Ready for Delivery */}
          <View style={[styles.metricCard, { backgroundColor: '#F5F3FF' }]}>
            <Truck size={17} color="#7C3AED" />
            <Text style={styles.metricNumber}>{readyCount}</Text>
            <Text style={styles.metricLabel}>Ready</Text>
          </View>

          {/* Delivered */}
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={17} color="#059669" />
            <Text style={styles.metricNumber}>{deliveredCount}</Text>
            <Text style={styles.metricLabel}>Delivered</Text>
          </View>
        </View>

        {/* Search, Filters & New Order Button Row */}
        <View style={styles.searchActionRow}>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by order no, customer name, phone..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters Button */}
          <TouchableOpacity
            style={styles.filtersBtn}
            onPress={() =>
              Alert.alert('Filter Orders', 'Filter by Date, Lab Status, or Delivery Date')
            }
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={14} color="#334155" style={{ marginRight: 5 }} />
            <Text style={styles.filtersBtnText}>Filters</Text>
          </TouchableOpacity>

          {/* New Order Button */}
          <TouchableOpacity
            style={styles.newOrderBtn}
            onPress={() => router.push('/(tabs)/pos')}
            activeOpacity={0.85}
          >
            <PlusCircle size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.newOrderBtnText}>New Order</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsContainer}
          style={styles.filterPillsScroll}
        >
          {dynamicFilterTabs.map((tab) => {
            const isActive = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
                onPress={() => setSelectedFilter(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Orders List */}
        <View style={styles.ordersList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const custName = order.customer?.name || 'Customer';
              const custPhone = order.customer?.phone || '-';
              const initials = getCustomerInitials(custName);
              const statusStyle = getStatusBadgeStyle(order.orderStatus);
              const isCancelled = order.orderStatus === 'Cancelled';
              const item = order.items && order.items.length > 0 ? order.items[0] : null;

              // Specific fitting label
              let fittingLabel = 'Lens Fitting';
              if (
                order.id === 'ord-2026-002' ||
                order.id === 'ord-2026-003' ||
                order.id === 'ord-2026-005'
              ) {
                fittingLabel = 'Fitting';
              }

              return (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() =>
                    router.push({
                      pathname: '/orders/[id]',
                      params: { id: order.id },
                    })
                  }
                  activeOpacity={0.88}
                >
                  {/* Top Section of Card */}
                  <View style={styles.orderCardTop}>
                    {/* Left Column: Order #, Date, Avatar, Customer */}
                    <View style={styles.orderLeftCol}>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{order.createdAt ? order.createdAt.split('T')[0] : 'Recent'}</Text>

                      <View style={styles.customerRow}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <View>
                          <Text style={styles.customerName}>{custName}</Text>
                          <Text style={styles.customerPhone}>{custPhone}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Visual Box */}
                    <View style={styles.orderVisualBox}>
                      <OrderProductVisual orderId={order.id} />
                    </View>

                    {/* Product Details */}
                    <View style={styles.orderMidCol}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item?.product?.name || 'Custom Optical Frame'}
                      </Text>
                      <Text style={styles.productCustomization} numberOfLines={1}>
                        {item?.lensCustomization || 'Optical Eyewear'}
                      </Text>

                      {/* Lens Pill Tag */}
                      {order.lensTag && (
                        <View
                          style={[
                            styles.lensTag,
                            order.lensTag === 'Single Vision' && {
                              backgroundColor: '#FFF1F2',
                            },
                            order.lensTag === 'Photochromic' && {
                              backgroundColor: '#FAF5FF',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.lensTagText,
                              order.lensTag === 'Single Vision' && {
                                color: '#E11D48',
                              },
                              order.lensTag === 'Photochromic' && {
                                color: '#9333EA',
                              },
                            ]}
                          >
                            {order.lensTag}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Right Column: Price, Status, Chevron */}
                    <View style={styles.orderRightCol}>
                      <Text style={styles.orderPrice}>{formatCurrency(order.total || 0)}</Text>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusStyle.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: statusStyle.text },
                          ]}
                        >
                          {order.orderStatus}
                        </Text>
                      </View>

                      <ChevronRight size={16} color="#94A3B8" style={{ marginTop: 4 }} />
                    </View>
                  </View>

                  {/* Bottom Timeline Stepper */}
                  <View style={styles.orderCardDivider} />
                  <OrderTimelineStepper
                    stage={order.stepperStage || 2}
                    isCancelled={isCancelled}
                    fittingLabel={fittingLabel}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <ShoppingCart size={48} color="#94A3B8" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#334155', marginTop: 10 }}>
                No Lab Orders Found
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
                New prescription fitting and lab orders will appear here.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#064E3B',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginTop: 14,
                }}
                onPress={() => router.push('/(tabs)/pos')}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>+ Create Sale / Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Space above bottom */}
        <View style={{ height: 25 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },

  /* Top Header */
  header: {
    backgroundColor: '#04281B', // Deep optical emerald green
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 2,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  brandTextContainer: {
    marginLeft: 6,
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 0.6,
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },

  /* 4 Metric KPI Cards */
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 6,
    lineHeight: 20,
  },
  metricLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },

  /* Search & Action Bar */
  searchActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filtersBtn: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  newOrderBtn: {
    height: 40,
    backgroundColor: '#064E3B',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  newOrderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Category Filter Pills */
  filterPillsScroll: {
    marginVertical: 2,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 10,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Orders List */
  ordersList: {
    gap: 10,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  orderCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Left Column */
  orderLeftCol: {
    width: '30%',
    paddingRight: 6,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderDate: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
    marginBottom: 6,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  customerName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerPhone: {
    fontSize: 9,
    color: '#64748B',
  },

  /* Visual Box */
  orderVisualBox: {
    width: 65,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  /* Mid Col */
  orderMidCol: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  productCustomization: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  lensTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  lensTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },

  /* Right Col */
  orderRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 6,
    gap: 4,
  },
  orderPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  /* Divider */
  orderCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },

  /* Stepper */
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepNodeBox: {
    alignItems: 'center',
  },
  stepDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepLineDone: {
    backgroundColor: '#059669',
  },
  stepText: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '600',
  },
  stepTextDone: {
    color: '#059669',
    fontWeight: '700',
  },
});
