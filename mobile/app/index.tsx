import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Directly opens the login screen
  return <Redirect href="/(auth)/login" />;
}
