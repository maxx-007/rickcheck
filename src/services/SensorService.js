import { Accelerometer, Gyroscope } from 'expo-sensors';

export class SensorService {
  constructor() {
    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.isMonitoring = false;
    this.sensorData = {
      accelerometer: { x: 0, y: 0, z: 0 },
      gyroscope: { x: 0, y: 0, z: 0 },
      isStationary: false,
      stationaryStartTime: null,
    };
    this.callbacks = [];
  }

  // Start monitoring sensors
  async startMonitoring(updateInterval = 1000) {
    try {
      // Check if sensors are available
      const accelAvailable = await Accelerometer.isAvailableAsync();
      const gyroAvailable = await Gyroscope.isAvailableAsync();

      if (!accelAvailable || !gyroAvailable) {
        console.warn('Sensors not available on this device');
        return false;
      }

      // Set update intervals
      Accelerometer.setUpdateInterval(updateInterval);
      Gyroscope.setUpdateInterval(updateInterval);

      // Subscribe to accelerometer
      this.accelerometerSubscription = Accelerometer.addListener((data) => {
        this.sensorData.accelerometer = data;
        this.analyzeMovement();
        this.notifyCallbacks();
      });

      // Subscribe to gyroscope
      this.gyroscopeSubscription = Gyroscope.addListener((data) => {
        this.sensorData.gyroscope = data;
        this.analyzeMovement();
        this.notifyCallbacks();
      });

      this.isMonitoring = true;
      return true;
    } catch (error) {
      console.error('Error starting sensor monitoring:', error);
      return false;
    }
  }

  // Stop monitoring sensors
  stopMonitoring() {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
      this.accelerometerSubscription = null;
    }

    if (this.gyroscopeSubscription) {
      this.gyroscopeSubscription.remove();
      this.gyroscopeSubscription = null;
    }

    this.isMonitoring = false;
    this.sensorData.isStationary = false;
    this.sensorData.stationaryStartTime = null;
  }

  // Analyze movement based on sensor data
  analyzeMovement() {
    const { accelerometer, gyroscope } = this.sensorData;
    
    // Calculate magnitude of acceleration (excluding gravity)
    const accelMagnitude = Math.sqrt(
      accelerometer.x ** 2 + 
      accelerometer.y ** 2 + 
      (accelerometer.z - 1) ** 2 // Subtract 1g for gravity
    );
    
    // Calculate magnitude of angular velocity
    const gyroMagnitude = Math.sqrt(
      gyroscope.x ** 2 + 
      gyroscope.y ** 2 + 
      gyroscope.z ** 2
    );

    // Thresholds for detecting stationary state
    const ACCEL_THRESHOLD = 0.3; // m/s²
    const GYRO_THRESHOLD = 0.1; // rad/s

    const wasStationary = this.sensorData.isStationary;
    const isCurrentlyStationary = accelMagnitude < ACCEL_THRESHOLD && gyroMagnitude < GYRO_THRESHOLD;

    // Update stationary state
    if (isCurrentlyStationary && !wasStationary) {
      // Just became stationary
      this.sensorData.isStationary = true;
      this.sensorData.stationaryStartTime = Date.now();
    } else if (!isCurrentlyStationary && wasStationary) {
      // Just started moving
      this.sensorData.isStationary = false;
      this.sensorData.stationaryStartTime = null;
    }

    // Add sensor readings for debugging
    this.sensorData.accelMagnitude = accelMagnitude;
    this.sensorData.gyroMagnitude = gyroMagnitude;
  }

  // Check if vehicle has been stationary for a minimum duration
  isStationaryForDuration(minimumSeconds = 10) {
    if (!this.sensorData.isStationary || !this.sensorData.stationaryStartTime) {
      return false;
    }

    const stationaryDuration = (Date.now() - this.sensorData.stationaryStartTime) / 1000;
    return stationaryDuration >= minimumSeconds;
  }

  // Get current stationary duration in seconds
  getStationaryDuration() {
    if (!this.sensorData.isStationary || !this.sensorData.stationaryStartTime) {
      return 0;
    }
    return (Date.now() - this.sensorData.stationaryStartTime) / 1000;
  }

  // Register callback for sensor updates
  addCallback(callback) {
    this.callbacks.push(callback);
  }

  // Remove callback
  removeCallback(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  // Notify all callbacks
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.sensorData);
      } catch (error) {
        console.error('Error in sensor callback:', error);
      }
    });
  }

  // Get current sensor data
  getSensorData() {
    return { ...this.sensorData };
  }

  // Check if sensors are currently monitoring
  isActive() {
    return this.isMonitoring;
  }

  // Calibrate sensors (reset baseline)
  calibrate() {
    // Reset stationary state
    this.sensorData.isStationary = false;
    this.sensorData.stationaryStartTime = null;
    
    console.log('Sensors calibrated');
  }

  // Get movement classification
  getMovementClassification() {
    const { accelMagnitude, gyroMagnitude, isStationary } = this.sensorData;
    
    if (isStationary) {
      return 'STATIONARY';
    } else if (accelMagnitude > 2 || gyroMagnitude > 0.5) {
      return 'HIGH_MOVEMENT';
    } else if (accelMagnitude > 0.8 || gyroMagnitude > 0.2) {
      return 'MODERATE_MOVEMENT';
    } else {
      return 'LOW_MOVEMENT';
    }
  }
}