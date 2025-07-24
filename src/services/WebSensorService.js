// Web-compatible sensor service with mock data for testing
export class WebSensorService {
    constructor() {
      this.isMonitoring = false;
      this.sensorData = {
        accelerometer: { x: 0, y: 0, z: 0 },
        gyroscope: { x: 0, y: 0, z: 0 },
        isStationary: false,
        stationaryStartTime: null,
      };
      this.callbacks = [];
      this.mockInterval = null;
      this.mockState = 'moving'; // 'moving', 'stationary'
      this.stateChangeTime = Date.now();
    }
  
    // Start monitoring sensors (web compatible)
    async startMonitoring(updateInterval = 1000) {
      try {
        this.isMonitoring = true;
        
        // Check if device motion is available (mobile browsers)
        if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
          try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
              this.startRealSensorMonitoring();
              return true;
            }
          } catch (error) {
            console.log('Device motion not available, using mock sensors');
          }
        }
  
        // Fallback to mock sensor data for web testing
        this.startMockSensorMonitoring(updateInterval);
        return true;
      } catch (error) {
        console.error('Error starting sensor monitoring:', error);
        this.startMockSensorMonitoring(updateInterval);
        return true;
      }
    }
  
    // Start real sensor monitoring (mobile browsers)
    startRealSensorMonitoring() {
      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
          this.sensorData.accelerometer = {
            x: event.acceleration?.x || 0,
            y: event.acceleration?.y || 0,
            z: event.acceleration?.z || 0,
          };
          
          this.sensorData.gyroscope = {
            x: event.rotationRate?.alpha || 0,
            y: event.rotationRate?.beta || 0,
            z: event.rotationRate?.gamma || 0,
          };
  
          this.analyzeMovement();
          this.notifyCallbacks();
        });
      }
    }
  
    // Start mock sensor monitoring for testing
    startMockSensorMonitoring(updateInterval) {
      this.mockInterval = setInterval(() => {
        if (!this.isMonitoring) return;
  
        // Simulate realistic sensor patterns
        this.updateMockSensorData();
        this.analyzeMovement();
        this.notifyCallbacks();
      }, updateInterval);
    }
  
    // Update mock sensor data with realistic patterns
    updateMockSensorData() {
      const time = Date.now();
      
      // Change state every 15-30 seconds
      if (time - this.stateChangeTime > (15000 + Math.random() * 15000)) {
        this.mockState = this.mockState === 'moving' ? 'stationary' : 'moving';
        this.stateChangeTime = time;
      }
  
      if (this.mockState === 'moving') {
        // Simulate vehicle movement
        this.sensorData.accelerometer = {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: 1 + (Math.random() - 0.5) * 0.5, // Include gravity
        };
        
        this.sensorData.gyroscope = {
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.4,
          z: (Math.random() - 0.5) * 0.4,
        };
      } else {
        // Simulate stationary vehicle
        this.sensorData.accelerometer = {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
          z: 1 + (Math.random() - 0.5) * 0.1,
        };
        
        this.sensorData.gyroscope = {
          x: (Math.random() - 0.5) * 0.05,
          y: (Math.random() - 0.5) * 0.05,
          z: (Math.random() - 0.5) * 0.05,
        };
      }
    }
  
    // Stop monitoring sensors
    stopMonitoring() {
      this.isMonitoring = false;
      
      if (this.mockInterval) {
        clearInterval(this.mockInterval);
        this.mockInterval = null;
      }
  
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', this.handleDeviceMotion);
      }
  
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
        (accelerometer.z - 1) ** 2
      );
      
      // Calculate magnitude of angular velocity
      const gyroMagnitude = Math.sqrt(
        gyroscope.x ** 2 + 
        gyroscope.y ** 2 + 
        gyroscope.z ** 2
      );
  
      // Thresholds for detecting stationary state
      const ACCEL_THRESHOLD = 0.3;
      const GYRO_THRESHOLD = 0.1;
  
      const wasStationary = this.sensorData.isStationary;
      const isCurrentlyStationary = accelMagnitude < ACCEL_THRESHOLD && gyroMagnitude < GYRO_THRESHOLD;
  
      // Update stationary state
      if (isCurrentlyStationary && !wasStationary) {
        this.sensorData.isStationary = true;
        this.sensorData.stationaryStartTime = Date.now();
      } else if (!isCurrentlyStationary && wasStationary) {
        this.sensorData.isStationary = false;
        this.sensorData.stationaryStartTime = null;
      }
  
      // Add calculated values
      this.sensorData.accelMagnitude = accelMagnitude;
      this.sensorData.gyroMagnitude = gyroMagnitude;
    }
  
    // Check if vehicle has been stationary for minimum duration
    isStationaryForDuration(minimumSeconds = 10) {
      if (!this.sensorData.isStationary || !this.sensorData.stationaryStartTime) {
        return false;
      }
  
      const stationaryDuration = (Date.now() - this.sensorData.stationaryStartTime) / 1000;
      return stationaryDuration >= minimumSeconds;
    }
  
    // Get current stationary duration
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
  
    // Calibrate sensors
    calibrate() {
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