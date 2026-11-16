import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { authStorage } from '../src/services/authStorage';

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await authStorage.getSession();
        if (session && session.isLoggedIn) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: '#04281B', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  // If user already logged in, directly open Dashboard, never show login again!
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // First time or explicitly logged out -> open login
  return <Redirect href="/(auth)/login" />;
}
