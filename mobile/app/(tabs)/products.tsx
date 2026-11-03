import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  Search,
  ScanBarcode,
  Plus,
  ChevronDown,
  LayoutGrid,
  SlidersHorizontal,
  Star,
} from 'lucide-react-native';
import { mockProducts } from '../../src/data/mockProducts';
import { opticalStore } from '../../src/store/opticalStore';
import { Product } from '../../src/types/product';
import { formatCurrency } from '../../src/utils/currency';
import { getProductEmoji } from '../../src/utils/productEmoji';

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

/**
 * Vector illustrations for each optical product in the 3-column grid
 */
function GridProductVisual({ id }: { id: string }) {
  switch (id) {
    case 'prod-rb2140':
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      );

    case 'prod-oakley009208':
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
          <Path d="M28 7 L36 7" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          <Rect x="36" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
          <Path d="M3 7 L0 6" stroke="#92400E" strokeWidth="2.8" />
          <Path d="M61 7 L64 6" stroke="#92400E" strokeWidth="2.8" />
        </Svg>
      );

    case 'prod-titan':
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#CBD5E1" strokeWidth="2.5" fill="#F8FAFC" />
          <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#CBD5E1" strokeWidth="2.5" fill="#F8FAFC" />
          <Path d="M3 8 L0 8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M61 8 L64 8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );

    case 'prod-vogue':
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.6" fill="#2563EB" />
          <Path d="M28 8 L36 8" stroke="#0F172A" strokeWidth="2.6" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.6" fill="#2563EB" />
          <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.6" />
          <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.6" />
        </Svg>
      );

    case 'prod-john-jacobs':
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
          <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#D97706" strokeWidth="2.8" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
          <Path d="M3 8 L0 8" stroke="#D97706" strokeWidth="2.8" />
          <Path d="M61 8 L64 8" stroke="#D97706" strokeWidth="2.8" />
        </Svg>
      );

    case 'prod-lenskart-air':
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="4" width="25" height="19" rx="4" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M28 8 L36 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <Rect x="36" y="4" width="25" height="19" rx="4" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="3" />
          <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="3" />
        </Svg>
      );

    case 'prod-blue-cut':
      return (
        <Svg width={46} height={24} viewBox="0 0 54 28" fill="none">
          <Circle cx="27" cy="14" r="12" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
          <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="27" cy="14" r="3" fill="#60A5FA" />
        </Svg>
      );

    case 'prod-progressive-lens':
      return (
        <Svg width={46} height={24} viewBox="0 0 54 28" fill="none">
          <Circle cx="27" cy="14" r="12" stroke="#94A3B8" strokeWidth="1.8" fill="#F8FAFC" />
          <Circle cx="27" cy="14" r="5" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2,2" />
          <Path d="M20 9 C23 7, 31 7, 34 9" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'prod-acuvue':
      return (
        <Svg width={50} height={24} viewBox="0 0 58 28" fill="none">
          <Rect x="2" y="4" width="54" height="20" rx="3" stroke="#2563EB" strokeWidth="1.5" fill="#EFF6FF" />
          <Rect x="6" y="8" width="20" height="4" rx="1" fill="#1D4ED8" />
          <Rect x="6" y="14" width="14" height="2" rx="1" fill="#60A5FA" />
          <Circle cx="44" cy="14" r="6" stroke="#3B82F6" strokeWidth="1.5" fill="#DBEAFE" />
        </Svg>
      );

    case 'prod-case':
      return (
        <Svg width={46} height={24} viewBox="0 0 54 28" fill="none">
          <Path d="M4 10 C4 6, 12 4, 27 4 C42 4, 50 6, 50 10 L47 24 C47 25, 40 26, 27 26 C14 26, 7 25, 7 24 Z" fill="#78350F" />
          <Path d="M4 10 C14 16, 40 16, 50 10" stroke="#92400E" strokeWidth="1.5" />
          <Circle cx="27" cy="18" r="3" fill="#F59E0B" />
        </Svg>
      );

    case 'prod-clean-kit':
      return (
        <Svg width={46} height={24} viewBox="0 0 54 28" fill="none">
          <Rect x="6" y="8" width="10" height="18" rx="2" fill="#0284C7" />
          <Rect x="9" y="4" width="4" height="4" fill="#38BDF8" />
          <Path d="M7 4 L13 4" stroke="#0284C7" strokeWidth="1.5" />
          <Path d="M22 14 L48 10 L44 26 L18 24 Z" fill="#60A5FA" />
          <Path d="M24 16 L46 13 L43 24 L21 22 Z" fill="#3B82F6" />
        </Svg>
      );

    case 'prod-microfiber':
      return (
        <Svg width={46} height={24} viewBox="0 0 54 28" fill="none">
          <Path d="M8 8 L46 6 L42 22 L4 20 Z" fill="#94A3B8" />
          <Path d="M12 11 L43 9 L39 20 L8 18 Z" fill="#64748B" />
        </Svg>
      );

    default:
      return (
        <Svg width={46} height={24} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.5" fill="#F8FAFC" />
          <Path d="M28 8 L36 8" stroke="#0F172A" strokeWidth="2.5" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.5" fill="#F8FAFC" />
        </Svg>
      );
  }
}

export default function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const list = opticalStore.getState().products;
    return list && list.length > 0 ? list : mockProducts;
  });

  React.useEffect(() => {
    const unsub = opticalStore.subscribe(() => {
      const list = opticalStore.getState().products;
      setProductsList(list && list.length > 0 ? list : mockProducts);
    });
    return unsub;
  }, []);

  const categories = [
    { label: 'All', icon: 'grid' },
    { label: 'Frames', icon: 'frame' },
    { label: 'Sunglasses', icon: 'sunglass' },
    { label: 'Lenses', icon: 'lens' },
    { label: 'Accessories', icon: 'accessory' },
  ];

  const filteredProducts = productsList.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Frames':
        return { label: 'Frame', bg: '#DCFCE7', text: '#15803D' };
      case 'Sunglasses':
        return { label: 'Sunglasses', bg: '#FCE7F3', text: '#BE185D' };
      case 'Lenses':
        return { label: 'Lens', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'Contact Lenses':
        return { label: 'Contact Lens', bg: '#F3E8FF', text: '#7E22CE' };
      case 'Accessories':
      default:
        return { label: 'Accessory', bg: '#FFEDD5', text: '#C2410C' };
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Top Header (Deep Optical Forest Green) */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerRow}>
          {/* Logo & Store Title */}
          <View style={styles.headerLeft}>
            <HeaderGlassesLogo />
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>श्री गणेश ऑप्टिकल</Text>
              <Text style={styles.headerSubtitle}>इंग्लिशिपुरा, सीहोर • 6263732857</Text>
            </View>
          </View>

          {/* Right Action Icons: Search, Barcode, + Add Product */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.8}>
              <Search size={18} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.8}>
              <ScanBarcode size={18} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.plusCircleBtn}
              onPress={() => router.push('/products/add')}
              activeOpacity={0.85}
            >
              <Plus size={15} color="#FFFFFF" strokeWidth={2.6} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & All Categories Dropdown Row */}
        <View style={styles.titleDropdownRow}>
          <View style={styles.titleBox}>
            <Text style={styles.screenHeading}>Products</Text>
            <Text style={styles.screenSubheading}>
              Manage your frames, goggles, lenses and accessories
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity
              style={styles.categoriesDropdown}
              onPress={() => router.push('/inventory/stock')}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownText}>Stock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoriesDropdown}
              onPress={() => router.push('/products/categories')}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownText}>All Categories</Text>
              <ChevronDown size={12} color="#475569" style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsContent}
          style={styles.categoryPillsScroll}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat.label)}
                activeOpacity={0.8}
              >
                {cat.icon === 'grid' && (
                  <LayoutGrid
                    size={12}
                    color={isActive ? '#FFFFFF' : '#0F172A'}
                    style={{ marginRight: 4 }}
                  />
                )}
                {cat.icon === 'frame' && (
                  <View style={styles.miniCatIcon}>
                    <Svg width={18} height={9} viewBox="0 0 40 18" fill="none">
                      <Rect x="2" y="2" width="16" height="14" rx="4" stroke={isActive ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" />
                      <Path d="M18 6 L22 6" stroke={isActive ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" />
                      <Rect x="22" y="2" width="16" height="14" rx="4" stroke={isActive ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" />
                    </Svg>
                  </View>
                )}
                {cat.icon === 'sunglass' && (
                  <View style={styles.miniCatIcon}>
                    <Svg width={18} height={9} viewBox="0 0 40 18" fill="none">
                      <Rect x="2" y="2" width="16" height="14" rx="4" fill={isActive ? '#FFFFFF' : '#1E293B'} stroke={isActive ? '#FFFFFF' : '#1E293B'} strokeWidth="2" />
                      <Path d="M18 6 L22 6" stroke={isActive ? '#FFFFFF' : '#1E293B'} strokeWidth="2" />
                      <Rect x="22" y="2" width="16" height="14" rx="4" fill={isActive ? '#FFFFFF' : '#1E293B'} stroke={isActive ? '#FFFFFF' : '#1E293B'} strokeWidth="2" />
                    </Svg>
                  </View>
                )}
                {cat.icon === 'lens' && (
                  <View style={styles.miniCatIcon}>
                    <Circle cx={6} cy={6} r={5} stroke={isActive ? '#FFFFFF' : '#3B82F6'} strokeWidth="1.8" fill={isActive ? 'transparent' : '#DBEAFE'} />
                  </View>
                )}
                {cat.icon === 'accessory' && (
                  <View style={styles.miniCatIcon}>
                    <Rect x={3} y={2} width={6} height={10} rx={1} fill={isActive ? '#FFFFFF' : '#0284C7'} />
                  </View>
                )}
                <Text
                  style={[
                    styles.categoryPillText,
                    isActive && styles.categoryPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Bar with Sliders Icon */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBox}>
            <Search size={16} color="#64748B" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, brand, SKU..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <SlidersHorizontal size={16} color="#0F172A" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3-Column Product Grid */}
        <View style={styles.threeColumnGrid}>
          {filteredProducts.map((prod) => {
            const badge = getCategoryBadge(prod.category);
            const isFeaturedRayBan = prod.id === 'prod-rb2140';

            return (
              <TouchableOpacity
                key={prod.id}
                style={styles.gridCard}
                onPress={() => router.push('/products/' + prod.id)}
                activeOpacity={0.88}
              >
                {/* Top Row: Category Badge & Star */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>

                  <TouchableOpacity activeOpacity={0.7}>
                    {isFeaturedRayBan ? (
                      <Star size={11} color="#15803D" fill="#15803D" />
                    ) : (
                      <Star size={11} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Visual (Real Photo or Emoji or Fallback Vector) */}
                <View style={styles.visualContainer}>
                  {prod.image ? (
                    <Image
                      source={{ uri: prod.image }}
                      style={styles.realGridImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 26 }}>
                      {prod.emoji || getProductEmoji(prod.name, prod.category)}
                    </Text>
                  )}
                </View>

                {/* Title & Description */}
                <Text style={styles.prodTitle} numberOfLines={1}>
                  {prod.name}
                </Text>
                <Text style={styles.prodSub} numberOfLines={1}>
                  {prod.description}
                </Text>

                {/* Price */}
                <Text style={styles.prodPrice}>
                  {formatCurrency(prod.price)}
                </Text>

                {/* Bottom Row: Stock Badge & 3 Dots (•••) */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.stockPill}>
                    <Text style={styles.stockPillText}>Stock: {prod.stock}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        prod.name,
                        `Price: ₹${prod.price}\nStock: ${prod.stock}\nCode: ${prod.code}`,
                        [{ text: 'Close' }]
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dotsText}>•••</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  headerTitleBox: {
    marginLeft: 7,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 7.8,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircleBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.8,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* Title & Dropdown */
  titleDropdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleBox: {
    flex: 1,
    paddingRight: 8,
  },
  screenHeading: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  screenSubheading: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  categoriesDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 2,
  },
  dropdownText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },

  /* Category Filter Pills */
  categoryPillsScroll: {
    marginBottom: 10,
  },
  categoryPillsContent: {
    gap: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  miniCatIcon: {
    marginRight: 4,
  },
  categoryPillText: {
    fontSize: 10.5,
    color: '#475569',
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Search Bar */
  searchBarWrapper: {
    marginBottom: 12,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    marginLeft: 6,
    paddingVertical: 0,
  },

  /* 3-Column Product Grid */
  threeColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCard: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badgePill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 7.5,
    fontWeight: '700',
  },
  visualContainer: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  realGridImage: {
    width: '100%',
    height: '100%',
  },
  prodTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  prodSub: {
    fontSize: 7.5,
    color: '#64748B',
    marginTop: 1,
  },
  prodPrice: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stockPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  stockPillText: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#15803D',
  },
  dotsText: {
    color: '#64748B',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: -1,
  },
});

