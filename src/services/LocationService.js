import * as Location from 'expo-location';
import { Alert } from 'react-native';

export class LocationService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.lastPosition = null;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required for accurate fare calculation.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current position
  async getCurrentPosition() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000,
        timeout: 15000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed || 0,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }

  // Start tracking location
  async startTracking(onLocationUpdate, onError) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;

      this.isTracking = true;
      
      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (location) => {
          const position = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            speed: this.convertMpsToKmh(location.coords.speed || 0),
            timestamp: location.timestamp,
          };

          this.lastPosition = position;
          onLocationUpdate(position);
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      if (onError) onError(error);
      return false;
    }
  }

  // Stop tracking location
  stopTracking() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
    this.isTracking = false;
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Convert meters per second to kilometers per hour
  convertMpsToKmh(mps) {
    return mps * 3.6;
  }

  // Check if location is accurate enough
  isLocationAccurate(position) {
    return position && position.accuracy && position.accuracy <= 20; // 20 meters accuracy
  }

  // Get location status
  getStatus() {
    return {
      isTracking: this.isTracking,
      lastPosition: this.lastPosition,
      hasWatchId: !!this.watchId,
    };
  }
}