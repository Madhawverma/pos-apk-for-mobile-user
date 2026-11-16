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
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path } from 'react-native-svg';
import {
  Search,
  UserPlus,
  MoreVertical,
  PlusCircle,
  Users,
  UserCheck,
  ShoppingBag,
  Star,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Eye,
  Pencil,
  ChevronRight,
  Clock,
  Crown,
  Trash2,
  Phone,
  MessageCircle,
} from 'lucide-react-native';
import { opticalStore } from '../../src/store/opticalStore';
import { Customer } from '../../src/types/customer';
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

export default function CustomersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [customersList, setCustomersList] = useState<Customer[]>(() => {
    return opticalStore.getState().customers || [];
  });

  useEffect(() => {
    const unsubscribe = opticalStore.subscribe(() => {
      setCustomersList(opticalStore.getState().customers || []);
    });
    return unsubscribe;
  }, []);

  const totalCount = customersList.length;
  const regularCount = customersList.filter((c) => c.status === 'Regular' || !c.status).length;
  const vipCount = customersList.filter((c) => c.status === 'VIP').length;
  const newCount = customersList.filter((c) => c.status === 'New').length;
  const dueCount = customersList.filter((c) => c.status === 'Due Checkup').length;

  const dynamicFilterTabs: { key: string; label: string; isVip?: boolean; isDue?: boolean }[] = [
    { key: 'all', label: `All Customers (${totalCount})` },
    { key: 'regular', label: `Regular (${regularCount})` },
    { key: 'new', label: `New (${newCount})` },
    { key: 'vip', label: `VIP (${vipCount})`, isVip: true },
    { key: 'due', label: `Due Checkup (${dueCount})`, isDue: true },
  ];

  const filteredCustomers = customersList.filter((c) => {
    // Search query matching
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter tab matching
    if (selectedFilter === 'regular') return c.status === 'Regular' || !c.status;
    if (selectedFilter === 'new') return c.status === 'New';
    if (selectedFilter === 'due') return c.status === 'Due Checkup';
    return true;
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleActionMenu = (customer: Customer) => {
    Alert.alert(
      customer.name,
      `Phone: ${customer.phone}\nLocation: ${customer.city}\nTotal Spent: ${formatCurrency(customer.totalSpent)}`,
      [
        {
          text: 'Call Customer',
          onPress: () => Linking.openURL(`tel:${customer.phone.replace(/\s+/g, '')}`),
        },
        {
          text: 'WhatsApp Message',
          onPress: () => {
            const rawDigits = customer.phone.replace(/[^0-9]/g, '');
            const phoneWith91 = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
            Linking.openURL(
              `https://wa.me/${phoneWith91}?text=Hello%20${encodeURIComponent(
                customer.name
              )},%20greeting%20from%20Shree%20Ganesh%20Optical!`
            );
          },
        },
        {
          text: 'View Full Profile & Rx',
          onPress: () => router.push(`/customers/${customer.id}`),
        },
        {
          text: 'Delete Customer',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Customer',
              `Are you sure you want to permanently delete ${customer.name}? This cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await opticalStore.deleteCustomer(customer.id);
                    Alert.alert('Deleted', `${customer.name} removed successfully.`);
                  },
                },
              ]
            );
          },
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
          {/* Left Brand Badge */}
          <View style={styles.brandContainer}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandTitle}>Goggles Shop</Text>
              <Text style={styles.brandSubtitle}>OPTICAL STORE POS</Text>
            </View>
          </View>

          {/* Right Action Icons: Search, Add Customer, 3 dots */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => { }}
              activeOpacity={0.7}
            >
              <Search size={19} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/customers/add')}
              activeOpacity={0.7}
            >
              <UserPlus size={19} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() =>
                Alert.alert(
                  'Customer Management',
                  '• Export Customers to Excel\n• Import CSV Contacts\n• Send Bulk WhatsApp / SMS',
                  [{ text: 'OK' }]
                )
              }
              activeOpacity={0.7}
            >
              <MoreVertical size={19} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Scrollable Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Add Customer Button Row */}
        <View style={styles.titleRow}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.screenHeading}>Customers</Text>
            <Text style={styles.screenSubheading}>
              Manage your customers, eye prescriptions and purchase history
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addCustomerBtn}
            onPress={() => router.push('/customers/add')}
            activeOpacity={0.85}
          >
            <PlusCircle size={15} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.addCustomerText}>Add Customer</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Metric / KPI Cards Row */}
        <View style={styles.metricsRow}>
          {/* Card 1: Total Customers */}
          <View style={[styles.metricCard, { backgroundColor: '#F0F9FF' }]}>
            <View style={styles.metricIconBox}>
              <Users size={16} color="#0284C7" />
            </View>
            <Text style={styles.metricNumber}>{totalCount}</Text>
            <Text style={styles.metricLabel}>Total Customers</Text>
          </View>

          {/* Card 2: New This Month */}
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
            <View style={styles.metricIconBox}>
              <UserCheck size={16} color="#059669" />
            </View>
            <Text style={styles.metricNumber}>{newCount}</Text>
            <Text style={styles.metricLabel}>New</Text>
          </View>

          {/* Card 3: Regular Customers */}
          <View style={[styles.metricCard, { backgroundColor: '#FFFBEB' }]}>
            <View style={styles.metricIconBox}>
              <ShoppingBag size={16} color="#D97706" />
            </View>
            <Text style={styles.metricNumber}>{regularCount}</Text>
            <Text style={styles.metricLabel}>Regular</Text>
          </View>

          {/* Card 4: Due Checkup */}
          <View style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
            <View style={styles.metricIconBox}>
              <Clock size={16} color="#DC2626" />
            </View>
            <Text style={styles.metricNumber}>{dueCount}</Text>
            <Text style={styles.metricLabel}>Due Checkup</Text>
          </View>
        </View>

        {/* Search & Sliders Filter Bar */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchContainer}>
            <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customer name, phone, email..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.filterSlidersBtn}
            onPress={() =>
              Alert.alert('Filter By', 'Select customer filter criteria:', [
                { text: 'Prescription Expiring Soon' },
                { text: 'Visited This Month' },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={17} color="#475569" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Category / Status Filter Pills (Horizontal Scroll) */}
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
                {tab.isVip && (
                  <Crown
                    size={13}
                    color={isActive ? '#FFFFFF' : '#D97706'}
                    style={{ marginRight: 4 }}
                  />
                )}
                {tab.isDue && (
                  <Clock
                    size={13}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                    style={{ marginRight: 4 }}
                  />
                )}
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

        {/* Customers List Items */}
        <View style={styles.customersList}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((cust) => {
              const initials = getInitials(cust.name);

              return (
                <TouchableOpacity
                  key={cust.id}
                  style={styles.customerCard}
                  onPress={() => router.push(`/customers/${cust.id}`)}
                  activeOpacity={0.88}
                >
                  {/* Top Header Row: Avatar, Customer Details & Badges */}
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: cust.avatarBg || '#DBEAFE' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          { color: cust.avatarColor || '#1D4ED8' },
                        ]}
                      >
                        {initials}
                      </Text>
                    </View>

                    <View style={styles.customerMainInfo}>
                      <View style={styles.nameBadgeRow}>
                        <Text style={styles.customerName} numberOfLines={1}>
                          {cust.name}
                        </Text>
                        {(cust.status === 'Regular' || !cust.status) && (
                          <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5' }]}>
                            <Text style={[styles.statusText, { color: '#059669' }]}>Regular</Text>
                          </View>
                        )}
                        {cust.status === 'New' && (
                          <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
                            <Text style={[styles.statusText, { color: '#2563EB' }]}>New</Text>
                          </View>
                        )}
                        {cust.status === 'Due Checkup' && (
                          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={[styles.statusText, { color: '#DC2626' }]}>Due Checkup</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.subMetaRow}>
                        <Text style={styles.customerPhone}>{cust.phone}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <View style={styles.locationRow}>
                          <MapPin size={11} color="#94A3B8" />
                          <Text style={styles.customerCity} numberOfLines={1}>
                            {cust.city || cust.address || 'Sehore'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.dotsBtn}
                      onPress={() => handleActionMenu(cust)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MoreVertical size={18} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  {/* Middle Stats Divider Row */}
                  <View style={styles.cardStatsBar}>
                    <View style={styles.statSubRow}>
                      <Calendar size={12} color="#64748B" style={{ marginRight: 5 }} />
                      <Text style={styles.statLabel}>Last Visit:</Text>
                      <Text style={styles.statValue}> {cust.lastVisit || cust.createdAt || 'Recent'}</Text>
                    </View>

                    <View style={styles.statSubRow}>
                      <ShoppingBag size={12} color="#059669" style={{ marginRight: 5 }} />
                      <Text style={styles.statLabel}>Total Spent:</Text>
                      <Text style={[styles.statValue, { color: '#059669', fontWeight: '800' }]}>
                        {' '}{formatCurrency(cust.totalSpent || 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Action Buttons Row */}
                  <View style={styles.cardActionsRow}>
                    {/* Call Button */}
                    <TouchableOpacity
                      style={styles.actionPillBtn}
                      onPress={() => Linking.openURL(`tel:${cust.phone.replace(/\s+/g, '')}`)}
                      activeOpacity={0.7}
                    >
                      <Phone size={13} color="#059669" strokeWidth={2.2} />
                      <Text style={[styles.actionPillText, { color: '#059669' }]}>Call</Text>
                    </TouchableOpacity>

                    {/* WhatsApp Button */}
                    <TouchableOpacity
                      style={styles.actionPillBtn}
                      onPress={() => {
                        const rawDigits = cust.phone.replace(/[^0-9]/g, '');
                        const phoneWith91 = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
                        Linking.openURL(
                          `https://wa.me/${phoneWith91}?text=Hello%20${encodeURIComponent(
                            cust.name
                          )},%20greeting%20from%20Shree%20Ganesh%20Optical!`
                        );
                      }}
                      activeOpacity={0.7}
                    >
                      <MessageCircle size={13} color="#2563EB" strokeWidth={2.2} />
                      <Text style={[styles.actionPillText, { color: '#2563EB' }]}>WhatsApp</Text>
                    </TouchableOpacity>

                    {/* View Details Button */}
                    <TouchableOpacity
                      style={styles.actionPillBtn}
                      onPress={() => router.push(`/customers/${cust.id}`)}
                      activeOpacity={0.7}
                    >
                      <Eye size={13} color="#475569" strokeWidth={2.2} />
                      <Text style={[styles.actionPillText, { color: '#475569' }]}>View Rx</Text>
                    </TouchableOpacity>

                    {/* Delete Customer Button */}
                    <TouchableOpacity
                      style={[styles.actionPillBtn, styles.deleteActionPill]}
                      onPress={() => {
                        Alert.alert(
                          'Delete Customer',
                          `Are you sure you want to delete ${cust.name}?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: async () => {
                                await opticalStore.deleteCustomer(cust.id);
                              },
                            },
                          ]
                        );
                      }}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={13} color="#DC2626" strokeWidth={2.2} />
                      <Text style={[styles.actionPillText, { color: '#DC2626' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <Users size={48} color="#94A3B8" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#334155', marginTop: 10 }}>
                No Customers Found
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
                Add a new customer or make a sale in POS to register them automatically.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#064E3B',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginTop: 14,
                }}
                onPress={() => router.push('/customers/add')}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>+ Add New Customer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Space above bottom tabs */}
        <View style={{ height: 30 }} />
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
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextContainer: {
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    padding: 4,
  },

  /* Scroll View */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },

  /* Heading & Add Customer Row */
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  screenSubheading: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  addCustomerBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addCustomerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 4 Metric Cards */
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
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
  metricIconBox: {
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 20,
  },
  metricLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  /* Search & Filter Bar */
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
    fontSize: 12.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterSlidersBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* Filter Pills */
  filterPillsScroll: {
    marginBottom: 14,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 10,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
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

  /* Customers List */
  customersList: {
    gap: 12,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  /* 1. Card Top Row */
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  customerMainInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    maxWidth: '70%',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  customerPhone: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  metaDot: {
    color: '#94A3B8',
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
  },
  customerCity: {
    fontSize: 11.5,
    color: '#64748B',
  },

  /* Status Badges */
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  /* 2. Middle Stats Bar */
  cardStatsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* 3. Bottom Action Buttons Row */
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  deleteActionPill: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  dotsBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
});
