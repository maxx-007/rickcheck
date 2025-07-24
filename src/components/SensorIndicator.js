import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

const SensorIndicator = ({ sensorData, isActive }) => {
  const [blinkAnim] = useState(new Animated.Value(1));

  // Blinking animation for stationary state
  useEffect(() => {
    if (sensorData.isStationary && isActive) {
      const blink = () => {
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(blink);
      };
      blink();
    } else {
      blinkAnim.setValue(1);
    }
  }, [sensorData.isStationary, isActive]);

  // Get movement status color
  const getMovementColor = (movementClass) => {
    switch (movementClass) {
      case 'STATIONARY': return '#FF6B35';
      case 'LOW_MOVEMENT': return '#FFA726';
      case 'MODERATE_MOVEMENT': return '#66BB6A';
      case 'HIGH_MOVEMENT': return '#42A5F5';
      default: return '#9E9E9E';
    }
  };

  // Get movement emoji
  const getMovementEmoji = (movementClass) => {
    switch (movementClass) {
      case 'STATIONARY': return '🛑';
      case 'LOW_MOVEMENT': return '🚶';
      case 'MODERATE_MOVEMENT': return '🚗';
      case 'HIGH_MOVEMENT': return '🏃';
      default: return '❓';
    }
  };

  if (!isActive) {
    return (
      <View style={styles.container}>
        <View style={styles.inactiveIndicator}>
          <Text style={styles.inactiveText}>Sensors Ready</Text>
          <Text style={styles.inactiveSubtext}>Start ride to begin monitoring</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motion Detection</Text>
      
      <View style={styles.sensorGrid}>
        
        {/* Movement Status */}
        <Animated.View 
          style={[
            styles.movementIndicator, 
            { 
              backgroundColor: getMovementColor(sensorData.movementClass),
              opacity: sensorData.isStationary ? blinkAnim : 1,
            }
          ]}
        >
          <Text style={styles.movementEmoji}>
            {getMovementEmoji(sensorData.movementClass)}
          </Text>
          <Text style={styles.movementText}>
            {sensorData.movementClass.replace('_', ' ')}
          </Text>
        </Animated.View>

        {/* Accelerometer */}
        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>📱 Accelerometer</Text>
          <View style={styles.sensorValues}>
            <Text style={styles.sensorValue}>
              X: {sensorData.accelerometer.x.toFixed(2)}
            </Text>
            <Text style={styles.sensorValue}>
              Y: {sensorData.accelerometer.y.toFixed(2)}
            </Text>
            <Text style={styles.sensorValue}>
              Z: {sensorData.accelerometer.z.toFixed(2)}
            </Text>
          </View>
          {sensorData.accelMagnitude && (
            <Text style={styles.magnitudeText}>
              Mag: {sensorData.accelMagnitude.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Gyroscope */}
        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>🌀 Gyroscope</Text>
          <View style={styles.sensorValues}>
            <Text style={styles.sensorValue}>
              X: {sensorData.gyroscope.x.toFixed(2)}
            </Text>
            <Text style={styles.sensorValue}>
              Y: {sensorData.gyroscope.y.toFixed(2)}
            </Text>
            <Text style={styles.sensorValue}>
              Z: {sensorData.gyroscope.z.toFixed(2)}
            </Text>
          </View>
          {sensorData.gyroMagnitude && (
            <Text style={styles.magnitudeText}>
              Mag: {sensorData.gyroMagnitude.toFixed(2)}
            </Text>
          )}
        </View>

      </View>

      {/* Status Message */}
      <View style={styles.statusMessage}>
        {sensorData.isStationary ? (
          <Text style={styles.stationaryMessage}>
            🛑 Vehicle is stationary - Waiting charges may apply
          </Text>
        ) : (
          <Text style={styles.movingMessage}>
            ✅ Vehicle is moving - Distance tracking active
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  sensorGrid: {
    marginBottom: 15,
  },
  movementIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
  },
  movementEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  movementText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sensorBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  sensorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sensorValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorValue: {
    fontSize: 11,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  magnitudeText: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  statusMessage: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f8f0',
  },
  stationaryMessage: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
    textAlign: 'center',
  },
  movingMessage: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    textAlign: 'center',
  },
  inactiveIndicator: {
    alignItems: 'center',
    padding: 20,
  },
  inactiveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  inactiveSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default SensorIndicator;