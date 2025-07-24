import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const FareComparisonChart = ({ calculatedFare, actualFare, isTampered }) => {
  const maxFare = Math.max(calculatedFare, actualFare) * 1.2;
  const calculatedWidth = (calculatedFare / maxFare) * (width - 80);
  const actualWidth = (actualFare / maxFare) * (width - 80);
  
  const difference = Math.abs(actualFare - calculatedFare);
  const percentageDiff = ((difference / calculatedFare) * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fare Comparison</Text>
      
      {/* Chart */}
      <View style={styles.chart}>
        
        {/* Official Fare Bar */}
        <View style={styles.barContainer}>
          <Text style={styles.barLabel}>Official Fare</Text>
          <View style={styles.barBackground}>
            <View style={[styles.bar, styles.officialBar, { width: calculatedWidth }]}>
              <Text style={styles.barValue}>₹{calculatedFare}</Text>
            </View>
          </View>
        </View>

        {/* Actual Fare Bar */}
        <View style={styles.barContainer}>
          <Text style={styles.barLabel}>Charged Fare</Text>
          <View style={styles.barBackground}>
            <View style={[
              styles.bar, 
              isTampered ? styles.tamperedBar : styles.fairBar, 
              { width: actualWidth }
            ]}>
              <Text style={styles.barValue}>₹{actualFare}</Text>
            </View>
          </View>
        </View>

      </View>

      {/* Comparison Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Difference:</Text>
          <Text style={[
            styles.summaryValue, 
            isTampered ? styles.tamperedValue : styles.fairValue
          ]}>
            ₹{difference.toFixed(0)} ({percentageDiff}%)
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status:</Text>
          <Text style={[
            styles.summaryValue,
            isTampered ? styles.tamperedValue : styles.fairValue
          ]}>
            {isTampered ? '⚠️ Suspicious' : '✅ Fair'}
          </Text>
        </View>

        {actualFare > calculatedFare && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Overcharged by:</Text>
            <Text style={styles.overchargeValue}>
              ₹{(actualFare - calculatedFare).toFixed(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.officialColor]} />
          <Text style={styles.legendText}>Official Rate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, isTampered ? styles.tamperedColor : styles.fairColor]} />
          <Text style={styles.legendText}>Charged Rate</Text>
        </View>
      </View>

      {/* Tolerance Info */}
      <View style={styles.toleranceInfo}>
        <Text style={styles.toleranceText}>
          ℹ️ Tolerance: ±10% difference is considered acceptable due to rounding and meter variations
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    marginBottom: 20,
  },
  barContainer: {
    marginVertical: 10,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  barBackground: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  bar: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
    minWidth: 60,
  },
  officialBar: {
    backgroundColor: '#4CAF50',
  },
  fairBar: {
    backgroundColor: '#2196F3',
  },
  tamperedBar: {
    backgroundColor: '#F44336',
  },
  barValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  fairValue: {
    color: '#4CAF50',
  },
  tamperedValue: {
    color: '#F44336',
  },
  overchargeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  officialColor: {
    backgroundColor: '#4CAF50',
  },
  fairColor: {
    backgroundColor: '#2196F3',
  },
  tamperedColor: {
    backgroundColor: '#F44336',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  toleranceInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  toleranceText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default FareComparisonChart;