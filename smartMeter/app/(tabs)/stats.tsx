import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { Icon } from '@rneui/themed';
import { LineChart } from 'react-native-gifted-charts';
import { useAppContext } from '../context/context';

const PowerUsageGraph = () => {
  
  const { data , graphData } = useAppContext();
  const windowWidth = Dimensions.get('window').width;
  const chartWidth = windowWidth * 2;

  

  const renderYAxis = () => {
    const sections = 5;
    const maxValue = 10;
    return (
      <View style={styles.yAxisContainer}>
        {Array.from({ length: sections + 1 }).map((_, index) => (
          <Text key={index} style={styles.yAxisText}>
            {Math.round((maxValue / sections) * (sections - index))}kW
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="flash" type="entypo" color="#fff" size={24} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Power Monitoring</Text>
            <Text style={styles.headerSubtitle}>{data?.meterID || 'Smart Meter'}</Text>
          </View>
        </View>
      </View>
    
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.title}>Current Usage</Text>
              <Text style={styles.value}>
                {graphData[graphData?.length - 1]?.value || 0}
                <Text style={styles.unit}> kW</Text>
              </Text>
            </View>
            <View style={styles.infoButton}>
              <Text style={styles.infoText}>ⓘ</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Real-Time Power Consumption</Text>
            <View style={styles.chartWithYAxis}>
              {renderYAxis()}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chartScrollContainer}
              >
                <View style={styles.chartWrapper}>
                  <LineChart
                    data={graphData}
                    width={chartWidth}
                    height={220}
                    spacing={30}
                    initialSpacing={10}
                    dataPointsColor="#0047AB"
                    dataPointsRadius={4}
                    thickness={2}
                    color="#0047AB"
                    maxValue={10}
                    noOfSections={5}
                    hideYAxisText
                    // xAxisTextStyle={styles.xAxisText}
                    yAxisColor="#E5E7EB"
                    xAxisColor="#E5E7EB"
                    showVerticalLines
                    verticalLinesColor="#E5E7EB"
                    rulesColor="#E5E7EB"
                    rulesType="solid"
                    // showDataPointText
                    textColor="#6B7280"
                    textShiftY={-10}
                    textShiftX={-5}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E40AF',
  },
  unit: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '400',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#6B7280',
  },
  chartContainer: {
    marginTop: 8,
  },
  chartWithYAxis: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxisContainer: {
    width: 50,
    height: 220,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  chartScrollContainer: {
    paddingRight: 10,
  },
  chartWrapper: {
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  yAxisText: {
    color: '#6B7280',
    fontSize: 12,
  },
  xAxisText: {
    color: '#6B7280',
    fontSize: 12,
  },
});

export default PowerUsageGraph;