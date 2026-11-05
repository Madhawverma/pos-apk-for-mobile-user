import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Direct instant redirect to login - zero delay, no custom splash screen
  return <Redirect href="/(auth)/login" />;
}
