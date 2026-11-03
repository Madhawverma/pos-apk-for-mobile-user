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
  Switch,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Trash2,
  Pencil,
  ChevronRight,
  Plus,
  Minus,
  FileText,
  Percent,
  ShoppingCart,
  UserCheck,
} from 'lucide-react-native';
import { cartManager, CartState } from '../../src/store/cartStore';
import { formatCurrency } from '../../src/utils/currency';

const { width } = Dimensions.get('window');

/**
 * Thumbnail illustrations for items in the checkout cart
 */
function CartItemVisual({ id }: { id: string }) {
  if (id === 'prod-rb2140' || id.includes('frame') || id.includes('rb')) {
    return (
      <Svg width={46} height={22} viewBox="0 0 64 28" fill="none">
        <Rect x="3" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
        <Path d="M28 8 C30 6, 34 6, 36 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <Rect x="36" y="3" width="25" height="22" rx="6" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" />
        <Path d="M3 8 L0 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <Path d="M61 8 L64 8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    );
  }

  if (id === 'prod-blue-cut' || id.includes('lens')) {
    return (
      <Svg width={42} height={22} viewBox="0 0 54 28" fill="none">
        <Circle cx="27" cy="14" r="12" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
        <Path d="M19 9 C22 7, 32 7, 35 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="27" cy="14" r="3" fill="#60A5FA" />
      </Svg>
    );
  }

  return (
    <Svg width={44} height={22} viewBox="0 0 54 28" fill="none">
      <Path d="M4 10 C4 6, 12 4, 27 4 C42 4, 50 6, 50 10 L47 24 C47 25, 40 26, 27 26 C14 26, 7 25, 7 24 Z" fill="#78350F" />
      <Path d="M4 10 C14 16, 40 16, 50 10" stroke="#92400E" strokeWidth="1.5" />
      <Circle cx="27" cy="18" r="3" fill="#F59E0B" />
    </Svg>
  );
}

export default function CartReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cart, setCart] = useState<CartState>(cartManager.getState());
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('amount');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [gstEnabled, setGstEnabled] = useState(false); // Default GST is OFF (0%)

  useEffect(() => {
    const unsub = cartManager.subscribe((st) => setCart({ ...st }));
    return () => {
      unsub();
    };
  }, []);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountRate = parseFloat(discountPercent) || 0;
  const discountAmount =
    discountType === 'percent'
      ? Math.round(subtotal * (discountRate / 100))
      : discountRate;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = gstEnabled ? Math.round(taxableAmount * 0.18) : 0;
  const totalAmount = taxableAmount + gstAmount;

  const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToCustomer = () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add products before proceeding.');
      return;
    }
    cartManager.setDiscount(discountAmount);
    cartManager.setTaxRate(gstEnabled ? 0.18 : 0);
    router.push('/checkout/customer');
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
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
              <Text style={styles.headerTitle}>Review Cart Items</Text>
              <Text style={styles.headerSubtitle}>Step 1: Check selected products & bill</Text>
            </View>
          </View>

          {cart.items.length > 0 && (
            <TouchableOpacity
              style={styles.clearCartBtn}
              onPress={() => cartManager.clearCart()}
              activeOpacity={0.75}
            >
              <Trash2 size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.clearCartText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 4-Step Flow Stepper */}
      <View style={styles.stepperBar}>
        {/* Step 1: Cart (Active) */}
        <View style={styles.stepItemActive}>
          <View style={styles.stepCircleActive}>
            <Text style={styles.stepNumActive}>1</Text>
          </View>
          <Text style={styles.stepLabelActive}>Items</Text>
          <View style={styles.stepIndicatorLineActive} />
        </View>

        {/* Step 2: Customer */}
        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Customer</Text>
          <View style={styles.stepIndicatorLine} />
        </View>

        {/* Step 3: Payment */}
        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
          <View style={styles.stepIndicatorLine} />
        </View>

        {/* Step 4: Invoice */}
        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>4</Text>
          </View>
          <Text style={styles.stepLabel}>Invoice</Text>
          <View style={styles.stepIndicatorLine} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Items List Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Selected Products ({totalItemCount})</Text>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Plus size={13} color="#064E3B" style={{ marginRight: 3 }} />
              <Text style={styles.headerActionText}>Add More</Text>
            </TouchableOpacity>
          </View>

          {cart.items.length === 0 ? (
            <View style={styles.emptyBox}>
              <ShoppingCart size={36} color="#CBD5E1" />
              <Text style={styles.emptyText}>Cart is currently empty.</Text>
            </View>
          ) : (
            cart.items.map((item) => (
              <View key={item.product.id} style={styles.cartRow}>
                <View style={styles.itemVisualBox}>
                  <CartItemVisual id={item.product.id} />
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemSub}>
                    {item.product.frameType || item.product.category} • Black
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.product.price)}
                  </Text>
                </View>

                <View style={styles.itemRightCol}>
                  <TouchableOpacity
                    onPress={() => cartManager.removeItem(item.product.id)}
                    style={styles.trashBtn}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={13} color="#94A3B8" />
                  </TouchableOpacity>

                  <View style={styles.stepperPill}>
                    <TouchableOpacity
                      style={styles.stepTouch}
                      onPress={() =>
                        cartManager.updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <Minus size={11} color="#475569" strokeWidth={2.5} />
                    </TouchableOpacity>

                    <Text style={styles.stepQtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.stepTouch}
                      onPress={() =>
                        cartManager.updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <Plus size={11} color="#475569" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Discount & Taxes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Discount & Taxes</Text>
            <View style={styles.segmentControl}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  discountType === 'percent' && styles.segmentBtnActive,
                ]}
                onPress={() => setDiscountType('percent')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    discountType === 'percent' && styles.segmentBtnTextActive,
                  ]}
                >
                  %
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  discountType === 'amount' && styles.segmentBtnActive,
                ]}
                onPress={() => setDiscountType('amount')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    discountType === 'amount' && styles.segmentBtnTextActive,
                  ]}
                >
                  ₹
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.discountInputRow}>
            <View style={styles.discountPlaceholderBox}>
              <Text style={styles.discountPlaceholderText}>
                Discount {discountType === 'percent' ? 'percentage' : 'amount'}
              </Text>
            </View>
            <View style={styles.discountValueBox}>
              <TextInput
                style={styles.discountValueInput}
                value={discountPercent}
                onChangeText={setDiscountPercent}
                keyboardType="numeric"
              />
              <Text style={styles.discountPercentSign}>
                {discountType === 'percent' ? '%' : '₹'}
              </Text>
            </View>
          </View>

          <View style={styles.gstRow}>
            <View style={styles.gstTitleBox}>
              <FileText size={15} color="#0F172A" style={{ marginRight: 6 }} />
              <Text style={styles.gstLabel}>Apply GST (18%)</Text>
            </View>

            <Switch
              value={gstEnabled}
              onValueChange={setGstEnabled}
              trackColor={{ false: '#CBD5E1', true: '#064E3B' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Bill Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>Subtotal ({totalItemCount} items)</Text>
            <Text style={styles.billValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>
              Discount ({discountType === 'percent' ? `${discountPercent}%` : 'Flat'})
            </Text>
            <Text style={styles.billDiscountValue}>
              - {formatCurrency(discountAmount)}
            </Text>
          </View>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>GST (18%)</Text>
            <Text style={styles.billValue}>{gstEnabled ? formatCurrency(gstAmount) : '₹0 (Disabled)'}</Text>
          </View>

          <View style={styles.billDivider} />

          <View style={styles.billTotalLine}>
            <Text style={styles.billTotalLabel}>Total Amount</Text>
            <Text style={styles.billTotalValue}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handleProceedToCustomer}
          activeOpacity={0.88}
        >
          <Text style={styles.proceedBtnText}>Next: Select Customer →</Text>
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
  clearCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
  },
  clearCartText: {
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
  stepItemActive: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
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
  stepIndicatorLine: {
    display: 'none',
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064E3B',
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '600',
  },

  /* Cart Row */
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemVisualBox: {
    width: 48,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemSub: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  itemRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  trashBtn: {
    padding: 3,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepTouch: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stepQtyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 18,
    textAlign: 'center',
  },

  /* Discount controls */
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#064E3B',
  },
  discountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  discountPlaceholderBox: {
    flex: 1,
  },
  discountPlaceholderText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  discountValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  discountValueInput: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    width: 38,
    textAlign: 'center',
    paddingVertical: 2,
  },
  discountPercentSign: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 2,
  },
  gstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  gstTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gstLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Bill Summary */
  billLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  billLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  billDiscountValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  billTotalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billTotalLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
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
