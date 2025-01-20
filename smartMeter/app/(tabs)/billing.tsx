import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { Tab, Text, Card,Icon, Button } from '@rneui/themed';
import { color } from '@rneui/base';
import axios from 'axios';
import { Alert } from 'react-native';
import { useAppContext } from '../context/context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type BillData = {
  currentBalance: number;
  lastRecharge: {
    amount: number;
    date: string;
  };
  consumption: number;
  billDate: string;
  totalBill: number;
};

interface RechargeHistoryItem {
  _id: string;
  email: string;
  amountRecharged: number;
  dateOfRecharge: string; // You might want to use Date type if you plan to manipulate dates
  createdAt: string; // Same as above
  updatedAt: string; // Same as above
}




const BillTracker = () => {


  const {data, balance, setBalance} = useAppContext();
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);



  const [index, setIndex] = useState(0);

  const fetchHistory = async () =>{
    try {

      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3500/getHistory`, {
        email: data.email,
      });

      setRechargeHistory( response.data);
      
    } catch (error: any) {
        
      if(error.status === 401){

        Alert.alert("Attention","error.data.message");
      }
    }

    
  }

  useEffect(()=>{
    if(data){
      fetchHistory();
    }
    // sort();
    console.log("charge history",rechargeHistory);
  },[balance])



  const CurrentBillView = ({ balance, data, setBalance }: { balance: number; data: any; setBalance: (balance: number) => void; }) => {

    
    const [scratchCardNumber, setScratchCardNumber] = useState('');
    const [isRecharging, setIsRecharging] = useState<boolean>(false);

    

    const handleRechargeSubmit = async () => {

      if(!scratchCardNumber){
        Alert.alert("Attention","Please Enter a Card Number first");
        return;
      }
      try {
        const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3500/recharge`, {
          cardNumber: scratchCardNumber,
          email: data.email

        });
        // Handle successful response
        if (response.status === 200) {
          Alert.alert("Success", "Recharge successful");
          setBalance(response.data.newBalance);
          // Reset the input field and hide the text input
          // setScratchCardNumber('');
          setIsRecharging(false);
        }
      } catch (error: any) {
        // Handle error response
        if(error.status === 400){
          Alert.alert("Attention", "Card is already redeemed");

        }
        else{

          Alert.alert("Error", "An unexpected error occurred");
        }
      }
    };

    const handlePressRecharge = () =>{
      console.log("key pressed");
      setIsRecharging(true); 
    }

    if (!data) {
      return <Text>Loading...</Text>;
    }

    return (
      
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balance}>{balance?.toFixed(2)} Rs</Text>
          {!isRecharging ? (
            <View>
            <Button
              title="Recharge"
              buttonStyle={styles.rechargeButton}
              containerStyle={styles.buttonContainer}
              onPress={handlePressRecharge}
            />
            {rechargeHistory === null ?  
            <Text style={styles.rechargeText}>
            No recharge history available
          </Text>:
          <Text style={styles.rechargeText}>
          Last Recharge received on {new Date(rechargeHistory[rechargeHistory.length - 1]?.dateOfRecharge).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} was {rechargeHistory[rechargeHistory.length - 1]?.amountRecharged} Rs
        </Text>
            }
          </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter Scratch Card Number"
                value={scratchCardNumber}
                onChangeText={setScratchCardNumber}
              />
              <Button
                title="Submit"
                buttonStyle={styles.rechargeButton}
                containerStyle={styles.buttonContainer}
                onPress={handleRechargeSubmit}
              />
            </View>
          )}
        </Card>
      </View>
    );
  };

  const HistoryView = () => { 

    if (!rechargeHistory) {
      return <Text>Loading...</Text>;
    }

    return( 
    <ScrollView style={styles.container}>
      {rechargeHistory.reverse().map((item, idx) => (
        <Card key={idx} containerStyle={styles.historyCard}>
          <Text style={styles.historyDate}>{new Date(item.dateOfRecharge).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          <Text style={styles.historyAmount}>{item.amountRecharged} Rs</Text>
        </Card>
      ))}
    </ScrollView>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
        <FontAwesome6 color="#fff" size={24} name="hand-holding-dollar" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Recharge</Text>
            <Text style={styles.headerSubtitle}>{data.meterID}</Text>
          </View>
        </View>
      </View>
      <Tab value={index} onChange={setIndex} indicatorStyle={styles.indicator}>
        <Tab.Item titleStyle={styles.title}>Current Bill</Tab.Item>
        <Tab.Item titleStyle={styles.title}>History</Tab.Item>
      </Tab>
      {index === 0 ? <CurrentBillView balance={balance} data={data} setBalance={setBalance} /> : <HistoryView />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  buttonContainer: {
    marginVertical: 5,
  },
  rechargeButton: {
    backgroundColor: '#0047AB',
    borderRadius: 8,
    padding: 12,
  },
  rechargeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  billSummary: {
    marginTop: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0047AB',
  },
  historyCard: {
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
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
  title: {
    color: "#0047AB", // Blue text color
  },
  indicator: {
    backgroundColor: '#0047AB', // Blue indicator color
    height: 3, // Customize thickness of the indicator
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#28A745', // Green color for submit button
    borderRadius: 8,
    padding: 12,
  },
});

export default BillTracker;