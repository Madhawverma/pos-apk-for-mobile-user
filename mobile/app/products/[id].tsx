import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Clipboard,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { opticalStore } from '../../src/store/opticalStore';
import { cartManager } from '../../src/store/cartStore';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Heart,
  Star,
  Package,
  Pencil,
  Copy,
  Trash2,
  FileText,
  Coins,
  BarChart2,
  Tag,
  Clock,
  Glasses,
  Check,
  ShoppingCart,
  Plus,
  Share2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * Optical Eyeglasses Logo for Top Header
 */
function HeaderGlassesLogo() {
  return (
    <Svg width={38} height={18} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Brand Logo Badge
 */
function BrandBadge({ brand }: { brand: string }) {
  return (
    <View style={styles.brandBadgeContainer}>
      <Text style={styles.brandText}>{brand || 'Optical'}</Text>
      <Text style={styles.brandSubtitleText}>GENUINE & CERTIFIED</Text>
    </View>
  );
}

/**
 * Fallback SVG Visual if product has no photo
 */
function FallbackGlassesVisual() {
  return (
    <Svg width={180} height={100} viewBox="0 0 160 95" fill="none">
      <Path
        d="M18 22 C32 18, 62 17, 72 24 C72 44, 66 68, 52 74 C36 80, 20 72, 16 52 Z"
        stroke="#064E3B"
        strokeWidth="5"
        fill="#F0FDF4"
      />
      <Path d="M72 26 C76 22, 84 22, 88 26" stroke="#064E3B" strokeWidth="5" strokeLinecap="round" />
      <Path
        d="M88 24 C98 17, 128 18, 142 22 C144 52, 124 80, 108 74 C94 68, 88 44, 88 24 Z"
        stroke="#064E3B"
        strokeWidth="5"
        fill="#F0FDF4"
      />
      <Path d="M26 30 C36 28, 58 28, 64 34" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  // Load product from opticalStore
  const products = opticalStore.getState().products;
  const product = products.find((p) => p.id === id) || products[0];

  const [activeAngle, setActiveAngle] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  const productImages = product?.images && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  const handleCopyBarcode = () => {
    const code = product?.barcode || '8901234567890';
    Clipboard.setString(code);
    Alert.alert('Copied', `Barcode ${code} copied to clipboard!`);
  };

  const handleEdit = () => {
    router.push('/products/add');
  };

  const handleAddToCart = () => {
    if (!product) return;
    cartManager.addItem(product, 1);
    Alert.alert(
      'Added to Cart',
      `${product.name} added to POS cart!`,
      [
        { text: 'Go to Cart', onPress: () => router.push('/checkout') },
        { text: 'Continue', style: 'cancel' },
      ]
    );
  };

  const handleDuplicate = () => {
    Alert.alert('Duplicate Product', `Create a copy of "${product?.name || 'Product'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Duplicate', onPress: () => router.push('/products/add') },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${product?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Deleted', 'Product removed from inventory.');
          router.back();
        },
      },
    ]);
  };

  const profitAmount = (product?.price || 0) - (product?.costPrice || 0);
  const profitMargin = product?.costPrice ? Math.round((profitAmount / product.costPrice) * 100) : 0;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerContent}>
          {/* Left Arrow & Titles */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Product Details</Text>
              <Text style={styles.headerSubtitle}>
                Catalog, stock & inventory specifications
              </Text>
            </View>
          </View>

          {/* Right Brand Badge */}
          <View style={styles.brandContainer}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandTitle}>Shree Ganesh Optical</Text>
              <Text style={styles.brandSubtitle}>OPTICAL POS</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Product Hero Card (Full Width & Clean) */}
        <View style={styles.heroCard}>
          {/* Top Wishlist / Status Row */}
          <View style={styles.heroTopRow}>
            <View style={styles.inStockBadge}>
              <Text style={styles.inStockText}>
                {product?.stock && product.stock > 0 ? `In Stock (${product.stock} pcs)` : 'Out of Stock'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => setIsWishlist(!isWishlist)}
              activeOpacity={0.7}
            >
              <Heart
                size={18}
                color={isWishlist ? '#EF4444' : '#64748B'}
                fill={isWishlist ? '#EF4444' : 'none'}
              />
            </TouchableOpacity>
          </View>

          {/* Large Hero Image or Visual */}
          <View style={styles.heroImageContainer}>
            {productImages.length > 0 ? (
              <Image
                source={{ uri: productImages[activeAngle] || productImages[0] }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : (
              <FallbackGlassesVisual />
            )}
          </View>

          {/* Thumbnails Row if multiple photos */}
          {productImages.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsScroll}>
              <View style={styles.thumbnailsRow}>
                {productImages.map((uri, idx) => (
                  <TouchableOpacity
                    key={`thumb-${idx}`}
                    style={[
                      styles.thumbnailBox,
                      activeAngle === idx && styles.thumbnailBoxActive,
                    ]}
                    onPress={() => setActiveAngle(idx)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Product Title & Brand */}
          <View style={styles.titleAndBrandRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product?.name || 'Optical Product'}</Text>
              <Text style={styles.productSubtitle}>
                {product?.brand} • {product?.category} • {product?.frameType || 'Full Rim'}
              </Text>
            </View>
            <BrandBadge brand={product?.brand || 'Ray-Ban'} />
          </View>

          {/* Price & Rating Row */}
          <View style={styles.priceAndStockRow}>
            <View>
              <Text style={styles.priceLabel}>Selling Price</Text>
              <View style={styles.priceRow}>
                <Text style={styles.sellingPrice}>₹{(product?.price || 0).toLocaleString()}</Text>
                {product?.costPrice ? (
                  <Text style={styles.mrpText}>₹{Math.round(product.price * 1.25).toLocaleString()}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.ratingBox}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingScore}>4.8</Text>
              <Text style={styles.ratingCount}>(120 reviews)</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons: Add to POS Cart + Edit + Duplicate + Delete */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <ShoppingCart size={18} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 8 }} />
            <Text style={styles.addToCartBtnText}>Add to POS Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={handleEdit}
            activeOpacity={0.8}
          >
            <Pencil size={18} color="#064E3B" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={handleDuplicate}
            activeOpacity={0.8}
          >
            <Copy size={18} color="#0F172A" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconActionBtn, styles.deleteActionBtn]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Trash2 size={18} color="#DC2626" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* 1. Pricing & Profit Breakdown Card */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.greenIconSquare}>
              <Coins size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.cardHeaderTitle}>Pricing & Profit Summary</Text>
          </View>

          <View style={styles.pricingBoxesRow}>
            <View style={styles.pricingMiniBox}>
              <Text style={styles.miniBoxLabel}>Purchase Price</Text>
              <Text style={styles.miniBoxValue}>₹{(product?.costPrice || 0).toLocaleString()}</Text>
            </View>

            <View style={styles.pricingMiniBox}>
              <Text style={styles.miniBoxLabel}>Selling Price</Text>
              <Text style={[styles.miniBoxValue, { color: '#064E3B' }]}>
                ₹{(product?.price || 0).toLocaleString()}
              </Text>
            </View>

            <View style={[styles.pricingMiniBox, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.miniBoxLabel}>Profit Margin</Text>
              <Text style={[styles.miniBoxValue, { color: '#059669' }]}>
                ₹{profitAmount.toLocaleString()} ({profitMargin}%)
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Specifications & Product Details Card */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.greenIconSquare}>
              <FileText size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.cardHeaderTitle}>Product Specifications</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Brand</Text>
            <Text style={styles.infoValue}>{product?.brand || 'Ray-Ban'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Model / SKU</Text>
            <Text style={styles.infoValue}>{product?.code || 'RB-2140'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{product?.category || 'Frames'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Frame Type</Text>
            <Text style={styles.infoValue}>{product?.frameType || 'Full Rim'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Material</Text>
            <Text style={styles.infoValue}>{product?.material || 'Acetate'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Barcode</Text>
            <TouchableOpacity
              style={styles.barcodeValueRow}
              onPress={handleCopyBarcode}
              activeOpacity={0.7}
            >
              <Text style={styles.barcodeText}>{product?.barcode || '8901234567890'}</Text>
              <Copy size={14} color="#059669" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {product?.description ? (
            <View style={styles.descBox}>
              <Text style={styles.descLabel}>Description</Text>
              <Text style={styles.descText}>{product.description}</Text>
            </View>
          ) : null}
        </View>

        {/* 3. Inventory & Stock Status Card */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.greenIconSquare}>
              <Package size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.cardHeaderTitle}>Inventory & Stock Status</Text>
          </View>

          <View style={styles.stockStatusContainer}>
            <View style={styles.stockStatusLeft}>
              <Text style={styles.stockStatusLabel}>Current Physical Stock</Text>
              <Text style={styles.stockStatusCount}>{product?.stock || 0} Pieces Available</Text>
            </View>

            <TouchableOpacity
              style={styles.stockUpdateBtn}
              onPress={() => router.push('/inventory/stock')}
              activeOpacity={0.8}
            >
              <Text style={styles.stockUpdateBtnText}>Adjust Stock</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Recent Sales History */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.greenIconSquare}>
                <Clock size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.cardHeaderTitle, { marginLeft: 8 }]}>Recent Sales History</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/orders')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View All Orders</Text>
            </TouchableOpacity>
          </View>

          {/* Sales list */}
          {[
            { date: 'Today, 11:20 AM', invoice: 'INV-2026-089', customer: 'Ramesh Sharma', qty: 1, amount: product?.price || 8500 },
            { date: 'Yesterday', invoice: 'INV-2026-081', customer: 'Pooja Verma', qty: 1, amount: product?.price || 8500 },
          ].map((sale, idx) => (
            <View key={sale.invoice} style={[styles.saleHistoryRow, idx === 1 && { borderBottomWidth: 0 }]}>
              <View>
                <Text style={styles.saleInvoiceText}>{sale.invoice} • {sale.customer}</Text>
                <Text style={styles.saleDateText}>{sale.date}</Text>
              </View>
              <Text style={styles.saleAmountText}>₹{sale.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  /* Header */
  header: {
    backgroundColor: '#04281B',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 2,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  brandTextContainer: {
    marginLeft: 6,
  },
  brandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandSubtitle: {
    fontSize: 8,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 0.8,
  },

  /* Scroll Content */
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 24,
  },

  /* Hero Card */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  inStockText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsScroll: {
    marginBottom: 12,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnailBox: {
    width: 54,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  thumbnailBoxActive: {
    borderColor: '#064E3B',
    borderWidth: 2,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  titleAndBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  productSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 4,
  },
  brandBadgeContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#DC2626',
    fontStyle: 'italic',
  },
  brandSubtitleText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  priceAndStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  sellingPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064E3B',
  },
  mrpText: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  ratingScore: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#92400E',
  },
  ratingCount: {
    fontSize: 10.5,
    color: '#B45309',
  },

  /* Action Buttons Row */
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#064E3B',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  greenIconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
  },

  /* Pricing Breakdown Boxes */
  pricingBoxesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pricingMiniBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  miniBoxLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  miniBoxValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },

  /* Info Key-Values */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  barcodeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  barcodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#064E3B',
  },
  descBox: {
    paddingTop: 12,
  },
  descLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  descText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },

  /* Stock Status */
  stockStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stockStatusLeft: {},
  stockStatusLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  stockStatusCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 2,
  },
  stockUpdateBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stockUpdateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Sales History List */
  saleHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  saleInvoiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  saleDateText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  saleAmountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B',
  },
});
