import React, { useState } from 'react';
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
  Check,
  Banknote,
  QrCode,
  CreditCard,
  Split,
  Pencil,
  MapPin,
  FileText,
  ShieldCheck,
  CornerDownLeft,
  User,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react-native';
import { cartManager } from '../../src/store/cartStore';
import { opticalStore } from '../../src/store/opticalStore';
import { Invoice } from '../../src/data/mockInvoices';
import { Order, PaymentStatus } from '../../src/types/order';
import { formatCurrency } from '../../src/utils/currency';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cart = cartManager.getState();
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Split'>('Cash');

  // Compute live subtotal & totals from actual cart
  const subtotal = cartManager.getSubtotal() || 0;
  const [discountAmount, setDiscountAmount] = useState(cart.discount || 0);
  const [customTotalInput, setCustomTotalInput] = useState<string>('');
  const [isEditingTotal, setIsEditingTotal] = useState(false);

  // Default calculated total: Uses exact admin-entered price without mandatory GST
  const appliedTaxRate = typeof cart.taxRate === 'number' ? cart.taxRate : 0;
  const defaultCalculatedTotal = Math.max(0, subtotal - discountAmount + Math.round(Math.max(0, subtotal - discountAmount) * appliedTaxRate));
  const effectiveTotal = customTotalInput !== '' && !isNaN(parseFloat(customTotalInput))
    ? Math.max(0, parseFloat(customTotalInput))
    : defaultCalculatedTotal;

  // Custom paid / received amount (Admin can set full, partial/advance, or 0 for credit/udhaar)
  const [receivedAmount, setReceivedAmount] = useState(String(effectiveTotal));
  const [paymentNote, setPaymentNote] = useState('Full payment received.');

  const numericReceived = parseFloat(receivedAmount) || 0;
  const changeToReturn = Math.max(0, numericReceived - effectiveTotal);
  const balanceDue = Math.max(0, effectiveTotal - numericReceived);

  const customerName = cart.selectedCustomer?.name || 'Walk-in Customer';
  const customerPhone = cart.selectedCustomer?.phone || '+91 99999 99999';

  const handleFinishPayment = () => {
    const invNumber = opticalStore.getNextInvoiceNumber();
    const ordNumber = `#ORD-2026-00${8 + Math.floor(Math.random() * 89)}`;

    const actualPaid = Math.min(numericReceived, effectiveTotal);
    const invoiceStatus = balanceDue === 0 ? 'Paid' : (actualPaid > 0 ? 'Partial' : 'Pending');
    const orderPaymentStatus: PaymentStatus = balanceDue === 0 ? 'Paid' : (actualPaid > 0 ? 'Partial (Advance)' : 'Due');
    const invoicePaymentMethod: 'Cash' | 'UPI' | 'Card' = paymentMode === 'Split' ? 'Cash' : paymentMode;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      customer: {
        name: customerName,
        phone: customerPhone,
        initials:
          customerName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'WC',
        avatarBg: '#DCFCE7',
        avatarColor: '#15803D',
        email: cart.selectedCustomer?.email || 'customer@email.com',
        address: cart.selectedCustomer?.address || 'Sehore, MP',
      },
      customerName,
      customerPhone,
      itemCount: cart.items.length || 1,
      itemType: 'frame',
      items:
        cart.items.length > 0
          ? cart.items.map((i) => ({
              description: i.product.name,
              qty: i.quantity,
              unitPrice: i.product.price,
              amount: i.product.price * i.quantity,
            }))
          : [
              {
                description: 'Custom Optical Order',
                qty: 1,
                unitPrice: effectiveTotal,
                amount: effectiveTotal,
              },
            ],
      total: effectiveTotal,
      paidAmount: actualPaid,
      dueAmount: balanceDue,
      status: invoiceStatus as any,
      paymentMethod: invoicePaymentMethod,
    };

    opticalStore.addInvoice(newInvoice);
    cartManager.setLastGeneratedInvoiceId(newInvoice.id);

    // Deduct stocks for items
    cart.items.forEach((item) => {
      opticalStore.updateProductStock(item.product.id, -item.quantity);
    });

    // Update customer history if customer exists
    if (cart.selectedCustomer?.id) {
      opticalStore.updateCustomerOrders(cart.selectedCustomer.id, effectiveTotal);
    }

    // Add order to orders list
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: ordNumber,
      customer: {
        id: cart.selectedCustomer?.id || 'cust-walkin',
        name: customerName,
        phone: customerPhone,
        email: cart.selectedCustomer?.email,
        address: cart.selectedCustomer?.address,
        tier: cart.selectedCustomer?.status || 'Regular Customer',
      },
      items:
        cart.items.length > 0
          ? cart.items.map((i) => ({
              product: i.product,
              quantity: i.quantity,
              price: i.product.price,
              subtitle: i.lensCustomization || i.product.brand,
              tags: [i.product.brand, i.product.category],
            }))
          : [],
      subtotal,
      discount: discountAmount,
      tax: Math.round(Math.max(0, subtotal - discountAmount) * (cart.taxRate || 0.18)),
      total: effectiveTotal,
      advancePaid: actualPaid,
      balanceDue: balanceDue,
      orderStatus: 'Delivered',
      paymentStatus: orderPaymentStatus,
      paymentMethod: invoicePaymentMethod,
      expectedDeliveryDate: cart.expectedDeliveryDate || 'Delivered Today',
      createdAt: 'Today',
      notes: paymentNote,
      stepperStage: 4,
    };
    opticalStore.addOrder(newOrder);

    cartManager.setAdvancePayment(actualPaid);
    cartManager.setNotes(paymentNote);
    router.replace('/checkout/success');
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
              <Text style={styles.headerTitle}>Select Payment Method</Text>
              <Text style={styles.headerSubtitle}>Step 3: Choose payment mode & complete sale</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 4-Step Stepper Bar */}
      <View style={styles.stepperBar}>
        <View style={styles.stepItemDone}>
          <CheckCircle2 size={16} color="#059669" />
          <Text style={styles.stepLabelDone}>Items</Text>
        </View>

        <View style={styles.stepItemDone}>
          <CheckCircle2 size={16} color="#059669" />
          <Text style={styles.stepLabelDone}>Customer</Text>
        </View>

        <View style={styles.stepItemActive}>
          <View style={styles.stepCircleActive}>
            <Text style={styles.stepNumActive}>3</Text>
          </View>
          <Text style={styles.stepLabelActive}>Payment</Text>
          <View style={styles.stepIndicatorLineActive} />
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
        {/* Total Payable Banner Card (Editable by Admin) */}
        <View style={styles.totalAmountCard}>
          <View style={styles.totalLeftBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.totalCardLabel}>Total Amount to Pay</Text>
              <TouchableOpacity
                onPress={() => setIsEditingTotal(!isEditingTotal)}
                style={styles.editTotalBadge}
                activeOpacity={0.7}
              >
                <Pencil size={11} color="#064E3B" />
                <Text style={styles.editTotalBadgeText}>{isEditingTotal ? 'Done' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            {isEditingTotal ? (
              <View style={styles.customTotalInputRow}>
                <Text style={styles.customTotalPrefix}>₹</Text>
                <TextInput
                  style={styles.customTotalInput}
                  value={customTotalInput !== '' ? customTotalInput : String(effectiveTotal)}
                  onChangeText={(val) => {
                    setCustomTotalInput(val);
                    const parsed = parseFloat(val);
                    if (!isNaN(parsed)) {
                      setReceivedAmount(String(parsed));
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="Custom Total"
                  placeholderTextColor="#94A3B8"
                  selectTextOnFocus
                  autoFocus
                />
              </View>
            ) : (
              <Text style={styles.totalCardValue}>{formatCurrency(effectiveTotal)}</Text>
            )}

            {customTotalInput !== '' && (
              <TouchableOpacity
                onPress={() => {
                  setCustomTotalInput('');
                  setReceivedAmount(String(defaultCalculatedTotal));
                  setIsEditingTotal(false);
                }}
                style={{ marginTop: 4 }}
              >
                <Text style={{ fontSize: 10, color: '#0284C7', fontWeight: '600' }}>
                  ↺ Reset to default (₹{defaultCalculatedTotal})
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.totalRightBreakdown}>
            <View style={styles.miniBreakdownLine}>
              <Text style={styles.miniLabel}>Items ({cart.items.length})</Text>
              <Text style={styles.miniValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.miniBreakdownLine}>
              <Text style={styles.miniLabel}>Discount</Text>
              <Text style={[styles.miniValue, { color: '#EF4444', fontWeight: '800' }]}>
                - {formatCurrency(discountAmount)}
              </Text>
            </View>
            <View style={styles.miniBreakdownLine}>
              <Text style={styles.miniLabel}>GST {appliedTaxRate > 0 ? '(18%)' : ''}</Text>
              <Text style={styles.miniValue}>
                {appliedTaxRate > 0
                  ? formatCurrency(Math.round(Math.max(0, subtotal - discountAmount) * appliedTaxRate))
                  : '₹0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Customer Snapshot Card */}
        <View style={styles.customerSnapshotCard}>
          <View style={styles.customerAvatarBox}>
            <User size={20} color="#064E3B" strokeWidth={2.4} />
          </View>
          <View style={styles.customerSnapshotInfo}>
            <Text style={styles.customerSnapshotName}>{customerName}</Text>
            <Text style={styles.customerSnapshotPhone}>{customerPhone}</Text>
          </View>
          <TouchableOpacity
            style={styles.changeCustBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Pencil size={12} color="#064E3B" style={{ marginRight: 3 }} />
            <Text style={styles.changeCustText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Select Payment Method Grid (Large & Clear) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Choose Payment Mode</Text>

          <View style={styles.paymentMethodsGrid}>
            {/* Cash */}
            <TouchableOpacity
              style={[styles.methodTile, paymentMode === 'Cash' && styles.methodTileActive]}
              onPress={() => {
                setPaymentMode('Cash');
                setReceivedAmount(String(effectiveTotal));
              }}
              activeOpacity={0.85}
            >
              <View style={styles.methodTileTop}>
                <View style={[styles.methodIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Banknote size={22} color="#15803D" strokeWidth={2.4} />
                </View>
                <View style={[styles.radioCircle, paymentMode === 'Cash' && styles.radioCircleActive]}>
                  {paymentMode === 'Cash' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </View>
              <Text style={styles.methodTileName}>Cash</Text>
              <Text style={styles.methodTileSub}>Cash payment</Text>
            </TouchableOpacity>

            {/* UPI */}
            <TouchableOpacity
              style={[styles.methodTile, paymentMode === 'UPI' && styles.methodTileActive]}
              onPress={() => setPaymentMode('UPI')}
              activeOpacity={0.85}
            >
              <View style={styles.methodTileTop}>
                <View style={[styles.methodIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <QrCode size={22} color="#7E22CE" strokeWidth={2.4} />
                </View>
                <View style={[styles.radioCircle, paymentMode === 'UPI' && styles.radioCircleActive]}>
                  {paymentMode === 'UPI' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </View>
              <Text style={styles.methodTileName}>UPI QR</Text>
              <Text style={styles.methodTileSub}>GPay, PhonePe, Paytm</Text>
            </TouchableOpacity>

            {/* Card */}
            <TouchableOpacity
              style={[styles.methodTile, paymentMode === 'Card' && styles.methodTileActive]}
              onPress={() => setPaymentMode('Card')}
              activeOpacity={0.85}
            >
              <View style={styles.methodTileTop}>
                <View style={[styles.methodIconBox, { backgroundColor: '#FCE7F3' }]}>
                  <CreditCard size={22} color="#BE185D" strokeWidth={2.4} />
                </View>
                <View style={[styles.radioCircle, paymentMode === 'Card' && styles.radioCircleActive]}>
                  {paymentMode === 'Card' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </View>
              <Text style={styles.methodTileName}>Card (POS)</Text>
              <Text style={styles.methodTileSub}>Debit or Credit Card</Text>
            </TouchableOpacity>

            {/* Split */}
            <TouchableOpacity
              style={[styles.methodTile, paymentMode === 'Split' && styles.methodTileActive]}
              onPress={() => setPaymentMode('Split')}
              activeOpacity={0.85}
            >
              <View style={styles.methodTileTop}>
                <View style={[styles.methodIconBox, { backgroundColor: '#FFEDD5' }]}>
                  <Split size={22} color="#C2410C" strokeWidth={2.4} />
                </View>
                <View style={[styles.radioCircle, paymentMode === 'Split' && styles.radioCircleActive]}>
                  {paymentMode === 'Split' && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </View>
              <Text style={styles.methodTileName}>Split Pay</Text>
              <Text style={styles.methodTileSub}>Cash + Online</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cash Calculation Box */}
        {paymentMode === 'Cash' && (
          <View style={styles.card}>
            <View style={styles.cashSectionHeader}>
              <Banknote size={18} color="#15803D" style={{ marginRight: 6 }} />
              <Text style={styles.cashSectionTitle}>Cash Calculation</Text>
            </View>

            <Text style={styles.inputLabel}>Amount Received from Customer</Text>
            <View style={styles.amountInputBox}>
              <Text style={styles.rupeePrefix}>₹</Text>
              <TextInput
                style={styles.amountTextInput}
                value={receivedAmount}
                onChangeText={setReceivedAmount}
                keyboardType="numeric"
                selectTextOnFocus
              />
            </View>

            {/* Quick Exact / Rounded Pills */}
            <View style={styles.quickPillsRow}>
              <TouchableOpacity
                style={styles.quickPill}
                onPress={() => setReceivedAmount(String(effectiveTotal))}
                activeOpacity={0.8}
              >
                <Text style={styles.quickPillText}>Exact ₹{effectiveTotal}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickPill}
                onPress={() => setReceivedAmount(String(Math.ceil(effectiveTotal / 500) * 500))}
                activeOpacity={0.8}
              >
                <Text style={styles.quickPillText}>Round ₹{Math.ceil(effectiveTotal / 500) * 500}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickPill}
                onPress={() => setReceivedAmount(String(Math.ceil(effectiveTotal / 1000) * 1000))}
                activeOpacity={0.8}
              >
                <Text style={styles.quickPillText}>₹{Math.ceil(effectiveTotal / 1000) * 1000}</Text>
              </TouchableOpacity>
            </View>

            {/* Change to Return or Balance Due */}
            {balanceDue > 0 ? (
              <View style={[styles.changeReturnCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                <View style={[styles.changeIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <CornerDownLeft size={20} color="#DC2626" strokeWidth={2.4} />
                </View>
                <View style={styles.changeTextBox}>
                  <Text style={[styles.changeLabel, { color: '#991B1B' }]}>Balance Due (Udhaar / Credit)</Text>
                  <Text style={[styles.changeAmount, { color: '#DC2626' }]}>{formatCurrency(balanceDue)}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.changeReturnCard}>
                <View style={styles.changeIconBox}>
                  <CornerDownLeft size={20} color="#064E3B" strokeWidth={2.4} />
                </View>
                <View style={styles.changeTextBox}>
                  <Text style={styles.changeLabel}>Change to Return to Customer</Text>
                  <Text style={styles.changeAmount}>{formatCurrency(changeToReturn)}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Payment Remarks Note */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Payment Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={paymentNote}
            onChangeText={setPaymentNote}
            placeholder="Add special delivery remarks, payment references..."
            placeholderTextColor="#94A3B8"
            multiline
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={handleFinishPayment}
          activeOpacity={0.88}
        >
          <ShieldCheck size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.completeBtnText}>Complete Payment & Generate Invoice →</Text>
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
    width: 36,
    height: 36,
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
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
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
    padding: 16,
    gap: 14,
  },

  /* Total Payable Banner Card */
  totalAmountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  totalLeftBox: {
    flex: 1.1,
  },
  editTotalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  editTotalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#064E3B',
  },
  customTotalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    backgroundColor: '#F0FDF4',
  },
  customTotalPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064E3B',
    marginRight: 4,
  },
  customTotalInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    padding: 0,
  },
  totalCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  totalCardValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#064E3B',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  totalRightBreakdown: {
    flex: 0.9,
    borderLeftWidth: 1.5,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 14,
  },
  miniBreakdownLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  miniLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  miniValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Customer Snapshot */
  customerSnapshotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  customerAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customerSnapshotInfo: {
    flex: 1,
  },
  customerSnapshotName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B',
  },
  customerSnapshotPhone: {
    fontSize: 11.5,
    color: '#047857',
    marginTop: 1,
  },
  changeCustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  changeCustText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064E3B',
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },

  /* Payment Methods Grid */
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodTile: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  methodTileActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#064E3B',
  },
  methodTileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  methodIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  methodTileName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodTileSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Cash Payment Section */
  cashSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cashSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
  },
  rupeePrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 0,
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  quickPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  changeReturnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  changeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  changeTextBox: {
    flex: 1,
  },
  changeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064E3B',
  },
  changeAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    marginTop: 2,
  },

  /* Note */
  noteInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    minHeight: 64,
    textAlignVertical: 'top',
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  completeBtn: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
