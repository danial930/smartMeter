import React, { useState } from 'react';
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
  onRegister,
}) => {
  const [Email, setEmail] = useState<string>('');
  const [Name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showEye, setShowEye] = useState<boolean>(true);
  const [showPass, setShowPass] = useState<boolean>(true);
  const [meterID, setMeterID] = useState<string>("");


  const handleRegister = async (): Promise<void> => {
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3500/signup`, {
        email: Email,
        fullName: Name,
        password: password,
        meterID: meterID,
      });
      // Handle successful registration response
      if(response.status === 201){
        Alert.alert("success", "regestration successfulll")
        router.back();
      }
      console.log('Registration successful:', response.data);
    } catch (error: any) {
      // Handle error response
      if(error.status === 409){
        Alert.alert("Attention", "User already exists")
      }
    }
  };

  const handleOTPLogin = (): void => {
    if (onOTPLogin) {
      onOTPLogin();
      
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          {/* Input Fields */}
          
            <Text style={styles.balanceAmount} >Enter Your Details</Text>
          
          <Input
            placeholder="Full Name"
            value={Name}
            onChangeText={setName}
            maxLength={15}
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputField}
            inputStyle={styles.inputText}
            placeholderTextColor="#999"
            leftIcon={{
              type: 'feather',
              name: 'user',
              color: '#666',
              size: 18,
              style: styles.inputIcon
            }}
          />
          <Input
            placeholder="Email"
            value={Email}
            onChangeText={setEmail}
            maxLength={15}
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
            placeholder="Meter ID"
            value={meterID}
            onChangeText={setMeterID}
            keyboardType="numeric"
            maxLength={15}
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputField}
            inputStyle={styles.inputText}
            placeholderTextColor="#999"
            leftIcon={{
              type: 'materialIcons',
              name: 'electric-meter',
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
            title="Register"
            onPress={handleRegister}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.loginButton}
          />

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