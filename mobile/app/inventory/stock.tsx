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
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  Pencil,
  Barcode,
  Trash2,
  TrendingDown,
  TrendingUp,
  FileText,
  Truck,
  ArrowLeftRight,
  Home,
  ShoppingCart,
  Users,
  Ellipsis,
} from 'lucide-react-native';
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
 * SVG Thumbnails for Stock Items
 */
function StockProductVisual({ type }: { type: string }) {
  if (type === 'frame-black') {
    return (
      <Svg width={38} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#F8FAFC" />
        <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.8" />
        <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (type === 'sunglasses-black') {
    return (
      <Svg width={38} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
        <Path d="M28 7 L36 7" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
        <Path d="M3 7 L0 6" stroke="#92400E" strokeWidth="2.8" />
        <Path d="M61 7 L64 6" stroke="#92400E" strokeWidth="2.8" />
      </Svg>
    );
  }

  if (type === 'frame-cat-eye') {
    return (
      <Svg width={38} height={18} viewBox="0 0 64 28" fill="none">
        <Path d="M4 14 C4 8, 12 4, 26 4 C27 12, 23 23, 14 23 C7 23, 4 19, 4 14 Z" stroke="#B45309" strokeWidth="2.5" fill="#FEF3C7" />
        <Path d="M26 9 C29 6, 35 6, 38 9" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M60 14 C60 8, 52 4, 38 4 C37 12, 41 23, 50 23 C57 23, 60 19, 60 14 Z" stroke="#B45309" strokeWidth="2.5" fill="#FEF3C7" />
      </Svg>
    );
  }

  if (type === 'lens-pair') {
    return (
      <Svg width={36} height={18} viewBox="0 0 60 30" fill="none">
        <Circle cx="20" cy="15" r="13" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
        <Circle cx="38" cy="16" r="13" stroke="#2563EB" strokeWidth="2" fill="#BFDBFE" />
        <Path d="M12 11 C15 9, 25 9, 28 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'lens-crizal') {
    return (
      <Svg width={34} height={18} viewBox="0 0 54 28" fill="none">
        <Circle cx="27" cy="14" r="12" stroke="#38BDF8" strokeWidth="2.2" fill="#E0F2FE" />
        <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'contact-box') {
    return (
      <Svg width={36} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="2" y="3" width="60" height="22" rx="4" stroke="#60A5FA" strokeWidth="1.6" fill="#FFFFFF" />
        <Path d="M2 10 L62 10" stroke="#3B82F6" strokeWidth="1.2" />
        <Path d="M8 7 L20 7" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
        <Path d="M28 17 C38 13, 50 15, 56 8" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'cleaner-bottle') {
    return (
      <Svg width={20} height={22} viewBox="0 0 30 36" fill="none">
        <Rect x="9" y="2" width="12" height="6" rx="2" fill="#0284C7" />
        <Path d="M6 10 C6 8, 24 8, 24 10 L25 32 C25 34, 23 35, 21 35 L9 35 C7 35, 5 34, 5 32 Z" stroke="#0284C7" strokeWidth="2" fill="#E0F2FE" />
        <Rect x="9" y="16" width="12" height="12" rx="2" fill="#FFFFFF" />
        <Path d="M15 19 L15 25" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
        <Path d="M12 22 L18 22" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'sports-goggles') {
    return (
      <Svg width={38} height={18} viewBox="0 0 64 28" fill="none">
        <Rect x="4" y="5" width="56" height="18" rx="8" stroke="#1E293B" strokeWidth="2.5" fill="#3B82F6" />
        <Path d="M24 14 C30 14, 34 14, 40 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <Path d="M0 14 L4 14" stroke="#1E293B" strokeWidth="3" />
        <Path d="M60 14 L64 14" stroke="#1E293B" strokeWidth="3" />
      </Svg>
    );
  }

  // Wipes box
  return (
    <Svg width={36} height={18} viewBox="0 0 60 28" fill="none">
      <Rect x="4" y="3" width="52" height="22" rx="4" stroke="#0284C7" strokeWidth="2" fill="#E0F2FE" />
      <Path d="M16 14 C22 10, 38 10, 44 14" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// Category Pills Data
const categoryPills = [
  { key: 'frames', label: 'Frames', count: 428, icon: 'glasses' },
  { key: 'sunglasses', label: 'Sunglasses', count: 186, icon: 'sunglasses' },
  { key: 'lenses', label: 'Lenses', count: 312, icon: 'lens' },
  { key: 'contact_lenses', label: 'Contact Lenses', count: 76, icon: 'contact' },
  { key: 'accessories', label: 'Accessories', count: 142, icon: 'bottle' },
  { key: 'others', label: 'Others', count: 104, icon: 'grid' },
];

// Main Stock Items Data
const stockItems = [
  {
    id: 'stk-1',
    name: 'Ray-Ban RB2140',
    subtitle: 'Wayfarer Classic',
    visualType: 'frame-black',
    category: 'Frames',
    brand: 'Ray-Ban',
    sku: 'RB2140-BLK',
    stock: 48,
    price: 5800,
    status: 'In Stock',
  },
  {
    id: 'stk-2',
    name: 'Oakley OO9102',
    subtitle: 'Holbrook',
    visualType: 'sunglasses-black',
    category: 'Sunglasses',
    brand: 'Oakley',
    sku: 'OO9102-BLK',
    stock: 22,
    price: 7500,
    status: 'Low Stock',
  },
  {
    id: 'stk-3',
    name: 'Vogue VO5276',
    subtitle: 'Cat Eye',
    visualType: 'frame-cat-eye',
    category: 'Frames',
    brand: 'Vogue',
    sku: 'VO5276-BRN',
    stock: 0,
    price: 4200,
    status: 'Out of Stock',
  },
  {
    id: 'stk-4',
    name: 'Essilor 1.56',
    subtitle: 'Anti-Glare',
    visualType: 'lens-pair',
    category: 'Lenses',
    brand: 'Essilor',
    sku: 'ESS-156-BL',
    stock: 120,
    price: 2700,
    status: 'In Stock',
  },
  {
    id: 'stk-5',
    name: 'Crizal Sapphire',
    subtitle: 'UV Protect',
    visualType: 'lens-crizal',
    category: 'Lenses',
    brand: 'Essilor',
    sku: 'CRZ-SAP-16',
    stock: 15,
    price: 3500,
    status: 'Low Stock',
  },
  {
    id: 'stk-6',
    name: 'Acuvue Oasys',
    subtitle: '6 Lenses Pack',
    visualType: 'contact-box',
    category: 'Contact Lenses',
    brand: 'Johnson & J.',
    sku: 'ACV-OAS-6',
    stock: 0,
    price: 3000,
    status: 'Out of Stock',
  },
  {
    id: 'stk-7',
    name: 'Cleaning Solution',
    subtitle: 'Lens Cleaner 100ml',
    visualType: 'cleaner-bottle',
    category: 'Accessories',
    brand: 'Bausch + Lomb',
    sku: 'BLOMB-CL-100',
    stock: 35,
    price: 450,
    status: 'In Stock',
  },
  {
    id: 'stk-8',
    name: 'Sports Goggles',
    subtitle: 'Swimming Goggles',
    visualType: 'sports-goggles',
    category: 'Sports',
    brand: 'Speedo',
    sku: 'SPD-GOG-BL',
    stock: 8,
    price: 1800,
    status: 'Low Stock',
  },
];

export default function StockManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeCategory, setActiveCategory] = useState('frames');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === stockItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stockItems.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredItems = stockItems.filter((i) => {
    const q = searchQuery.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.brand.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

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
              <Text style={styles.headerTitle}>Inventory / Stock Management</Text>
              <Text style={styles.headerSubtitle}>
                Manage frames, lenses, accessories and stock
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
          {/* Total Items */}
          <View style={[styles.metricCard, { backgroundColor: '#F0F9FF' }]}>
            <Package size={17} color="#2563EB" />
            <Text style={styles.metricNumber}>1,248</Text>
            <Text style={styles.metricLabel}>Total Items</Text>
            <Text style={[styles.metricSubvalue, { color: '#2563EB' }]}>₹18,45,600</Text>
          </View>

          {/* In Stock */}
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={17} color="#059669" />
            <Text style={styles.metricNumber}>892</Text>
            <Text style={styles.metricLabel}>In Stock</Text>
            <Text style={[styles.metricSubvalue, { color: '#059669' }]}>71.5%</Text>
          </View>

          {/* Low Stock */}
          <View style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
            <AlertTriangle size={17} color="#D97706" />
            <Text style={styles.metricNumber}>84</Text>
            <Text style={styles.metricLabel}>Low Stock</Text>
            <Text style={[styles.metricSubvalue, { color: '#D97706' }]}>6.7%</Text>
          </View>

          {/* Out of Stock */}
          <View style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
            <XCircle size={17} color="#DC2626" />
            <Text style={styles.metricNumber}>272</Text>
            <Text style={styles.metricLabel}>Out of Stock</Text>
            <Text style={[styles.metricSubvalue, { color: '#DC2626' }]}>21.8%</Text>
          </View>
        </View>

        {/* Category Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsContainer}
          style={styles.categoryPillsScroll}
        >
          {categoryPills.map((pill) => {
            const isActive = activeCategory === pill.key;
            return (
              <TouchableOpacity
                key={pill.key}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveCategory(pill.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isActive && styles.categoryPillTextActive,
                  ]}
                >
                  {pill.label} ({pill.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search, Filter & Add Product Row */}
        <View style={styles.filterControlsRow}>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Search size={15} color="#94A3B8" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, brand, SKU, category..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters Button */}
          <TouchableOpacity
            style={styles.filtersBtn}
            onPress={() => Alert.alert('Filters', 'Filter by Stock Range or Supplier')}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={13} color="#334155" style={{ marginRight: 4 }} />
            <Text style={styles.filtersBtnText}>Filters</Text>
          </TouchableOpacity>

          {/* All Brands Dropdown */}
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => Alert.alert('Filter Brands', 'Ray-Ban, Oakley, Vogue, Essilor...')}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText}>All Brands</Text>
            <ChevronDown size={12} color="#64748B" style={{ marginLeft: 3 }} />
          </TouchableOpacity>

          {/* All Status Dropdown */}
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => Alert.alert('Filter Status', 'In Stock, Low Stock, Out of Stock')}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText}>All Status</Text>
            <ChevronDown size={12} color="#64748B" style={{ marginLeft: 3 }} />
          </TouchableOpacity>

          {/* + Add Product Button */}
          <TouchableOpacity
            style={styles.addProductBtn}
            onPress={() => router.push('/products/add')}
            activeOpacity={0.85}
          >
            <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addProductBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Main Stock Table */}
        <View style={styles.tableCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Column Headers */}
              <View style={styles.tableHeaderRow}>
                {/* Select All Checkbox */}
                <TouchableOpacity
                  style={styles.colCheck}
                  onPress={toggleSelectAll}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedIds.length === stockItems.length && styles.checkboxActive,
                    ]}
                  />
                </TouchableOpacity>

                <Text style={[styles.thText, styles.colProduct]}>Product</Text>
                <Text style={[styles.thText, styles.colCategory]}>Category</Text>
                <Text style={[styles.thText, styles.colBrand]}>Brand</Text>
                <Text style={[styles.thText, styles.colSku]}>SKU</Text>
                <Text style={[styles.thText, styles.colStock]}>Stock</Text>
                <Text style={[styles.thText, styles.colPrice]}>Price (₹)</Text>
                <Text style={[styles.thText, styles.colStatus]}>Status</Text>
                <Text style={[styles.thText, styles.colActions]}>Actions</Text>
              </View>

              {/* Table Rows */}
              {filteredItems.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const isInStock = item.status === 'In Stock';
                const isLowStock = item.status === 'Low Stock';
                const isOutOfStock = item.status === 'Out of Stock';

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && { backgroundColor: '#FCFDFE' },
                    ]}
                  >
                    {/* Checkbox */}
                    <TouchableOpacity
                      style={styles.colCheck}
                      onPress={() => toggleSelectItem(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, isSelected && styles.checkboxActive]} />
                    </TouchableOpacity>

                    {/* Product Visual & Name */}
                    <View style={styles.colProduct}>
                      <View style={styles.productVisualBox}>
                        <StockProductVisual type={item.visualType} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.productNameText} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.productSubText} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>

                    {/* Category */}
                    <View style={styles.colCategory}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>

                    {/* Brand */}
                    <View style={styles.colBrand}>
                      <Text style={styles.brandText}>{item.brand}</Text>
                    </View>

                    {/* SKU */}
                    <View style={styles.colSku}>
                      <Text style={styles.skuText}>{item.sku}</Text>
                    </View>

                    {/* Stock */}
                    <View style={styles.colStock}>
                      <Text
                        style={[
                          styles.stockText,
                          item.stock === 0 && { color: '#DC2626', fontWeight: '800' },
                        ]}
                      >
                        {item.stock}
                      </Text>
                    </View>

                    {/* Price */}
                    <View style={styles.colPrice}>
                      <Text style={styles.priceText}>{item.price.toLocaleString()}</Text>
                    </View>

                    {/* Status */}
                    <View style={styles.colStatus}>
                      {isInStock && (
                        <View style={styles.inStockBadge}>
                          <Text style={styles.inStockBadgeText}>In Stock</Text>
                        </View>
                      )}

                      {isLowStock && (
                        <View style={styles.lowStockBadge}>
                          <Text style={styles.lowStockBadgeText}>Low Stock</Text>
                        </View>
                      )}

                      {isOutOfStock && (
                        <View style={styles.outOfStockBadge}>
                          <Text style={styles.outOfStockBadgeText}>Out of Stock</Text>
                        </View>
                      )}
                    </View>

                    {/* Actions: Edit, Barcode, Delete */}
                    <View style={styles.colActions}>
                      <TouchableOpacity
                        style={styles.actionPencilBtn}
                        onPress={() => router.push('/products/add')}
                        activeOpacity={0.7}
                      >
                        <Pencil size={13} color="#059669" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBarcodeBtn}
                        onPress={() => Alert.alert('Barcode', `SKU: ${item.sku}\nBarcode printed.`)}
                        activeOpacity={0.7}
                      >
                        <Barcode size={14} color="#334155" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionTrashBtn}
                        onPress={() =>
                          Alert.alert('Delete Item', `Remove ${item.name} from inventory?`, [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => {} },
                          ])
                        }
                        activeOpacity={0.7}
                      >
                        <Trash2 size={13} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* 2-Column Responsive Split Bottom Grid */}
        <View style={styles.twoColGridRow}>
          {/* Left Column: Stock Overview Chart & Recent Movements */}
          <View style={styles.colFlex}>
            {/* 1. Stock Overview Vertical Bar Chart Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Package size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Stock Overview</Text>
              </View>

              {/* Chart Visual with Y-axis and Bars */}
              <View style={styles.chartContainer}>
                {/* Y-axis labels */}
                <View style={styles.yAxisCol}>
                  <Text style={styles.axisLabel}>400</Text>
                  <Text style={styles.axisLabel}>300</Text>
                  <Text style={styles.axisLabel}>200</Text>
                  <Text style={styles.axisLabel}>100</Text>
                  <Text style={styles.axisLabel}>0</Text>
                </View>

                {/* Bars Area */}
                <View style={styles.barsArea}>
                  {/* Bar 1: Frames (428) */}
                  <View style={styles.barItemCol}>
                    <Text style={styles.barValueText}>428</Text>
                    <View style={[styles.barRect, { height: 95, backgroundColor: '#059669' }]} />
                    <Text style={styles.barCategoryText}>Frames</Text>
                  </View>

                  {/* Bar 2: Sunglasses (186) */}
                  <View style={styles.barItemCol}>
                    <Text style={styles.barValueText}>186</Text>
                    <View style={[styles.barRect, { height: 48, backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.barCategoryText}>Sunglasses</Text>
                  </View>

                  {/* Bar 3: Lenses (312) */}
                  <View style={styles.barItemCol}>
                    <Text style={styles.barValueText}>312</Text>
                    <View style={[styles.barRect, { height: 75, backgroundColor: '#0D9488' }]} />
                    <Text style={styles.barCategoryText}>Lenses</Text>
                  </View>

                  {/* Bar 4: Contact Lenses (76) */}
                  <View style={styles.barItemCol}>
                    <Text style={styles.barValueText}>76</Text>
                    <View style={[styles.barRect, { height: 26, backgroundColor: '#EF4444' }]} />
                    <Text style={styles.barCategoryText}>Contact Lenses</Text>
                  </View>

                  {/* Bar 5: Accessories (142) */}
                  <View style={styles.barItemCol}>
                    <Text style={styles.barValueText}>142</Text>
                    <View style={[styles.barRect, { height: 40, backgroundColor: '#10B981' }]} />
                    <Text style={styles.barCategoryText}>Accessories</Text>
                  </View>

                  {/* Bar 6: Others (104) */}
                  <View style={styles.barItemCol}>
                    <Text style={styles.barValueText}>104</Text>
                    <View style={[styles.barRect, { height: 32, backgroundColor: '#F87171' }]} />
                    <Text style={styles.barCategoryText}>Others</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 2. Recent Stock Movements Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderBetween}>
                <View style={styles.cardHeader}>
                  <FileText size={15} color="#064E3B" style={{ marginRight: 6 }} />
                  <Text style={styles.cardTitle}>Recent Stock Movements</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Movements', 'Full Stock Audit Log')}>
                  <Text style={styles.viewAllLinkText}>View All</Text>
                </TouchableOpacity>
              </View>

              {/* Movements Table */}
              <View style={styles.movementsTable}>
                <View style={styles.movTableHeader}>
                  <Text style={[styles.movThText, { flex: 1.2 }]}>Date</Text>
                  <Text style={[styles.movThText, { flex: 1.6 }]}>Product</Text>
                  <Text style={[styles.movThText, { flex: 1, textAlign: 'center' }]}>Type</Text>
                  <Text style={[styles.movThText, { flex: 0.8, textAlign: 'center' }]}>Qty</Text>
                  <Text style={[styles.movThText, { flex: 0.8, textAlign: 'right' }]}>By</Text>
                </View>

                {/* Mov 1: Sale */}
                <View style={styles.movTableRow}>
                  <Text style={[styles.movTdText, { flex: 1.2 }]}>28 Oct 2026</Text>
                  <Text style={[styles.movTdTextBold, { flex: 1.6 }]}>Ray-Ban RB2140</Text>
                  <View style={[styles.movTypeCol, { flex: 1 }]}>
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleBadgeText}>Sale</Text>
                    </View>
                  </View>
                  <Text style={[styles.movQtyText, { flex: 0.8, color: '#DC2626' }]}>-1</Text>
                  <Text style={[styles.movTdText, { flex: 0.8, textAlign: 'right' }]}>Admin</Text>
                </View>

                {/* Mov 2: Purchase */}
                <View style={styles.movTableRow}>
                  <Text style={[styles.movTdText, { flex: 1.2 }]}>27 Oct 2026</Text>
                  <Text style={[styles.movTdTextBold, { flex: 1.6 }]}>Essilor 1.56</Text>
                  <View style={[styles.movTypeCol, { flex: 1 }]}>
                    <View style={styles.purchaseBadge}>
                      <Text style={styles.purchaseBadgeText}>Purchase</Text>
                    </View>
                  </View>
                  <Text style={[styles.movQtyText, { flex: 0.8, color: '#059669' }]}>+50</Text>
                  <Text style={[styles.movTdText, { flex: 0.8, textAlign: 'right' }]}>Admin</Text>
                </View>

                {/* Mov 3: Sale */}
                <View style={styles.movTableRow}>
                  <Text style={[styles.movTdText, { flex: 1.2 }]}>26 Oct 2026</Text>
                  <Text style={[styles.movTdTextBold, { flex: 1.6 }]}>Acuvue Oasys</Text>
                  <View style={[styles.movTypeCol, { flex: 1 }]}>
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleBadgeText}>Sale</Text>
                    </View>
                  </View>
                  <Text style={[styles.movQtyText, { flex: 0.8, color: '#DC2626' }]}>-2</Text>
                  <Text style={[styles.movTdText, { flex: 0.8, textAlign: 'right' }]}>Staff</Text>
                </View>

                {/* Mov 4: Purchase */}
                <View style={[styles.movTableRow, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.movTdText, { flex: 1.2 }]}>25 Oct 2026</Text>
                  <Text style={[styles.movTdTextBold, { flex: 1.6 }]}>Cleaning Solution</Text>
                  <View style={[styles.movTypeCol, { flex: 1 }]}>
                    <View style={styles.purchaseBadge}>
                      <Text style={styles.purchaseBadgeText}>Purchase</Text>
                    </View>
                  </View>
                  <Text style={[styles.movQtyText, { flex: 0.8, color: '#059669' }]}>+30</Text>
                  <Text style={[styles.movTdText, { flex: 0.8, textAlign: 'right' }]}>Admin</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Column: Low Stock Alerts & Quick Actions */}
          <View style={styles.colFlex}>
            {/* 1. Low Stock Alerts (84) Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderBetween}>
                <View style={styles.cardHeader}>
                  <AlertTriangle size={15} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.cardTitle}>Low Stock Alerts (84)</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Low Stock Alerts', 'Showing all 84 items with stock under minimum threshold.')}>
                  <Text style={styles.viewAllLinkText}>View All</Text>
                </TouchableOpacity>
              </View>

              {/* Alert Items List */}
              <View style={styles.alertList}>
                {/* Alert Item 1 */}
                <View style={styles.alertRow}>
                  <View style={styles.alertThumbBox}>
                    <StockProductVisual type="sunglasses-black" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertNameText}>Oakley OO9102</Text>
                    <Text style={styles.alertSubText}>Holbrook Sunglasses</Text>
                  </View>
                  <Text style={styles.alertLeftText}>22 left</Text>
                </View>

                {/* Alert Item 2 */}
                <View style={styles.alertRow}>
                  <View style={styles.alertThumbBox}>
                    <StockProductVisual type="lens-crizal" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertNameText}>Crizal Sapphire</Text>
                    <Text style={styles.alertSubText}>1.56 Lens</Text>
                  </View>
                  <Text style={styles.alertLeftText}>15 left</Text>
                </View>

                {/* Alert Item 3 */}
                <View style={styles.alertRow}>
                  <View style={styles.alertThumbBox}>
                    <StockProductVisual type="sports-goggles" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertNameText}>Sports Goggles</Text>
                    <Text style={styles.alertSubText}>Swimming Goggles</Text>
                  </View>
                  <Text style={styles.alertLeftText}>8 left</Text>
                </View>

                {/* Alert Item 4 */}
                <View style={[styles.alertRow, { borderBottomWidth: 0 }]}>
                  <View style={styles.alertThumbBox}>
                    <StockProductVisual type="cleaner-wipes" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertNameText}>Cleansing Wipes</Text>
                    <Text style={styles.alertSubText}>Lens Wipes (30 pcs)</Text>
                  </View>
                  <Text style={styles.alertLeftText}>6 left</Text>
                </View>
              </View>
            </View>

            {/* 2. Quick Actions Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <CheckCircle2 size={15} color="#064E3B" style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Quick Actions</Text>
              </View>

              {/* 2x2 Grid of Actions */}
              <View style={styles.quickActionsGrid}>
                {/* Action 1: Add New Product */}
                <TouchableOpacity
                  style={[styles.quickActionTile, { backgroundColor: '#F0FDF4' }]}
                  onPress={() => router.push('/products/add')}
                  activeOpacity={0.8}
                >
                  <Package size={17} color="#059669" />
                  <Text style={[styles.quickActionLabel, { color: '#064E3B' }]}>
                    Add New Product
                  </Text>
                </TouchableOpacity>

                {/* Action 2: Stock Adjustment */}
                <TouchableOpacity
                  style={[styles.quickActionTile, { backgroundColor: '#EFF6FF' }]}
                  onPress={() => router.push('/inventory/adjustment')}
                  activeOpacity={0.8}
                >
                  <ArrowLeftRight size={17} color="#2563EB" />
                  <Text style={[styles.quickActionLabel, { color: '#1D4ED8' }]}>
                    Stock Adjustment
                  </Text>
                </TouchableOpacity>

                {/* Action 3: Stock Transfer */}
                <TouchableOpacity
                  style={[styles.quickActionTile, { backgroundColor: '#FAF5FF' }]}
                  onPress={() => Alert.alert('Stock Transfer', 'Transfer frames & lenses between branch stores')}
                  activeOpacity={0.8}
                >
                  <Truck size={17} color="#9333EA" />
                  <Text style={[styles.quickActionLabel, { color: '#7E22CE' }]}>
                    Stock Transfer
                  </Text>
                </TouchableOpacity>

                {/* Action 4: Generate Report */}
                <TouchableOpacity
                  style={[styles.quickActionTile, { backgroundColor: '#FFFBEB' }]}
                  onPress={() => Alert.alert('Stock Valuation Report', 'Export Excel / PDF of current ₹18,45,600 stock valuation')}
                  activeOpacity={0.8}
                >
                  <FileText size={17} color="#D97706" />
                  <Text style={[styles.quickActionLabel, { color: '#B45309' }]}>
                    Generate Report
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar Matching Screenshot */}
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

  // Category Pills
  categoryPillsScroll: {
    marginBottom: 10,
  },
  categoryPillsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  categoryPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Search, Filter & Add Product Row
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1.5,
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
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 8,
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
  },
  addProductBtn: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 7,
  },
  addProductBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
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
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  thText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  // Column Dimensions
  colCheck: {
    width: 26,
    alignItems: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.4,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    borderColor: '#064E3B',
    backgroundColor: '#064E3B',
  },

  colProduct: {
    width: 155,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productVisualBox: {
    width: 42,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  productNameText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  productSubText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },

  colCategory: {
    width: 80,
  },
  categoryText: {
    fontSize: 10,
    color: '#475569',
  },

  colBrand: {
    width: 75,
  },
  brandText: {
    fontSize: 10,
    color: '#475569',
  },

  colSku: {
    width: 85,
  },
  skuText: {
    fontSize: 9.5,
    color: '#64748B',
  },

  colStock: {
    width: 48,
    alignItems: 'center',
  },
  stockText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  colPrice: {
    width: 65,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  colStatus: {
    width: 90,
    alignItems: 'center',
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inStockBadgeText: {
    color: '#059669',
    fontSize: 9.5,
    fontWeight: '700',
  },
  lowStockBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowStockBadgeText: {
    color: '#D97706',
    fontSize: 9.5,
    fontWeight: '700',
  },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockBadgeText: {
    color: '#DC2626',
    fontSize: 9.5,
    fontWeight: '700',
  },

  colActions: {
    width: 85,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'flex-end',
  },
  actionPencilBtn: {
    padding: 3,
  },
  actionBarcodeBtn: {
    padding: 3,
  },
  actionTrashBtn: {
    padding: 3,
  },

  // 2-Column Responsive Split Bottom Grid
  twoColGridRow: {
    flexDirection: width > 700 ? 'row' : 'row',
    gap: 10,
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
  viewAllLinkText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#064E3B',
  },

  // Stock Overview Bar Chart
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 145,
    paddingTop: 8,
  },
  yAxisCol: {
    height: 115,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  axisLabel: {
    fontSize: 8,
    color: '#94A3B8',
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 135,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 4,
  },
  barItemCol: {
    alignItems: 'center',
  },
  barValueText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  barRect: {
    width: 22,
    borderRadius: 3,
  },
  barCategoryText: {
    fontSize: 7.5,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 40,
  },

  // Recent Stock Movements Table
  movementsTable: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  movTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  movThText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  movTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  movTdText: {
    fontSize: 9,
    color: '#475569',
  },
  movTdTextBold: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  movTypeCol: {
    alignItems: 'center',
  },
  saleBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  saleBadgeText: {
    color: '#DC2626',
    fontSize: 8.5,
    fontWeight: '700',
  },
  purchaseBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  purchaseBadgeText: {
    color: '#059669',
    fontSize: 8.5,
    fontWeight: '700',
  },
  movQtyText: {
    fontSize: 9.5,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Low Stock Alerts List
  alertList: {
    gap: 6,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  alertThumbBox: {
    width: 38,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  alertNameText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  alertSubText: {
    fontSize: 9,
    color: '#64748B',
  },
  alertLeftText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
  },

  // Quick Actions 2x2 Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionTile: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
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
