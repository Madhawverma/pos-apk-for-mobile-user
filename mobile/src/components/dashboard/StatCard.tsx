import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  indicatorColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, indicatorColor = colors.primary }) => {
  return (
    <View style={[styles.card, { borderLeftColor: indicatorColor }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  value: { fontSize: 20, fontWeight: '700', color: colors.text, marginVertical: 4 },
  subtext: { fontSize: 11, color: colors.textMuted },
});
