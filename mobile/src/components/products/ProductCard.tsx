import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../../types/product';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/currency';

interface Props {
  product: Product;
  onPress?: () => void;
  onAdd?: () => void;
}

export const ProductCard: React.FC<Props> = ({ product, onPress, onAdd }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.top}>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={[styles.stock, product.stock <= product.minStockAlert && styles.low]}>{product.stock} in stock</Text>
    </View>
    <Text style={styles.name}>{product.name}</Text>
    <Text style={styles.code}>{product.code}</Text>
    <View style={styles.bot}>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      {onAdd ? (
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  brand: { fontSize: 11, color: colors.primary, fontWeight: '700' },
  stock: { fontSize: 11, color: colors.success, fontWeight: '600' },
  low: { color: colors.danger },
  name: { fontSize: 14, fontWeight: '600', color: colors.text, marginVertical: 3 },
  code: { fontSize: 11, color: colors.textMuted },
  bot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  price: { fontSize: 15, fontWeight: '700', color: colors.text },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  addText: { color: colors.white, fontSize: 11, fontWeight: '700' },
});
