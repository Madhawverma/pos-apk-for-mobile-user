import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle, Line } from 'react-native-svg';
import {
  Bell,
  ChevronDown,
  Calendar,
  Users,
  Glasses,
  FileText,
  ScanBarcode,
  Plus,
  ShoppingCart,
  Package,
  ShoppingBag,
  TrendingUp,
  X,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Store,
  ExternalLink,
  Barcode,
} from 'lucide-react-native';
import { opticalStore, DashboardMetrics, AppNotification } from '../../src/store/opticalStore';
import { cartManager } from '../../src/store/cartStore';
import { formatCurrency } from '../../src/utils/currency';
import { Invoice } from '../../src/data/mockInvoices';
import { Order } from '../../src/types/order';
import { Product } from '../../src/types/product';

const { width } = Dimensions.get('window');

// Local images
const bannerImg = require('../../assets/dashboard_banner.jpg');
const managerAvatar = require('../../assets/manager_avatar.jpg');

/**
 * Optical Eyeglasses Logo for Top Header
 */
function HeaderGlassesLogo() {
  return (
    <Svg width={42} height={18} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Mini product icons for recent sales and low stock items
 */
function MiniProductIcon({
  variant = 'frame',
}: {
  variant?: 'frame' | 'sunglass' | 'tortoise' | 'clear' | 'lens' | string;
}) {
  if (variant === 'lens') {
    return (
      <View style={styles.miniLensCircle}>
        <View style={styles.lensReflection} />
      </View>
    );
  }

  const frameColor =
    variant === 'sunglass' || variant === 'sunglasses'
      ? '#1E293B'
      : variant === 'tortoise'
      ? '#78350F'
      : variant === 'clear'
      ? '#94A3B8'
      : '#0F172A';

  const lensFill =
    variant === 'sunglass' || variant === 'sunglasses'
      ? '#334155'
      : variant === 'clear'
      ? '#F1F5F9'
      : '#E2E8F0';

  return (
    <Svg width={30} height={14} viewBox="0 0 48 20" fill="none">
      <Rect
        x="2"
        y="2"
        width="18"
        height="15"
        rx="5"
        fill={lensFill}
        stroke={frameColor}
        strokeWidth="2.2"
      />
      <Path d="M20 7 C22 5, 26 5, 28 7" stroke={frameColor} strokeWidth="2.2" strokeLinecap="round" />
      <Rect
        x="28"
        y="2"
        width="18"
        height="15"
        rx="5"
        fill={lensFill}
        stroke={frameColor}
        strokeWidth="2.2"
      />
    </Svg>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Dynamic filter state
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month'>('today');

  // Reactive store state
  const [metrics, setMetrics] = useState<DashboardMetrics>(() =>
    opticalStore.getDashboardMetrics(activeFilter)
  );
  const [recentSales, setRecentSales] = useState<Invoice[]>(() =>
    opticalStore.getRecentInvoices(5)
  );
  const [pendingOrders, setPendingOrders] = useState<Order[]>(() =>
    opticalStore.getPendingLensOrders(4)
  );
  const [lowStockItems, setLowStockItems] = useState<Product[]>(() =>
    opticalStore.getLowStockProducts(3)
  );
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(() =>
    opticalStore.getUnreadNotificationsCount()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    opticalStore.getState().notifications
  );

  // Modals state
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Barcode scanner simulation state
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [activeBarIdx, setActiveBarIdx] = useState<number>(6); // Default to today (last bar index 6)

  // Subscribe to opticalStore changes
  useEffect(() => {
    const updateLocalState = () => {
      setMetrics(opticalStore.getDashboardMetrics(activeFilter));
      setRecentSales(opticalStore.getRecentInvoices(5));
      setPendingOrders(opticalStore.getPendingLensOrders(4));
      setLowStockItems(opticalStore.getLowStockProducts(3));
      setUnreadNotifsCount(opticalStore.getUnreadNotificationsCount());
      setNotifications(opticalStore.getState().notifications);
    };

    const unsubscribe = opticalStore.subscribe(updateLocalState);
    return () => unsubscribe();
  }, [activeFilter]);

  // Recalculate metrics when timeframe filter changes
  useEffect(() => {
    setMetrics(opticalStore.getDashboardMetrics(activeFilter));
  }, [activeFilter]);

  // Compute live greeting based on current local hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good Morning!'
      : currentHour < 17
      ? 'Good Afternoon!'
      : 'Good Evening!';

  // Format current date: e.g. "Thu, 31 Oct 2026"
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Handle Scan Barcode
  const handleTriggerScanner = () => {
    // Pick the first product from inventory as scanned sample
    const sample = opticalStore.getState().products[0] || null;
    setScannedProduct(sample);
    setShowScannerModal(true);
  };

  const handleAddScannedToCart = () => {
    if (scannedProduct) {
      cartManager.addItem(scannedProduct, 1);
      setShowScannerModal(false);
      Alert.alert(
        'Added to POS Cart',
        `${scannedProduct.name} has been added to cart. Open POS Billing?`,
        [
          { text: 'Continue Scanning', style: 'cancel' },
          { text: 'Go to POS', onPress: () => router.push('/(tabs)/pos') },
        ]
      );
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Top Header (Deep Optical Emerald Green) */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
        <View style={styles.headerRow}>
          {/* Brand Logo & Title */}
          <View style={styles.headerLeft}>
            <HeaderGlassesLogo />
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>श्री गणेश ऑप्टिकल</Text>
              <Text style={styles.headerSubtitle}>इंग्लिशिपुरा, सीहोर • 6263732857</Text>
            </View>
          </View>

          {/* Notifications & Admin Profile */}
          <View style={styles.headerRight}>
            {/* Notification Bell with Badge */}
            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.75}
              onPress={() => setShowNotifModal(true)}
            >
              <Bell size={19} color="#FFFFFF" strokeWidth={2} />
              {unreadNotifsCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadNotifsCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile Avatar & Info */}
            <TouchableOpacity
              style={styles.profileRow}
              activeOpacity={0.85}
              onPress={() => setShowProfileModal(true)}
            >
              <Image source={managerAvatar} style={styles.avatarImg} />
              <View style={styles.profileTextBox}>
                <Text style={styles.profileName}>Admin</Text>
                <View style={styles.profileRoleRow}>
                  <Text style={styles.profileRole}>Store Manager</Text>
                  <ChevronDown size={11} color="#A7F3D0" style={styles.chevronIcon} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Back Banner Card with Seamless Fitted Photo */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerGreeting}>{greeting}</Text>
            <View style={styles.bannerTitleRow}>
              <Text style={styles.bannerTitle}>Welcome Back</Text>
              <Text style={styles.bannerEmoji}> 👋</Text>
            </View>
            <Text style={styles.bannerSubtitle}>
              {pendingOrders.length} pending lens orders • {lowStockItems.length} low stock alerts
            </Text>
          </View>

          {/* Seamless right-aligned photo with zero border */}
          <View style={styles.bannerImageWrapper}>
            <Image source={bannerImg} style={styles.bannerImage} resizeMode="cover" />
          </View>
        </View>

        {/* Date & Timeframe Filter Row */}
        <View style={styles.filterRow}>
          <View style={styles.dateBox}>
            <Calendar size={15} color="#064E3B" strokeWidth={2.2} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <View style={styles.filterPills}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === 'today' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('today')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'today' && styles.filterPillTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === 'week' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('week')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'week' && styles.filterPillTextActive,
                ]}
              >
                This Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === 'month' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('month')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'month' && styles.filterPillTextActive,
                ]}
              >
                This Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Dynamic KPI Summary Cards */}
        <View style={styles.kpiRow}>
          {/* Today's / Filtered Sales */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.85}
            onPress={() => router.push('/reports/profit' as any)}
          >
            <View style={[styles.kpiIconBox, { backgroundColor: '#10B981' }]}>
              <Text style={styles.kpiRupeeSymbol}>₹</Text>
            </View>
            <Text style={styles.kpiValue}>{formatCurrency(metrics.salesTotal)}</Text>
            <Text style={styles.kpiLabel}>
              {activeFilter === 'today'
                ? "Today's Sales"
                : activeFilter === 'week'
                ? 'Weekly Sales'
                : 'Monthly Sales'}
            </Text>
            <View style={styles.kpiTrendRow}>
              <TrendingUp size={12} color="#10B981" strokeWidth={2.4} />
              <Text style={[styles.kpiTrendText, { color: '#10B981' }]}> {metrics.trendSales}</Text>
            </View>
          </TouchableOpacity>

          {/* Total Orders */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <View style={[styles.kpiIconBox, { backgroundColor: '#3B82F6' }]}>
              <ShoppingCart size={15} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.kpiValue}>{metrics.ordersTotal}</Text>
            <Text style={styles.kpiLabel}>Total Orders</Text>
            <View style={styles.kpiTrendRow}>
              <TrendingUp size={12} color="#3B82F6" strokeWidth={2.4} />
              <Text style={[styles.kpiTrendText, { color: '#3B82F6' }]}> {metrics.trendOrders}</Text>
            </View>
          </TouchableOpacity>

          {/* Customers */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/customers')}
          >
            <View style={[styles.kpiIconBox, { backgroundColor: '#8B5CF6' }]}>
              <Users size={15} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.kpiValue}>{metrics.customersTotal}</Text>
            <Text style={styles.kpiLabel}>Customers</Text>
            <View style={styles.kpiTrendRow}>
              <TrendingUp size={12} color="#8B5CF6" strokeWidth={2.4} />
              <Text style={[styles.kpiTrendText, { color: '#8B5CF6' }]}> +5%</Text>
            </View>
          </TouchableOpacity>

          {/* Low Stock */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.85}
            onPress={() => router.push('/inventory/stock' as any)}
          >
            <View style={[styles.kpiIconBox, { backgroundColor: '#EF4444' }]}>
              <Package size={15} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.kpiValue}>{metrics.lowStockTotal}</Text>
            <Text style={styles.kpiLabel}>Low Stock</Text>
            <View style={styles.kpiTrendRow}>
              <TrendingUp size={12} color="#EF4444" strokeWidth={2.4} />
              <Text style={[styles.kpiTrendText, { color: '#EF4444' }]}> Alert</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5 Quick Actions */}
        <View style={styles.actionsRow}>
          {/* New Sale POS Billing (Featured Dark Green) */}
          <TouchableOpacity
            style={styles.actionBtnFeatured}
            onPress={() => router.push('/(tabs)/pos')}
            activeOpacity={0.88}
          >
            <View style={styles.plusCircle}>
              <Plus size={15} color="#064E3B" strokeWidth={3} />
            </View>
            <Text style={styles.actionBtnFeaturedTitle}>New Sale</Text>
            <Text style={styles.actionBtnFeaturedSub}>POS Billing</Text>
          </TouchableOpacity>

          {/* Add Customer */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/customers/add')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircle}>
              <Users size={19} color="#064E3B" strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Add Customer</Text>
          </TouchableOpacity>

          {/* Add Product */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/products/add')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircle}>
              <Glasses size={19} color="#064E3B" strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Add Product</Text>
          </TouchableOpacity>

          {/* Lens Order */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/orders/create')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircle}>
              <FileText size={19} color="#064E3B" strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Lens Order</Text>
          </TouchableOpacity>

          {/* Scan Barcode */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleTriggerScanner}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircle}>
              <ScanBarcode size={19} color="#064E3B" strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Middle Section: 2 Columns (Recent Sales & Pending Lens Orders) */}
        <View style={styles.twoColumnRow}>
          {/* Recent Sales Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Recent Sales</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/invoices')}>
                <Text style={styles.cardSeeAll}>See All →</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Recent Sales Rows */}
            {recentSales.map((sale, idx) => (
              <TouchableOpacity
                key={sale.id || idx}
                style={[
                  styles.saleRow,
                  idx === recentSales.length - 1 && styles.lastItemRow,
                ]}
                activeOpacity={0.75}
                onPress={() => router.push(`/invoices/${sale.id}` as any)}
              >
                <View style={styles.productIconBox}>
                  <MiniProductIcon variant={sale.itemType} />
                </View>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleInvoiceNumber}>{sale.invoiceNumber}</Text>
                  <Text style={styles.saleSubtext}>
                    {sale.time} • {sale.itemCount} {sale.itemCount === 1 ? 'Item' : 'Items'}
                  </Text>
                </View>
                <View style={styles.saleRight}>
                  <Text style={styles.saleAmount}>{formatCurrency(sale.total)}</Text>
                  <View
                    style={[
                      styles.methodBadge,
                      {
                        backgroundColor:
                          sale.paymentMethod === 'Cash'
                            ? '#DCFCE7'
                            : sale.paymentMethod === 'UPI'
                            ? '#F3E8FF'
                            : '#FCE7F3',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        {
                          color:
                            sale.paymentMethod === 'Cash'
                              ? '#15803D'
                              : sale.paymentMethod === 'UPI'
                              ? '#7E22CE'
                              : '#BE185D',
                        },
                      ]}
                    >
                      {sale.paymentMethod || 'Cash'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pending Lens Orders Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Pending Lens Orders</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
                <Text style={styles.cardSeeAll}>See All →</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Pending Lens Order Rows */}
            {pendingOrders.map((ord, idx) => {
              const initials =
                ord.customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase() || 'CU';

              const isReady =
                ord.orderStatus === 'Ready' || ord.orderStatus === 'Ready for Pickup';
              const isInProcess =
                ord.orderStatus === 'Processing' || ord.orderStatus === 'Fitting';

              return (
                <TouchableOpacity
                  key={ord.id || idx}
                  style={[
                    styles.orderRow,
                    idx === pendingOrders.length - 1 && styles.lastItemRow,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => router.push(`/orders/${ord.id}` as any)}
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.customerName}>{ord.customer.name}</Text>
                    <Text style={styles.lensType}>
                      {ord.lensTag ||
                        ord.items[0]?.subtitle ||
                        ord.items[0]?.lensCustomization ||
                        'Single Vision'}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isReady
                            ? '#DCFCE7'
                            : isInProcess
                            ? '#FEF3C7'
                            : '#DBEAFE',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: isReady
                              ? '#15803D'
                              : isInProcess
                              ? '#B45309'
                              : '#1D4ED8',
                          },
                        ]}
                      >
                        {ord.orderStatus}
                      </Text>
                    </View>
                    <Text style={styles.orderDate}>{ord.createdAt}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Lower Section: Low Stock Products & Sales Overview */}
        <View style={styles.twoColumnRow}>
          {/* Low Stock Products Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Low Stock Products</Text>
              <TouchableOpacity onPress={() => router.push('/inventory/stock' as any)}>
                <Text style={styles.cardSeeAll}>See All →</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Low Stock Product Rows */}
            {lowStockItems.map((prod, idx) => (
              <TouchableOpacity
                key={prod.id || idx}
                style={[
                  styles.stockRow,
                  idx === lowStockItems.length - 1 && styles.lastItemRow,
                ]}
                activeOpacity={0.75}
                onPress={() => router.push(`/products/${prod.id}` as any)}
              >
                <View style={styles.productIconBox}>
                  <MiniProductIcon
                    variant={
                      prod.category === 'Sunglasses'
                        ? 'sunglass'
                        : prod.category === 'Lenses'
                        ? 'lens'
                        : 'frame'
                    }
                  />
                </View>
                <View style={styles.stockInfo}>
                  <Text style={styles.stockProductName}>{prod.name}</Text>
                  <Text style={styles.stockProductSub}>
                    {prod.category} • {prod.brand}
                  </Text>
                </View>
                <View
                  style={[
                    styles.stockBadgeContainer,
                    prod.stock <= 2 && { backgroundColor: '#FEE2E2' },
                  ]}
                >
                  <Text
                    style={[
                      styles.stockBadge,
                      prod.stock <= 2 && { color: '#DC2626' },
                    ]}
                  >
                    Stock: {prod.stock}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sales Overview Bar Chart Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Sales Overview</Text>
              <TouchableOpacity
                style={styles.timeDropdown}
                onPress={() =>
                  setActiveFilter((prev) => (prev === 'week' ? 'month' : 'week'))
                }
              >
                <Text style={styles.timeDropdownText}>
                  {activeFilter === 'month' ? 'This Month' : 'This Week'}
                </Text>
                <ChevronDown size={11} color="#64748B" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>

            {/* Chart Area */}
            <View style={styles.chartWrapper}>
              {/* Y Axis Labels */}
              <View style={styles.chartYAxis}>
                <Text style={styles.yAxisLabel}>80K</Text>
                <Text style={styles.yAxisLabel}>50K</Text>
                <Text style={styles.yAxisLabel}>25K</Text>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>

              {/* Bars Row */}
              <View style={styles.chartBarsContainer}>
                {metrics.chartData.map((item, index) => {
                  const isSelected = activeBarIdx === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.barColumn}
                      onPress={() => setActiveBarIdx(index)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: `${item.height}%`,
                              backgroundColor: isSelected ? '#064E3B' : '#A7F3D0',
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.barDayText,
                          isSelected && { color: '#064E3B', fontWeight: '700' },
                        ]}
                      >
                        {item.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Bottom Summary Metrics */}
            <View style={styles.chartBottomSummary}>
              <TouchableOpacity
                style={styles.summaryItem}
                onPress={() => router.push('/reports/profit' as any)}
              >
                <View style={[styles.summaryIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <ShoppingBag size={12} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.summaryAmount}>
                    {formatCurrency(metrics.chartData[activeBarIdx]?.amount || metrics.salesTotal)}
                  </Text>
                  <Text style={styles.summarySub}>
                    {metrics.chartData[activeBarIdx]?.day} Sales
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.summaryItem}
                onPress={() => router.push('/(tabs)/orders')}
              >
                <View style={[styles.summaryIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <ShoppingCart size={12} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.summaryAmount}>
                    {metrics.chartData[activeBarIdx]?.orders || metrics.ordersTotal}
                  </Text>
                  <Text style={styles.summarySub}>
                    {metrics.chartData[activeBarIdx]?.day} Orders
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ===================== MODAL 1: NOTIFICATIONS MODAL ===================== */}
      <Modal
        visible={showNotifModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notifModalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Bell size={18} color="#064E3B" />
                <Text style={styles.modalTitle}>Notifications</Text>
                {unreadNotifsCount > 0 && (
                  <View style={styles.notifBadgePill}>
                    <Text style={styles.notifBadgePillText}>{unreadNotifsCount} new</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowNotifModal(false)}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifs}>
                  <Text style={styles.emptyNotifsText}>No new notifications</Text>
                </View>
              ) : (
                notifications.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.notifItem,
                      !item.read && { backgroundColor: '#F0FDF4' },
                    ]}
                  >
                    <View
                      style={[
                        styles.notifIconCircle,
                        item.type === 'stock'
                          ? { backgroundColor: '#FEE2E2' }
                          : item.type === 'order'
                          ? { backgroundColor: '#DBEAFE' }
                          : { backgroundColor: '#DCFCE7' },
                      ]}
                    >
                      {item.type === 'stock' ? (
                        <AlertTriangle size={15} color="#EF4444" />
                      ) : item.type === 'order' ? (
                        <CheckCircle2 size={15} color="#2563EB" />
                      ) : (
                        <Receipt size={15} color="#16A34A" />
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.notifTitle}>{item.title}</Text>
                      <Text style={styles.notifMsg}>{item.message}</Text>
                      <Text style={styles.notifTime}>{item.time}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.notifModalFooter}>
              <TouchableOpacity
                style={styles.markReadBtn}
                onPress={() => {
                  opticalStore.markAllNotificationsRead();
                  setUnreadNotifsCount(0);
                }}
              >
                <Text style={styles.markReadText}>Mark all as read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearNotifsBtn}
                onPress={() => opticalStore.clearNotifications()}
              >
                <Text style={styles.clearNotifsText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===================== MODAL 2: BARCODE SCANNER MODAL ===================== */}
      <Modal
        visible={showScannerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScannerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scannerModalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ScanBarcode size={18} color="#064E3B" />
                <Text style={styles.modalTitle}>Optical Barcode Scanner</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowScannerModal(false)}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Simulated Camera Viewfinder */}
            <View style={styles.viewfinder}>
              <View style={styles.laserLine} />
              <Barcode size={64} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.viewfinderText}>Align barcode inside frame to scan</Text>
            </View>

            {/* Scanned product detected box */}
            {scannedProduct && (
              <View style={styles.scannedProductBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scannedProductName}>{scannedProduct.name}</Text>
                  <Text style={styles.scannedProductSub}>
                    {scannedProduct.brand} • {scannedProduct.code} • Stock: {scannedProduct.stock} pcs
                  </Text>
                  <Text style={styles.scannedProductPrice}>
                    {formatCurrency(scannedProduct.price)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={handleAddScannedToCart}
                  activeOpacity={0.85}
                >
                  <Plus size={14} color="#FFFFFF" />
                  <Text style={styles.addToCartBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.cancelScannerBtn}
              onPress={() => setShowScannerModal(false)}
            >
              <Text style={styles.cancelScannerText}>Close Scanner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===================== MODAL 3: PROFILE / SHOP SETTINGS MODAL ===================== */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Store Manager Profile</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowProfileModal(false)}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetailsRow}>
              <Image source={managerAvatar} style={styles.profileModalAvatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.profileModalName}>Admin (Store Manager)</Text>
                <Text style={styles.profileModalShop}>श्री गणेश ऑप्टिकल (Shree Ganesh Optical)</Text>
                <Text style={styles.profileModalAddress}>इंग्लिशपुरा, सीहोर (म.प्र.)</Text>
                <Text style={styles.profileModalPhone}>+91 6263732857</Text>
              </View>
            </View>

            <View style={styles.profileModalActions}>
              <TouchableOpacity
                style={styles.profileActionBtn}
                onPress={() => {
                  setShowProfileModal(false);
                  router.push('/settings/shop-profile' as any);
                }}
              >
                <Store size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.profileActionText}>Shop Profile & Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileActionBtn}
                onPress={() => {
                  setShowProfileModal(false);
                  router.push('/reports/profit' as any);
                }}
              >
                <TrendingUp size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.profileActionText}>View Profit Reports</Text>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* Top Header */
  header: {
    backgroundColor: '#04281B', // Rich optical forest green
    paddingHorizontal: 16,
    paddingBottom: 14,
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
    marginLeft: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#04281B',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  profileTextBox: {
    marginLeft: 7,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 14,
  },
  profileRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRole: {
    color: '#A7F3D0',
    fontSize: 9.5,
    fontWeight: '500',
    lineHeight: 11,
  },
  chevronIcon: {
    marginLeft: 2,
  },

  /* Welcome Banner */
  bannerCard: {
    backgroundColor: '#064E3B',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    height: 98,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerLeft: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerGreeting: {
    color: '#A7F3D0',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  bannerEmoji: {
    fontSize: 14,
  },
  bannerSubtitle: {
    color: '#D1FAE5',
    fontSize: 10.5,
    fontWeight: '400',
    marginTop: 1,
  },
  bannerImageWrapper: {
    width: 135,
    height: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  /* Filter Row */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 10,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateText: {
    color: '#064E3B',
    fontSize: 10.5,
    fontWeight: '700',
    marginLeft: 6,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 6,
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
  },
  filterPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  /* KPI Cards */
  kpiRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 10,
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  kpiIconBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  kpiRupeeSymbol: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  kpiValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  kpiLabel: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  kpiTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  kpiTrendText: {
    fontSize: 9,
    fontWeight: '700',
  },

  /* Actions Row */
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 10,
    gap: 7,
  },
  actionBtnFeatured: {
    flex: 1.15,
    backgroundColor: '#064E3B',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  plusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  actionBtnFeaturedTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
  },
  actionBtnFeaturedSub: {
    color: '#A7F3D0',
    fontSize: 8.5,
    fontWeight: '600',
    lineHeight: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionBtnText: {
    color: '#0F172A',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 11,
  },

  /* 2-Column Responsive Layout */
  twoColumnRow: {
    flexDirection: width > 768 ? 'row' : 'column',
    marginHorizontal: 12,
    marginTop: 10,
    gap: 10,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  cardSeeAll: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#064E3B',
  },

  /* Recent Sales Items */
  saleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  lastItemRow: {
    borderBottomWidth: 0,
  },
  productIconBox: {
    width: 38,
    height: 26,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  miniLensCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lensReflection: {
    width: 7,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-30deg' }],
  },
  saleInfo: {
    flex: 1,
  },
  saleInvoiceNumber: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  saleSubtext: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  saleRight: {
    alignItems: 'flex-end',
  },
  saleAmount: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginTop: 2,
  },
  methodText: {
    fontSize: 8.5,
    fontWeight: '700',
  },

  /* Pending Lens Orders Items */
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  avatarInitials: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  lensType: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 8.5,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Low Stock Products Items */
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7.5,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  stockInfo: {
    flex: 1,
  },
  stockProductName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  stockProductSub: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  stockBadgeContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },

  /* Sales Overview Bar Chart */
  timeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeDropdownText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 100,
    marginTop: 6,
    alignItems: 'flex-end',
  },
  chartYAxis: {
    height: '100%',
    justifyContent: 'space-between',
    paddingRight: 6,
    alignItems: 'flex-end',
    width: 26,
  },
  yAxisLabel: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chartBarsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: '100%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 14,
    height: 82,
    backgroundColor: '#F8FAFC',
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barDayText: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 3,
  },
  chartBottomSummary: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAmount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  summarySub: {
    fontSize: 8.5,
    color: '#64748B',
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notifModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  scannerModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  profileModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  notifBadgePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
  emptyNotifs: {
    padding: 24,
    alignItems: 'center',
  },
  emptyNotifsText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  notifItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  notifIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifMsg: {
    fontSize: 10.5,
    color: '#475569',
    marginTop: 1,
  },
  notifTime: {
    fontSize: 8.5,
    color: '#94A3B8',
    marginTop: 3,
  },
  notifModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  markReadBtn: {
    padding: 6,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#064E3B',
  },
  clearNotifsBtn: {
    padding: 6,
  },
  clearNotifsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },

  /* Viewfinder */
  viewfinder: {
    height: 160,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    marginVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  laserLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  viewfinderText: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 10,
  },
  scannedProductBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scannedProductName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  scannedProductSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  scannedProductPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 4,
  },
  addToCartBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cancelScannerBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  cancelScannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  /* Profile Modal */
  profileDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  profileModalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  profileModalName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileModalShop: {
    fontSize: 11.5,
    color: '#064E3B',
    fontWeight: '600',
    marginTop: 1,
  },
  profileModalAddress: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  profileModalPhone: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  profileModalActions: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  profileActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileActionText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
  },
});
