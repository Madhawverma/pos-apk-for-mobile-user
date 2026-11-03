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
import Svg, { Rect, Path } from 'react-native-svg';
import {
  ArrowLeft,
  Pencil,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Calendar,
  CalendarRange,
  User,
  Eye,
  FileText,
  Crown,
  Gift,
  Zap,
  Glasses,
  MessageSquare,
  Plus,
} from 'lucide-react-native';
import { opticalStore } from '../../src/store/opticalStore';
import { Invoice } from '../../src/data/mockInvoices';
import { Customer } from '../../src/types/customer';
import { cartManager } from '../../src/store/cartStore';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

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

// Navigation Tabs
const customerTabs = [
  { key: 'overview', label: 'Overview', icon: 'user' },
  { key: 'prescriptions', label: 'Prescriptions', icon: 'glasses' },
  { key: 'purchases', label: 'Purchase History', icon: 'cart' },
  { key: 'notes', label: 'Notes', icon: 'note' },
];

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('overview');

  // Reactive customer & invoices state from opticalStore
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const list = opticalStore.getState().customers;
    return list.find((c) => c.id === id || c.phone === id) || null;
  });

  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>(() => {
    const allInvoices = opticalStore.getState().invoices;
    return allInvoices.filter(
      (inv: Invoice) =>
        inv.customer?.phone === id ||
        inv.customerPhone === id ||
        (customer && (inv.customerPhone === customer.phone || inv.customerName === customer.name || inv.customer?.phone === customer.phone))
    );
  });

  useEffect(() => {
    const updateCustomerData = () => {
      const currentState = opticalStore.getState();
      const found = currentState.customers.find((c: Customer) => c.id === id || c.phone === id) || null;
      setCustomer(found);

      const relatedInvoices = currentState.invoices.filter(
        (inv: Invoice) =>
          inv.customer?.phone === id ||
          inv.customerPhone === id ||
          (found && (inv.customerPhone === found.phone || inv.customerName === found.name || inv.customer?.phone === found.phone))
      );
      setCustomerInvoices(relatedInvoices);
    };

    const unsubscribe = opticalStore.subscribe(updateCustomerData);
    return unsubscribe;
  }, [id]);

  // Fallback when customer is not found
  if (!customer) {
    return (
      <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20), paddingHorizontal: 20 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Customer Profile</Text>
        </View>

        <View style={styles.notFoundContainer}>
          <User size={50} color="#94A3B8" />
          <Text style={styles.notFoundTitle}>Customer Not Found</Text>
          <Text style={styles.notFoundSub}>
            Customer details are not available or have been removed.
          </Text>
          <TouchableOpacity
            style={styles.notFoundBtn}
            onPress={() => router.replace('/customers')}
            activeOpacity={0.85}
          >
            <Text style={styles.notFoundBtnText}>Back to Customers List</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Calculate dynamic initials
  const initials = customer.name
    ? customer.name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'CU'
    : 'CU';

  // Dynamic calculations
  const totalOrdersCount = customerInvoices.length || customer.totalOrders || 0;
  const calculatedTotalSpent = customerInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0) || customer.totalSpent || 0;
  const latestPrescription = customer.prescriptions && customer.prescriptions.length > 0 ? customer.prescriptions[0] : null;

  const handleStartSale = () => {
    cartManager.setCustomer(customer);
    if (latestPrescription) {
      cartManager.setPrescription(latestPrescription);
    }
    router.push('/(tabs)/pos');
  };

  const handleWhatsApp = () => {
    const rawDigits = customer.phone.replace(/[^0-9]/g, '');
    const phoneWith91 = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
    Linking.openURL(
      `https://wa.me/${phoneWith91}?text=Hello%20${encodeURIComponent(
        customer.name
      )},%20greeting%20from%20Shree%20Ganesh%20Optical!`
    );
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerContent}>
          {/* Left Arrow & Titles */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {customer.name}
              </Text>
              <Text style={styles.headerSubtitle}>
                {customer.phone} • {customer.city || 'Customer Details'}
              </Text>
            </View>
          </View>

          {/* Right Brand Badge */}
          <View style={styles.headerRight}>
            <View style={styles.brandContainer}>
              <HeaderGlassesLogo />
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandTitle}>SG OPTICAL</Text>
                <Text style={styles.brandSubtitle}>PORTAL</Text>
              </View>
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
        {/* ========================================================= */}
        {/* 1. TOP PROFILE CARD */}
        {/* ========================================================= */}
        <View style={styles.profileCard}>
          <View style={styles.profileMainRow}>
            {/* Left: Avatar */}
            <View style={[styles.profileAvatarBox, { backgroundColor: customer.avatarBg || '#DBEAFE' }]}>
              <Text style={[styles.profileAvatarText, { color: customer.avatarColor || '#1D4ED8' }]}>
                {initials}
              </Text>
            </View>

            {/* Center: Info */}
            <View style={styles.profileInfoBox}>
              <View style={styles.nameAndBadgeRow}>
                <Text style={styles.profileName} numberOfLines={1}>{customer.name}</Text>
                <View style={styles.regularBadge}>
                  <Text style={styles.regularBadgeText}>{customer.status || 'Active Customer'}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Phone size={13} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.metaText}>{customer.phone}</Text>
              </View>

              {customer.email ? (
                <View style={styles.metaRow}>
                  <Mail size={13} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.metaText}>{customer.email}</Text>
                </View>
              ) : null}

              <View style={styles.metaRow}>
                <MapPin size={13} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.metaText}>
                  {customer.address ? customer.address : customer.city ? customer.city : 'Address not specified'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.profileActionsRow}>
            {/* New Sale Button */}
            <TouchableOpacity
              style={styles.newSaleActionBtn}
              onPress={handleStartSale}
              activeOpacity={0.85}
            >
              <ShoppingCart size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.newSaleActionText}>New Sale</Text>
            </TouchableOpacity>

            {/* WhatsApp Button */}
            <TouchableOpacity
              style={styles.whatsAppActionBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.85}
            >
              <Phone size={14} color="#15803D" style={{ marginRight: 6 }} />
              <Text style={styles.whatsAppActionText}>WhatsApp</Text>
            </TouchableOpacity>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => router.push('/customers/add')}
              activeOpacity={0.85}
            >
              <Pencil size={13} color="#334155" style={{ marginRight: 5 }} />
              <Text style={styles.editActionText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. FOUR KPI STAT CARDS */}
        {/* ========================================================= */}
        <View style={styles.metricsGrid}>
          {/* Total Spent */}
          <View style={[styles.metricCard, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
            <View style={styles.metricTop}>
              <ShoppingBag size={16} color="#0284C7" />
              <Text style={styles.metricLabel}>Total Spent</Text>
            </View>
            <Text style={styles.metricValue}>₹{calculatedTotalSpent.toLocaleString('en-IN')}</Text>
          </View>

          {/* Total Orders */}
          <View style={[styles.metricCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
            <View style={styles.metricTop}>
              <ShoppingCart size={16} color="#7C3AED" />
              <Text style={styles.metricLabel}>Total Orders</Text>
            </View>
            <Text style={styles.metricValue}>{totalOrdersCount}</Text>
          </View>

          {/* Last Visit */}
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <View style={styles.metricTop}>
              <Calendar size={16} color="#059669" />
              <Text style={styles.metricLabel}>Last Visit</Text>
            </View>
            <Text style={styles.metricValue}>{customer.lastVisit || customer.createdAt || 'Recent'}</Text>
          </View>

          {/* Customer Since */}
          <View style={[styles.metricCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
            <View style={styles.metricTop}>
              <CalendarRange size={16} color="#D97706" />
              <Text style={styles.metricLabel}>Customer Since</Text>
            </View>
            <Text style={styles.metricValue}>{customer.createdAt || 'New'}</Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. TABS BAR */}
        {/* ========================================================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScroll}
        >
          {customerTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                {tab.icon === 'user' && (
                  <User
                    size={14}
                    color={isActive ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                )}
                {tab.icon === 'glasses' && (
                  <Glasses
                    size={14}
                    color={isActive ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                )}
                {tab.icon === 'cart' && (
                  <ShoppingCart
                    size={14}
                    color={isActive ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                )}
                {tab.icon === 'note' && (
                  <FileText
                    size={14}
                    color={isActive ? '#FFFFFF' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ========================================================= */}
        {/* 4. DETAILS SECTION */}
        {/* ========================================================= */}
        <View style={isTablet ? styles.splitGridRow : styles.verticalStack}>
          {/* LEFT / FIRST COLUMN */}
          <View style={isTablet ? styles.leftColumn : styles.fullWidth}>
            {/* CARD A: Personal Information */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeaderTitleLeft}>
                  <User size={18} color="#064E3B" strokeWidth={2.4} />
                  <Text style={styles.cardHeading}>Personal Information</Text>
                </View>
                <TouchableOpacity
                  style={styles.editSmallBtn}
                  onPress={() => router.push('/customers/add')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editSmallText}>Edit Info</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Full Name</Text>
                <Text style={styles.infoVal}>{customer.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Phone Number</Text>
                <Text style={styles.infoVal}>{customer.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Email</Text>
                <Text style={styles.infoVal}>{customer.email || 'Not provided'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>City</Text>
                <Text style={styles.infoVal}>{customer.city || 'Not provided'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Address</Text>
                <Text style={styles.infoVal}>{customer.address || customer.city || 'Not provided'}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoKey}>Registered Date</Text>
                <Text style={styles.infoVal}>{customer.createdAt || 'Recent'}</Text>
              </View>
            </View>

            {/* CARD B: Latest Eye Prescription */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeaderTitleLeft}>
                  <Eye size={18} color="#064E3B" strokeWidth={2.4} />
                  <Text style={styles.cardHeading}>Latest Eye Prescription</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push(`/customers/prescription/${customer.id}`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllLink}>
                    {latestPrescription ? 'Update Rx' : '+ Add Rx'}
                  </Text>
                </TouchableOpacity>
              </View>

              {latestPrescription ? (
                <>
                  {/* Rx Table */}
                  <View style={styles.rxTable}>
                    <View style={styles.rxHeaderRow}>
                      <Text style={[styles.rxHeadCell, { flex: 1.4 }]}>Eye</Text>
                      <Text style={[styles.rxHeadCell, { flex: 1 }]}>SPH</Text>
                      <Text style={[styles.rxHeadCell, { flex: 1 }]}>CYL</Text>
                      <Text style={[styles.rxHeadCell, { flex: 1 }]}>Axis</Text>
                      <Text style={[styles.rxHeadCell, { flex: 1 }]}>Add</Text>
                      <Text style={[styles.rxHeadCell, { flex: 1 }]}>PD</Text>
                    </View>

                    {/* Right Eye */}
                    <View style={styles.rxDataRow}>
                      <Text style={[styles.rxDataEye, { flex: 1.4 }]}>Right (OD)</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.od.sph || '0.00'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.od.cyl || '0.00'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.od.axis || '-'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.od.add || '-'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.pd || '-'}</Text>
                    </View>

                    {/* Left Eye */}
                    <View style={[styles.rxDataRow, { borderBottomWidth: 0 }]}>
                      <Text style={[styles.rxDataEye, { flex: 1.4 }]}>Left (OS)</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.os.sph || '0.00'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.os.cyl || '0.00'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.os.axis || '-'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.os.add || '-'}</Text>
                      <Text style={[styles.rxDataCell, { flex: 1 }]}>{latestPrescription.pd || '-'}</Text>
                    </View>
                  </View>

                  {/* Rx Footer */}
                  <View style={styles.rxFooterRow}>
                    <Text style={styles.rxFooterText}>
                      Date: {latestPrescription.date || 'Recent'}
                    </Text>
                    <Text style={styles.rxFooterText}>
                      Optometrist: {latestPrescription.optometristName || 'Admin'}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.emptyPrescriptionBox}>
                  <Glasses size={32} color="#94A3B8" />
                  <Text style={styles.emptyPrescriptionTitle}>No Prescription Recorded</Text>
                  <Text style={styles.emptyPrescriptionSub}>
                    You can record eye prescription power (SPH, CYL, Axis) for this customer.
                  </Text>
                  <TouchableOpacity
                    style={styles.addRxBtn}
                    onPress={() => router.push(`/customers/prescription/${customer.id}`)}
                    activeOpacity={0.8}
                  >
                    <Plus size={14} color="#064E3B" style={{ marginRight: 4 }} />
                    <Text style={styles.addRxBtnText}>Record Prescription</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* RIGHT / SECOND COLUMN */}
          <View style={isTablet ? styles.rightColumn : styles.fullWidth}>
            {/* CARD C: Customer Status */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeaderTitleLeft}>
                  <Crown size={18} color="#D97706" />
                  <Text style={styles.cardHeading}>Customer Summary</Text>
                </View>
                <View style={styles.regularStatusPill}>
                  <Text style={styles.regularStatusText}>{customer.status || 'Active'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Status Category</Text>
                <Text style={styles.infoVal}>{customer.status || 'Regular'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Total Invoices</Text>
                <Text style={styles.infoVal}>{totalOrdersCount}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Total Amount Spent</Text>
                <Text style={[styles.infoVal, { color: '#064E3B', fontWeight: '800' }]}>
                  ₹{calculatedTotalSpent.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoKey}>Customer Phone</Text>
                <Text style={styles.infoVal}>{customer.phone}</Text>
              </View>
            </View>

            {/* CARD D: Quick Actions */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderTitleLeft}>
                <Zap size={18} color="#064E3B" strokeWidth={2.4} />
                <Text style={styles.cardHeading}>Quick Actions</Text>
              </View>

              {/* Action 1: New Sale */}
              <TouchableOpacity
                style={styles.quickActionPrimaryBtn}
                onPress={handleStartSale}
                activeOpacity={0.85}
              >
                <ShoppingCart size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.quickActionPrimaryText}>Create New Sale</Text>
              </TouchableOpacity>

              {/* Action 2: Update Prescription */}
              <TouchableOpacity
                style={styles.quickActionOutlineBtn}
                onPress={() => router.push(`/customers/prescription/${customer.id}`)}
                activeOpacity={0.8}
              >
                <Glasses size={16} color="#0F172A" style={{ marginRight: 8 }} />
                <Text style={styles.quickActionOutlineText}>
                  {latestPrescription ? 'Update Prescription' : 'Add Prescription'}
                </Text>
              </TouchableOpacity>

              {/* Action 3: Send WhatsApp */}
              <TouchableOpacity
                style={styles.quickActionOutlineBtn}
                onPress={handleWhatsApp}
                activeOpacity={0.8}
              >
                <Phone size={16} color="#15803D" style={{ marginRight: 8 }} />
                <Text style={styles.quickActionOutlineText}>Send WhatsApp Greeting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 5. PURCHASE HISTORY TABLE */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTitleLeft}>
              <ShoppingCart size={18} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.cardHeading}>Purchase History</Text>
            </View>
            <Text style={styles.badgeCountText}>
              {customerInvoices.length} {customerInvoices.length === 1 ? 'Sale' : 'Sales'}
            </Text>
          </View>

          {customerInvoices.length > 0 ? (
            <View style={styles.historyTableContainer}>
              {/* Head */}
              <View style={styles.historyHeadRow}>
                <Text style={[styles.historyHeadCell, { flex: 1.2 }]}>Date</Text>
                <Text style={[styles.historyHeadCell, { flex: 1.4 }]}>Invoice No.</Text>
                <Text style={[styles.historyHeadCell, { flex: 2.2 }]}>Items</Text>
                <Text style={[styles.historyHeadCell, { flex: 1.1, textAlign: 'right' }]}>Amount</Text>
                <Text style={[styles.historyHeadCell, { flex: 1.1, textAlign: 'center' }]}>Mode</Text>
                <Text style={[styles.historyHeadCell, { flex: 1, textAlign: 'right' }]}>Status</Text>
              </View>

              {/* Dynamic Rows */}
              {customerInvoices.map((inv, idx) => {
                const isLast = idx === customerInvoices.length - 1;
                const itemsStr =
                  inv.items && inv.items.length > 0
                    ? inv.items.map((it: any) => it.description || it.productName || it.name || 'Optical Item').join(', ')
                    : 'Optical Products';

                return (
                  <View
                    key={inv.id || idx}
                    style={[styles.historyDataRow, isLast && { borderBottomWidth: 0 }]}
                  >
                    <Text style={[styles.historyCell, { flex: 1.2 }]}>
                      {inv.date || 'Recent'}
                    </Text>
                    <Text style={[styles.historyCellBold, { flex: 1.4 }]}>
                      {inv.invoiceNumber || `#INV-${inv.id ? inv.id.substring(0, 6) : '00'}`}
                    </Text>
                    <Text style={[styles.historyCell, { flex: 2.2 }]} numberOfLines={1}>
                      {itemsStr}
                    </Text>
                    <Text style={[styles.historyCellBold, { flex: 1.1, textAlign: 'right', color: '#064E3B' }]}>
                      ₹{(inv.total || 0).toLocaleString('en-IN')}
                    </Text>
                    <Text style={[styles.historyCell, { flex: 1.1, textAlign: 'center' }]}>
                      {inv.paymentMethod || 'Cash'}
                    </Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <View style={styles.paidStatusPill}>
                        <Text style={styles.paidStatusText}>{inv.status || 'Paid'}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyHistoryBox}>
              <ShoppingCart size={32} color="#94A3B8" />
              <Text style={styles.emptyHistoryTitle}>No Invoices Yet</Text>
              <Text style={styles.emptyHistorySub}>
                When you bill products for {customer.name}, their receipts and purchase history will appear here.
              </Text>
              <TouchableOpacity
                style={styles.startFirstSaleBtn}
                onPress={handleStartSale}
                activeOpacity={0.85}
              >
                <ShoppingCart size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.startFirstSaleText}>Start First Sale</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Space above bottom */}
        <View style={{ height: 35 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Top Header */
  header: {
    backgroundColor: '#04281B', // Deep optical emerald green
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
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
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 8,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 0.6,
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  /* 1. Profile Card */
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '900',
  },
  profileInfoBox: {
    flex: 1,
  },
  nameAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  regularBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  regularBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  /* Profile Actions Row */
  profileActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  newSaleActionBtn: {
    flex: 1.2,
    height: 42,
    backgroundColor: '#064E3B',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSaleActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  whatsAppActionBtn: {
    flex: 1.2,
    height: 42,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsAppActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  editActionBtn: {
    flex: 0.8,
    height: 42,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  /* 2. Metrics Grid */
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },

  /* 3. Tabs Bar */
  tabsScroll: {
    marginVertical: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* 4. Split Grid / Stack */
  splitGridRow: {
    flexDirection: 'row',
    gap: 14,
  },
  verticalStack: {
    flexDirection: 'column',
    gap: 14,
  },
  leftColumn: {
    flex: 1.2,
    gap: 14,
  },
  rightColumn: {
    flex: 0.9,
    gap: 14,
  },
  fullWidth: {
    width: '100%',
    gap: 14,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  editSmallBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  editSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },

  /* Key-Value Info Rows */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoKey: {
    fontSize: 13,
    color: '#64748B',
  },
  infoVal: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  regularStatusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  regularStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  /* Rx Table */
  rxTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
  },
  rxHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rxHeadCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  rxDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rxDataEye: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  rxDataCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  rxFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  rxFooterText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },

  /* Empty Prescription Box */
  emptyPrescriptionBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  emptyPrescriptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginTop: 8,
  },
  emptyPrescriptionSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  addRxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 12,
  },
  addRxBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#064E3B',
  },

  /* Quick Actions Buttons */
  quickActionPrimaryBtn: {
    height: 44,
    backgroundColor: '#064E3B',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  quickActionPrimaryText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickActionOutlineBtn: {
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionOutlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },

  /* 5. Purchase History Table */
  historyTableContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
  },
  historyHeadRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  historyHeadCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  historyDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyCell: {
    fontSize: 12,
    color: '#475569',
  },
  historyCellBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  paidStatusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paidStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  /* Empty History Box */
  emptyHistoryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  emptyHistoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginTop: 10,
  },
  emptyHistorySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 320,
  },
  startFirstSaleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 14,
  },
  startFirstSaleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Not Found */
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
  },
  notFoundSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  notFoundBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  notFoundBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
