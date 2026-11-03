import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  Ban,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Phone,
  Mail,
  MapPin,
  Eye,
  ShoppingCart,
  Pencil,
  MoreHorizontal,
  ChevronRight,
  Home,
  Package,
  Truck,
  Ellipsis,
} from 'lucide-react-native';
import { mockSuppliers } from '../../src/data/mockSuppliers';
import { Supplier } from '../../src/types/supplier';
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
 * Brand Vector Logos for Suppliers
 */
function SupplierBrandVisual({ brand }: { brand: string }) {
  if (brand === 'rayban') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Circle cx="23" cy="23" r="23" fill="#FFE4E6" />
        <Text
          style={{
            color: '#E11D48',
            fontSize: 16,
            fontWeight: '900',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 46,
          }}
        >
          RB
        </Text>
      </Svg>
    );
  }

  if (brand === 'essilor') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Rect width="46" height="46" rx="8" fill="#E0F2FE" />
        <Rect x="8" y="8" width="30" height="30" rx="6" fill="#0284C7" />
        <Path d="M28 17 C21 17, 16 20, 16 23 C16 26, 21 29, 28 29" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    );
  }

  if (brand === 'zeiss') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Circle cx="23" cy="23" r="22" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
        <Text
          style={{
            color: '#1E40AF',
            fontSize: 10,
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: 46,
            letterSpacing: 0.5,
          }}
        >
          ZEISS
        </Text>
      </Svg>
    );
  }

  if (brand === 'lenskart') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Circle cx="23" cy="23" r="22" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
        <Circle cx="17" cy="20" r="6" stroke="#059669" strokeWidth="2.4" />
        <Circle cx="29" cy="20" r="6" stroke="#059669" strokeWidth="2.4" />
        <Path d="M23 20 L23 20" stroke="#059669" strokeWidth="2.4" />
        <Text
          style={{
            color: '#064E3B',
            fontSize: 6.5,
            fontWeight: '800',
            textAlign: 'center',
            marginTop: 28,
          }}
        >
          Lenskart
        </Text>
      </Svg>
    );
  }

  if (brand === 'vogue') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Circle cx="23" cy="23" r="23" fill="#FFF1F2" />
        <Text
          style={{
            color: '#E11D48',
            fontSize: 20,
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: 46,
          }}
        >
          V
        </Text>
      </Svg>
    );
  }

  if (brand === 'acuvue') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Circle cx="23" cy="23" r="22" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
        <Text
          style={{
            color: '#0284C7',
            fontSize: 8.5,
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: 46,
            letterSpacing: 0.4,
          }}
        >
          ACUVUE
        </Text>
      </Svg>
    );
  }

  if (brand === 'bausch') {
    return (
      <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
        <Circle cx="23" cy="23" r="22" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
        <Text
          style={{
            color: '#0D9488',
            fontSize: 6,
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: 46,
          }}
        >
          BAUSCH+LOMB
        </Text>
      </Svg>
    );
  }

  // Oakley ellipse
  return (
    <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
      <Circle cx="23" cy="23" r="22" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
      <Path
        d="M23 16 C14 16, 10 19, 10 23 C10 27, 14 30, 23 30 C32 30, 36 27, 36 23 C36 19, 32 16, 23 16 Z M23 26 C17 26, 15 25, 15 23 C15 21, 17 20, 23 20 C29 20, 31 21, 31 23 C31 25, 29 26, 23 26 Z"
        fill="#2563EB"
      />
    </Svg>
  );
}

// Category filter tabs
const filterTabs = [
  { key: 'all', label: 'All Suppliers (32)' },
  { key: 'frames', label: 'Frames (12)' },
  { key: 'lenses', label: 'Lenses (8)' },
  { key: 'contact_lenses', label: 'Contact Lenses (5)' },
  { key: 'accessories', label: 'Accessories (7)' },
];

export default function SuppliersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSuppliers = mockSuppliers.filter((sup) => {
    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sup.name.toLowerCase().includes(q) ||
      sup.phone.includes(q) ||
      sup.categories.toLowerCase().includes(q) ||
      sup.location.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Category filter
    if (selectedCategory !== 'all') {
      return sup.categoryTag === selectedCategory;
    }
    return true;
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleNewPurchase = (sup: Supplier) => {
    Alert.alert(
      'Create Purchase Order',
      `Create purchase invoice / PO for ${sup.name}?`,
      [
        {
          text: 'Open Stock Adjustment',
          onPress: () => router.push('/inventory/adjustment'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
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
              <Text style={styles.headerTitle}>Suppliers</Text>
              <Text style={styles.headerSubtitle}>
                Manage your suppliers and purchase records
              </Text>
            </View>
          </View>

          {/* Right Brand Logo */}
          <View style={styles.brandBox}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextBox}>
              <Text style={styles.brandTitle}>Goggles Shop</Text>
              <Text style={styles.brandSubtitle}>OPTICAL STORE POS</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Scrollable Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 4 Metric KPI Cards Row */}
        <View style={styles.metricsRow}>
          {/* Total Suppliers */}
          <View style={[styles.metricCard, { backgroundColor: '#F0F9FF' }]}>
            <Users size={17} color="#2563EB" />
            <Text style={styles.metricLabel}>Total Suppliers</Text>
            <Text style={styles.metricNumber}>32</Text>
          </View>

          {/* Active Suppliers */}
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={17} color="#059669" />
            <Text style={styles.metricLabel}>Active Suppliers</Text>
            <Text style={styles.metricNumber}>28</Text>
          </View>

          {/* Pending Payments */}
          <View style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
            <Clock size={17} color="#D97706" />
            <Text style={styles.metricLabel}>Pending Payments</Text>
            <Text style={styles.metricNumber}>6</Text>
            <Text style={styles.metricSubvalue}>₹2,48,500</Text>
          </View>

          {/* Inactive Suppliers */}
          <View style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
            <Ban size={17} color="#DC2626" />
            <Text style={styles.metricLabel}>Inactive Suppliers</Text>
            <Text style={styles.metricNumber}>4</Text>
          </View>
        </View>

        {/* Search, Filter & Add Supplier Row */}
        <View style={styles.filterControlsRow}>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Search size={15} color="#94A3B8" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by supplier name, phone, brand..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters Button */}
          <TouchableOpacity
            style={styles.filtersBtn}
            onPress={() => Alert.alert('Filters', 'Filter by Outstanding Balance or State')}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={13} color="#334155" style={{ marginRight: 4 }} />
            <Text style={styles.filtersBtnText}>Filters</Text>
          </TouchableOpacity>

          {/* Sort Dropdown */}
          <TouchableOpacity
            style={styles.sortDropdownBtn}
            onPress={() => Alert.alert('Sort By', 'Name (A-Z), Outstanding, Purchases')}
            activeOpacity={0.8}
          >
            <ArrowUpDown size={13} color="#334155" style={{ marginRight: 4 }} />
            <Text style={styles.sortDropdownBtnText}>Name (A-Z) ⌵</Text>
          </TouchableOpacity>

          {/* + Add Supplier Button */}
          <TouchableOpacity
            style={styles.addSupplierBtn}
            onPress={() => router.push('/suppliers/add')}
            activeOpacity={0.85}
          >
            <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addSupplierBtnText}>Add Supplier</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsContainer}
          style={styles.filterPillsScroll}
        >
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setSelectedCategory(tab.key)}
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

        {/* Suppliers List */}
        <View style={styles.suppliersList}>
          {filteredSuppliers.map((sup) => {
            const isActive = sup.status === 'Active';
            const hasOutstanding = sup.outstanding > 0;

            return (
              <View key={sup.id} style={styles.supplierCard}>
                {/* Top Section */}
                <View style={styles.cardTopRow}>
                  {/* Left: Brand Visual Logo */}
                  <View style={styles.brandVisualCol}>
                    <SupplierBrandVisual brand={sup.brandCode} />
                  </View>

                  {/* Middle Info Column */}
                  <View style={styles.supplierInfoCol}>
                    <View style={styles.nameStatusRow}>
                      <Text style={styles.supplierNameText}>{sup.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isActive ? styles.statusActiveBadge : styles.statusInactiveBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isActive ? { color: '#059669' } : { color: '#D97706' },
                          ]}
                        >
                          {sup.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.categoriesText}>{sup.categories}</Text>

                    {/* Phone & Email Row */}
                    <View style={styles.contactRow}>
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => handleCall(sup.phone)}
                        activeOpacity={0.7}
                      >
                        <Phone size={11} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={styles.contactText}>{sup.phone}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.contactItem, { marginLeft: 8 }]}
                        onPress={() => handleEmail(sup.email)}
                        activeOpacity={0.7}
                      >
                        <Mail size={11} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.contactText}>{sup.email}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Location Row */}
                    <View style={styles.locationRow}>
                      <MapPin size={11} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.locationText}>{sup.location}</Text>
                    </View>
                  </View>

                  {/* Right: Total Purchases & Outstanding */}
                  <View style={styles.financialCol}>
                    <View style={styles.financialItem}>
                      <Text style={styles.financialLabel}>Total Purchases</Text>
                      <Text style={styles.purchasesAmountText}>
                        {formatCurrency(sup.totalPurchases)}
                      </Text>
                    </View>

                    <View style={[styles.financialItem, { marginTop: 4 }]}>
                      <Text style={styles.financialLabel}>Outstanding</Text>
                      <Text
                        style={[
                          styles.outstandingAmountText,
                          hasOutstanding ? { color: '#DC2626' } : { color: '#059669' },
                        ]}
                      >
                        {formatCurrency(sup.outstanding)}
                      </Text>
                    </View>

                    <ChevronRight size={16} color="#94A3B8" style={{ marginTop: 2 }} />
                  </View>
                </View>

                {/* Bottom Action Pills Row */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      Alert.alert(
                        sup.name,
                        `Location: ${sup.location}\nCategories: ${sup.categories}\nTotal Purchases: ${formatCurrency(
                          sup.totalPurchases
                        )}\nOutstanding: ${formatCurrency(sup.outstanding)}`
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Eye size={12} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={styles.actionBtnText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleNewPurchase(sup)}
                    activeOpacity={0.7}
                  >
                    <ShoppingCart size={12} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={styles.actionBtnText}>Purchase</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => Alert.alert('Edit Supplier', `Edit contact details for ${sup.name}`)}
                    activeOpacity={0.7}
                  >
                    <Pencil size={12} color="#475569" style={{ marginRight: 4 }} />
                    <Text style={styles.actionBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.moreActionBtn}
                    onPress={() =>
                      Alert.alert(sup.name, 'Supplier Options', [
                        { text: 'View Purchase Invoices', onPress: () => {} },
                        { text: 'Statement of Accounts', onPress: () => {} },
                        { text: 'Cancel', style: 'cancel' },
                      ])
                    }
                    activeOpacity={0.7}
                  >
                    <MoreHorizontal size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar Matching Mockup */}
      <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/dashboard')}
          activeOpacity={0.7}
        >
          <Home size={19} color="#64748B" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/pos')}
          activeOpacity={0.7}
        >
          <ShoppingCart size={19} color="#64748B" />
          <Text style={styles.tabLabel}>POS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.7}
        >
          <Package size={19} color="#64748B" />
          <Text style={styles.tabLabel}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/customers')}
          activeOpacity={0.7}
        >
          <Users size={19} color="#64748B" />
          <Text style={styles.tabLabel}>Customers</Text>
        </TouchableOpacity>

        {/* Active Suppliers Tab Pill */}
        <TouchableOpacity
          style={styles.tabItemActivePill}
          onPress={() => router.push('/inventory/suppliers')}
          activeOpacity={0.7}
        >
          <Truck size={19} color="#064E3B" />
          <Text style={styles.tabLabelActive}>Suppliers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.7}
        >
          <Ellipsis size={19} color="#64748B" />
          <Text style={styles.tabLabel}>More</Text>
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
    fontSize: 10,
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

  // 4 Metric KPI Cards Row
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  metricSubvalue: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 1,
  },

  // Search, Filter & Add Supplier Row
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 10.5,
    color: '#0F172A',
    padding: 0,
  },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filtersBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
  },
  sortDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortDropdownBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
  },
  addSupplierBtn: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 7,
  },
  addSupplierBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Filter Pills (Horizontal Scroll)
  filterPillsScroll: {
    marginBottom: 10,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
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
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Suppliers List
  suppliersList: {
    gap: 8,
  },
  supplierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  brandVisualCol: {
    width: 48,
    alignItems: 'center',
    marginRight: 9,
  },
  supplierInfoCol: {
    flex: 1,
  },
  nameStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  supplierNameText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 5.5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusActiveBadge: {
    backgroundColor: '#DCFCE7',
  },
  statusInactiveBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  categoriesText: {
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9.5,
    color: '#475569',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  locationText: {
    fontSize: 9.5,
    color: '#64748B',
  },

  // Financial Stats Right Col
  financialCol: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  financialItem: {
    alignItems: 'flex-end',
  },
  financialLabel: {
    fontSize: 8.5,
    color: '#64748B',
  },
  purchasesAmountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  outstandingAmountText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Bottom Action Pills Row
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionBtnText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
  },
  moreActionBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Persistent Bottom Tab Bar
  bottomTabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  tabItemActivePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 2,
  },
});
