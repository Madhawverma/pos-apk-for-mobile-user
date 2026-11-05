import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.shopName}>श्री गणेश ऑप्टिकल (Shree Ganesh Optical)</Text>
        <Text style={styles.addr}>ASG Eye Hospital के पास, इंग्लिशिपुरा, सीहोर (म.प्र.) - 466001</Text>
        <Text style={styles.gst}>📞 +91 6263732857</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.secTitle}>Store Configuration</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/shop-profile')}>
          <Text style={styles.itemText}>🏪 Shop Profile & Address</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/invoice-settings')}>
          <Text style={styles.itemText}>🧾 Invoice & GST Settings</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/inventory/stock')}>
          <Text style={styles.itemText}>📦 Stock & Inventory Alerts</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/inventory/suppliers')}>
          <Text style={styles.itemText}>🏭 Frame Suppliers & Lens Labs</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.secTitle}>Reports & Business Analytics</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/reports/sales')}>
          <Text style={styles.itemText}>📈 Sales & Tax Report</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/reports/inventory')}>
          <Text style={styles.itemText}>🏷️ Stock Valuation Report</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/reports/profit')}>
          <Text style={styles.itemText}>💰 Profit & Loss Statement</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert('Lock POS', 'Do you want to lock POS terminal?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Lock', onPress: () => router.replace('/(auth)/login') }
            ]);
          }}
        >
          <Text style={styles.logoutText}>Lock Terminal / Exit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerCard: { backgroundColor: colors.card, padding: 14, margin: 10, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: colors.primary, borderWidth: 1, borderColor: colors.border },
  shopName: { fontSize: 17, fontWeight: '800', color: colors.primary },
  addr: { fontSize: 12, color: colors.text, marginTop: 2 },
  gst: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  section: { backgroundColor: colors.card, marginHorizontal: 10, marginBottom: 10, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border },
  secTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.inputBg },
  itemText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  arrow: { fontSize: 16, color: colors.textMuted },
  logoutBtn: { paddingVertical: 10, alignItems: 'center' },
  logoutText: { color: colors.danger, fontSize: 13, fontWeight: '700' },
});
