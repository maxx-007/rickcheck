import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';

const FareMeter = ({ fare, isActive, isNight }) => {
  const [displayFare, setDisplayFare] = useState(fare);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  // Animate fare changes
  useEffect(() => {
    if (fare !== displayFare) {
      // Scale animation for fare changes
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      setDisplayFare(fare);
    }
  }, [fare]);

  // Glow animation when active
  useEffect(() => {
    if (isActive) {
      const glow = () => {
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]).start(glow);
      };
      glow();
    } else {
      glowAnim.setValue(0);
    }
  }, [isActive]);

  const animatedGlowStyle = {
    shadowColor: isActive ? '#4CAF50' : '#ddd',
    shadowOpacity: glowAnim,
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    }),
    elevation: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 15],
    }),
  };

  return (
    <Animated.View style={[styles.container, animatedGlowStyle]}>
      <View style={[styles.meter, isActive && styles.activeMeter, isNight && styles.nightMeter]}>
        
        {/* Fare Display */}
        <Animated.View style={[styles.fareContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={[styles.fareAmount, isNight && styles.nightFare]}>
            {displayFare.toFixed(0)}
          </Text>
        </Animated.View>

        {/* Status Indicators */}
        <View style={styles.statusContainer}>
          {isActive && (
            <View style={styles.activeIndicator}>
              <View style={styles.activeDot} />
              <Text style={styles.statusText}>LIVE</Text>
            </View>
          )}
          
          {isNight && (
            <View style={styles.nightIndicator}>
              <Text style={styles.nightText}>🌙 NIGHT</Text>
            </View>
          )}
        </View>

        {/* Meter Border */}
        <View style={[styles.meterBorder, isActive && styles.activeBorder]} />
        
        {/* Digital Display Effect */}
        {isActive && (
          <View style={styles.digitalLines}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={[styles.digitalLine, { opacity: 0.1 + (i * 0.1) }]} />
            ))}
          </View>
        )}
      </View>

      {/* Meter Label */}
      <Text style={styles.meterLabel}>
        {isActive ? 'Current Fare' : 'Ready to Start'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  meter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#e0e0e0',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      },
    }),
  },
  activeMeter: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  nightMeter: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff8f0',
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  fareAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  nightFare: {
    color: '#FF6B35',
  },
  statusContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nightIndicator: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nightText: {
    fontSize: 9,
    color: 'white',
    fontWeight: 'bold',
  },
  meterBorder: {
    position: 'absolute',
    width: 216,
    height: 216,
    borderRadius: 108,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeBorder: {
    borderColor: '#4CAF50',
  },
  digitalLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
  digitalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#4CAF50',
    top: (i) => 20 + (i * 20),
  },
  meterLabel: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
});

export default FareMeter;