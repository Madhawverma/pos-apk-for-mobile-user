import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Calendar,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  MessageCircle,
} from 'lucide-react-native';
import { mockInvoices, InvoiceRecord, InvoiceStatus } from '../../src/data/mockInvoices';
import { opticalStore } from '../../src/store/opticalStore';
import { pdfService } from '../../src/services/pdfService';
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
 * High Detail Vector Visuals for Invoice Items
 */
function InvoiceItemVisual({ type }: { type: string }) {
  if (type === 'frame') {
    return (
      <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
        <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.8" />
        <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (type === 'sunglasses') {
    return (
      <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
        <Path d="M28 7 L36 7" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
        <Path d="M3 7 L0 6" stroke="#92400E" strokeWidth="2.8" />
        <Path d="M61 7 L64 6" stroke="#92400E" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (type === 'lens') {
    return (
      <Svg width={34} height={18} viewBox="0 0 60 30" fill="none">
        <Circle cx="20" cy="15" r="13" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
        <Circle cx="38" cy="16" r="13" stroke="#2563EB" strokeWidth="2" fill="#BFDBFE" />
        <Path d="M12 11 C15 9, 25 9, 28 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'tortoise') {
    return (
      <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#D97706" strokeWidth="2.8" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
        <Path d="M3 8 L0 8" stroke="#D97706" strokeWidth="2.8" />
        <Path d="M61 8 L64 8" stroke="#D97706" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (type === 'contact_lens') {
    return (
      <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="2" y="3" width="60" height="22" rx="4" stroke="#60A5FA" strokeWidth="1.6" fill="#FFFFFF" />
        <Path d="M2 10 L62 10" stroke="#3B82F6" strokeWidth="1.2" />
        <Path d="M8 7 L20 7" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
        <Path d="M28 17 C38 13, 50 15, 56 8" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'photochromic') {
    return (
      <Svg width={32} height={18} viewBox="0 0 54 28" fill="none">
        <Circle cx="27" cy="14" r="12" stroke="#64748B" strokeWidth="2" fill="#E2E8F0" />
        <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  // pink_frame
  return (
    <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
      <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#DB2777" strokeWidth="2.6" fill="#FCE7F3" />
      <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#DB2777" strokeWidth="2.6" strokeLinecap="round" />
      <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#DB2777" strokeWidth="2.6" fill="#FCE7F3" />
      <Path d="M3 8 L0 8" stroke="#DB2777" strokeWidth="2.6" strokeLinecap="round" />
      <Path d="M61 8 L64 8" stroke="#DB2777" strokeWidth="2.6" strokeLinecap="round" />
    </Svg>
  );
}

export default function InvoicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [storeState, setStoreState] = useState(() => opticalStore.getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initial fetch from live MongoDB database
    opticalStore.syncFromBackend();
    const unsub = opticalStore.subscribe(() => {
      setStoreState(opticalStore.getState());
    });
    return () => unsub();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await opticalStore.syncFromBackend();
    setRefreshing(false);
  }, []);

  const allInvoices = storeState.invoices || [];

  // Live Dynamic Counts & Totals
  const totalCount = allInvoices.length;
  const paidInvoices = allInvoices.filter((i) => i.status === 'Paid');
  const paidCount = paidInvoices.length;
  const paidTotal = paidInvoices.reduce((sum, i) => sum + (Number(i.paidAmount || i.total) || 0), 0);

  const pendingInvoices = allInvoices.filter((i) => i.status === 'Pending' || i.status === 'Partial' || i.status === 'Unpaid');
  const pendingCount = pendingInvoices.length;
  const pendingTotal = pendingInvoices.reduce((sum, i) => sum + (Number(i.dueAmount || i.total) || 0), 0);

  const cancelledInvoices = allInvoices.filter((i) => i.status === 'Cancelled');
  const cancelledCount = cancelledInvoices.length;
  const cancelledTotal = cancelledInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);

  const filterTabs = [
    { key: 'all', label: `All Invoices (${totalCount})` },
    { key: 'paid', label: `Paid (${paidCount})` },
    { key: 'pending', label: `Pending (${pendingCount})` },
    { key: 'cancelled', label: `Cancelled (${cancelledCount})` },
  ];

  const filteredInvoices = allInvoices.filter((inv) => {
    // Search query
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customer?.name || inv.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customer?.phone || inv.customerPhone || '').includes(searchQuery);

    if (!matchesSearch) return false;

    // Filter status
    if (selectedFilter === 'paid') return inv.status === 'Paid';
    if (selectedFilter === 'pending') return inv.status === 'Pending' || inv.status === 'Partial' || inv.status === 'Unpaid';
    if (selectedFilter === 'cancelled') return inv.status === 'Cancelled';
    return true;
  });

  const handleDownloadPdf = async (inv: InvoiceRecord) => {
    try {
      await pdfService.sharePdf(inv);
    } catch (err: any) {
      Alert.alert('PDF Error', `Could not share PDF invoice: ${err?.message || 'Error occurred'}`);
    }
  };

  const handleWhatsApp = (inv: InvoiceRecord) => {
    const rawDigits = inv.customer.phone.replace(/[^0-9]/g, '');
    const phoneWith91 = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
    const message = encodeURIComponent(
      `Hello ${inv.customer.name},\nHere is your optical invoice ${inv.invoiceNumber} for amount ${formatCurrency(
        inv.total
      )} from Shree Ganesh Optical, Sehore (Contact: +91 6263732857).\nStatus: ${inv.status}. Thank you!`
    );
    Linking.openURL(`https://wa.me/${phoneWith91}?text=${message}`);
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerContent}>
          {/* Left Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Invoices</Text>
              <Text style={styles.headerSubtitle}>
                Manage bills, payments and invoices
              </Text>
            </View>
          </View>

          {/* Right Brand Logo */}
          <View style={styles.brandBox}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextBox}>
              <Text style={styles.brandTitle}>श्री गणेश ऑप्टिकल</Text>
              <Text style={styles.brandSubtitle}>सीहोर • 6263732857</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D9488']} />}
      >
        {/* Create Invoice Top Button Row */}
        <View style={styles.topActionRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.createInvoiceBtn}
            onPress={() => router.push('/(tabs)/pos')}
            activeOpacity={0.85}
          >
            <Plus size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.createInvoiceBtnText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Metric KPI Cards Row */}
        <View style={styles.metricsRow}>
          {/* Total Invoices */}
          <View style={[styles.metricCard, { backgroundColor: '#F0F9FF' }]}>
            <FileText size={17} color="#2563EB" />
            <Text style={styles.metricNumber}>{totalCount}</Text>
            <Text style={styles.metricLabel}>Total Invoices</Text>
          </View>

          {/* Paid */}
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={17} color="#059669" />
            <Text style={styles.metricNumber}>{paidCount}</Text>
            <Text style={styles.metricLabel}>Paid</Text>
            <Text style={[styles.metricSubvalue, { color: '#059669' }]}>{formatCurrency(paidTotal)}</Text>
          </View>

          {/* Pending */}
          <View style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
            <Clock size={17} color="#D97706" />
            <Text style={styles.metricNumber}>{pendingCount}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
            <Text style={[styles.metricSubvalue, { color: '#D97706' }]}>{formatCurrency(pendingTotal)}</Text>
          </View>

          {/* Cancelled */}
          <View style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
            <XCircle size={17} color="#DC2626" />
            <Text style={styles.metricNumber}>{cancelledCount}</Text>
            <Text style={styles.metricLabel}>Cancelled</Text>
            <Text style={[styles.metricSubvalue, { color: '#DC2626' }]}>{formatCurrency(cancelledTotal)}</Text>
          </View>
        </View>

        {/* Search, Filter & Date Range Row */}
        <View style={styles.filterControlsRow}>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by invoice no, customer name, phone..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters Button */}
          <TouchableOpacity
            style={styles.filtersBtn}
            onPress={() =>
              Alert.alert('Filter Invoices', 'Filter by Payment Mode, Date, or Staff')
            }
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={14} color="#334155" style={{ marginRight: 5 }} />
            <Text style={styles.filtersBtnText}>Filters</Text>
          </TouchableOpacity>

          {/* Date Range Button */}
          <TouchableOpacity
            style={styles.dateRangeBtn}
            onPress={() =>
              Alert.alert('Select Date Range', 'Default: 01 Oct 2026 - 31 Oct 2026')
            }
            activeOpacity={0.8}
          >
            <Calendar size={14} color="#334155" style={{ marginRight: 5 }} />
            <Text style={styles.dateRangeBtnText}>01 Oct 2026 - 31 Oct 2026</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills (All Invoices, Paid, Pending, Cancelled) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsContainer}
          style={styles.filterPillsScroll}
        >
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
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

        {/* Invoices Wide Data Table Container */}
        <View style={styles.tableCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Column Headers */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thText, styles.colInvNo]}>Invoice No.</Text>
                <Text style={[styles.thText, styles.colDate]}>Date</Text>
                <Text style={[styles.thText, styles.colCustomer]}>Customer</Text>
                <Text style={[styles.thText, styles.colItems]}>Items</Text>
                <Text style={[styles.thText, styles.colAmount]}>Amount</Text>
                <Text style={[styles.thText, styles.colStatus]}>Payment Status</Text>
                <Text style={[styles.thText, styles.colActions]}>Actions</Text>
              </View>

              {/* Table Rows */}
              {filteredInvoices.map((inv, index) => {
                const isPaid = inv.status === 'Paid';
                const isPending = inv.status === 'Pending';
                const isCancelled = inv.status === 'Cancelled';

                return (
                  <View
                    key={inv.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && { backgroundColor: '#FCFDFE' },
                    ]}
                  >
                    {/* Invoice No */}
                    <TouchableOpacity
                      style={styles.colInvNo}
                      onPress={() =>
                        router.push({
                          pathname: '/invoices/[id]',
                          params: { id: inv.id },
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text style={styles.invNoText}>{inv.invoiceNumber}</Text>
                    </TouchableOpacity>

                    {/* Date */}
                    <View style={styles.colDate}>
                      <Text style={styles.datePrimaryText}>{inv.date}</Text>
                      <Text style={styles.dateSecondaryText}>{inv.time}</Text>
                    </View>

                    {/* Customer */}
                    <View style={styles.colCustomer}>
                      <View
                        style={[
                          styles.avatarBox,
                          { backgroundColor: inv.customer.avatarBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.avatarText,
                            { color: inv.customer.avatarColor },
                          ]}
                        >
                          {inv.customer.initials}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.customerNameText} numberOfLines={1}>
                          {inv.customer.name}
                        </Text>
                        <Text style={styles.customerPhoneText}>
                          {inv.customer.phone}
                        </Text>
                      </View>
                    </View>

                    {/* Items */}
                    <View style={styles.colItems}>
                      <View style={styles.itemVisualContainer}>
                        <InvoiceItemVisual type={inv.itemType} />
                        <Text style={styles.itemCountText}>
                          {inv.itemCount} {inv.itemCount === 1 ? 'item' : 'items'}
                        </Text>
                      </View>
                    </View>

                    {/* Amount */}
                    <View style={styles.colAmount}>
                      <Text style={styles.amountText}>
                        {formatCurrency(inv.total)}
                      </Text>
                    </View>

                    {/* Payment Status */}
                    <View style={styles.colStatus}>
                      {isPaid && (
                        <View style={styles.paidBadge}>
                          <Text style={styles.paidBadgeText}>Paid</Text>
                          {inv.paymentMethod && (
                            <Text style={styles.methodText}>
                              ({inv.paymentMethod})
                            </Text>
                          )}
                        </View>
                      )}

                      {isPending && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingBadgeText}>Pending</Text>
                          {inv.pendingAmount && (
                            <Text style={styles.pendingAmountText}>
                              ({formatCurrency(inv.pendingAmount)})
                            </Text>
                          )}
                        </View>
                      )}

                      {isCancelled && (
                        <View style={styles.cancelledBadge}>
                          <Text style={styles.cancelledBadgeText}>Cancelled</Text>
                        </View>
                      )}
                    </View>

                    {/* Actions */}
                    <View style={styles.colActions}>
                      {/* PDF Action */}
                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        onPress={() => handleDownloadPdf(inv)}
                        activeOpacity={0.7}
                      >
                        <FileText size={15} color="#334155" />
                        <Text style={styles.actionIconText}>PDF</Text>
                      </TouchableOpacity>

                      {/* WhatsApp Action */}
                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        onPress={() => handleWhatsApp(inv)}
                        activeOpacity={0.7}
                      >
                        <MessageCircle size={15} color="#16A34A" />
                        <Text style={[styles.actionIconText, { color: '#16A34A' }]}>
                          WhatsApp
                        </Text>
                      </TouchableOpacity>

                      {/* More Menu */}
                      <TouchableOpacity
                        style={styles.moreIconBtn}
                        onPress={() =>
                          Alert.alert(
                            inv.invoiceNumber,
                            `Customer: ${inv.customer.name}\nTotal: ${formatCurrency(
                              inv.total
                            )}\nStatus: ${inv.status}`,
                            [
                              {
                                text: 'View Order Details',
                                onPress: () =>
                                  router.push({
                                    pathname: '/orders/[id]',
                                    params: { id: 'ord-2026-001' },
                                  }),
                              },
                              {
                                text: 'Print Receipt',
                                onPress: () => handleDownloadPdf(inv),
                              },
                              { text: 'Cancel', style: 'cancel' },
                            ]
                          )
                        }
                      >
                        <MoreVertical size={16} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },

  // Top Action Row (+ Create Invoice)
  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  createInvoiceBtn: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  createInvoiceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // 4 Metric KPI Cards Row
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  metricSubvalue: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
  },

  // Search, Filter & Date Range Row
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    color: '#0F172A',
    padding: 0,
  },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 9,
    height: 38,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filtersBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 9,
    height: 38,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateRangeBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
  },

  // Filter Pills
  filterPillsScroll: {
    marginBottom: 10,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Table Card & Columns
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  thText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  // Column Widths (matching screenshot proportions)
  colInvNo: {
    width: 110,
  },
  invNoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },

  colDate: {
    width: 85,
  },
  datePrimaryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0F172A',
  },
  dateSecondaryText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },

  colCustomer: {
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  avatarBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '800',
  },
  customerNameText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerPhoneText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },

  colItems: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemVisualContainer: {
    alignItems: 'center',
  },
  itemCountText: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  colAmount: {
    width: 75,
  },
  amountText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },

  colStatus: {
    width: 88,
    alignItems: 'center',
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 5,
    alignItems: 'center',
  },
  paidBadgeText: {
    color: '#059669',
    fontSize: 9.5,
    fontWeight: '700',
  },
  methodText: {
    color: '#059669',
    fontSize: 8.5,
    fontWeight: '500',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    alignItems: 'center',
  },
  pendingBadgeText: {
    color: '#D97706',
    fontSize: 9.5,
    fontWeight: '700',
  },
  pendingAmountText: {
    color: '#D97706',
    fontSize: 8.5,
    fontWeight: '600',
  },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelledBadgeText: {
    color: '#DC2626',
    fontSize: 9.5,
    fontWeight: '700',
  },

  colActions: {
    width: 125,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  actionIconText: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '600',
  },
  moreIconBtn: {
    padding: 3,
  },
});
