import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Invoice } from '../../data/mockInvoices';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/currency';

export const InvoiceRow: React.FC<{ invoice: Invoice; onPress?: () => void }> = ({ invoice, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <Text style={styles.no}>{invoice.invoiceNumber}</Text>
      <Text style={styles.status}>{invoice.status}</Text>
    </View>
    <Text style={styles.name}>{invoice.customerName}</Text>
    <Text style={styles.date}>{invoice.date}</Text>
    <View style={styles.bot}>
      <Text style={styles.total}>{formatCurrency(invoice.total)}</Text>
      {invoice.dueAmount > 0 ? <Text style={styles.due}>Due: {formatCurrency(invoice.dueAmount)}</Text> : null}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  no: { fontSize: 13, fontWeight: '700', color: colors.primary },
  status: { fontSize: 11, fontWeight: '600', color: colors.secondary },
  name: { fontSize: 13, fontWeight: '600', color: colors.text, marginVertical: 2 },
  date: { fontSize: 11, color: colors.textMuted },
  bot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.inputBg },
  total: { fontSize: 14, fontWeight: '700', color: colors.text },
  due: { fontSize: 12, fontWeight: '700', color: colors.danger },
});
