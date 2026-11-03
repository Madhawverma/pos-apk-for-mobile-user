import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path } from 'react-native-svg';
import {
  ArrowLeft,
  Calendar,
  Clock,
  BarChart3,
  Receipt,
  TrendingUp,
  Percent,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react-native';
import { opticalStore } from '../../src/store/opticalStore';
import { Invoice } from '../../src/data/mockInvoices';
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

export default function ProfitReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Real-time ticking clock for Date & Time display
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reactive invoices state directly from opticalStore
  const [invoices, setInvoices] = useState<Invoice[]>(() => opticalStore.getState().invoices || []);

  useEffect(() => {
    const unsub = opticalStore.subscribe(() => {
      setInvoices(opticalStore.getState().invoices || []);
    });
    return unsub;
  }, []);

  // Filter invoices based on selected timeframe
  const now = new Date();
  const todayDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // e.g. "03 Nov 2026"
  const todayIso = now.toISOString().split('T')[0]; // e.g. "2026-11-03"
  const currentMonthStr = now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); // e.g. "Nov 2026"

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === 'all') return true;
    const invDate = (inv.date || '').toLowerCase();
    const invCreatedAt = (inv as any).createdAt || '';

    if (activeTab === 'today') {
      return (
        invDate.includes('today') ||
        invDate.includes(todayDateStr.toLowerCase()) ||
        invDate.includes(todayIso) ||
        invCreatedAt.includes(todayIso)
      );
    }

    if (activeTab === 'week') {
      // Within past 7 days or current month/today
      return (
        invDate.includes('today') ||
        invDate.includes(todayDateStr.toLowerCase()) ||
        invDate.includes(currentMonthStr.toLowerCase()) ||
        invCreatedAt.includes(todayIso)
      );
    }

    if (activeTab === 'month') {
      return (
        invDate.includes(currentMonthStr.toLowerCase()) ||
        invDate.includes(todayIso.slice(0, 7)) ||
        invCreatedAt.includes(todayIso.slice(0, 7))
      );
    }

    return true;
  });

  // Calculate Real Dynamic Figures
  const totalSales = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalCost = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.costPrice !== undefined ? inv.costPrice : Math.round((inv.total || 0) * 0.6)),
    0
  );
  
  // Net Profit / Loss calculation
  const difference = totalSales - totalCost;
  const isProfit = difference >= 0;
  const netProfit = Math.abs(difference);
  const profitMarginPercent = totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0;
  const totalBills = filteredInvoices.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Profit & Loss Summary</Text>
            <Text style={styles.headerSubtitle}>Sales, Purchase & Net Profit Overview</Text>
          </View>
        </View>

        {/* Brand Logo & Name */}
        <View style={styles.headerRight}>
          <View style={styles.logoRow}>
            <HeaderGlassesLogo />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.brandTitle}>SG OPTICAL</Text>
              <Text style={styles.brandSubtitle}>REPORT</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Real-time Live Clock & Date Banner */}
        <View style={styles.liveClockBanner}>
          <View style={styles.liveClockLeft}>
            <View style={styles.clockIconBox}>
              <Clock size={16} color="#059669" strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.liveTimeText}>
                {currentDateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </Text>
              <Text style={styles.liveDateText}>
                {currentDateTime.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.liveStatusIndicator}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.liveStatusText}>LIVE DATA</Text>
          </View>
        </View>

        {/* 2. Simple Filter Tabs */}
        <View style={styles.filterRow}>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'all' && styles.filterTabActive]}
              onPress={() => setActiveTab('all')}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, activeTab === 'all' && styles.filterTabTextActive]}>
                All Time
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'today' && styles.filterTabActive]}
              onPress={() => setActiveTab('today')}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, activeTab === 'today' && styles.filterTabTextActive]}>
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'week' && styles.filterTabActive]}
              onPress={() => setActiveTab('week')}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, activeTab === 'week' && styles.filterTabTextActive]}>
                This Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'month' && styles.filterTabActive]}
              onPress={() => setActiveTab('month')}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, activeTab === 'month' && styles.filterTabTextActive]}>
                This Month
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.billsCountBadge}>
            <Calendar size={13} color="#064E3B" style={{ marginRight: 5 }} />
            <Text style={styles.billsCountText}>{totalBills} Bills</Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. ONLY FOCUSED CARDS: SALE, PURCHASE, PROFIT / LOSS, MARGIN */}
        {/* ========================================================= */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Total Sale Amount (बिक्री) */}
          <View style={[styles.bigCard, styles.saleCard]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <BarChart3 size={24} color="#16A34A" strokeWidth={2.4} />
              </View>
              <View style={styles.badgePillGreen}>
                <Text style={styles.badgeTextGreen}>Total Revenue</Text>
              </View>
            </View>

            <Text style={styles.cardLabel}>Total Sales (कुल बिक्री)</Text>
            <Text style={[styles.cardValue, { color: '#15803D' }]}>{formatCurrency(totalSales)}</Text>
            <Text style={styles.cardDesc}>ग्राहक से प्राप्त कुल बिक्री राशि</Text>
          </View>

          {/* Card 2: Total Purchase Cost (खरीद लागत) */}
          <View style={[styles.bigCard, styles.costCard]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Receipt size={24} color="#DC2626" strokeWidth={2.4} />
              </View>
              <View style={styles.badgePillRed}>
                <Text style={styles.badgeTextRed}>Total Buying Cost</Text>
              </View>
            </View>

            <Text style={styles.cardLabel}>Purchase Cost (कुल खरीदी)</Text>
            <Text style={[styles.cardValue, { color: '#DC2626' }]}>{formatCurrency(totalCost)}</Text>
            <Text style={styles.cardDesc}>सामान खरीदने की कुल लागत (Wholesale / Supplier Price)</Text>
          </View>

          {/* Card 3: Net Profit or Net Loss (मुनाफा या नुकसान) */}
          <View
            style={[
              styles.bigCard,
              isProfit ? styles.profitCard : styles.lossCard,
            ]}
          >
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: isProfit ? '#DBEAFE' : '#FEE2E2' },
                ]}
              >
                {isProfit ? (
                  <TrendingUp size={24} color="#2563EB" strokeWidth={2.4} />
                ) : (
                  <TrendingDown size={24} color="#DC2626" strokeWidth={2.4} />
                )}
              </View>
              <View style={isProfit ? styles.badgePillBlue : styles.badgePillRed}>
                <Text style={isProfit ? styles.badgeTextBlue : styles.badgeTextRed}>
                  {isProfit ? 'Net Earnings' : 'Net Loss'}
                </Text>
              </View>
            </View>

            <Text style={styles.cardLabel}>
              {isProfit ? 'Net Profit (शुद्ध मुनाफा)' : 'Net Loss (नुकसान)'}
            </Text>
            <Text
              style={[
                styles.cardValue,
                { color: isProfit ? '#2563EB' : '#DC2626' },
              ]}
            >
              {isProfit ? `+${formatCurrency(netProfit)}` : `-${formatCurrency(netProfit)}`}
            </Text>
            <Text style={styles.cardDesc}>
              {isProfit
                ? 'बिक्री में से खरीदी लागत घटाने के बाद आपका शुद्ध मुनाफा'
                : 'बिक्री से अधिक खरीदी लागत'}
            </Text>
          </View>

          {/* Card 4: Profit Margin % */}
          <View style={[styles.bigCard, styles.marginCard]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Percent size={22} color="#D97706" strokeWidth={2.5} />
              </View>
              <View style={styles.badgePillAmber}>
                <Text style={styles.badgeTextAmber}>Margin %</Text>
              </View>
            </View>

            <Text style={styles.cardLabel}>Profit Margin (मुनाफा प्रतिशत)</Text>
            <Text style={[styles.cardValue, { color: '#D97706' }]}>{profitMarginPercent}%</Text>
            <Text style={styles.cardDesc}>
              कुल {totalBills} बिलों पर शुद्ध मुनाफे का प्रतिशत
            </Text>
          </View>
        </View>

        {/* Quick New Sale Action Button */}
        <TouchableOpacity
          style={styles.newSaleBtn}
          onPress={() => router.push('/(tabs)/pos')}
          activeOpacity={0.88}
        >
          <ShoppingCart size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.newSaleBtnText}>Create New Sale (POS)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header */
  header: {
    backgroundColor: '#04281B',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 18,
    gap: 16,
  },

  /* Live Clock Banner */
  liveClockBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  liveClockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clockIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTimeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  liveDateText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  liveStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 20,
    gap: 6,
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },

  /* Filter Bar */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#064E3B',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  billsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  billsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
  },

  /* Cards Container */
  cardsContainer: {
    gap: 14,
  },
  bigCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  saleCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  costCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  profitCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  lossCard: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  marginCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  badgePillRed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextRed: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B91C1C',
  },
  badgePillBlue: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextBlue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  badgePillAmber: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextAmber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },

  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  /* New Sale Button */
  newSaleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#064E3B',
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newSaleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
