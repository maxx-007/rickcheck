// Web-compatible location service for testing in browser
export class WebLocationService {
    constructor() {
      this.watchId = null;
      this.isTracking = false;
      this.lastPosition = null;
      this.mockPath = this.generateMockPath();
      this.pathIndex = 0;
    }
  
    // Generate a mock path for testing
    generateMockPath() {
      const baseLocation = { lat: 19.0760, lng: 72.8777 }; // Mumbai coordinates
      const path = [];
      
      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const distance = 0.01 * (i / 100); // Gradually increase distance
        
        path.push({
          latitude: baseLocation.lat + Math.sin(angle) * distance,
          longitude: baseLocation.lng + Math.cos(angle) * distance,
          speed: 20 + Math.random() * 20, // 20-40 km/h
          accuracy: 5 + Math.random() * 10,
          timestamp: Date.now() + (i * 2000), // 2 seconds apart
        });
      }
      
      return path;
    }
  
    // Request location permissions (web compatible)
    async requestPermissions() {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported in this environment');
        return true; // Allow mock data for web testing
      }
  
      try {
        // Test if geolocation works
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => reject(false),
            { timeout: 5000 }
          );
        });
        return true;
      } catch (error) {
        console.warn('Geolocation permission denied, using mock data');
        return true; // Still allow app to work with mock data
      }
    }
  
    // Get current position
    async getCurrentPosition() {
      try {
        await this.requestPermissions();
  
        if (navigator.geolocation) {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  speed: position.coords.speed ? position.coords.speed * 3.6 : 0, // Convert m/s to km/h
                  timestamp: Date.now(),
                };
                this.lastPosition = pos;
                resolve(pos);
              },
              (error) => {
                console.warn('GPS failed, using mock location:', error);
                // Return mock location for testing
                const mockPos = this.mockPath[0];
                this.lastPosition = mockPos;
                resolve(mockPos);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              }
            );
          });
        } else {
          // Return mock location for environments without GPS
          const mockPos = this.mockPath[0];
          this.lastPosition = mockPos;
          return mockPos;
        }
      } catch (error) {
        console.error('Error getting current position:', error);
        return this.mockPath[0]; // Fallback to mock
      }
    }
  
    // Start tracking location
    async startTracking(onLocationUpdate, onError) {
      try {
        await this.requestPermissions();
        this.isTracking = true;
  
        if (navigator.geolocation) {
          // Try real geolocation first
          this.watchId = navigator.geolocation.watchPosition(
            (position) => {
              const pos = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                speed: position.coords.speed ? position.coords.speed * 3.6 : Math.random() * 30,
                timestamp: Date.now(),
              };
              this.lastPosition = pos;
              onLocationUpdate(pos);
            },
            (error) => {
              console.warn('GPS tracking failed, switching to mock mode:', error);
              this.startMockTracking(onLocationUpdate);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 10000,
            }
          );
        } else {
          // Start mock tracking for web testing
          this.startMockTracking(onLocationUpdate);
        }
  
        return true;
      } catch (error) {
        console.error('Error starting location tracking:', error);
        this.startMockTracking(onLocationUpdate);
        return true;
      }
    }
  
    // Mock tracking for testing
    startMockTracking(onLocationUpdate) {
      this.pathIndex = 0;
      
      const mockInterval = setInterval(() => {
        if (!this.isTracking) {
          clearInterval(mockInterval);
          return;
        }
  
        if (this.pathIndex < this.mockPath.length) {
          const position = {
            ...this.mockPath[this.pathIndex],
            timestamp: Date.now(),
          };
          
          this.lastPosition = position;
          onLocationUpdate(position);
          this.pathIndex++;
        } else {
          // Loop back to beginning for continuous testing
          this.pathIndex = 0;
        }
      }, 2000); // Update every 2 seconds
  
      this.watchId = mockInterval;
    }
  
    // Stop tracking location
    stopTracking() {
      if (this.watchId) {
        if (navigator.geolocation && typeof this.watchId === 'number') {
          navigator.geolocation.clearWatch(this.watchId);
        } else {
          clearInterval(this.watchId);
        }
        this.watchId = null;
      }
      this.isTracking = false;
    }
  
    // Calculate distance between two coordinates
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in kilometers
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  
    // Convert degrees to radians
    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
  
    // Check if location is accurate enough
    isLocationAccurate(position) {
      return position && position.accuracy && position.accuracy <= 50; // More lenient for web
    }
  
    // Get location status
    getStatus() {
      return {
        isTracking: this.isTracking,
        lastPosition: this.lastPosition,
        hasWatchId: !!this.watchId,
        usingMockData: !navigator.geolocation || this.pathIndex >= 0,
      };
    }
  }