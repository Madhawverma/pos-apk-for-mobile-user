import React, { useState, useEffect } from 'react';
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
  SlidersHorizontal,
  Star,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  User,
  Scan,
  EllipsisVertical,
  ShoppingCart,
  Percent,
  Zap,
  Phone,
  Package,
} from 'lucide-react-native';
import { mockProducts } from '../../src/data/mockProducts';
import { mockCustomers } from '../../src/data/mockCustomers';
import { cartManager, CartState } from '../../src/store/cartStore';
import { opticalStore } from '../../src/store/opticalStore';
import { Product } from '../../src/types/product';
import { Customer } from '../../src/types/customer';
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
 * High-precision vector illustration for each product in POS Catalog & Cart
 */
function ProductVisual({ id, size = 'card' }: { id: string; size?: 'card' | 'cart' }) {
  const scale = size === 'cart' ? 0.72 : 1;
  const widthVal = size === 'cart' ? 44 : 58;
  const heightVal = size === 'cart' ? 22 : 28;

  switch (id) {
    case 'prod-rb2140':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      );

    case 'prod-oakley009208':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
          <Path d="M28 7 L36 7" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          <Rect x="36" y="3" width="25" height="22" rx="7" stroke="#1E293B" strokeWidth="2.5" fill="#334155" />
          <Path d="M3 7 L0 6" stroke="#92400E" strokeWidth="2.8" />
          <Path d="M61 7 L64 6" stroke="#92400E" strokeWidth="2.8" />
        </Svg>
      );

    case 'prod-titan':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#CBD5E1" strokeWidth="2.5" fill="#F1F5F9" />
          <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#CBD5E1" strokeWidth="2.5" fill="#F1F5F9" />
          <Path d="M3 8 L0 8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M61 8 L64 8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );

    case 'prod-lenskart-air':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="4" width="25" height="19" rx="4" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M28 8 L36 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <Rect x="36" y="4" width="25" height="19" rx="4" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
          <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="3" />
          <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="3" />
        </Svg>
      );

    case 'prod-vogue':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.6" fill="#2563EB" />
          <Path d="M28 8 L36 8" stroke="#0F172A" strokeWidth="2.6" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.6" fill="#2563EB" />
          <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="2.6" />
          <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="2.6" />
        </Svg>
      );

    case 'prod-john-jacobs':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
          <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#D97706" strokeWidth="2.8" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#78350F" strokeWidth="2.8" fill="#FEF3C7" />
          <Path d="M3 8 L0 8" stroke="#D97706" strokeWidth="2.8" />
          <Path d="M61 8 L64 8" stroke="#D97706" strokeWidth="2.8" />
        </Svg>
      );

    case 'prod-blue-cut':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 54 28" fill="none">
          <Circle cx="27" cy="14" r="12" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
          <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="27" cy="14" r="3" fill="#60A5FA" />
        </Svg>
      );

    case 'prod-fastrack':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Path d="M3 5 C3 5, 15 2, 27 5 C28 17, 18 25, 12 25 C6 25, 3 17, 3 5 Z" stroke="#334155" strokeWidth="2" fill="#475569" />
          <Path d="M27 6 L37 6" stroke="#334155" strokeWidth="2" />
          <Path d="M27 9 L37 9" stroke="#334155" strokeWidth="1.5" />
          <Path d="M61 5 C61 5, 49 2, 37 5 C36 17, 46 25, 52 25 C58 25, 61 17, 61 5 Z" stroke="#334155" strokeWidth="2" fill="#475569" />
        </Svg>
      );

    case 'prod-acuvue':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 58 28" fill="none">
          <Rect x="2" y="4" width="54" height="20" rx="3" stroke="#2563EB" strokeWidth="1.5" fill="#EFF6FF" />
          <Rect x="6" y="8" width="20" height="4" rx="1" fill="#1D4ED8" />
          <Rect x="6" y="14" width="14" height="2" rx="1" fill="#60A5FA" />
          <Circle cx="44" cy="14" r="6" stroke="#3B82F6" strokeWidth="1.5" fill="#DBEAFE" />
        </Svg>
      );

    case 'prod-clean-kit':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 54 28" fill="none">
          <Rect x="6" y="8" width="10" height="18" rx="2" fill="#0284C7" />
          <Rect x="9" y="4" width="4" height="4" fill="#38BDF8" />
          <Path d="M7 4 L13 4" stroke="#0284C7" strokeWidth="1.5" />
          <Path d="M22 14 L48 10 L44 26 L18 24 Z" fill="#60A5FA" />
          <Path d="M24 16 L46 13 L43 24 L21 22 Z" fill="#3B82F6" />
        </Svg>
      );

    case 'prod-case':
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 54 28" fill="none">
          <Path d="M4 10 C4 6, 12 4, 27 4 C42 4, 50 6, 50 10 L47 24 C47 25, 40 26, 27 26 C14 26, 7 25, 7 24 Z" fill="#78350F" />
          <Path d="M4 10 C14 16, 40 16, 50 10" stroke="#92400E" strokeWidth="1.5" />
          <Circle cx="27" cy="18" r="3" fill="#F59E0B" />
        </Svg>
      );

    default:
      return (
        <Svg width={widthVal} height={heightVal} viewBox="0 0 64 28" fill="none">
          <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.5" fill="#F8FAFC" />
          <Path d="M28 8 L36 8" stroke="#0F172A" strokeWidth="2.5" />
          <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="2.5" fill="#F8FAFC" />
        </Svg>
      );
  }
}

export default function PosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartState>(cartManager.getState());

  // Quick Direct Sale form state (When no product exists or instant custom billing)
  const [showQuickSale, setShowQuickSale] = useState(true);
  const [quickProdName, setQuickProdName] = useState('');
  const [quickPrice, setQuickPrice] = useState('');
  const [quickCategory, setQuickCategory] = useState('Frames');
  const [quickEmoji, setQuickEmoji] = useState('👓');
  const [quickCustomerName, setQuickCustomerName] = useState('');
  const [quickCustomerPhone, setQuickCustomerPhone] = useState('');

  // Automatically update default emoji when typing product name or switching category
  const handleProductNameChange = (text: string) => {
    setQuickProdName(text);
    const autoEmoji = getProductEmoji(text, quickCategory);
    setQuickEmoji(autoEmoji);
  };

  const handleCategorySelect = (cat: string) => {
    setQuickCategory(cat);
    const autoEmoji = getProductEmoji(quickProdName, cat);
    setQuickEmoji(autoEmoji);
  };

  const [productsList, setProductsList] = useState<Product[]>(() => {
    const list = opticalStore.getState().products;
    return list && list.length > 0 ? list : mockProducts;
  });

  useEffect(() => {
    const unsubCart = cartManager.subscribe((st) => setCart({ ...st }));
    const unsubStore = opticalStore.subscribe(() => {
      const list = opticalStore.getState().products;
      setProductsList(list && list.length > 0 ? list : mockProducts);
    });
    return () => {
      unsubCart();
      unsubStore();
    };
  }, []);

  const categories = [
    { label: 'All', icon: null },
    { label: 'Frames', icon: 'frame' },
    { label: 'Sunglasses', icon: 'sunglass' },
    { label: 'Lenses', icon: 'lens' },
    { label: 'Contact Lenses', icon: 'contact' },
    { label: 'Accessories', icon: 'accessory' },
  ];

  const filteredProducts = productsList.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Handle Quick Direct Sale -> Adds product to store DB, attaches customer, routes to payment
  const handleQuickSaleProceed = () => {
    if (!quickProdName.trim()) {
      Alert.alert('Product Name Required', 'Please enter product name (e.g., Ray-Ban Frame, Blue Cut Lens).');
      return;
    }
    const priceNum = parseFloat(quickPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Price Required', 'Please enter a valid price for the item.');
      return;
    }

    // 1. Create and save product permanently in store and backend DB
    const finalEmoji = quickEmoji || getProductEmoji(quickProdName, quickCategory);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: quickProdName.trim(),
      code: `OPT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: quickCategory as any,
      brand: 'Custom / In-Store',
      price: priceNum,
      costPrice: Math.round(priceNum * 0.65),
      stock: 10,
      minStockAlert: 2,
      barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      description: `${quickProdName.trim()} created during POS Direct Sale`,
      emoji: finalEmoji,
    };

    opticalStore.addProduct(newProduct);

    // 2. Clear previous items and add this new product to Cart
    cartManager.clearCart();
    cartManager.addItem(newProduct, 1);

    // 3. If Customer details provided, save customer and assign to cart
    if (quickCustomerName.trim() || quickCustomerPhone.trim()) {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: quickCustomerName.trim() || 'Walk-in Customer',
        phone: quickCustomerPhone.trim() || '+91 99999 99999',
        city: 'Sehore',
        address: 'In-Store',
        status: 'Regular',
        totalOrders: 1,
        totalSpent: priceNum,
        lastVisit: 'Today',
        createdAt: new Date().toISOString().split('T')[0],
      };
      opticalStore.addCustomer(newCust);
      cartManager.setCustomer(newCust);
    } else {
      cartManager.setCustomer({
        id: 'cust-walkin',
        name: 'Walk-in Customer',
        phone: '+91 99999 99999',
        city: 'Sehore',
        status: 'Regular',
        totalOrders: 1,
        totalSpent: priceNum,
        lastVisit: 'Today',
        createdAt: new Date().toISOString().split('T')[0],
      } as Customer);
    }

    // 4. Reset quick inputs and navigate smoothly to payment
    setQuickProdName('');
    setQuickPrice('');
    setQuickCustomerName('');
    setQuickCustomerPhone('');

    router.push('/checkout/payment');
  };

  const totalCartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before proceeding.');
      return;
    }
    router.push('/checkout');
  };

  const handleAddDiscount = () => {
    Alert.prompt
      ? Alert.prompt(
          'Apply Discount',
          'Enter discount amount in ₹',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Apply',
              onPress: (val?: string) => {
                const num = parseFloat(val || '0');
                if (!isNaN(num) && num >= 0) {
                  cartManager.setDiscount(num);
                }
              },
            },
          ],
          'plain-text',
          cart.discount ? String(cart.discount) : '500'
        )
      : cartManager.setDiscount(cart.discount === 500 ? 0 : 500);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Top Header (Deep Optical Forest Green) */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerRow}>
          {/* Logo & Brand Name */}
          <View style={styles.headerLeft}>
            <HeaderGlassesLogo />
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>श्री गणेश ऑप्टिकल</Text>
              <Text style={styles.headerSubtitle}>इंग्लिशिपुरा, सीहोर • 6263732857</Text>
            </View>
          </View>

          {/* Right Action Icons: Scan, Search, Cart Badge, Menu */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.8}>
              <Scan size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.headerScanText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtnSmall} activeOpacity={0.8}>
              <Search size={19} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtnSmall} activeOpacity={0.8}>
              <ShoppingCart size={19} color="#FFFFFF" strokeWidth={2} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtnSmall} activeOpacity={0.8}>
              <EllipsisVertical size={19} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBox}>
          <Search size={17} color="#64748B" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search frames, goggles, lenses..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity activeOpacity={0.7}>
            <SlidersHorizontal size={17} color="#0F172A" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter Pills (Horizontal Scroll) */}
      <View style={styles.categoryScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
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
                {cat.icon === 'frame' && (
                  <View style={styles.catIconMini}>
                    <Svg width={18} height={9} viewBox="0 0 40 18" fill="none">
                      <Rect x="2" y="2" width="16" height="14" rx="4" stroke={isActive ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" />
                      <Path d="M18 6 L22 6" stroke={isActive ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" />
                      <Rect x="22" y="2" width="16" height="14" rx="4" stroke={isActive ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" />
                    </Svg>
                  </View>
                )}
                {cat.icon === 'sunglass' && (
                  <View style={styles.catIconMini}>
                    <Svg width={18} height={9} viewBox="0 0 40 18" fill="none">
                      <Rect x="2" y="2" width="16" height="14" rx="4" fill={isActive ? '#FFFFFF' : '#1E293B'} stroke={isActive ? '#FFFFFF' : '#1E293B'} strokeWidth="2" />
                      <Path d="M18 6 L22 6" stroke={isActive ? '#FFFFFF' : '#1E293B'} strokeWidth="2" />
                      <Rect x="22" y="2" width="16" height="14" rx="4" fill={isActive ? '#FFFFFF' : '#1E293B'} stroke={isActive ? '#FFFFFF' : '#1E293B'} strokeWidth="2" />
                    </Svg>
                  </View>
                )}
                {cat.icon === 'lens' && (
                  <View style={styles.catIconMini}>
                    <Circle cx={6} cy={6} r={5} stroke={isActive ? '#FFFFFF' : '#3B82F6'} strokeWidth="1.8" fill={isActive ? 'transparent' : '#DBEAFE'} />
                  </View>
                )}
                {cat.icon === 'contact' && (
                  <View style={styles.catIconMini}>
                    <Rect x={1} y={2} width={12} height={8} rx={2} stroke={isActive ? '#FFFFFF' : '#2563EB'} strokeWidth="1.5" />
                  </View>
                )}
                {cat.icon === 'accessory' && (
                  <View style={styles.catIconMini}>
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
      </View>

      {/* Clean Full-Screen Product Selection Catalog */}
      <ScrollView
        style={styles.catalogColumn}
        contentContainerStyle={[
          styles.catalogGridContent,
          { paddingBottom: totalCartCount > 0 ? 100 : 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Instant New Sale Quick Billing Card (When no products or fast manual billing) */}
        <View style={styles.quickSaleCard}>
          <View style={styles.quickSaleHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.quickSaleZapBox}>
                <Zap size={16} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.quickSaleTitle}>Instant Direct Sale</Text>
                <Text style={styles.quickSaleSub}>
                  Enter item & customer details directly to bill immediately
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowQuickSale(!showQuickSale)}
              style={styles.toggleQuickSaleBtn}
            >
              <Text style={styles.toggleQuickSaleText}>{showQuickSale ? 'Collapse ▲' : 'Open ▼'}</Text>
            </TouchableOpacity>
          </View>

          {showQuickSale && (
            <View style={styles.quickSaleBody}>
              {/* Product Details Section */}
              <View style={styles.quickSectionLabelRow}>
                <Package size={13} color="#064E3B" />
                <Text style={styles.quickSectionLabel}>PRODUCT DETAILS (Saved to Products automatically)</Text>
              </View>

              <View style={styles.quickInputRow}>
                <View style={{ flex: 1.6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={styles.fieldLabel}>Item / Product Name *</Text>
                    <Text style={{ fontSize: 11, color: '#064E3B', fontWeight: '700' }}>Icon: {quickEmoji}</Text>
                  </View>
                  <TextInput
                    style={styles.quickTextInput}
                    placeholder="e.g. Titan Frame / Blue Cut Lens"
                    placeholderTextColor="#94A3B8"
                    value={quickProdName}
                    onChangeText={handleProductNameChange}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Price (₹) *</Text>
                  <TextInput
                    style={styles.quickTextInput}
                    placeholder="₹ 1500"
                    placeholderTextColor="#94A3B8"
                    value={quickPrice}
                    onChangeText={setQuickPrice}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Category Pills & Emoji selector */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '700' }}>Category & Icon:</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {['👓', '🔍', '🕶️', '👁️', '🧰'].map((em) => (
                    <TouchableOpacity
                      key={em}
                      onPress={() => setQuickEmoji(em)}
                      style={[
                        { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
                        quickEmoji === em && { backgroundColor: '#A7F3D0', borderWidth: 1, borderColor: '#064E3B' },
                      ]}
                    >
                      <Text style={{ fontSize: 14 }}>{em}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.quickCategoryRow}>
                {['Frames', 'Sunglasses', 'Lenses', 'Accessories'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.quickCatPill, quickCategory === cat && styles.quickCatPillActive]}
                    onPress={() => handleCategorySelect(cat)}
                  >
                    <Text style={[styles.quickCatPillText, quickCategory === cat && styles.quickCatPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Customer Details Section */}
              <View style={[styles.quickSectionLabelRow, { marginTop: 12 }]}>
                <User size={13} color="#064E3B" />
                <Text style={styles.quickSectionLabel}>CUSTOMER DETAILS (Optional for instant billing)</Text>
              </View>

              <View style={styles.quickInputRow}>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.fieldLabel}>Customer Name</Text>
                  <TextInput
                    style={styles.quickTextInput}
                    placeholder="Customer Name"
                    placeholderTextColor="#94A3B8"
                    value={quickCustomerName}
                    onChangeText={setQuickCustomerName}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Mobile Number</Text>
                  <TextInput
                    style={styles.quickTextInput}
                    placeholder="10-digit mobile"
                    placeholderTextColor="#94A3B8"
                    value={quickCustomerPhone}
                    onChangeText={setQuickCustomerPhone}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Action Button: Proceed to Sale */}
              <TouchableOpacity
                style={styles.quickProceedBtn}
                onPress={handleQuickSaleProceed}
                activeOpacity={0.88}
              >
                <Zap size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.quickProceedBtnText}>
                  Save Product & Proceed to Payment →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyProductsNotice}>
            <Text style={styles.emptyProductsNoticeTitle}>No saved inventory products yet</Text>
            <Text style={styles.emptyProductsNoticeSub}>
              Use the Instant Direct Sale box above to bill a customer directly, or tap &quot;+&quot; on Products tab to add inventory stock.
            </Text>
          </View>
        )}

        <View style={styles.gridRowWrap}>
          {filteredProducts.map((prod) => {
            const inCart = cart.items.find((i) => i.product.id === prod.id);
            const cartQty = inCart ? inCart.quantity : 0;

            return (
              <View key={prod.id} style={styles.productCard}>
                {/* Star Favorite Outline */}
                <TouchableOpacity style={styles.starBtn} activeOpacity={0.7}>
                  <Star size={14} color="#94A3B8" strokeWidth={1.8} />
                </TouchableOpacity>

                {/* Product Image (Real photo or smart Emoji or fallback) */}
                <View style={styles.productVisualBox}>
                  {prod.image ? (
                    <Image
                      source={{ uri: prod.image }}
                      style={styles.realProductThumb}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 32 }}>
                      {prod.emoji || getProductEmoji(prod.name, prod.category)}
                    </Text>
                  )}
                </View>

                {/* Product Info */}
                <Text style={styles.productName} numberOfLines={1}>
                  {prod.name}
                </Text>
                <Text style={styles.productCategory}>{prod.category}</Text>

                {/* Price & Add / Stepper Controls */}
                <View style={styles.productFooter}>
                  <View>
                    <Text style={styles.productPrice}>{formatCurrency(prod.price)}</Text>
                    <Text style={styles.productStock}>Stock: {prod.stock}</Text>
                  </View>

                  {cartQty > 0 ? (
                    <View style={styles.cardQtyStepper}>
                      <TouchableOpacity
                        style={styles.cardStepBtn}
                        onPress={() => cartManager.updateQuantity(prod.id, cartQty - 1)}
                        activeOpacity={0.7}
                      >
                        <Minus size={12} color="#064E3B" strokeWidth={2.8} />
                      </TouchableOpacity>
                      <Text style={styles.cardStepQtyText}>{cartQty}</Text>
                      <TouchableOpacity
                        style={styles.cardStepBtn}
                        onPress={() => cartManager.addItem(prod, 1)}
                        activeOpacity={0.7}
                      >
                        <Plus size={12} color="#064E3B" strokeWidth={2.8} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addPlusBtn}
                      onPress={() => cartManager.addItem(prod, 1)}
                      activeOpacity={0.85}
                    >
                      <Plus size={15} color="#FFFFFF" strokeWidth={2.8} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Bar: Proceed to Checkout */}
      {totalCartCount > 0 && (
        <View style={[styles.floatingCheckoutBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
          <View style={styles.floatingCheckoutContent}>
            <View style={styles.floatingCartInfo}>
              <View style={styles.floatingCartBadge}>
                <ShoppingCart size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.floatingCartBadgeText}>{totalCartCount}</Text>
              </View>
              <View style={styles.floatingPriceBox}>
                <Text style={styles.floatingItemCountText}>
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} added
                </Text>
                <Text style={styles.floatingTotalValue}>
                  {formatCurrency(cartManager.getTotal())}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.proceedCheckoutFloatingBtn}
              onPress={handleCheckout}
              activeOpacity={0.88}
            >
              <Text style={styles.proceedCheckoutFloatingText}>Review & Checkout</Text>
              <ChevronRight size={17} color="#064E3B" strokeWidth={2.8} />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingHorizontal: 14,
    paddingBottom: 10,
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
    fontSize: 16.5,
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
    gap: 8,
  },
  headerIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerScanText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '600',
    marginTop: 1,
  },
  headerIconBtnSmall: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },

  /* Search Bar */
  searchBarWrapper: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    marginLeft: 8,
    paddingVertical: 0,
  },

  /* Category Filter Pills */
  categoryScrollWrapper: {
    marginTop: 10,
    marginBottom: 8,
  },
  categoryScrollContent: {
    paddingHorizontal: 12,
    gap: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  catIconMini: {
    marginRight: 5,
  },
  categoryPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Full-width Product Grid Layout */
  catalogColumn: {
    flex: 1,
    paddingHorizontal: 12,
  },
  catalogGridContent: {
    paddingTop: 6,
  },
  gridRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  starBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  productVisualBox: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  realProductThumb: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  productCategory: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  productStock: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },
  addPlusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  cardQtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  cardStepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStepQtyText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
    minWidth: 18,
    textAlign: 'center',
  },

  /* Floating Bottom Bar */
  floatingCheckoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingCheckoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingCartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 10,
  },
  floatingCartBadgeText: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  floatingPriceBox: {
    justifyContent: 'center',
  },
  floatingItemCountText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  floatingTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  proceedCheckoutFloatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A7F3D0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 4,
  },
  proceedCheckoutFloatingText: {
    color: '#064E3B',
    fontSize: 12.5,
    fontWeight: '800',
  },

  /* Quick Sale Direct Billing Card */
  quickSaleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  quickSaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickSaleZapBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSaleTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#064E3B',
  },
  quickSaleSub: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  toggleQuickSaleBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  toggleQuickSaleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064E3B',
  },
  quickSaleBody: {
    marginTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 14,
  },
  quickSectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  quickSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: 0.5,
  },
  quickInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  quickTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  quickCategoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quickCatPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickCatPillActive: {
    backgroundColor: '#064E3B',
  },
  quickCatPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  quickCatPillTextActive: {
    color: '#FFFFFF',
  },
  quickProceedBtn: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 14,
    gap: 8,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  quickProceedBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  emptyProductsNotice: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  emptyProductsNoticeTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 3,
  },
  emptyProductsNoticeSub: {
    fontSize: 11,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 15,
  },
});
