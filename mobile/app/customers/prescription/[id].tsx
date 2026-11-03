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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Rect,
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Glasses,
  FileText,
  Clock,
  PlusCircle,
  ChevronDown,
  Pencil,
  Trash2,
  Save,
  Check,
  Phone,
  Mail,
  MapPin,
  Home,
  ShoppingCart,
  Package,
  Users,
  MoreHorizontal,
} from 'lucide-react-native';
import { mockCustomers } from '../../../src/data/mockCustomers';
import { cartManager } from '../../../src/store/cartStore';

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
 * High Definition Stylized Human Eye SVG Illustration
 */
function HumanEyeVisual({ side }: { side: 'right' | 'left' }) {
  return (
    <Svg width={96} height={56} viewBox="0 0 100 60" fill="none">
      <Defs>
        <RadialGradient id={`iris-${side}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#1E3A8A" />
          <Stop offset="40%" stopColor="#2563EB" />
          <Stop offset="75%" stopColor="#38BDF8" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </RadialGradient>
        <LinearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FED7AA" />
          <Stop offset="100%" stopColor="#FDBA74" />
        </LinearGradient>
      </Defs>

      {/* Surrounding Eyelid skin */}
      <Path
        d="M2 30 C15 10, 85 10, 98 30 C85 50, 15 50, 2 30 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* Upper Crease */}
      <Path
        d="M10 22 C30 8, 70 8, 90 22"
        stroke="#FDBA74"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sclera Blood vessels (subtle) */}
      <Path d="M12 28 C18 29, 24 27, 28 28" stroke="#FECACA" strokeWidth="1" strokeLinecap="round" />
      <Path d="M88 28 C82 29, 76 27, 72 28" stroke="#FECACA" strokeWidth="1" strokeLinecap="round" />

      {/* Iris */}
      <Circle cx="50" cy="30" r="17" fill={`url(#iris-${side})`} />

      {/* Iris fine radial lines */}
      <Circle cx="50" cy="30" r="14" stroke="#60A5FA" strokeWidth="0.8" opacity={0.6} />

      {/* Pupil */}
      <Circle cx="50" cy="30" r="7.5" fill="#0F172A" />

      {/* Highlights / Cornea light reflection */}
      <Circle cx="45" cy="25" r="3.2" fill="#FFFFFF" />
      <Circle cx="54" cy="34" r="1.5" fill="#FFFFFF" opacity={0.8} />

      {/* Upper Eyelashes */}
      <Path
        d="M4 30 C20 12, 80 12, 96 30"
        stroke="#78350F"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Lower Eyelashes */}
      <Path
        d="M6 31 C22 46, 78 46, 94 31"
        stroke="#B45309"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Recommended Lens Visuals
 */
function LensProductVisual({ type }: { type: string }) {
  if (type === 'progressive') {
    return (
      <Svg width={46} height={40} viewBox="0 0 54 48" fill="none">
        <Circle cx="27" cy="24" r="18" stroke="#2563EB" strokeWidth="2.2" fill="#EFF6FF" />
        <Circle cx="27" cy="20" r="8" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="3,2" />
        <Circle cx="27" cy="30" r="5" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="2,2" />
        <Path d="M15 16 C18 13, 36 13, 39 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'blue-cut') {
    return (
      <Svg width={46} height={36} viewBox="0 0 60 40" fill="none">
        <Rect x="5" y="8" width="22" height="20" rx="5" stroke="#2563EB" strokeWidth="2.4" fill="#DBEAFE" />
        <Path d="M27 15 C30 12, 34 12, 37 15" stroke="#2563EB" strokeWidth="2.4" />
        <Rect x="37" y="8" width="22" height="20" rx="5" stroke="#2563EB" strokeWidth="2.4" fill="#DBEAFE" />
        <Path d="M10 14 C14 11, 20 11, 24 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'anti-glare') {
    return (
      <Svg width={46} height={40} viewBox="0 0 54 48" fill="none">
        <Circle cx="27" cy="24" r="18" stroke="#059669" strokeWidth="2.2" fill="#ECFDF5" />
        <Path d="M15 16 C18 13, 36 13, 39 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M20 22 C24 19, 32 19, 36 22" stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    );
  }

  // Photochromic transition
  return (
    <Svg width={48} height={40} viewBox="0 0 58 48" fill="none">
      {/* Light lens */}
      <Circle cx="22" cy="24" r="16" stroke="#64748B" strokeWidth="2" fill="#F1F5F9" />
      {/* Dark lens overlapping */}
      <Circle cx="36" cy="24" r="16" stroke="#1E293B" strokeWidth="2" fill="#334155" />
      <Path d="M26 16 C30 13, 42 13, 46 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}

export default function EyePrescriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const customer =
    mockCustomers.find((c) => c.id === id) || mockCustomers[0];

  const [activeMode, setActiveMode] = useState<'new' | 'history'>('new');

  // Form Fields matching screenshot
  const [rxDate, setRxDate] = useState('28 Oct 2026');

  // Refraction Matrix Table
  const [odSph, setOdSph] = useState('-1.25');
  const [odCyl, setOdCyl] = useState('-0.50');
  const [odAxis, setOdAxis] = useState('180');
  const [odAdd, setOdAdd] = useState('+1.00');
  const [odPd, setOdPd] = useState('30');
  const [odVision, setOdVision] = useState('6/6');

  const [osSph, setOsSph] = useState('-1.50');
  const [osCyl, setOsCyl] = useState('-0.75');
  const [osAxis, setOsAxis] = useState('175');
  const [osAdd, setOsAdd] = useState('+1.00');
  const [osPd, setOsPd] = useState('31');
  const [osVision, setOsVision] = useState('6/6');

  const [rxType, setRxType] = useState('Progressive');
  const [validTill, setValidTill] = useState('28 Oct 2028');
  const [doctorName, setDoctorName] = useState('Dr. R. Mehta');
  const [notes, setNotes] = useState(
    'Customer prefers anti-glare, blue cut lenses. Suitable for daily office use.'
  );

  const handleClear = () => {
    setOdSph('');
    setOdCyl('');
    setOdAxis('');
    setOdAdd('');
    setOdPd('');
    setOsSph('');
    setOsCyl('');
    setOsAxis('');
    setOsAdd('');
    setOsPd('');
    setNotes('');
  };

  const handleSavePrescription = () => {
    Alert.alert(
      'Prescription Saved',
      `New optical prescription for ${customer.name} has been saved and linked to customer profile!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
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
              <Text style={styles.headerTitle}>Eye Prescription</Text>
              <Text style={styles.headerSubtitle}>
                Manage customer eye prescriptions
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

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* 1. TOP CUSTOMER SUMMARY CARD */}
        {/* ========================================================= */}
        <View style={styles.customerCard}>
          <View style={styles.customerCardLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AS</Text>
            </View>

            <View style={styles.customerMeta}>
              <View style={styles.nameRow}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <View style={styles.regularPill}>
                  <Text style={styles.regularPillText}>Regular Customer</Text>
                </View>
              </View>

              <View style={styles.infoLine}>
                <Phone size={11} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.infoLineText}>{customer.phone}</Text>
              </View>

              <View style={styles.infoLine}>
                <Mail size={11} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.infoLineText}>{customer.email || 'amit@email.com'}</Text>
              </View>

              <View style={styles.infoLine}>
                <MapPin size={11} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.infoLineText}>{customer.address || 'Vijay Nagar, Indore, MP'}</Text>
              </View>
            </View>
          </View>

          {/* Right: DOB & Last Visit */}
          <View style={styles.customerCardRight}>
            <View style={styles.dateBlock}>
              <Calendar size={13} color="#475569" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.dateLabel}>Date of Birth</Text>
                <Text style={styles.dateVal}>15 Mar 1998 (28 yrs)</Text>
              </View>
            </View>

            <View style={[styles.dateBlock, { marginTop: 8 }]}>
              <Glasses size={13} color="#475569" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.dateLabel}>Last Visit</Text>
                <Text style={styles.dateVal}>28 Oct 2026</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. MODE BUTTONS: + New Prescription | Prescription History */}
        {/* ========================================================= */}
        <View style={styles.modeButtonsRow}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              activeMode === 'new' ? styles.modeBtnActive : styles.modeBtnInactive,
            ]}
            onPress={() => setActiveMode('new')}
            activeOpacity={0.85}
          >
            <PlusCircle
              size={15}
              color={activeMode === 'new' ? '#FFFFFF' : '#475569'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.modeBtnText,
                activeMode === 'new' && styles.modeBtnTextActive,
              ]}
            >
              New Prescription
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeBtn,
              activeMode === 'history' ? styles.modeBtnActive : styles.modeBtnInactive,
            ]}
            onPress={() => setActiveMode('history')}
            activeOpacity={0.85}
          >
            <FileText
              size={15}
              color={activeMode === 'history' ? '#FFFFFF' : '#475569'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.modeBtnText,
                activeMode === 'history' && styles.modeBtnTextActive,
              ]}
            >
              Prescription History
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* 3. ADD NEW PRESCRIPTION SECTION */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          {/* Header Row: Title & Prescription Date */}
          <View style={styles.sectionHeaderBetween}>
            <View style={styles.sectionTitleLeft}>
              <Eye size={18} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>Add New Prescription</Text>
            </View>

            <View style={styles.rxDateBox}>
              <Text style={styles.rxDateLabel}>
                Prescription Date <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <View style={styles.dateInputWrapper}>
                <Calendar size={14} color="#475569" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.dateInput}
                  value={rxDate}
                  onChangeText={setRxDate}
                  placeholder="DD MMM YYYY"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

          {/* Refraction Table Matrix */}
          <View style={styles.rxTable}>
            {/* Headers */}
            <View style={styles.rxHeaderRow}>
              <Text style={[styles.rxHeadCell, { flex: 1.4 }]}>Eye</Text>
              <Text style={[styles.rxHeadCell, { flex: 1.1 }]}>
                SPH{'\n'}<Text style={styles.rxSubHead}>(Sphere)</Text>
              </Text>
              <Text style={[styles.rxHeadCell, { flex: 1.1 }]}>
                CYL{'\n'}<Text style={styles.rxSubHead}>(Cylinder)</Text>
              </Text>
              <Text style={[styles.rxHeadCell, { flex: 1.1 }]}>
                Axis{'\n'}<Text style={styles.rxSubHead}>(Degree)</Text>
              </Text>
              <Text style={[styles.rxHeadCell, { flex: 1.1 }]}>
                ADD{'\n'}<Text style={styles.rxSubHead}>(Near)</Text>
              </Text>
              <Text style={[styles.rxHeadCell, { flex: 1.1 }]}>
                PD (mm)
              </Text>
              <Text style={[styles.rxHeadCell, { flex: 1.2 }]}>
                Vision
              </Text>
            </View>

            {/* Row 1: Right (OD) */}
            <View style={styles.rxDataRow}>
              <Text style={[styles.rxEyeLabel, { flex: 1.4 }]}>Right (OD)</Text>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={odSph}
                  onChangeText={setOdSph}
                  placeholder="-0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={odCyl}
                  onChangeText={setOdCyl}
                  placeholder="-0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={odAxis}
                  onChangeText={setOdAxis}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={odAdd}
                  onChangeText={setOdAdd}
                  placeholder="+0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={odPd}
                  onChangeText={setOdPd}
                  placeholder="30"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                style={[styles.visionSelectBox, { flex: 1.2 }]}
                onPress={() =>
                  Alert.alert('Vision', 'Select Right Eye Acuity:', [
                    { text: '6/6', onPress: () => setOdVision('6/6') },
                    { text: '6/9', onPress: () => setOdVision('6/9') },
                    { text: '6/12', onPress: () => setOdVision('6/12') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.visionText}>{odVision}</Text>
                <ChevronDown size={12} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Row 2: Left (OS) */}
            <View style={styles.rxDataRow}>
              <Text style={[styles.rxEyeLabel, { flex: 1.4 }]}>Left (OS)</Text>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={osSph}
                  onChangeText={setOsSph}
                  placeholder="-0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={osCyl}
                  onChangeText={setOsCyl}
                  placeholder="-0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={osAxis}
                  onChangeText={setOsAxis}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={osAdd}
                  onChangeText={setOsAdd}
                  placeholder="+0.00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.rxInputBox, { flex: 1.1 }]}>
                <TextInput
                  style={styles.cellInput}
                  value={osPd}
                  onChangeText={setOsPd}
                  placeholder="31"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                style={[styles.visionSelectBox, { flex: 1.2 }]}
                onPress={() =>
                  Alert.alert('Vision', 'Select Left Eye Acuity:', [
                    { text: '6/6', onPress: () => setOsVision('6/6') },
                    { text: '6/9', onPress: () => setOsVision('6/9') },
                    { text: '6/12', onPress: () => setOsVision('6/12') },
                  ])
                }
                activeOpacity={0.8}
              >
                <Text style={styles.visionText}>{osVision}</Text>
                <ChevronDown size={12} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3 Columns Row: Prescription Type + Valid Till + Doctor/Optometrist */}
          <View style={styles.formThreeColRow}>
            {/* Prescription Type */}
            <View style={styles.threeColItem}>
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
                <ChevronDown size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Valid Till */}
            <View style={styles.threeColItem}>
              <Text style={styles.inputLabel}>Valid Till</Text>
              <View style={styles.iconInputContainer}>
                <Calendar size={15} color="#475569" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.innerTextInput}
                  value={validTill}
                  onChangeText={setValidTill}
                  placeholder="DD MMM YYYY"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Doctor / Optometrist */}
            <View style={styles.threeColItem}>
              <Text style={styles.inputLabel}>Doctor / Optometrist (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={doctorName}
                onChangeText={setDoctorName}
                placeholder="Dr. R. Mehta"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Eye Preview Cards & Additional Notes Row */}
          <View style={styles.eyePreviewRow}>
            {/* Right Eye Card */}
            <View style={[styles.eyeCard, { backgroundColor: '#F0F9FF' }]}>
              <HumanEyeVisual side="right" />
              <View style={styles.eyeTextColumn}>
                <Text style={[styles.eyeCardTitle, { color: '#0369A1' }]}>
                  Right Eye (OD)
                </Text>
                <Text style={styles.eyeCardDetail}>SPH: {odSph}</Text>
                <Text style={styles.eyeCardDetail}>CYL: {odCyl}</Text>
                <Text style={styles.eyeCardDetail}>Axis: {odAxis}</Text>
                <Text style={styles.eyeCardDetail}>ADD: {odAdd}</Text>
                <Text style={styles.eyeCardDetail}>PD: {odPd}</Text>
              </View>
            </View>

            {/* Left Eye Card */}
            <View style={[styles.eyeCard, { backgroundColor: '#FFF1F2' }]}>
              <HumanEyeVisual side="left" />
              <View style={styles.eyeTextColumn}>
                <Text style={[styles.eyeCardTitle, { color: '#BE123C' }]}>
                  Left Eye (OS)
                </Text>
                <Text style={styles.eyeCardDetail}>SPH: {osSph}</Text>
                <Text style={styles.eyeCardDetail}>CYL: {osCyl}</Text>
                <Text style={styles.eyeCardDetail}>Axis: {osAxis}</Text>
                <Text style={styles.eyeCardDetail}>ADD: {osAdd}</Text>
                <Text style={styles.eyeCardDetail}>PD: {osPd}</Text>
              </View>
            </View>

            {/* Additional Notes Box */}
            <View style={styles.additionalNotesBox}>
              <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.notesTextArea}
                value={notes}
                onChangeText={setNotes}
                placeholder="Customer prefers anti-glare, blue cut lenses. Suitable for daily office use."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. RECOMMENDED PRODUCTS SECTION */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderBetween}>
            <View style={styles.sectionTitleLeft}>
              <Glasses size={18} color="#064E3B" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>Recommended Products</Text>
            </View>

            <TouchableOpacity
              style={styles.suggestBtn}
              onPress={() =>
                Alert.alert(
                  'AI Lens Suggestion',
                  'Based on SPH -1.50 and Progressive requirement, High Index 1.60 Blue Shield is ideal.'
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.suggestBtnText}>Suggest Lenses</Text>
            </TouchableOpacity>
          </View>

          {/* 4 Cards Row */}
          <View style={styles.productsGridRow}>
            {/* Card 1: Progressive Lenses */}
            <TouchableOpacity
              style={styles.lensCard}
              onPress={() => router.push('/(tabs)/pos')}
              activeOpacity={0.8}
            >
              <LensProductVisual type="progressive" />
              <Text style={styles.lensTitle} numberOfLines={1}>
                Progressive Lenses
              </Text>
              <Text style={styles.lensPrice}>₹6,800</Text>
              <View style={[styles.lensTag, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.lensTagText, { color: '#059669' }]}>
                  Recommended
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 2: Blue Cut Lenses */}
            <TouchableOpacity
              style={styles.lensCard}
              onPress={() => router.push('/(tabs)/pos')}
              activeOpacity={0.8}
            >
              <LensProductVisual type="blue-cut" />
              <Text style={styles.lensTitle} numberOfLines={1}>
                Blue Cut Lenses
              </Text>
              <Text style={styles.lensPrice}>₹3,500</Text>
              <View style={[styles.lensTag, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.lensTagText, { color: '#2563EB' }]}>
                  Popular
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 3: Anti-Glare Coating */}
            <TouchableOpacity
              style={styles.lensCard}
              onPress={() => router.push('/(tabs)/pos')}
              activeOpacity={0.8}
            >
              <LensProductVisual type="anti-glare" />
              <Text style={styles.lensTitle} numberOfLines={1}>
                Anti-Glare Coating
              </Text>
              <Text style={styles.lensPrice}>₹1,200</Text>
              <View style={[styles.lensTag, { backgroundColor: '#FFFBEB' }]}>
                <Text style={[styles.lensTagText, { color: '#D97706' }]}>
                  Add-on
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card 4: Photochromic Lenses */}
            <TouchableOpacity
              style={styles.lensCard}
              onPress={() => router.push('/(tabs)/pos')}
              activeOpacity={0.8}
            >
              <LensProductVisual type="photochromic" />
              <Text style={styles.lensTitle} numberOfLines={1}>
                Photochromic Lenses
              </Text>
              <Text style={styles.lensPrice}>₹7,500</Text>
              <View style={[styles.lensTag, { backgroundColor: '#FAF5FF' }]}>
                <Text style={[styles.lensTagText, { color: '#9333EA' }]}>
                  Premium
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 5. PREVIOUS PRESCRIPTIONS TABLE */}
        {/* ========================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleLeft}>
            <Clock size={18} color="#064E3B" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>Previous Prescriptions</Text>
          </View>

          {/* Table */}
          <View style={styles.prevTableContainer}>
            <View style={styles.prevHeadRow}>
              <Text style={[styles.prevHeadCell, { flex: 1.1 }]}>Date</Text>
              <Text style={[styles.prevHeadCell, { flex: 1.1 }]}>Type</Text>
              <Text style={[styles.prevHeadCell, { flex: 1.5 }]}>Right Eye (OD)</Text>
              <Text style={[styles.prevHeadCell, { flex: 1.5 }]}>Left Eye (OS)</Text>
              <Text style={[styles.prevHeadCell, { flex: 1.1 }]}>Valid Till</Text>
              <Text style={[styles.prevHeadCell, { flex: 1.1 }]}>Added By</Text>
              <Text style={[styles.prevHeadCell, { flex: 1.1, textAlign: 'center' }]}>
                Actions
              </Text>
            </View>

            {/* Rows */}
            {[
              {
                date: '28 Oct 2026',
                type: 'Progressive',
                od: '-1.25 / -0.50 / 180',
                os: '-1.50 / -0.75 / 175',
                valid: '28 Oct 2028',
                by: 'Staff: Admin',
              },
              {
                date: '12 Aug 2025',
                type: 'Single Vision',
                od: '-1.00 / -0.50 / 180',
                os: '-1.25 / -0.50 / 170',
                valid: '12 Aug 2027',
                by: 'Dr. R. Mehta',
              },
              {
                date: '20 Jan 2024',
                type: 'Single Vision',
                od: '-0.75 / -0.25 / 180',
                os: '-1.00 / -0.50 / 170',
                valid: '20 Jan 2026',
                by: 'Staff: Priya',
              },
            ].map((p, idx) => (
              <View
                key={p.date}
                style={[
                  styles.prevDataRow,
                  idx === 2 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={[styles.prevCell, { flex: 1.1 }]}>{p.date}</Text>
                <Text style={[styles.prevCell, { flex: 1.1 }]}>{p.type}</Text>
                <Text style={[styles.prevCellBold, { flex: 1.5 }]}>{p.od}</Text>
                <Text style={[styles.prevCellBold, { flex: 1.5 }]}>{p.os}</Text>
                <Text style={[styles.prevCell, { flex: 1.1 }]}>{p.valid}</Text>
                <Text style={[styles.prevCell, { flex: 1.1 }]}>{p.by}</Text>
                <View style={[styles.prevActionsRow, { flex: 1.1 }]}>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('View Rx', `${p.type}\nOD: ${p.od}\nOS: ${p.os}`)}
                  >
                    <Eye size={12} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('Edit Rx', `Edit prescription of ${p.date}`)}
                  >
                    <Pencil size={12} color="#059669" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => Alert.alert('Delete', 'Delete historical prescription?')}
                  >
                    <Trash2 size={12} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Space above bottom sticky bar */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.saveDraftBtn}
          onPress={() => {
            Alert.alert('Draft Saved', 'Prescription draft saved successfully.');
            router.back();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.saveDraftText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClear}
          activeOpacity={0.8}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.savePrescriptionBtn}
          onPress={handleSavePrescription}
          activeOpacity={0.85}
        >
          <Save size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.savePrescriptionText}>Save Prescription</Text>
        </TouchableOpacity>
      </View>

      {/* Persistent Bottom Tab Bar */}
      <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/dashboard')}
          activeOpacity={0.7}
        >
          <Home size={20} color="#64748B" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/pos')}
          activeOpacity={0.7}
        >
          <ShoppingCart size={20} color="#64748B" />
          <Text style={styles.tabLabel}>POS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.7}
        >
          <Package size={20} color="#64748B" />
          <Text style={styles.tabLabel}>Products</Text>
        </TouchableOpacity>

        {/* Active Customers Tab */}
        <TouchableOpacity
          style={styles.tabItemActivePill}
          onPress={() => router.push('/(tabs)/customers')}
          activeOpacity={0.7}
        >
          <Users size={20} color="#064E3B" />
          <Text style={styles.tabLabelActive}>Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/orders')}
          activeOpacity={0.7}
        >
          <FileText size={20} color="#64748B" />
          <Text style={styles.tabLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.7}
        >
          <MoreHorizontal size={20} color="#64748B" />
          <Text style={styles.tabLabel}>More</Text>
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

  /* Scroll Content */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },

  /* 1. Customer Summary Card */
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  customerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  customerMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  regularPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  regularPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  infoLineText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  customerCardRight: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 12,
    justifyContent: 'center',
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  dateVal: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* 2. Mode Buttons */
  modeButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#064E3B',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  modeBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  rxDateBox: {
    alignItems: 'flex-end',
  },
  rxDateLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  dateInputWrapper: {
    height: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '700',
    paddingVertical: 0,
  },

  /* Refraction Table Matrix */
  rxTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  rxHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rxHeadCell: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  rxSubHead: {
    fontSize: 8.5,
    fontWeight: '500',
    color: '#64748B',
  },
  rxDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rxEyeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  rxInputBox: {
    marginHorizontal: 3,
  },
  cellInput: {
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    paddingVertical: 0,
  },
  visionSelectBox: {
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginHorizontal: 3,
  },
  visionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* 3 Col Form */
  formThreeColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  threeColItem: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  dropdownInputContainer: {
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  iconInputContainer: {
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerTextInput: {
    flex: 1,
    fontSize: 11.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  textInput: {
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 11.5,
    color: '#0F172A',
  },

  /* Eye Preview Cards & Notes */
  eyePreviewRow: {
    flexDirection: 'row',
    gap: 10,
  },
  eyeCard: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  eyeTextColumn: {
    alignItems: 'center',
    marginTop: 4,
  },
  eyeCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  eyeCardDetail: {
    fontSize: 9.5,
    color: '#334155',
    fontWeight: '600',
    lineHeight: 14,
  },
  additionalNotesBox: {
    flex: 1.2,
  },
  notesTextArea: {
    minHeight: 108,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 8,
    fontSize: 11,
    color: '#0F172A',
    textAlignVertical: 'top',
  },

  /* Recommended Products */
  suggestBtn: {
    borderWidth: 1,
    borderColor: '#064E3B',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  suggestBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064E3B',
  },
  productsGridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  lensCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  lensTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
    textAlign: 'center',
  },
  lensPrice: {
    fontSize: 11,
    fontWeight: '900',
    color: '#064E3B',
    marginTop: 2,
    marginBottom: 4,
  },
  lensTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lensTagText: {
    fontSize: 8.5,
    fontWeight: '800',
  },

  /* Previous Prescriptions */
  prevTableContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  prevHeadRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  prevHeadCell: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  prevDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  prevCell: {
    fontSize: 9.5,
    color: '#475569',
  },
  prevCellBold: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  prevActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  actionIconBtn: {
    padding: 3,
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  saveDraftBtn: {
    flex: 1,
    height: 42,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  clearBtn: {
    flex: 0.8,
    height: 42,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  savePrescriptionBtn: {
    flex: 1.4,
    height: 42,
    backgroundColor: '#064E3B',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePrescriptionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Bottom Tab Bar */
  bottomTabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabItemActivePill: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tabLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontSize: 9.5,
    color: '#064E3B',
    marginTop: 2,
    fontWeight: '800',
  },
});
