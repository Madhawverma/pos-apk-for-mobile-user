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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path } from 'react-native-svg';
import {
  ArrowLeft,
  User,
  Camera,
  Calendar,
  ChevronDown,
  MapPin,
  Eye,
  Plus,
  FileText,
  Bell,
  Check,
  Save,
  Crown,
  UserCheck,
} from 'lucide-react-native';
import { mockCustomers } from '../../src/data/mockCustomers';
import { opticalStore } from '../../src/store/opticalStore';
import { cartManager } from '../../src/store/cartStore';

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

export default function AddCustomerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; fromCheckout?: string }>();
  const insets = useSafeAreaInsets();

  // Basic Information Form State
  const [customerTier, setCustomerTier] = useState<'Regular' | 'New' | 'VIP'>('Regular');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(params.phone || '');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Eye Prescription Refraction Table State
  const [showPrescriptionSection, setShowPrescriptionSection] = useState(false);
  const [odSph, setOdSph] = useState('');
  const [odCyl, setOdCyl] = useState('');
  const [odAxis, setOdAxis] = useState('');
  const [odAdd, setOdAdd] = useState('');
  const [odPd, setOdPd] = useState('');

  const [osSph, setOsSph] = useState('');
  const [osCyl, setOsCyl] = useState('');
  const [osAxis, setOsAxis] = useState('');
  const [osAdd, setOsAdd] = useState('');
  const [osPd, setOsPd] = useState('');

  const [rxType, setRxType] = useState('Single Vision');
  const [rxDate, setRxDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [validTill, setValidTill] = useState('');
  const [rxNotes, setRxNotes] = useState('');

  // Additional Information State
  const [customerType, setCustomerType] = useState('Regular');
  const [customerSource, setCustomerSource] = useState('Walk-in');
  const [preferredBrand, setPreferredBrand] = useState('');
  const [remarks, setRemarks] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  const handleSaveCustomer = () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      Alert.alert('Required Fields', 'Please enter Customer Full Name and Phone Number.');
      return;
    }

    const hasRx = showPrescriptionSection && (odSph || odCyl || osSph || osCyl || rxNotes);

    const newCust = {
      id: 'cust-' + Date.now(),
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      email: email.trim() || undefined,
      city: city.trim() || 'Indore, MP',
      address: address.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      lastVisit: rxDate,
      totalOrders: 0,
      totalSpent: 0,
      status: customerTier,
      tenure: 'New',
      avatarBg: '#DBEAFE',
      avatarColor: '#1D4ED8',
      prescriptions: hasRx
        ? [
            {
              id: 'rx-' + Date.now(),
              customerId: 'cust-' + Date.now(),
              customerName: fullName.trim(),
              date: rxDate,
              optometristName: 'In-House Optometrist',
              od: { sph: odSph || '0.00', cyl: odCyl || '0.00', axis: odAxis || '0', add: odAdd || '0.00', va: '6/6' },
              os: { sph: osSph || '0.00', cyl: osCyl || '0.00', axis: osAxis || '0', add: osAdd || '0.00', va: '6/6' },
              pd: String((parseInt(odPd || '30', 10) || 30) + (parseInt(osPd || '30', 10) || 30)),
              lensRecommendation: rxNotes,
              remarks: remarks,
            },
          ]
        : [],
    };

    opticalStore.addCustomer(newCust as any);

    if (params.fromCheckout === 'true') {
      cartManager.setCustomer(newCust as any);
      Alert.alert(
        'Customer Added',
        `${fullName} has been selected! Proceeding to checkout payment.`,
        [
          {
            text: 'Continue to Payment',
            onPress: () => router.replace('/checkout/payment'),
          },
        ]
      );
    } else {
      Alert.alert(
        'Customer Saved',
        hasRx
          ? `${fullName} and eye prescription have been successfully saved to your optical records!`
          : `${fullName} has been successfully added to customer records!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', `Customer ${fullName || 'record'} draft saved locally.`);
    router.back();
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerContent}>
          {/* Left Arrow & Titles */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Add Customer</Text>
              <Text style={styles.headerSubtitle}>
                Add new customer and eye prescription
              </Text>
            </View>
          </View>

          {/* Right Brand Badge */}
          <View style={styles.brandContainer}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextContainer}>
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
        {/* ========================================================= */}
        {/* SECTION 1: Basic Information */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          {/* Header Row: Title & Tier Pills */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <User size={18} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <View style={styles.tierPillsRow}>
              {/* Regular Pill */}
              <TouchableOpacity
                style={[
                  styles.tierPill,
                  customerTier === 'Regular' && styles.tierPillActiveRegular,
                ]}
                onPress={() => setCustomerTier('Regular')}
                activeOpacity={0.8}
              >
                <UserCheck
                  size={12}
                  color={customerTier === 'Regular' ? '#FFFFFF' : '#059669'}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.tierText,
                    customerTier === 'Regular' && styles.tierTextActive,
                  ]}
                >
                  Regular
                </Text>
              </TouchableOpacity>

              {/* New Pill */}
              <TouchableOpacity
                style={[
                  styles.tierPill,
                  customerTier === 'New' && styles.tierPillActiveNew,
                ]}
                onPress={() => setCustomerTier('New')}
                activeOpacity={0.8}
              >
                <Plus
                  size={12}
                  color={customerTier === 'New' ? '#FFFFFF' : '#0284C7'}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.tierText,
                    customerTier === 'New' && styles.tierTextActive,
                  ]}
                >
                  New
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo + Name + Phone + Email (Responsive Clean Layout) */}
          <View style={styles.photoContainerWrapper}>
            <TouchableOpacity
              style={styles.addPhotoCircle}
              onPress={() => Alert.alert('Add Photo', 'Upload customer portrait photo from camera or gallery.')}
              activeOpacity={0.8}
            >
              <Camera size={22} color="#059669" />
              <Text style={styles.addPhotoLabel}>Add Photo</Text>
            </TouchableOpacity>
            <View style={styles.photoHelperTextBox}>
              <Text style={styles.photoHelperTitle}>Customer Photo</Text>
              <Text style={styles.photoHelperSub}>Upload image or click picture for face recognition</Text>
            </View>
          </View>

          {/* Full Name & Phone Number */}
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>
                Full Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>
                Phone Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+91 9876543210"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email & Occupation */}
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Email (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="customer@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Occupation (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={occupation}
                onChangeText={setOccupation}
                placeholder="e.g. IT Professional, Doctor"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Date of Birth & Gender */}
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <View style={styles.iconInputContainer}>
                <Calendar size={18} color="#475569" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.innerTextInput}
                  value={dob}
                  onChangeText={setDob}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity
                style={styles.dropdownInputContainer}
                onPress={() =>
                  Alert.alert('Gender', 'Select Gender:', [
                    { text: 'Male', onPress: () => setGender('Male') },
                    { text: 'Female', onPress: () => setGender('Female') },
                    { text: 'Other', onPress: () => setGender('Other') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>{gender}</Text>
                <ChevronDown size={17} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Address, City & Pincode */}
          <View style={styles.addressSection}>
            <Text style={styles.inputLabel}>Full Address</Text>
            <View style={styles.iconInputContainer}>
              <MapPin size={18} color="#475569" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.innerTextInput}
                value={address}
                onChangeText={setAddress}
                placeholder="House / Street / Colony / Landmark"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={[styles.twoColRow, { marginTop: 12 }]}>
              <View style={styles.colItem}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g. Sehore / Bhopal"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.colItem}>
                <Text style={styles.inputLabel}>Pincode</Text>
                <TextInput
                  style={styles.textInput}
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="466001"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* SECTION 2: Eye Prescription */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          {/* Header Row: Title & Add Previous Prescription */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <Eye size={18} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>Eye Prescription</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.addPrevRxBtn,
                  showPrescriptionSection && { backgroundColor: '#ECFDF5', borderColor: '#059669' },
                ]}
                onPress={() => setShowPrescriptionSection(!showPrescriptionSection)}
                activeOpacity={0.8}
              >
                <Plus size={13} color={showPrescriptionSection ? '#059669' : '#475569'} style={{ marginRight: 4 }} />
                <Text
                  style={[
                    styles.addPrevRxText,
                    showPrescriptionSection && { color: '#059669', fontWeight: '700' },
                  ]}
                >
                  {showPrescriptionSection ? 'Prescription Added ✓' : '+ Add Eye Prescription'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {!showPrescriptionSection ? (
            <TouchableOpacity
              style={styles.rxEmptyStateBox}
              onPress={() => setShowPrescriptionSection(true)}
              activeOpacity={0.7}
            >
              <Eye size={22} color="#94A3B8" />
              <Text style={styles.rxEmptyStateTitle}>No Eye Prescription Added</Text>
              <Text style={styles.rxEmptyStateSub}>
                Tap "+ Add Eye Prescription" above to enter optical power details (OD/OS, SPH, CYL, Axis)
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Refraction Matrix Table */}
              <View style={styles.rxTableContainer}>
            {/* Table Header Row */}
            <View style={styles.rxTableHeaderRow}>
              <Text style={[styles.rxHeadCell, { flex: 1.4 }]}>Eye</Text>
              <Text style={[styles.rxHeadCell, { flex: 1 }]}>SPH</Text>
              <Text style={[styles.rxHeadCell, { flex: 1 }]}>CYL</Text>
              <Text style={[styles.rxHeadCell, { flex: 1 }]}>Axis</Text>
              <Text style={[styles.rxHeadCell, { flex: 1 }]}>Add</Text>
              <Text style={[styles.rxHeadCell, { flex: 1 }]}>PD (mm)</Text>
            </View>

            {/* Row 1: Right (OD) */}
            <View style={styles.rxTableRow}>
              <Text style={[styles.rxEyeLabel, { flex: 1.4 }]}>Right (OD)</Text>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={odSph}
                  onChangeText={setOdSph}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={odCyl}
                  onChangeText={setOdCyl}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={odAxis}
                  onChangeText={setOdAxis}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={odAdd}
                  onChangeText={setOdAdd}
                  placeholder="+0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={odPd}
                  onChangeText={setOdPd}
                  placeholder="30"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Row 2: Left (OS) */}
            <View style={styles.rxTableRow}>
              <Text style={[styles.rxEyeLabel, { flex: 1.4 }]}>Left (OS)</Text>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={osSph}
                  onChangeText={setOsSph}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={osCyl}
                  onChangeText={setOsCyl}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={osAxis}
                  onChangeText={setOsAxis}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={osAdd}
                  onChangeText={setOsAdd}
                  placeholder="+0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.rxCellBox, { flex: 1 }]}>
                <TextInput
                  style={styles.rxInput}
                  value={osPd}
                  onChangeText={setOsPd}
                  placeholder="31"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Dropdowns & Dates Row */}
          <View style={[styles.twoColRow, { marginTop: 12 }]}>
            {/* Prescription Type */}
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Prescription Type</Text>
              <TouchableOpacity
                style={styles.dropdownInputContainer}
                onPress={() =>
                  Alert.alert('Prescription Type', 'Select Type:', [
                    { text: 'Single Vision', onPress: () => setRxType('Single Vision') },
                    { text: 'Bifocal', onPress: () => setRxType('Bifocal') },
                    { text: 'Progressive', onPress: () => setRxType('Progressive') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>{rxType}</Text>
                <ChevronDown size={17} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Prescription Date */}
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Prescription Date</Text>
              <View style={styles.iconInputContainer}>
                <Calendar size={18} color="#475569" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.innerTextInput}
                  value={rxDate}
                  onChangeText={setRxDate}
                  placeholder="DD MMM YYYY"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

          {/* Valid Till & Notes */}
          <View style={{ marginTop: 12 }}>
            <Text style={styles.inputLabel}>Valid Till (Optional)</Text>
            <View style={styles.iconInputContainer}>
              <Calendar size={18} color="#475569" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.innerTextInput}
                value={validTill}
                onChangeText={setValidTill}
                placeholder="DD MMM YYYY (e.g. 1 Year validity)"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Notes (Optional) */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={rxNotes}
              onChangeText={setRxNotes}
              placeholder="e.g. Customer prefers anti-glare and blue cut lenses."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
            />
          </View>
            </>
          )}
        </View>

        {/* ========================================================= */}
        {/* SECTION 3: Additional Information */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          {/* Header */}
          <View style={styles.sectionTitleLeft}>
            <FileText size={18} color="#064E3B" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>Additional Information</Text>
          </View>

          {/* 3 Dropdowns Row: Customer Type + Customer Source + Preferred Brand */}
          <View style={[styles.twoColRow, { marginTop: 12 }]}>
            {/* Customer Type */}
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Customer Type</Text>
              <TouchableOpacity
                style={styles.dropdownInputContainer}
                onPress={() =>
                  Alert.alert('Customer Type', 'Select Type:', [
                    { text: 'Regular', onPress: () => setCustomerType('Regular') },
                    { text: 'Corporate', onPress: () => setCustomerType('Corporate') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>{customerType}</Text>
                <ChevronDown size={17} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Customer Source */}
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Customer Source</Text>
              <TouchableOpacity
                style={styles.dropdownInputContainer}
                onPress={() =>
                  Alert.alert('Customer Source', 'Select Source:', [
                    { text: 'Walk-in', onPress: () => setCustomerSource('Walk-in') },
                    { text: 'Referral', onPress: () => setCustomerSource('Referral') },
                    { text: 'Doctor Prescription', onPress: () => setCustomerSource('Doctor Prescription') },
                    { text: 'Online / Social', onPress: () => setCustomerSource('Online / Social') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>{customerSource}</Text>
                <ChevronDown size={17} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.twoColRow, { marginTop: 12 }]}>
            {/* Preferred Brand */}
            <View style={styles.colItem}>
              <Text style={styles.inputLabel}>Preferred Brand (Optional)</Text>
              <TouchableOpacity
                style={styles.dropdownInputContainer}
                onPress={() =>
                  Alert.alert('Preferred Brand', 'Select Brand:', [
                    { text: 'Ray-Ban', onPress: () => setPreferredBrand('Ray-Ban') },
                    { text: 'Oakley', onPress: () => setPreferredBrand('Oakley') },
                    { text: 'Titan', onPress: () => setPreferredBrand('Titan') },
                    { text: 'Vogue', onPress: () => setPreferredBrand('Vogue') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>{preferredBrand || 'Select Brand'}</Text>
                <ChevronDown size={17} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Split Row: Remarks & Notifications */}
          <View style={styles.remarksNotificationSection}>
            {/* Remarks (Optional) */}
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.inputLabel}>Remarks (Optional)</Text>
              <TextInput
                style={styles.textArea}
                value={remarks}
                onChangeText={setRemarks}
                placeholder="Regular customer. Prefers lightweight frames, progressive lens user..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Notifications Box */}
            <View style={styles.notificationsBox}>
              <View style={styles.notificationsTitleRow}>
                <Bell size={18} color="#064E3B" />
                <Text style={styles.notificationsHeading}>Customer Communication & Notifications</Text>
              </View>

              <View style={styles.notificationsOptionsRow}>
                {/* WhatsApp Checkbox */}
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setSendWhatsApp(!sendWhatsApp)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxSquare,
                      sendWhatsApp && styles.checkboxSquareChecked,
                    ]}
                  >
                    {sendWhatsApp && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Send WhatsApp invoices & reminders</Text>
                </TouchableOpacity>

                {/* SMS Checkbox */}
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setSendSms(!sendSms)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxSquare,
                      sendSms && styles.checkboxSquareChecked,
                    ]}
                  >
                    {sendSms && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Send SMS status updates</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Space above bottom sticky bar */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.saveDraftBtn}
          onPress={handleSaveDraft}
          activeOpacity={0.8}
        >
          <Text style={styles.saveDraftText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveCustomerBtn}
          onPress={handleSaveCustomer}
          activeOpacity={0.85}
        >
          <Save size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.saveCustomerText}>Save Customer</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 1,
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
    padding: 16,
    gap: 16,
  },

  /* Section Card */
  sectionCard: {
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Tier Pills (Regular, VIP, New) */
  tierPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  tierPillActiveRegular: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  tierPillActiveVip: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  tierPillActiveNew: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tierTextActive: {
    color: '#FFFFFF',
  },

  /* Photo & Header Section */
  photoContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addPhotoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    marginRight: 14,
  },
  addPhotoLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 2,
  },
  photoHelperTextBox: {
    flex: 1,
  },
  photoHelperTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  photoHelperSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },

  /* 2-Column Responsive Layout */
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  colItem: {
    flex: 1,
  },
  addressSection: {
    marginBottom: 4,
  },

  /* Labels & Inputs - Increased Size & Spacing */
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: '#EF4444',
    fontSize: 13,
  },
  textInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
  },
  iconInputContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  dropdownInputContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  textArea: {
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
  },

  /* Eye Prescription Table - Enhanced for readability */
  addPrevRxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  addPrevRxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
  },
  rxTableContainer: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  rxTableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  rxHeadCell: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  rxTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rxEyeLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  rxCellBox: {
    marginHorizontal: 3,
  },
  rxInput: {
    height: 40,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    paddingVertical: 0,
  },
  rxEmptyStateBox: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: 8,
  },
  rxEmptyStateTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#334155',
    marginTop: 8,
  },
  rxEmptyStateSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 340,
  },

  /* Remarks & Notifications Section */
  remarksNotificationSection: {
    marginTop: 4,
  },
  notificationsBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 14,
  },
  notificationsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notificationsHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  notificationsOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  checkboxSquareChecked: {
    backgroundColor: '#059669',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 14,
  },
  saveDraftBtn: {
    flex: 1,
    height: 50,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  saveCustomerBtn: {
    flex: 1.6,
    height: 50,
    backgroundColor: '#064E3B',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveCustomerText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
