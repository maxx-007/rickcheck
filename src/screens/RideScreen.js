import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { FareCalculator } from '../utils/FareCalculator';
import { LocationService } from '../services/LocationService';
import { SensorService } from '../services/SensorService';
import { WebLocationService } from '../services/WebLocationService';
import { WebSensorService } from '../services/WebSensorService';
import FareMeter from '../components/FareMeter';
import TripStats from '../components/TripStats';
import SensorIndicator from '../components/SensorIndicator';

const RideScreen = ({ navigation }) => {
  // Services - Use web services for web platform, native for mobile
  const fareCalculator = useRef(new FareCalculator()).current;
  const locationService = useRef(
    Platform.OS === 'web' ? new WebLocationService() : new LocationService()
  ).current;
  const sensorService = useRef(
    Platform.OS === 'web' ? new WebSensorService() : new SensorService()
  ).current;

  // Trip state
  const [isRideActive, setIsRideActive] = useState(false);
  const [tripData, setTripData] = useState({
    distance: 0,
    duration: 0,
    waitingTime: 0,
    currentFare: 26,
    startTime: null,
    endTime: null,
    startLocation: null,
    currentLocation: null,
    halts: [],
    isNightTime: false,
    path: [],
  });

  // Sensor state
  const [sensorData, setSensorData] = useState({
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    isStationary: false,
    movementClass: 'STATIONARY',
  });

  // Animation
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Tracking refs
  const tripStartTime = useRef(null);
  const lastUpdateTime = useRef(null);
  const currentHaltStart = useRef(null);

  // Initialize services
  useEffect(() => {
    const initServices = async () => {
      // Start sensor monitoring
      const sensorStarted = await sensorService.startMonitoring(500);
      if (sensorStarted) {
        sensorService.addCallback(handleSensorUpdate);
      }

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

    initServices();

    return () => {
      locationService.stopTracking();
      sensorService.stopMonitoring();
    };
  }, []);

  // Handle sensor updates
  const handleSensorUpdate = (data) => {
    setSensorData({
      accelerometer: data.accelerometer,
      gyroscope: data.gyroscope,
      isStationary: data.isStationary,
      movementClass: sensorService.getMovementClassification(),
      accelMagnitude: data.accelMagnitude,
      gyroMagnitude: data.gyroMagnitude,
    });
  };

  // Pulse animation for active ride
  useEffect(() => {
    if (isRideActive) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(pulse);
      };
      pulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRideActive]);

  // Handle location updates during ride
  const handleLocationUpdate = (position) => {
    if (!isRideActive) return;

    const currentTime = Date.now();
    
    setTripData(prev => {
      let newData = { ...prev };
      
      // Update current location
      newData.currentLocation = position;
      newData.path.push({
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: currentTime,
        speed: position.speed,
      });

      // Calculate distance if we have a previous position
      if (prev.currentLocation) {
        const segmentDistance = locationService.calculateDistance(
          prev.currentLocation.latitude,
          prev.currentLocation.longitude,
          position.latitude,
          position.longitude
        );
        newData.distance += segmentDistance;
      }

      // Update duration
      if (tripStartTime.current) {
        newData.duration = (currentTime - tripStartTime.current) / 1000; // seconds
      }

      // Handle halt detection
      const isCurrentlyStationary = sensorData.isStationary || position.speed < 2;
      
      if (isCurrentlyStationary && !currentHaltStart.current) {
        // Start of a halt
        currentHaltStart.current = currentTime;
      } else if (!isCurrentlyStationary && currentHaltStart.current) {
        // End of a halt
        const haltDuration = (currentTime - currentHaltStart.current) / 1000;
        if (haltDuration > 10) { // Only count halts longer than 10 seconds
          newData.halts.push({
            startTime: currentHaltStart.current,
            endTime: currentTime,
            duration: haltDuration,
            location: prev.currentLocation,
          });
          newData.waitingTime += haltDuration / 60; // Convert to minutes
        }
        currentHaltStart.current = null;
      }

      // Calculate current fare
      newData.currentFare = fareCalculator.calculateTotalFare(
        newData.distance,
        newData.waitingTime,
        newData.isNightTime
      );

      return newData;
    });

    lastUpdateTime.current = currentTime;
  };

  // Start ride
  const startRide = async () => {
    try {
      const position = await locationService.getCurrentPosition();
      if (!position) {
        Alert.alert('Error', 'Could not get current location. Please check GPS settings.');
        return;
      }

      const startTime = Date.now();
      tripStartTime.current = startTime;
      
      setTripData({
        distance: 0,
        duration: 0,
        waitingTime: 0,
        currentFare: 26,
        startTime,
        endTime: null,
        startLocation: position,
        currentLocation: position,
        halts: [],
        isNightTime: fareCalculator.isNightTime(),
        path: [{ 
          latitude: position.latitude, 
          longitude: position.longitude, 
          timestamp: startTime,
          speed: position.speed,
        }],
      });

      // Start location tracking
      const trackingStarted = await locationService.startTracking(
        handleLocationUpdate,
        (error) => {
          Alert.alert('Location Error', 'GPS tracking failed. Please check location settings.');
          console.error('Location tracking error:', error);
        }
      );

      if (trackingStarted) {
        setIsRideActive(true);
        Alert.alert('Ride Started', 'GPS tracking is now active. Fair fare calculation in progress.');
      } else {
        Alert.alert('Error', 'Failed to start location tracking.');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Error', 'Failed to start ride tracking.');
    }
  };

  // End ride
  const endRide = () => {
    Alert.alert(
      'End Ride',
      'Are you sure you want to end the current ride?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Ride',
          style: 'destructive',
          onPress: () => {
            locationService.stopTracking();
            
            // Add final halt if vehicle is currently stationary
            if (currentHaltStart.current) {
              const haltDuration = (Date.now() - currentHaltStart.current) / 1000;
              setTripData(prev => ({
                ...prev,
                endTime: Date.now(),
                halts: [...prev.halts, {
                  startTime: currentHaltStart.current,
                  endTime: Date.now(),
                  duration: haltDuration,
                  location: prev.currentLocation,
                }],
                waitingTime: prev.waitingTime + (haltDuration / 60),
              }));
            } else {
              setTripData(prev => ({ ...prev, endTime: Date.now() }));
            }

            setIsRideActive(false);
            currentHaltStart.current = null;
            
            // Navigate to summary with a slight delay to ensure state is updated
            setTimeout(() => {
              navigation.navigate('Summary', { tripData });
            }, 100);
          },
        },
      ]
    );
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RickCheck</Text>
          <Text style={styles.subtitle}>Fair Fare Calculator</Text>
          {tripData.isNightTime && (
            <Text style={styles.nightIndicator}>🌙 Night Rate (+25%)</Text>
          )}
        </View>

        {/* Fare Meter */}
        <Animated.View style={[styles.meterContainer, { transform: [{ scale: pulseAnim }] }]}>
          <FareMeter 
            fare={tripData.currentFare}
            isActive={isRideActive}
            isNight={tripData.isNightTime}
          />
        </Animated.View>

        {/* Trip Statistics */}
        <TripStats
          distance={tripData.distance}
          duration={tripData.duration}
          waitingTime={tripData.waitingTime}
          halts={tripData.halts.length}
          isActive={isRideActive}
        />

        {/* Sensor Indicator */}
        <SensorIndicator
          sensorData={sensorData}
          isActive={isRideActive}
        />

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          {!isRideActive ? (
            <TouchableOpacity style={styles.startButton} onPress={startRide}>
              <Text style={styles.buttonText}>Start Ride</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endButton} onPress={endRide}>
              <Text style={styles.buttonText}>End Ride</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings Button */}
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsText}>⚙️ Settings</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  nightIndicator: {
    fontSize: 14,
    color: '#FF6B35',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  meterContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  endButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 10,
  },
  settingsText: {
    fontSize: 16,
    color: '#666',
  },
});

export default RideScreen;