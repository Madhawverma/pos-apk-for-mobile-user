import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { colors } from '../src/theme/colors';
import { opticalStore } from '../src/store/opticalStore';

export default function RootLayout() {
  useEffect(() => {
    // Connect and load fresh data from backend database on app start
    opticalStore.syncFromBackend();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="customers/add" options={{ headerShown: false }} />
      <Stack.Screen name="customers/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="customers/prescription/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="products/add" options={{ headerShown: false }} />
      <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="products/categories" options={{ headerShown: false }} />
      <Stack.Screen name="orders/create" options={{ headerShown: false }} />
      <Stack.Screen name="orders/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="invoices/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/index" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/customer" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/payment" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/success" options={{ headerShown: false }} />
    </Stack>
  );
}
