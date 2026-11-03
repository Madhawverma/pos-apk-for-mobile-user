import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  UserPlus,
} from 'lucide-react-native';
import { cartManager, CartState } from '../../src/store/cartStore';
import { opticalStore } from '../../src/store/opticalStore';
import { mockCustomers } from '../../src/data/mockCustomers';
import { Customer } from '../../src/types/customer';

export default function CustomerSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cart, setCart] = useState<CartState>(cartManager.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(cart.selectedCustomer || null);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(() => {
    const storeCustomers = opticalStore.getState().customers || [];
    return storeCustomers.length > 0 ? storeCustomers : mockCustomers;
  });

  useEffect(() => {
    const unsub = opticalStore.subscribe(() => {
      const current = opticalStore.getState().customers || [];
      setAllCustomers(current.length > 0 ? current : mockCustomers);
    });
    return unsub;
  }, []);

  const filteredCustomers = allCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  // Auto detect 10-digit phone number if customer not found
  useEffect(() => {
    const digitsOnly = searchQuery.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      const match = allCustomers.find((c) => c.phone.replace(/\D/g, '').endsWith(digitsOnly));
      if (!match) {
        // Customer does not exist, open Add Customer form automatically
        router.push({
          pathname: '/customers/add',
          params: { phone: digitsOnly, fromCheckout: 'true' },
        });
      }
    }
  }, [searchQuery, allCustomers]);

  const handleSelect = (customer: Customer) => {
    setSelectedCust(customer);
    cartManager.setCustomer(customer);
  };

  const handleWalkInCustomer = () => {
    const walkIn: Customer = {
      id: 'cust-walkin',
      name: 'Walk-in Customer',
      phone: '+91 99999 99999',
      email: 'walkin@store.com',
      city: 'Sehore',
      address: 'In-Store',
      status: 'Regular',
      totalSpent: 0,
      totalOrders: 0,
      lastVisit: 'Today',
      createdAt: '2026-11-02',
    };
    setSelectedCust(walkIn);
    cartManager.setCustomer(walkIn);
  };

  const handleProceedToPayment = () => {
    if (!selectedCust) {
      Alert.alert(
        'Customer Required',
        'Please select a registered customer or tap "Continue as Walk-in Customer".'
      );
      return;
    }
    cartManager.setCustomer(selectedCust);
    router.push('/checkout/payment');
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Select Customer</Text>
              <Text style={styles.headerSubtitle}>Step 2: Assign customer for this invoice</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addCustomerTopBtn}
            onPress={() => router.push('/customers/add')}
            activeOpacity={0.8}
          >
            <Plus size={13} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.addCustomerTopText}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stepper Bar */}
      <View style={styles.stepperBar}>
        <View style={styles.stepItemDone}>
          <CheckCircle2 size={16} color="#059669" />
          <Text style={styles.stepLabelDone}>Items</Text>
        </View>

        <View style={styles.stepItemActive}>
          <View style={styles.stepCircleActive}>
            <Text style={styles.stepNumActive}>2</Text>
          </View>
          <Text style={styles.stepLabelActive}>Customer</Text>
          <View style={styles.stepIndicatorLineActive} />
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>4</Text>
          </View>
          <Text style={styles.stepLabel}>Invoice</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Walk-in Shortcut Card */}
        <TouchableOpacity
          style={[
            styles.walkInCard,
            selectedCust?.id === 'cust-walkin' && styles.selectedCustomerCard,
          ]}
          onPress={handleWalkInCustomer}
          activeOpacity={0.85}
        >
          <View style={styles.walkInIconBox}>
            <UserCheck size={20} color="#064E3B" strokeWidth={2.2} />
          </View>
          <View style={styles.walkInTextBox}>
            <Text style={styles.walkInTitle}>Walk-in Customer</Text>
            <Text style={styles.walkInSubtitle}>Quick checkout without saving contact details</Text>
          </View>
          {selectedCust?.id === 'cust-walkin' && (
            <CheckCircle2 size={20} color="#059669" />
          )}
        </TouchableOpacity>

        {/* Search Customer Bar */}
        <View style={styles.searchBox}>
          <Search size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customer by name or mobile..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionHeaderTitle}>Registered Customers</Text>

        {/* Not Found Banner with quick Add Customer button */}
        {filteredCustomers.length === 0 && searchQuery.trim().length > 0 && (
          <TouchableOpacity
            style={styles.notFoundAddBox}
            onPress={() => {
              const digits = searchQuery.replace(/\D/g, '');
              router.push({
                pathname: '/customers/add',
                params: { phone: digits || searchQuery, fromCheckout: 'true' },
              });
            }}
            activeOpacity={0.8}
          >
            <View style={styles.notFoundIconCircle}>
              <UserPlus size={20} color="#0284C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notFoundTitle}>Customer Not Found</Text>
              <Text style={styles.notFoundSub}>
                Tap to quickly register &quot;{searchQuery}&quot; and proceed with sale
              </Text>
            </View>
            <View style={styles.notFoundBadge}>
              <Text style={styles.notFoundBadgeText}>+ Add Now</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Customer List */}
        {filteredCustomers.map((cust) => {
          const isSelected = selectedCust?.id === cust.id;
          const initials = cust.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

          return (
            <TouchableOpacity
              key={cust.id}
              style={[styles.customerCard, isSelected && styles.selectedCustomerCard]}
              onPress={() => handleSelect(cust)}
              activeOpacity={0.85}
            >
              <View style={[styles.avatarCircle, isSelected && styles.avatarCircleSelected]}>
                <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                  {initials}
                </Text>
              </View>

              <View style={styles.customerInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.custName}>{cust.name}</Text>
                  {cust.status && (
                    <View style={styles.tierBadge}>
                      <Text style={styles.tierText}>{cust.status}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.custDetailRow}>
                  <Phone size={11} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.custDetailText}>{cust.phone}</Text>
                </View>

                {cust.address && (
                  <View style={styles.custDetailRow}>
                    <MapPin size={11} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.custDetailText} numberOfLines={1}>
                      {cust.address}
                    </Text>
                  </View>
                )}
              </View>

              {isSelected ? (
                <CheckCircle2 size={22} color="#059669" />
              ) : (
                <View style={styles.radioEmpty} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handleProceedToPayment}
          activeOpacity={0.88}
        >
          <Text style={styles.proceedBtnText}>Next: Select Payment Method →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  header: {
    backgroundColor: '#04281B',
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
  backBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitleBox: {
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 9.5,
    fontWeight: '500',
    marginTop: 1,
  },
  addCustomerTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
    gap: 3,
  },
  addCustomerTopText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Stepper */
  stepperBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stepItemDone: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  stepLabelDone: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  stepItemActive: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepNumActive: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepNum: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  stepLabelActive: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  stepLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  stepIndicatorLineActive: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#064E3B',
    borderRadius: 1.5,
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 24,
  },
  walkInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  walkInIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walkInTextBox: {
    flex: 1,
  },
  walkInTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  walkInSubtitle: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    marginLeft: 8,
  },
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  selectedCustomerCard: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarCircleSelected: {
    backgroundColor: '#064E3B',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  avatarTextSelected: {
    color: '#FFFFFF',
  },
  customerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  custName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  tierBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#B45309',
  },
  custDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  custDetailText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },

  /* Customer Not Found Quick Add */
  notFoundAddBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  notFoundIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  notFoundSub: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 2,
  },
  notFoundBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  notFoundBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  proceedBtn: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
