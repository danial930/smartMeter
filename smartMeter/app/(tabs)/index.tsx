import React, { useContext, useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Platform, ScrollView, TouchableOpacity, Modal, NativeSyntheticEvent, NativeScrollEvent, RefreshControl, Alert } from 'react-native';
import { Text, Button, Card, Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAppContext } from '../context/context';
import axios from 'axios';

interface DashboardProps {
  userName: string;
  accountNumber: string;
  balance: number;
  lastRecharge: {
    amount: number;
    date: string;
  };
  meterStatus: 'Connected' | 'Disconnected';
  onRecharge?: () => void;
  onViewBill?: () => void;
  navigation: any;
}


const DashboardScreen: React.FC<DashboardProps> = () => {

  const {data, balance, pricePerUnit, setBalance} = useAppContext();

  
  const [showMenu, setShowMenu] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const getData = async () =>{

    console.log("done");
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3500/getUser`, {
        email: data?.email
      });
      // Handle successful response
      if (response.status === 200) {
        // console.log(response.data.existingUser.balance);
        setBalance(response.data.existingUser.balance);
      }
    } catch (error: any) {
      Alert.alert("Couldn't Refresh", "Retry again");
      console.log(error);
      setRefreshing(false);
    }
  }
  
  const onRefresh = async () => {
    console.log(data.email);
    setRefreshing(true);
    
    await getData();
    setRefreshing(false);
  };

  const meterStatus: 'connected' | 'disconnected' = data?.meterStatus || 'Disconnected';


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.back();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <View style={styles.headerLeft}>
      <Icon
            name="location"
            type="entypo"
            color="#fff"
            size={24}
          />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>My Meter</Text>
          <Text style={styles.headerSubtitle}>{data?.meterID}</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          style={styles.menuButton}
        >
          <Icon name="dots-three-vertical" type="entypo" color="#fff" />
        </TouchableOpacity>

        <Modal
          visible={showMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowMenu(false)}
          >
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
              >
                <Text style={styles.dropdownText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Hello, {data?.fullName}</Text>

        {/* Balance Card */}
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } scrollEventThrottle={16}>
        <Card containerStyle={styles.balanceCard}>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Here's your current balance</Text>
              <Icon
                name="information-circle-outline"
                type="ionicon"
                size={20}
                color="#666"
              />
            </View>
            <Text style={styles.balanceAmount}>{balance?.toFixed(2)} Rs</Text>
            <View style={styles.meterStatus}>
              <Text style={styles.meterStatusText}>
                Meter Status: 
                <Text style={[
                  styles.meterStatusValue,
                  { color: meterStatus === 'connected' ? '#4CAF50' : '#F44336' }
                ]}>
                  {' '}{meterStatus}
                </Text>
              </Text>
            </View>
            <Text style={styles.powerUnits}>
              You can use approximately <Text style={styles.powerUnitsAmount}>{(balance / pricePerUnit).toFixed(2)}</Text> power units with your current balance.
            </Text>
          </View>

        </Card>

        
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 8,
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  dropdown: {
    position: 'absolute',
    right: 16,
    top: 70,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2C3E50',
  },
  balanceCard: {
    borderRadius: 12,
    padding: 16,
    margin: 0,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    marginVertical: 8,
  },
  lastRecharge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meterStatus: {
    marginTop: 8,
  },
  meterStatusText: {
    fontSize: 14,
    color: '#666',
  },
  meterStatusValue: {
    fontWeight: '600',
  },
  buttonContainer: {
    marginVertical: 5,
  },
  rechargeButton: {
    backgroundColor: '#0047AB',
    borderRadius: 8,
    padding: 12,
  },
  viewBillButton: {
    borderColor: '#0047AB',
    borderRadius: 8,
    padding: 12,
  },
  viewBillText: {
    color: '#0047AB',
  },
  usageSection: {
    marginTop: 20,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  chartAxisText: {
    color: '#666',
    fontSize: 12,
  },
  tooltip: {
    backgroundColor: '#2C3E50',
    padding: 8,
    borderRadius: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
    width: 150,
    backgroundColor: '#fff',
    position: 'absolute',
    right: 0,
    top: 40,
    zIndex: 1000,
  },
  powerUnits: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  powerUnitsAmount: {
    fontWeight: 'bold',
    fontSize:16
  },
});

export default DashboardScreen;