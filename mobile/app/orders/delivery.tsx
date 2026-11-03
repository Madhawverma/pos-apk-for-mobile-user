import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function OrderDeliveryScreen() {
  const router = useRouter();
  const [collected, setCollected] = useState(false);

  const handleDeliver = () => {
    Alert.alert('Spectacles Delivered', 'Order marked delivered & balance payment logged!', [
      { text: 'OK', onPress: () => router.replace('/(tabs)/orders') }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Spectacle Handover / Delivery</Text>
        <Text style={styles.cust}>Customer: Rajesh Sharma (+91 98261 23456)</Text>
        <Text style={styles.order}>Order: #SGO-2024-1001</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.secTitle}>Payment Settlement</Text>
        <Text style={styles.dueText}>Remaining Balance Due: ₹3,565</Text>
        <TouchableOpacity
          style={[styles.collectBtn, collected && styles.collectBtnActive]}
          onPress={() => setCollected(!collected)}
        >
          <Text style={styles.collectText}>{collected ? '✓ Balance Payment Collected' : 'Mark Balance As Received'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deliverBtn} onPress={handleDeliver}>
        <Text style={styles.deliverBtnText}>Confirm Delivery to Customer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 14 },
  card: { backgroundColor: colors.card, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '800', color: colors.primary, marginBottom: 6 },
  cust: { fontSize: 13, fontWeight: '600', color: colors.text },
  order: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  secTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  dueText: { fontSize: 14, fontWeight: '700', color: colors.danger, marginBottom: 10 },
  collectBtn: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  collectBtnActive: { backgroundColor: colors.badge.ready, borderColor: colors.badge.readyText },
  collectText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  deliverBtn: { backgroundColor: colors.primary, borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  deliverBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },
});
