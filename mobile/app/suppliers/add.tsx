import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Package,
  CreditCard,
  FileText,
  Camera,
  Check,
  Home,
  ShoppingCart,
  Users,
  Truck,
  Ellipsis,
} from 'lucide-react-native';

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
 * Red Ray-Ban Brand Logo Card
 */
function RayBanLogoCard() {
  return (
    <View style={styles.brandLogoCard}>
      <Svg width={72} height={42} viewBox="0 0 72 42" fill="none">
        <Rect width="72" height="42" rx="6" fill="#DC2626" />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '900',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 42,
            letterSpacing: 0.5,
          }}
        >
          Ray-Ban
        </Text>
      </Svg>
    </View>
  );
}

export default function AddSupplierScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Basic Information State
  const [supplierName, setSupplierName] = useState('Ray-Ban India Pvt. Ltd.');
  const [supplierType, setSupplierType] = useState('Manufacturer');
  const [brandCompany, setBrandCompany] = useState('Ray-Ban');
  const [gstNumber, setGstNumber] = useState('27AABCR1234F1Z5');
  const [panNumber, setPanNumber] = useState('AABCR1234F');
  const [contactPerson, setContactPerson] = useState('Vikram Mehta');

  // Contact Details State
  const [phone, setPhone] = useState('+91 98765 43210');
  const [alternatePhone, setAlternatePhone] = useState('+91 87654 32109');
  const [email, setEmail] = useState('sales@raybanindia.com');
  const [website, setWebsite] = useState('https://www.ray-ban.com');

  // Address State
  const [address, setAddress] = useState('123, Industrial Area, Andheri East, Mumbai - 400093');
  const [city, setCity] = useState('Mumbai');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400093');

  // Product Categories State (Multi-select)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'frames',
    'sunglasses',
    'lenses',
  ]);

  // Payment Terms State
  const [paymentTerm, setPaymentTerm] = useState('Credit (30 Days)');
  const [creditLimit, setCreditLimit] = useState('1,00,000');
  const [defaultDiscount, setDefaultDiscount] = useState('0');

  // Additional Information State
  const [notes, setNotes] = useState(
    'Authorized distributor for Ray-Ban frames and sunglasses.\nProvide genuine products with warranty.'
  );
  const [isActiveSupplier, setIsActiveSupplier] = useState(true);

  const toggleCategory = (key: string) => {
    if (selectedCategories.includes(key)) {
      setSelectedCategories(selectedCategories.filter((k) => k !== key));
    } else {
      setSelectedCategories([...selectedCategories, key]);
    }
  };

  const handleSaveSupplier = () => {
    Alert.alert(
      'Supplier Added Successfully',
      `"${supplierName}" has been added to your suppliers directory.`,
      [
        {
          text: 'View Suppliers',
          onPress: () => router.push('/inventory/suppliers'),
        },
        { text: 'OK' },
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
              <Text style={styles.headerTitle}>Add Supplier</Text>
              <Text style={styles.headerSubtitle}>
                Add a new supplier to your business
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

      {/* Main Scrollable Form */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Basic Information */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Building2 size={16} color="#064E3B" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Basic Information</Text>
          </View>

          {/* Row 1: Name, Type & Logo Slot */}
          <View style={styles.formRowWithLogo}>
            <View style={{ flex: 1, gap: 8 }}>
              {/* Supplier Name */}
              <View>
                <Text style={styles.fieldLabel}>Supplier Name *</Text>
                <TextInput
                  style={styles.inputBox}
                  value={supplierName}
                  onChangeText={setSupplierName}
                  placeholder="e.g. Ray-Ban India Pvt. Ltd."
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Supplier Type Dropdown */}
              <View>
                <Text style={styles.fieldLabel}>Supplier Type *</Text>
                <TouchableOpacity
                  style={styles.dropdownBox}
                  onPress={() =>
                    Alert.alert('Supplier Type', 'Select supplier classification', [
                      { text: 'Manufacturer', onPress: () => setSupplierType('Manufacturer') },
                      { text: 'Wholesaler / Distributor', onPress: () => setSupplierType('Wholesaler') },
                      { text: 'Importer', onPress: () => setSupplierType('Importer') },
                      { text: 'Cancel', style: 'cancel' },
                    ])
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownValueText}>{supplierType}</Text>
                  <Text style={{ color: '#64748B', fontSize: 11 }}>⌵</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logo Slot on Right */}
            <View style={styles.logoCol}>
              <RayBanLogoCard />
              <TouchableOpacity
                style={styles.changeLogoBtn}
                onPress={() => Alert.alert('Upload Logo', 'Select brand logo from gallery or files')}
                activeOpacity={0.8}
              >
                <Camera size={12} color="#334155" style={{ marginRight: 4 }} />
                <Text style={styles.changeLogoBtnText}>Change Logo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Brand/Company & GST Number */}
          <View style={styles.twoColGridRow}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Brand / Company</Text>
              <TextInput
                style={styles.inputBox}
                value={brandCompany}
                onChangeText={setBrandCompany}
                placeholder="e.g. Ray-Ban"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>GST Number</Text>
              <TextInput
                style={styles.inputBox}
                value={gstNumber}
                onChangeText={setGstNumber}
                placeholder="27AABCR1234F1Z5"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Row 3: PAN Number & Contact Person */}
          <View style={styles.twoColGridRow}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>PAN Number</Text>
              <TextInput
                style={styles.inputBox}
                value={panNumber}
                onChangeText={setPanNumber}
                placeholder="AABCR1234F"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Contact Person</Text>
              <TextInput
                style={styles.inputBox}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="Vikram Mehta"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Section 2: Contact Details */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Phone size={16} color="#064E3B" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Contact Details</Text>
          </View>

          {/* Row 1: Phone & Alternate Phone */}
          <View style={styles.twoColGridRow}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Phone Number *</Text>
              <View style={styles.inputWithIcon}>
                <Phone size={13} color="#059669" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.inputInside}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Alternate Phone</Text>
              <View style={styles.inputWithIcon}>
                <Phone size={13} color="#64748B" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.inputInside}
                  value={alternatePhone}
                  onChangeText={setAlternatePhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Row 2: Email & Website */}
          <View style={styles.twoColGridRow}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputWithIcon}>
                <Mail size={13} color="#64748B" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.inputInside}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Website (Optional)</Text>
              <View style={styles.inputWithIcon}>
                <Globe size={13} color="#64748B" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.inputInside}
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Address Information */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <MapPin size={16} color="#064E3B" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Address Information</Text>
          </View>

          <View style={styles.twoColGridRow}>
            {/* Address Multi-line Box */}
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Address *</Text>
              <View style={styles.addressInputBox}>
                <MapPin size={14} color="#64748B" style={{ marginRight: 6, marginTop: 2 }} />
                <TextInput
                  style={styles.addressTextInput}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* City, State, PIN */}
            <View style={[styles.fieldCol, { gap: 8 }]}>
              <View>
                <Text style={styles.fieldLabel}>City *</Text>
                <TextInput style={styles.inputBox} value={city} onChangeText={setCity} />
              </View>

              <View style={{ flexDirection: 'row', gap: 6 }}>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.fieldLabel}>State *</Text>
                  <TouchableOpacity
                    style={styles.dropdownBox}
                    onPress={() =>
                      Alert.alert('State', 'Maharashtra, Delhi, Karnataka, Gujarat, MP...')
                    }
                  >
                    <Text style={styles.dropdownValueText}>{stateName}</Text>
                    <Text style={{ color: '#64748B', fontSize: 11 }}>⌵</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>PIN Code *</Text>
                  <TextInput
                    style={styles.inputBox}
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Product Categories (Multi-select) */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Package size={16} color="#064E3B" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Product Categories</Text>
          </View>
          <Text style={styles.sectionSubtext}>
            Select the product categories supplied by this supplier
          </Text>

          <View style={styles.categoriesTilesRow}>
            {/* 1. Frames */}
            <TouchableOpacity
              style={[
                styles.categoryTile,
                selectedCategories.includes('frames') && styles.categoryTileSelected,
              ]}
              onPress={() => toggleCategory('frames')}
              activeOpacity={0.8}
            >
              {selectedCategories.includes('frames') && (
                <View style={styles.selectedCheckCircle}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
              <Text style={styles.catEmoji}>👓</Text>
              <Text style={styles.catTileLabel}>Frames</Text>
            </TouchableOpacity>

            {/* 2. Sunglasses */}
            <TouchableOpacity
              style={[
                styles.categoryTile,
                selectedCategories.includes('sunglasses') && styles.categoryTileSelected,
              ]}
              onPress={() => toggleCategory('sunglasses')}
              activeOpacity={0.8}
            >
              {selectedCategories.includes('sunglasses') && (
                <View style={styles.selectedCheckCircle}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
              <Text style={styles.catEmoji}>🕶️</Text>
              <Text style={styles.catTileLabel}>Sunglasses</Text>
            </TouchableOpacity>

            {/* 3. Lenses */}
            <TouchableOpacity
              style={[
                styles.categoryTile,
                selectedCategories.includes('lenses') && styles.categoryTileSelected,
              ]}
              onPress={() => toggleCategory('lenses')}
              activeOpacity={0.8}
            >
              {selectedCategories.includes('lenses') && (
                <View style={styles.selectedCheckCircle}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
              <Text style={styles.catEmoji}>⚪</Text>
              <Text style={styles.catTileLabel}>Lenses</Text>
            </TouchableOpacity>

            {/* 4. Contact Lenses */}
            <TouchableOpacity
              style={[
                styles.categoryTile,
                selectedCategories.includes('contact_lenses') && styles.categoryTileSelected,
              ]}
              onPress={() => toggleCategory('contact_lenses')}
              activeOpacity={0.8}
            >
              {selectedCategories.includes('contact_lenses') && (
                <View style={styles.selectedCheckCircle}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
              <Text style={styles.catEmoji}>👁️</Text>
              <Text style={styles.catTileLabel}>Contact Lenses</Text>
            </TouchableOpacity>

            {/* 5. Accessories */}
            <TouchableOpacity
              style={[
                styles.categoryTile,
                selectedCategories.includes('accessories') && styles.categoryTileSelected,
              ]}
              onPress={() => toggleCategory('accessories')}
              activeOpacity={0.8}
            >
              {selectedCategories.includes('accessories') && (
                <View style={styles.selectedCheckCircle}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
              <Text style={styles.catEmoji}>🧴</Text>
              <Text style={styles.catTileLabel}>Accessories</Text>
            </TouchableOpacity>

            {/* 6. Others */}
            <TouchableOpacity
              style={[
                styles.categoryTile,
                selectedCategories.includes('others') && styles.categoryTileSelected,
              ]}
              onPress={() => toggleCategory('others')}
              activeOpacity={0.8}
            >
              {selectedCategories.includes('others') && (
                <View style={styles.selectedCheckCircle}>
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
              <Text style={styles.catEmoji}>🔲</Text>
              <Text style={styles.catTileLabel}>Others</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 5: Payment Terms */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <CreditCard size={16} color="#064E3B" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Payment Terms</Text>
          </View>

          <View style={styles.threeColRow}>
            {/* Payment Term */}
            <View style={{ flex: 1.3 }}>
              <Text style={styles.fieldLabel}>Payment Term</Text>
              <TouchableOpacity
                style={styles.dropdownBox}
                onPress={() =>
                  Alert.alert('Payment Term', 'Credit (30 Days), Credit (15 Days), Cash on Delivery, Advance')
                }
              >
                <Text style={styles.dropdownValueText}>{paymentTerm}</Text>
                <Text style={{ color: '#64748B', fontSize: 11 }}>⌵</Text>
              </TouchableOpacity>
            </View>

            {/* Credit Limit */}
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Credit Limit (₹)</Text>
              <TextInput
                style={styles.inputBox}
                value={creditLimit}
                onChangeText={setCreditLimit}
              />
            </View>

            {/* Default Discount */}
            <View style={{ flex: 0.9 }}>
              <Text style={styles.fieldLabel}>Default Discount (%)</Text>
              <TextInput
                style={styles.inputBox}
                value={defaultDiscount}
                onChangeText={setDefaultDiscount}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Section 6: Additional Information */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <FileText size={16} color="#064E3B" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Additional Information</Text>
          </View>

          <View style={styles.twoColGridRow}>
            {/* Notes */}
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesBox}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Status Switch */}
            <View style={[styles.fieldCol, { justifyContent: 'center' }]}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.statusSwitchRow}>
                <Switch
                  value={isActiveSupplier}
                  onValueChange={setIsActiveSupplier}
                  trackColor={{ false: '#E2E8F0', true: '#059669' }}
                  thumbColor="#FFFFFF"
                />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.statusLabelText}>
                    {isActiveSupplier ? 'Active Supplier' : 'Inactive Supplier'}
                  </Text>
                  <Text style={styles.statusSubtext}>
                    Active suppliers will be available in purchase and stock management.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Actions Row: Cancel & Save Supplier */}
        <View style={styles.actionBtnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveSupplierBtn}
            onPress={handleSaveSupplier}
            activeOpacity={0.85}
          >
            <FileText size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveSupplierBtnText}>Save Supplier</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
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
    gap: 10,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtext: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: -4,
  },

  // Form Fields
  fieldLabel: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 3,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    paddingHorizontal: 9,
    height: 36,
    fontSize: 11,
    color: '#0F172A',
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    paddingHorizontal: 9,
    height: 36,
  },
  dropdownValueText: {
    fontSize: 11,
    color: '#0F172A',
  },

  // Form Layout Grids
  formRowWithLogo: {
    flexDirection: 'row',
    gap: 10,
  },
  logoCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  brandLogoCard: {
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  changeLogoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 5,
  },
  changeLogoBtnText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#334155',
  },

  twoColGridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fieldCol: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 36,
  },
  inputInside: {
    flex: 1,
    fontSize: 11,
    color: '#0F172A',
    padding: 0,
  },
  addressInputBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    padding: 8,
    minHeight: 76,
  },
  addressTextInput: {
    flex: 1,
    fontSize: 10.5,
    color: '#0F172A',
    lineHeight: 15,
    textAlignVertical: 'top',
  },

  // Category Tiles
  categoriesTilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTile: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryTileSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  selectedCheckCircle: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: {
    fontSize: 15,
    marginBottom: 2,
  },
  catTileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Three Column Row
  threeColRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Notes & Status
  notesBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    padding: 8,
    fontSize: 10.5,
    color: '#0F172A',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  statusSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusSubtext: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },

  // Bottom Buttons
  actionBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  saveSupplierBtn: {
    flex: 1.6,
    backgroundColor: '#064E3B',
    borderRadius: 8,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveSupplierBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
