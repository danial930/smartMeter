import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';


const pricePerUnit = 35;
const powerPerUnit = 1000;

interface GraphDataType {
  value: number;
  label: string;
  dataPointText: string;
}



interface AppContextType {
  data: any; // Replace 'any' with your specific data type
  balance: number;
  error: string | null;
  userNumber: string | null;
  pricePerUnit: number;
  powerPerUnit: number;
  
  graphData: GraphDataType[];
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setGraphData: React.Dispatch<React.SetStateAction<GraphDataType[]>>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [data, setData] = useState<any>(null); // Replace 'any' with your specific data type
  const [balance, setBalance] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [userNumber, setUserNumber] = useState<string | null>("12345768");

  const [graphData, setGraphData] = useState<GraphDataType[]>([
    { value: 0, label: '0s', dataPointText: '0' }
  ]);

  const loadUserData = async () => {
    
      try {
        const userData = await AsyncStorage.getItem('user');
        
        if (userData) {
          const temp = JSON.parse(userData);
          
          setData(temp.existingUser)
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      console.log("inside context");
      
    
  };

  
  useEffect(() => {
    loadUserData();
    console.log("user loaded")
  }, []);
  
  useEffect(() => {
    if (data) {
      setBalance(data.balance); // Ensure data exists before setting balance
      console.log("balance ser");
    }
  }, [data]);
  


  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrentValue = Math.floor(Math.random() * 10) + 1;
      const newTimeLabel = ``;
      
      setGraphData(prevData => {
        const newData = [...prevData, {
          value: newCurrentValue,
          label: newTimeLabel,
          dataPointText: newCurrentValue.toString()
        }];
        return newData.slice(-20);
      });

      
    }, 10000);

    return () => clearInterval(intervalId);
  }, [graphData.length, graphData]);

  return (
    <AppContext.Provider value={{ pricePerUnit , powerPerUnit, data, balance, error, userNumber, graphData, setBalance,  setGraphData}}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
