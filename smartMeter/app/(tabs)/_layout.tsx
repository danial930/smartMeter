import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AppProvider } from '../context/context';




export default function TabLayout() {

  return (
    <AppProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color}) => <MaterialIcons color={color} size={30} name="home" />,
        }}
      />
      <Tabs.Screen
        name="billing"
        options={{
          title: 'Recharge',
          tabBarIcon: ({ color }) => <FontAwesome5 color={color} size={20} name="money-check-alt" />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={30} name="query-stats" />,
        }}
      />
    </Tabs>
    </AppProvider>
  );
}
