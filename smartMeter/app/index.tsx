import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Alert } from 'react-native';
import { 
  Input, 
  Button, 
  Text, 
  CheckBox,
  ThemeProvider,
  createTheme
} from '@rneui/themed';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin?: (mobileNumber: string, password: string) => void;
  onOTPLogin?: () => void;
  onRegister?: () => void;
}

const theme = createTheme({
  lightColors: {
    primary: '#0047AB',
  },
  darkColors: {
    primary: '#0047AB',
  },
  mode: 'light',
});

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onOTPLogin,
}) => {
  const [Email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showEye, setShowEye] = useState<boolean>(true);
  const [showPass, setShowPass] = useState<boolean>(true);

 

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3500/login`, {
        email: Email,
        password: password,
      });
      // Handle successful login response
      if (response.status === 200) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        Alert.alert("Success", "Login successful");
        router.push("/(tabs)"); // Navigate to the main app screen
      }
      console.log('Login successful:', response.data);
    } catch (error: any) {
      // Handle error response
      if (error.response && error.response.status === 401) {
        Alert.alert("Error", "Invalid credentials");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    }
  };

  const handleOTPLogin = (): void => {
    
  };

  const onRegister = () =>{
    router.push("/signup")
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          {/* Input Fields */}
          
            <Text style={styles.balanceAmount} >Welcome</Text>
          
          <Input
            placeholder="Email"
            value={Email}
            onChangeText={setEmail}
            maxLength={50}
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputField}
            inputStyle={styles.inputText}
            placeholderTextColor="#999"
            leftIcon={{
              type: 'feather',
              name: 'mail',
              color: '#666',
              size: 18,
              style: styles.inputIcon
            }}
          />
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry = {showPass}
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputField}
            inputStyle={styles.inputText}
            placeholderTextColor="#999"
            leftIcon={{
              type: 'feather',
              name: 'lock',
              color: '#666',
              size: 18,
              style: styles.inputIcon
            }}
            rightIcon={showEye ? {
              type: 'feather',
              name: 'eye-off',
              color: '#666',
              size: 18,
              style: styles.inputIcon,
              onPress: ()=> {setShowEye(!showEye);setShowPass(!showPass)}
            }:
            {
              type: 'feather',
              name: 'eye',
              color: '#666',
              size: 18,
              style: styles.inputIcon,
              onPress: () => {setShowEye(!showEye);setShowPass(!showPass)}
            }}
          />

          {/* Remember Me Checkbox */}

          {/* Login Button */}
          <Button
            title="Login"
            onPress={handleLogin}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.loginButton}
          />

          {/* Help Links */}
          <View style={styles.helpLinksContainer}>
            
            <Text style={styles.helpText}>
              Don't have an account?{' '}
              <Text 
                style={styles.linkText}
                onPress={onRegister}
              >
                Register Here
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex:1,
    justifyContent:"center",
    padding: 20,
    marginTop: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1, // Override RNE default
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 5,
    height: 48,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 20,
  },
  buttonContainer: {
    marginHorizontal: 0,
    marginVertical: 5,
  },
  loginButton: {
    padding: 15,
    borderRadius: 5,
  },
  otpButton: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#666',
  },
  helpLinksContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  helpText: {
    color: '#333',
    marginBottom: 10,
  },
  linkText: {
    color: '#0047AB',
    textDecorationLine: 'underline',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  footerLink: {
    color: '#666',
    textDecorationLine: 'underline',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0047AB',
    marginBottom: 30,
    textAlign:"center"
  },
});

export default LoginScreen;