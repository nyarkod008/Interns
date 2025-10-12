import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TabNavigator from './src/navigation/TabNavigator';
import { ErrorBoundary, OfflineIndicator } from './src/components';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <OfflineIndicator />
          <TabNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
