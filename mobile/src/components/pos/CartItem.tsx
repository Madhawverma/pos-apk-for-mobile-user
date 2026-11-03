import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/currency';

interface Props {
  name: string;
  price: number;
  qty: number;
  onInc: () => void;
  onDec: () => void;
}

export const CartItemRow: React.FC<Props> = ({ name, price, qty, onInc, onDec }) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.rate}>{formatCurrency(price)} each</Text>
    </View>
    <View style={styles.stepper}>
      <TouchableOpacity onPress={onDec}><Text style={styles.btn}>-</Text></TouchableOpacity>
      <Text style={styles.qty}>{qty}</Text>
      <TouchableOpacity onPress={onInc}><Text style={styles.btn}>+</Text></TouchableOpacity>
    </View>
    <Text style={styles.total}>{formatCurrency(price * qty)}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.inputBg },
  name: { fontSize: 13, fontWeight: '600', color: colors.text },
  rate: { fontSize: 11, color: colors.textMuted },
  stepper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  btn: { fontSize: 16, fontWeight: '700', color: colors.primary, paddingHorizontal: 6 },
  qty: { fontSize: 13, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  total: { fontSize: 13, fontWeight: '700', color: colors.text, width: 70, textAlign: 'right' },
});
