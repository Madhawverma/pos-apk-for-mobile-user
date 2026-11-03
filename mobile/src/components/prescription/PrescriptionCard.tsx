import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Prescription } from '../../types/prescription';
import { colors } from '../../theme/colors';

export const PrescriptionCard: React.FC<{ prescription: Prescription; onPress?: () => void }> = ({ prescription, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.date}>Rx Date: {prescription.date}</Text>
      <Text style={styles.doc}>{prescription.optometristName}</Text>
    </View>
    <Text style={styles.power}>OD (R): SPH {prescription.od.sph} | CYL {prescription.od.cyl} | AXIS {prescription.od.axis}°</Text>
    <Text style={styles.power}>OS (L): SPH {prescription.os.sph} | CYL {prescription.os.cyl} | AXIS {prescription.os.axis}°</Text>
    <Text style={styles.pd}>PD: {prescription.pd} mm • {prescription.lensRecommendation || 'Anti-Glare'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  date: { fontSize: 12, fontWeight: '700', color: colors.primary },
  doc: { fontSize: 11, color: colors.textMuted },
  power: { fontSize: 12, color: colors.text, marginVertical: 1 },
  pd: { fontSize: 11, color: colors.secondary, fontWeight: '600', marginTop: 4 },
});
