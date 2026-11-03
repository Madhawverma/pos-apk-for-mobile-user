import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Ellipsis,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activePill : styles.inactivePill}>
              <Home
                size={19}
                color={focused ? colors.primary : colors.textMuted}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pos"
        options={{
          title: 'POS',
          tabBarLabel: 'POS',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activePill : styles.inactivePill}>
              <ShoppingCart
                size={20}
                color={focused ? colors.primary : colors.textMuted}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarLabel: 'Products',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activePill : styles.inactivePill}>
              <Package
                size={20}
                color={focused ? colors.primary : colors.textMuted}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarLabel: 'Customers',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activePill : styles.inactivePill}>
              <Users
                size={20}
                color={focused ? colors.primary : colors.textMuted}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Invoices',
          tabBarLabel: 'Invoices',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activePill : styles.inactivePill}>
              <FileText
                size={20}
                color={focused ? colors.primary : colors.textMuted}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          href: null,
          title: 'Orders',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'More',
          tabBarLabel: 'More',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activePill : styles.inactivePill}>
              <Ellipsis
                size={20}
                color={focused ? colors.primary : colors.textMuted}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activePill: {
    backgroundColor: '#DCFCE7', // Soft mint green active indicator
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactivePill: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
