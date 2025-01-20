import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { createTheme } from '@rneui/themed';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = createTheme({
    lightColors: {
      primary: 'red',
    },
    darkColors: {
      primary: 'blue',
    },
    components: {
      Button: {
        raised: true,
      },
    },
  });

  return (
    
      <> 
      
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerTitle: "Signup", headerTintColor:"white", headerStyle: {
          backgroundColor: '#0047AB',
        },}} />
        <Stack.Screen name="+not-found" />
      </Stack>
      
      <StatusBar style="auto" />
      
      </>
  );
}
