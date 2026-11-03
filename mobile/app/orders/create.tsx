import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { opticalStore } from '../../src/store/opticalStore';
import { mockProducts } from '../../src/data/mockProducts';
import { Order } from '../../src/types/order';

export default function CreateOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [frame, setFrame] = useState('Titan Matte Black');
  const [lens, setLens] = useState('Crizal Blue UV Capture');
  const [deliveryDate, setDeliveryDate] = useState('02 Nov 2026');
  const [advance, setAdvance] = useState('2000');
  const [totalAmount, setTotalAmount] = useState('5800');

  const handleCreate = () => {
    if (!customer.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please enter customer name and phone number');
      return;
    }

    const total = parseFloat(totalAmount) || 5800;
    const adv = parseFloat(advance) || 0;
    const ordNum = `#ORD-2026-00${8 + Math.floor(Math.random() * 89)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: ordNum,
      customer: {
        id: `cust-${Date.now()}`,
        name: customer.trim(),
        phone: phone.trim(),
        tier: 'Regular Customer',
      },
      items: [
        {
          product: mockProducts[0],
          quantity: 1,
          price: total,
          subtitle: `${frame} + ${lens}`,
          tags: ['Lab Fitting', lens],
        },
      ],
      subtotal: total,
      discount: 0,
      tax: 0,
      total,
      advancePaid: adv,
      balanceDue: Math.max(0, total - adv),
      orderStatus: 'Delivered',
      paymentStatus: adv >= total ? 'Paid' : 'Partial (Advance)',
      paymentMethod: 'UPI',
      expectedDeliveryDate: deliveryDate || 'Delivered Today',
      createdAt: 'Today',
      notes: `Delivered order. Lens: ${lens}. Frame: ${frame}`,
      stepperStage: 4,
      lensTag: lens,
      lensDetails: {
        lensType: lens,
        lensMaterial: '1.56 Index',
        coating: 'Anti-Glare + Blue Cut',
        brand: 'Essilor',
        warranty: '2 Years',
        expectedDelivery: deliveryDate || '02 Nov 2026',
      },
    };

    opticalStore.addOrder(newOrder);

    Alert.alert(
      'Order Created',
      `Order ${ordNum} for ${customer} has been registered and sent to fitting lab!`,
      [{ text: 'View Orders', onPress: () => router.replace('/(tabs)/orders') }]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>New Lens Order</Text>
          <Text style={styles.headerSubtitle}>Spectacle assembly & lab edging</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Customer Name *</Text>
          <TextInput
            style={styles.input}
            value={customer}
            onChangeText={setCustomer}
            placeholder="e.g. Anand Sharma"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98260..."
            keyboardType="phone-pad"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Selected Frame Model</Text>
          <TextInput
            style={styles.input}
            value={frame}
            onChangeText={setFrame}
            placeholder="Titan Matte Black"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Prescription Lens Type</Text>
          <TextInput
            style={styles.input}
            value={lens}
            onChangeText={setLens}
            placeholder="Crizal Blue UV Capture"
            placeholderTextColor="#94A3B8"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Total Amount (₹)</Text>
              <TextInput
                style={styles.input}
                value={totalAmount}
                onChangeText={setTotalAmount}
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Advance (₹)</Text>
              <TextInput
                style={styles.input}
                value={advance}
                onChangeText={setAdvance}
                placeholder="1000"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <Text style={styles.label}>Expected Ready / Delivery Date</Text>
          <TextInput
            style={styles.input}
            value={deliveryDate}
            onChangeText={setDeliveryDate}
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity style={styles.btn} onPress={handleCreate} activeOpacity={0.88}>
            <Send size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Send Order to Fitting Lab</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#04281B',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, color: '#A7F3D0', marginTop: 2 },
  container: { flex: 1 },
  content: { padding: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 12, fontWeight: '600', color: '#1E293B', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    backgroundColor: '#064E3B',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  btnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
