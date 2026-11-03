import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../../src/theme/colors';
import { mockInvoices, Invoice } from '../../../src/data/mockInvoices';
import { formatCurrency } from '../../../src/utils/currency';
import { opticalStore } from '../../../src/store/opticalStore';
import { pdfService, numberToWords } from '../../../src/services/pdfService';

export default function InvoicePreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Subscribe to live optical store
  const [storeState, setStoreState] = useState(() => opticalStore.getState());
  useEffect(() => {
    return opticalStore.subscribe(() => {
      setStoreState(opticalStore.getState());
    });
  }, []);

  const inv: Invoice | null =
    storeState.invoices.find((i) => i.id === id || i.invoiceNumber === id) ||
    (storeState.invoices.length > 0 ? storeState.invoices[0] : null) ||
    mockInvoices.find((i) => i.id === id || i.invoiceNumber === id) ||
    mockInvoices[0] ||
    null;

  if (!inv) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 16, color: colors.textMuted }}>Invoice not found</Text>
      </View>
    );
  }

  const customerName = inv.customerName || inv.customer?.name || 'Customer';
  const customerPhone = inv.customerPhone || inv.customer?.phone || '6263732857';
  const items = inv.items && inv.items.length > 0 ? inv.items : [
    { description: 'Complete Eyewear Set', qty: 1, unitPrice: inv.total || 0, amount: inv.total || 0 }
  ];
  const totalAmount = inv.total || items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paidAmount = inv.paidAmount !== undefined ? inv.paidAmount : totalAmount;
  const dueAmount = inv.dueAmount !== undefined ? inv.dueAmount : Math.max(0, totalAmount - paidAmount);

  const handlePrint = async () => {
    try {
      await pdfService.printInvoice(inv);
    } catch (e: any) {
      Alert.alert('Printer Error', e?.message || 'Could not print bill');
    }
  };

  const handleShare = async () => {
    try {
      await pdfService.sharePdf(inv);
    } catch (e: any) {
      Alert.alert('Share Error', e?.message || 'Could not share PDF');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.invoicePaper}>
        <Text style={styles.storeName}>🙏 श्री गणेश ऑप्टिकल, सीहोर 🙏</Text>
        <Text style={styles.storeAddr}>ASG Eye Hospital के पास, इंग्लिशिपुरा, सीहोर (म.प्र.) - 466001</Text>
        <Text style={styles.storeGst}>📞 संपर्क: +91 6263732857 • प्रो. माधव वर्मा</Text>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <Text style={styles.meta}>Bill To: <Text style={{ fontWeight: '800' }}>{customerName}</Text></Text>
          <Text style={styles.meta}>Invoice: <Text style={{ fontWeight: '800' }}>{inv.invoiceNumber}</Text></Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Phone: {customerPhone}</Text>
          <Text style={styles.meta}>Date: {inv.date || 'Today'} {inv.time || ''}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tr, styles.th]}>
            <Text style={[styles.td, { flex: 2.2, fontWeight: '800' }]}>Description</Text>
            <Text style={[styles.td, { width: 40, textAlign: 'center', fontWeight: '800' }]}>Qty</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right', fontWeight: '800' }]}>Rate</Text>
            <Text style={[styles.td, { flex: 1.2, textAlign: 'right', fontWeight: '800' }]}>Total</Text>
          </View>
          {items.map((i, idx) => (
            <View key={idx} style={styles.tr}>
              <Text style={[styles.td, { flex: 2.2 }]}>{i.description}</Text>
              <Text style={[styles.td, { width: 40, textAlign: 'center' }]}>{i.qty}</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{formatCurrency(i.unitPrice)}</Text>
              <Text style={[styles.td, { flex: 1.2, textAlign: 'right', fontWeight: '700' }]}>{formatCurrency(i.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}><Text style={styles.tLbl}>Total Amount:</Text><Text style={[styles.tVal, { fontSize: 15, color: '#04281B' }]}>{formatCurrency(totalAmount)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.tLbl}>Paid Amount:</Text><Text style={[styles.tVal, { color: '#15803D' }]}>{formatCurrency(paidAmount)}</Text></View>
          {dueAmount > 0 && (
            <View style={styles.totalRow}><Text style={styles.tLbl}>Balance Due:</Text><Text style={[styles.tVal, { color: '#DC2626' }]}>{formatCurrency(dueAmount)}</Text></View>
          )}
        </View>

        <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 6 }}>
          <Text style={{ fontSize: 9.5, color: '#64748B' }}>Amount in Words: <Text style={{ fontStyle: 'italic', fontWeight: '600' }}>{numberToWords(totalAmount)}</Text></Text>
        </View>

        <Text style={styles.footerNote}>🙏 श्री गणेश ऑप्टिकल, सीहोर से खरीदारी के लिए धन्यवाद! 👓✨</Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📤 Share Official PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
          <Text style={styles.printBtnText}>🖨️ Print Invoice Bill</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  content: { padding: 16 },
  invoicePaper: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#CBD5E1', marginBottom: 16, elevation: 3 },
  storeName: { fontSize: 18, fontWeight: '900', color: '#04281B', textAlign: 'center' },
  storeAddr: { fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 3, fontWeight: '500' },
  storeGst: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 3 },
  divider: { height: 1.5, backgroundColor: '#E2E8F0', marginVertical: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  meta: { fontSize: 12.5, color: '#1E293B' },
  table: { marginVertical: 12, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, overflow: 'hidden' },
  tr: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  th: { backgroundColor: '#F8FAFC' },
  td: { fontSize: 12, color: '#1E293B' },
  totals: { marginTop: 8, gap: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  tLbl: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  tVal: { fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  footerNote: { textAlign: 'center', fontSize: 11, color: '#064E3B', marginTop: 16, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10 },
  shareBtn: { flex: 1, backgroundColor: '#064E3B', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  shareBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  printBtn: { flex: 1, backgroundColor: '#1E293B', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  printBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
