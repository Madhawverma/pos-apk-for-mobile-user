import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../../types/order';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/currency';

export const OrderItemCard: React.FC<{ order: Order; onPress?: () => void }> = ({ order, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <Text style={styles.orderNo}>{order.orderNumber}</Text>
      <Text style={styles.status}>{order.orderStatus}</Text>
    </View>
    <Text style={styles.customer}>{order.customer.name}</Text>
    <Text style={styles.due}>Due: {order.expectedDeliveryDate}</Text>
    <View style={styles.bot}>
      <Text style={styles.total}>Total: {formatCurrency(order.total)}</Text>
      <Text style={[styles.bal, order.balanceDue > 0 ? styles.dueText : styles.paidText]}>
        {order.balanceDue > 0 ? 'Due: ' + formatCurrency(order.balanceDue) : 'Paid'}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  orderNo: { fontSize: 13, fontWeight: '700', color: colors.primary },
  status: { fontSize: 11, fontWeight: '700', color: colors.secondary },
  customer: { fontSize: 14, fontWeight: '600', color: colors.text, marginVertical: 3 },
  due: { fontSize: 11, color: colors.textMuted },
  bot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.inputBg },
  total: { fontSize: 13, fontWeight: '700', color: colors.text },
  bal: { fontSize: 12, fontWeight: '700' },
  dueText: { color: colors.danger },
  paidText: { color: colors.success },
});
