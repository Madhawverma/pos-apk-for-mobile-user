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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Calendar,
  Package,
  Plus,
  MinusCircle,
  AlertTriangle,
  FileText,
  Link as LinkIcon,
  Bell,
  Check,
  Maximize2,
  Clock,
  Home,
  ShoppingCart,
  Users,
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
 * High Detail Hero Eyewear Visual for Product Preview
 */
function HeroProductVisual({ colorIdx = 0 }: { colorIdx?: number }) {
  const frameColor = colorIdx === 0 ? '#0F172A' : colorIdx === 1 ? '#78350F' : colorIdx === 2 ? '#64748B' : '#1E293B';
  const fillColor = colorIdx === 0 ? '#F8FAFC' : colorIdx === 1 ? '#FEF3C7' : colorIdx === 2 ? '#F1F5F9' : '#0F172A';

  return (
    <Svg width={180} height={70} viewBox="0 0 180 70" fill="none">
      {/* Left Rim */}
      <Rect
        x="12"
        y="10"
        width="66"
        height="48"
        rx="14"
        stroke={frameColor}
        strokeWidth="6"
        fill={fillColor}
      />
      {/* Left Lens Glare */}
      <Path
        d="M26 22 C32 16, 52 16, 62 22"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Bridge */}
      <Path
        d="M78 24 C84 18, 96 18, 102 24"
        stroke={frameColor}
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Right Rim */}
      <Rect
        x="102"
        y="10"
        width="66"
        height="48"
        rx="14"
        stroke={frameColor}
        strokeWidth="6"
        fill={fillColor}
      />
      {/* Right Lens Glare */}
      <Path
        d="M116 22 C122 16, 142 16, 152 22"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Temples / Arms */}
      <Path
        d="M12 22 L2 20 C0 20, 0 24, 2 24 L12 24"
        stroke={frameColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Path
        d="M168 22 L178 20 C180 20, 180 24, 178 24 L168 24"
        stroke={frameColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Small Product Thumbnail
 */
function SmallFrameVisual({ colorIdx = 0 }: { colorIdx?: number }) {
  const frameColor = colorIdx === 0 ? '#0F172A' : colorIdx === 1 ? '#78350F' : colorIdx === 2 ? '#64748B' : '#1E293B';
  const fillColor = colorIdx === 0 ? '#F8FAFC' : colorIdx === 1 ? '#FEF3C7' : colorIdx === 2 ? '#F1F5F9' : '#0F172A';

  return (
    <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
      <Rect x="3" y="3" width="25" height="22" rx="6" stroke={frameColor} strokeWidth="2.8" fill={fillColor} />
      <Path d="M28 8 C30 6, 34 6, 36 8" stroke={frameColor} strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="36" y="3" width="25" height="22" rx="6" stroke={frameColor} strokeWidth="2.8" fill={fillColor} />
      <Path d="M3 8 L0 8" stroke={frameColor} strokeWidth="2.8" />
      <Path d="M61 8 L64 8" stroke={frameColor} strokeWidth="2.8" />
    </Svg>
  );
}

/**
 * Barcode Vector Graphic
 */
function BarcodeVisual() {
  return (
    <Svg width={110} height={20} viewBox="0 0 110 20" fill="none">
      <Rect x="0" y="0" width="3" height="20" fill="#0F172A" />
      <Rect x="5" y="0" width="1.5" height="20" fill="#0F172A" />
      <Rect x="8" y="0" width="4" height="20" fill="#0F172A" />
      <Rect x="14" y="0" width="2" height="20" fill="#0F172A" />
      <Rect x="18" y="0" width="3" height="20" fill="#0F172A" />
      <Rect x="23" y="0" width="1" height="20" fill="#0F172A" />
      <Rect x="26" y="0" width="4" height="20" fill="#0F172A" />
      <Rect x="32" y="0" width="2.5" height="20" fill="#0F172A" />
      <Rect x="37" y="0" width="1.5" height="20" fill="#0F172A" />
      <Rect x="41" y="0" width="3.5" height="20" fill="#0F172A" />
      <Rect x="47" y="0" width="2" height="20" fill="#0F172A" />
      <Rect x="51" y="0" width="4" height="20" fill="#0F172A" />
      <Rect x="57" y="0" width="1.5" height="20" fill="#0F172A" />
      <Rect x="60" y="0" width="3" height="20" fill="#0F172A" />
      <Rect x="65" y="0" width="2" height="20" fill="#0F172A" />
      <Rect x="69" y="0" width="4" height="20" fill="#0F172A" />
      <Rect x="75" y="0" width="1.5" height="20" fill="#0F172A" />
      <Rect x="78" y="0" width="3" height="20" fill="#0F172A" />
      <Rect x="83" y="0" width="2" height="20" fill="#0F172A" />
      <Rect x="87" y="0" width="4" height="20" fill="#0F172A" />
      <Rect x="93" y="0" width="1.5" height="20" fill="#0F172A" />
      <Rect x="96" y="0" width="3.5" height="20" fill="#0F172A" />
      <Rect x="102" y="0" width="2" height="20" fill="#0F172A" />
      <Rect x="106" y="0" width="3" height="20" fill="#0F172A" />
    </Svg>
  );
}

// 5 History Records matching screenshot
const historyRecords = [
  {
    id: 'adj-1',
    date: '28 Oct 2026, 10:30 AM',
    type: 'Add',
    quantity: '+20',
    prevStock: 48,
    newStock: 68,
    reference: 'PI-2026-001',
    by: 'Admin',
    notes: 'Purchase from supplier',
  },
  {
    id: 'adj-2',
    date: '25 Oct 2026, 04:15 PM',
    type: 'Remove',
    quantity: '-2',
    prevStock: 50,
    newStock: 48,
    reference: 'ORD-2026-098',
    by: 'Staff',
    notes: 'Damaged frame',
  },
  {
    id: 'adj-3',
    date: '20 Oct 2026, 11:20 AM',
    type: 'Add',
    quantity: '+10',
    prevStock: 40,
    newStock: 50,
    reference: 'PI-2026-045',
    by: 'Admin',
    notes: 'New stock received',
  },
  {
    id: 'adj-4',
    date: '18 Oct 2026, 03:10 PM',
    type: 'Remove',
    quantity: '-1',
    prevStock: 41,
    newStock: 40,
    reference: 'Sale',
    by: 'Staff',
    notes: 'Sold to customer',
  },
  {
    id: 'adj-5',
    date: '15 Oct 2026, 01:45 PM',
    type: 'Add',
    quantity: '+30',
    prevStock: 11,
    newStock: 41,
    reference: 'PI-2026-032',
    by: 'Admin',
    notes: 'Purchase from supplier',
  },
];

export default function StockAdjustmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State Management
  const currentStock = 48;
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'damage' | 'count'>('add');
  const [quantity, setQuantity] = useState<number>(20);
  const [reason, setReason] = useState('Purchase from Supplier');
  const [invoiceNo, setInvoiceNo] = useState('PI-2026-001');
  const [supplierName, setSupplierName] = useState('Lenskart Distributors');
  const [purchaseDate, setPurchaseDate] = useState('28 Oct 2026');
  const [unitPrice, setUnitPrice] = useState('4200');
  const [notes, setNotes] = useState('');
  const [lowStockLimit, setLowStockLimit] = useState('10');
  const [enableAlert, setEnableAlert] = useState(true);
  const [selectedPreviewAngle, setSelectedPreviewAngle] = useState(0);

  // Dynamic Stock Calculation
  let calculatedNewStock = currentStock;
  if (adjustmentType === 'add') {
    calculatedNewStock = currentStock + (quantity || 0);
  } else if (adjustmentType === 'remove' || adjustmentType === 'damage') {
    calculatedNewStock = Math.max(0, currentStock - (quantity || 0));
  } else if (adjustmentType === 'count') {
    calculatedNewStock = quantity || 0;
  }

  const handleUpdateStock = () => {
    Alert.alert(
      'Stock Updated Successfully',
      `Ray-Ban RB2140 stock updated to ${calculatedNewStock} pcs.\nAdjustment: ${
        adjustmentType === 'add' ? '+' : '-'
      }${quantity} pcs.`,
      [
        {
          text: 'View in Stock List',
          onPress: () => router.push('/inventory/stock'),
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
              <Text style={styles.headerTitle}>Stock Adjustment</Text>
              <Text style={styles.headerSubtitle}>
                Add, remove or update stock quantity
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
        {/* 2-Column Responsive Form & Status Area */}
        <View style={styles.twoColRow}>
          {/* Left Column: Form & Inputs */}
          <View style={styles.colFlex}>
            {/* 1. Product Information Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Package size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Product Information</Text>
              </View>

              <View style={styles.productInfoRow}>
                {/* Thumbnail */}
                <View style={styles.productThumbBox}>
                  <SmallFrameVisual colorIdx={0} />
                </View>

                {/* Details */}
                <View style={{ flex: 1 }}>
                  <View style={styles.productNameBadgeRow}>
                    <Text style={styles.productNameText}>Ray-Ban RB2140</Text>
                    <View style={styles.inStockBadge}>
                      <Text style={styles.inStockBadgeText}>In Stock</Text>
                    </View>
                  </View>

                  <Text style={styles.productDescText}>Wayfarer Classic Frame (Black)</Text>

                  <View style={styles.productMetaGrid}>
                    <Text style={styles.productMetaText}>SKU: RB2140-BLK</Text>
                    <Text style={styles.productMetaText}>Brand: Ray-Ban</Text>
                    <Text style={styles.productMetaText}>Category: Frames</Text>
                    <Text style={styles.productMetaText}>Selling Price: ₹5,800</Text>
                  </View>

                  <Text style={styles.currentStockHighlightText}>
                    Current Stock: <Text style={{ color: '#059669' }}>48 pcs</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. Adjustment Type Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Package size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Adjustment Type</Text>
              </View>

              <View style={styles.typeSelectorRow}>
                {/* Type 1: Add Stock */}
                <TouchableOpacity
                  style={[
                    styles.typeTile,
                    adjustmentType === 'add' && styles.typeTileActive,
                  ]}
                  onPress={() => setAdjustmentType('add')}
                  activeOpacity={0.8}
                >
                  <Plus
                    size={15}
                    color={adjustmentType === 'add' ? '#FFFFFF' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.typeTileLabel,
                      adjustmentType === 'add' && styles.typeTileLabelActive,
                    ]}
                  >
                    Add Stock
                  </Text>
                </TouchableOpacity>

                {/* Type 2: Remove Stock */}
                <TouchableOpacity
                  style={[
                    styles.typeTile,
                    adjustmentType === 'remove' && styles.typeTileActive,
                  ]}
                  onPress={() => setAdjustmentType('remove')}
                  activeOpacity={0.8}
                >
                  <MinusCircle
                    size={15}
                    color={adjustmentType === 'remove' ? '#FFFFFF' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.typeTileLabel,
                      adjustmentType === 'remove' && styles.typeTileLabelActive,
                    ]}
                  >
                    Remove Stock
                  </Text>
                </TouchableOpacity>

                {/* Type 3: Damage/Reject */}
                <TouchableOpacity
                  style={[
                    styles.typeTile,
                    adjustmentType === 'damage' && styles.typeTileActive,
                  ]}
                  onPress={() => setAdjustmentType('damage')}
                  activeOpacity={0.8}
                >
                  <AlertTriangle
                    size={15}
                    color={adjustmentType === 'damage' ? '#FFFFFF' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.typeTileLabel,
                      adjustmentType === 'damage' && styles.typeTileLabelActive,
                    ]}
                  >
                    Damage/Reject
                  </Text>
                </TouchableOpacity>

                {/* Type 4: Stock Count */}
                <TouchableOpacity
                  style={[
                    styles.typeTile,
                    adjustmentType === 'count' && styles.typeTileActive,
                  ]}
                  onPress={() => setAdjustmentType('count')}
                  activeOpacity={0.8}
                >
                  <FileText
                    size={15}
                    color={adjustmentType === 'count' ? '#FFFFFF' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.typeTileLabel,
                      adjustmentType === 'count' && styles.typeTileLabelActive,
                    ]}
                  >
                    Stock Count
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Quantity Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Package size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Quantity</Text>
              </View>

              {/* Quantity Input Box */}
              <View style={styles.quantityInputContainer}>
                <TextInput
                  style={styles.quantityInput}
                  value={String(quantity)}
                  onChangeText={(val) => setQuantity(Number(val) || 0)}
                  keyboardType="numeric"
                />
                <View style={styles.unitSuffixBox}>
                  <Text style={styles.unitSuffixText}>pcs</Text>
                </View>
              </View>

              {/* Quick Increment Chips Row */}
              <View style={styles.quickChipsRow}>
                {[1, 5, 10, 50, 100].map((inc) => (
                  <TouchableOpacity
                    key={inc}
                    style={styles.quickChip}
                    onPress={() => setQuantity((prev) => prev + inc)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickChipText}>+{inc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 4. Reason for Adjustment Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FileText size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Reason for Adjustment</Text>
              </View>

              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() =>
                  Alert.alert(
                    'Select Reason',
                    'Choose a reason for stock adjustment',
                    [
                      { text: 'Purchase from Supplier', onPress: () => setReason('Purchase from Supplier') },
                      { text: 'Customer Return', onPress: () => setReason('Customer Return') },
                      { text: 'Inventory Count Reconciliation', onPress: () => setReason('Inventory Count Reconciliation') },
                      { text: 'Damaged in Transit / Lab', onPress: () => setReason('Damaged in Transit / Lab') },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  )
                }
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText}>{reason}</Text>
                <Text style={{ color: '#64748B', fontSize: 12 }}>⌵</Text>
              </TouchableOpacity>
            </View>

            {/* 5. Reference Details (Optional) Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <LinkIcon size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Reference Details (Optional)</Text>
              </View>

              <View style={styles.referenceGrid}>
                {/* Row 1: Invoice No & Supplier Name */}
                <View style={styles.formRowTwoCol}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputFieldLabel}>Purchase Invoice No.</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. PI-2026-001"
                      placeholderTextColor="#94A3B8"
                      value={invoiceNo}
                      onChangeText={setInvoiceNo}
                    />
                  </View>

                  <View style={styles.formCol}>
                    <Text style={styles.inputFieldLabel}>Supplier Name</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. Lenskart Distributors"
                      placeholderTextColor="#94A3B8"
                      value={supplierName}
                      onChangeText={setSupplierName}
                    />
                  </View>
                </View>

                {/* Row 2: Purchase Date & Unit Price */}
                <View style={styles.formRowTwoCol}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputFieldLabel}>Purchase Date</Text>
                    <View style={styles.dateInputBox}>
                      <TextInput
                        style={styles.dateTextInput}
                        value={purchaseDate}
                        onChangeText={setPurchaseDate}
                      />
                      <Calendar size={14} color="#64748B" />
                    </View>
                  </View>

                  <View style={styles.formCol}>
                    <Text style={styles.inputFieldLabel}>Unit Purchase Price (₹)</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="4200"
                      placeholderTextColor="#94A3B8"
                      value={unitPrice}
                      onChangeText={setUnitPrice}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* 6. Notes (Optional) Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FileText size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Notes (Optional)</Text>
              </View>

              <TextInput
                style={styles.notesTextArea}
                placeholder="Add any additional notes..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Bottom Actions Row: Cancel & Update Stock */}
            <View style={styles.actionBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateStockBtn}
                onPress={handleUpdateStock}
                activeOpacity={0.85}
              >
                <FileText size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Text style={styles.updateStockBtnText}>Update Stock</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column: Stock Status, Preview, Details, Low Stock Alert */}
          <View style={styles.colFlex}>
            {/* 1. Current Stock Status Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Package size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Current Stock Status</Text>
              </View>

              <View style={styles.stockStatusTilesRow}>
                {/* Current Stock */}
                <View style={[styles.statusTile, { backgroundColor: '#F8FAFC' }]}>
                  <Text style={styles.statusTileNumber}>{currentStock}</Text>
                  <Text style={styles.statusTileLabel}>Current Stock</Text>
                </View>

                {/* Adjustment Qty */}
                <View style={[styles.statusTile, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.statusTileNumber, { color: '#059669' }]}>
                    {quantity}
                  </Text>
                  <Text style={[styles.statusTileLabel, { color: '#059669' }]}>
                    Adjustment Qty
                  </Text>
                </View>

                {/* New Stock */}
                <View style={[styles.statusTile, { backgroundColor: '#EFF6FF' }]}>
                  <Text style={[styles.statusTileNumber, { color: '#2563EB' }]}>
                    {calculatedNewStock}
                  </Text>
                  <Text style={[styles.statusTileLabel, { color: '#2563EB' }]}>
                    New Stock
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. Product Preview Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderBetween}>
                <View style={styles.cardHeader}>
                  <FileText size={15} color="#064E3B" style={{ marginRight: 6 }} />
                  <Text style={styles.cardTitle}>Product Preview</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Preview', 'Fullscreen Ray-Ban RB2140 Preview')}>
                  <Maximize2 size={13} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Large Glasses Visual */}
              <View style={styles.previewHeroBox}>
                <HeroProductVisual colorIdx={selectedPreviewAngle} />
              </View>

              {/* 4 Thumbnails Row */}
              <View style={styles.previewThumbsRow}>
                {[0, 1, 2, 3].map((idx) => {
                  const isSelected = selectedPreviewAngle === idx;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.previewThumbBox,
                        isSelected && styles.previewThumbBoxActive,
                      ]}
                      onPress={() => setSelectedPreviewAngle(idx)}
                      activeOpacity={0.8}
                    >
                      <SmallFrameVisual colorIdx={idx} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Product Details Table Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Plus size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Product Details</Text>
              </View>

              <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Product Name</Text>
                  <Text style={styles.detailValue}>Ray-Ban RB2140</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Brand</Text>
                  <Text style={styles.detailValue}>Ray-Ban</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>Frames</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>SKU</Text>
                  <Text style={styles.detailValue}>RB2140-BLK</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Barcode</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <BarcodeVisual />
                    <Text style={styles.barcodeDigits}>8901234567890</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Selling Price (₹)</Text>
                  <Text style={styles.detailValue}>5,800</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purchase Price (₹)</Text>
                  <Text style={styles.detailValue}>4,200</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Current Stock</Text>
                  <Text style={[styles.detailValue, { color: '#059669', fontWeight: '800' }]}>
                    48 pcs
                  </Text>
                </View>

                {/* Highlighted New Stock After Row */}
                <View style={styles.newStockAfterRow}>
                  <Text style={styles.newStockAfterLabel}>New Stock (After)</Text>
                  <Text style={styles.newStockAfterValue}>{calculatedNewStock} pcs</Text>
                </View>
              </View>
            </View>

            {/* 4. Low Stock Alert Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Bell size={15} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Low Stock Alert</Text>
              </View>

              {/* Controls */}
              <View style={styles.lowStockControlRow}>
                <View style={styles.limitControlCol}>
                  <Text style={styles.limitLabel}>Low Stock Limit</Text>
                  <View style={styles.limitInputContainer}>
                    <TextInput
                      style={styles.limitInput}
                      value={lowStockLimit}
                      onChangeText={setLowStockLimit}
                      keyboardType="numeric"
                    />
                    <View style={styles.limitSuffix}>
                      <Text style={styles.limitSuffixText}>pcs</Text>
                    </View>
                  </View>
                </View>

                {/* Enable Alert Checkbox */}
                <TouchableOpacity
                  style={styles.enableAlertBtn}
                  onPress={() => setEnableAlert(!enableAlert)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.alertCheckbox,
                      enableAlert && styles.alertCheckboxChecked,
                    ]}
                  >
                    {enableAlert && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={styles.enableAlertText}>Enable Alert</Text>
                </TouchableOpacity>
              </View>

              {/* Warning Notice Box */}
              <View style={styles.noticeBox}>
                <AlertTriangle size={14} color="#D97706" style={{ marginRight: 6, marginTop: 1 }} />
                <Text style={styles.noticeText}>
                  You will be notified when stock quantity falls below {lowStockLimit || '10'} pcs.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Section: Stock Adjustment History Table */}
        <View style={styles.historyCard}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <Clock size={15} color="#064E3B" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Stock Adjustment History</Text>
            </View>

            <TouchableOpacity onPress={() => Alert.alert('History', 'Full Historical Audit Log')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Wide Table with Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View style={styles.historyTableHeader}>
                <Text style={[styles.histTh, { width: 130 }]}>Date</Text>
                <Text style={[styles.histTh, { width: 65, textAlign: 'center' }]}>Type</Text>
                <Text style={[styles.histTh, { width: 65, textAlign: 'center' }]}>Quantity</Text>
                <Text style={[styles.histTh, { width: 85, textAlign: 'center' }]}>Previous Stock</Text>
                <Text style={[styles.histTh, { width: 75, textAlign: 'center' }]}>New Stock</Text>
                <Text style={[styles.histTh, { width: 95 }]}>Reference</Text>
                <Text style={[styles.histTh, { width: 60 }]}>By</Text>
                <Text style={[styles.histTh, { width: 140 }]}>Notes</Text>
              </View>

              {/* Rows */}
              {historyRecords.map((item, idx) => {
                const isAdd = item.type === 'Add';
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.historyTableRow,
                      idx % 2 === 1 && { backgroundColor: '#FCFDFE' },
                    ]}
                  >
                    <Text style={[styles.histTd, { width: 130 }]}>{item.date}</Text>

                    <View style={{ width: 65, alignItems: 'center' }}>
                      <View
                        style={[
                          styles.histTypePill,
                          isAdd ? styles.histTypeAdd : styles.histTypeRemove,
                        ]}
                      >
                        <Text
                          style={[
                            styles.histTypePillText,
                            isAdd ? { color: '#059669' } : { color: '#DC2626' },
                          ]}
                        >
                          {item.type}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.histTdBold,
                        {
                          width: 65,
                          textAlign: 'center',
                          color: isAdd ? '#059669' : '#DC2626',
                        },
                      ]}
                    >
                      {item.quantity}
                    </Text>

                    <Text style={[styles.histTd, { width: 85, textAlign: 'center' }]}>
                      {item.prevStock}
                    </Text>

                    <Text
                      style={[
                        styles.histTdBold,
                        { width: 75, textAlign: 'center', color: '#059669' },
                      ]}
                    >
                      {item.newStock}
                    </Text>

                    <Text style={[styles.histTd, { width: 95 }]}>{item.reference}</Text>
                    <Text style={[styles.histTd, { width: 60 }]}>{item.by}</Text>
                    <Text style={[styles.histTd, { width: 140 }]} numberOfLines={1}>
                      {item.notes}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 25 }} />
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

        {/* Active Products Tab Pill */}
        <TouchableOpacity
          style={styles.tabItemActivePill}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.7}
        >
          <Package size={19} color="#064E3B" />
          <Text style={styles.tabLabelActive}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/customers')}
          activeOpacity={0.7}
        >
          <Users size={19} color="#64748B" />
          <Text style={styles.tabLabel}>Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/orders')}
          activeOpacity={0.7}
        >
          <FileText size={19} color="#64748B" />
          <Text style={styles.tabLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/invoices')}
          activeOpacity={0.7}
        >
          <FileText size={19} color="#64748B" />
          <Text style={styles.tabLabel}>Invoices</Text>
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
    fontSize: 17,
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

  // 2-Column Responsive Split
  twoColRow: {
    flexDirection: width > 700 ? 'row' : 'row',
    gap: 10,
    marginBottom: 10,
  },
  colFlex: {
    flex: 1,
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },

  // 1. Product Info Card
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productThumbBox: {
    width: 60,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  productNameText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 5,
  },
  inStockBadgeText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '700',
  },
  productDescText: {
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 3,
  },
  productMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  productMetaText: {
    fontSize: 8.5,
    color: '#475569',
  },
  currentStockHighlightText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },

  // 2. Adjustment Type Card
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  typeTileActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  typeTileLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  typeTileLabelActive: {
    color: '#FFFFFF',
  },

  // 3. Quantity Card
  quantityInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    height: 38,
    marginBottom: 8,
  },
  quantityInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  unitSuffixBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitSuffixText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickChip: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },

  // 4. Reason Card
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  dropdownSelectorText: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '500',
  },

  // 5. Reference Details
  referenceGrid: {
    gap: 8,
  },
  formRowTwoCol: {
    flexDirection: 'row',
    gap: 8,
  },
  formCol: {
    flex: 1,
  },
  inputFieldLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 3,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 34,
    fontSize: 10.5,
    color: '#0F172A',
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 34,
  },
  dateTextInput: {
    flex: 1,
    fontSize: 10.5,
    color: '#0F172A',
    padding: 0,
  },

  // 6. Notes
  notesTextArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    padding: 8,
    fontSize: 10.5,
    color: '#0F172A',
    minHeight: 50,
    textAlignVertical: 'top',
  },

  // Action Buttons Row
  actionBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  updateStockBtn: {
    flex: 1.6,
    backgroundColor: '#064E3B',
    borderRadius: 8,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateStockBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Current Stock Status Tiles
  stockStatusTilesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusTile: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTileNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusTileLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '600',
  },

  // Product Preview Card
  previewHeroBox: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  previewThumbsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  previewThumbBox: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewThumbBoxActive: {
    borderColor: '#064E3B',
    borderWidth: 1.8,
  },

  // Product Details Table
  detailsList: {
    gap: 5.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  barcodeDigits: {
    fontSize: 7.5,
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  newStockAfterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 6,
    marginTop: 2,
  },
  newStockAfterLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#064E3B',
  },
  newStockAfterValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },

  // Low Stock Alert Card
  lowStockControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitControlCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  limitLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  limitInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    height: 30,
    overflow: 'hidden',
  },
  limitInput: {
    width: 38,
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  limitSuffix: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  limitSuffixText: {
    fontSize: 9.5,
    color: '#64748B',
  },
  enableAlertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCheckboxChecked: {
    borderColor: '#064E3B',
    backgroundColor: '#064E3B',
  },
  enableAlertText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 7,
    borderRadius: 6,
  },
  noticeText: {
    flex: 1,
    fontSize: 9.5,
    color: '#B45309',
    lineHeight: 13,
  },

  // Stock Adjustment History
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#064E3B',
  },
  historyTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  histTh: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  historyTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  histTd: {
    fontSize: 9.5,
    color: '#475569',
  },
  histTdBold: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  histTypePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  histTypeAdd: {
    backgroundColor: '#DCFCE7',
  },
  histTypeRemove: {
    backgroundColor: '#FEE2E2',
  },
  histTypePillText: {
    fontSize: 8.5,
    fontWeight: '700',
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
    paddingHorizontal: 6,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  tabItemActivePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelActive: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 2,
  },
});
