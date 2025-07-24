import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

// Simple map visualization component (in a real app, use react-native-maps)
const TripMap = ({ tripData }) => {
  
  // Calculate map bounds
  const getMapBounds = () => {
    if (!tripData.path || tripData.path.length === 0) return null;
    
    let minLat = tripData.path[0].latitude;
    let maxLat = tripData.path[0].latitude;
    let minLon = tripData.path[0].longitude;
    let maxLon = tripData.path[0].longitude;
    
    tripData.path.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLon = Math.min(minLon, point.longitude);
      maxLon = Math.max(maxLon, point.longitude);
    });
    
    return { minLat, maxLat, minLon, maxLon };
  };

  // Format coordinates for display
  const formatCoordinate = (coord) => {
    return coord.toFixed(6);
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const bounds = getMapBounds();

  return (
    <View style={styles.container}>
      
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>Trip Route Visualization</Text>
        <Text style={styles.mapSubtitle}>
          In a production app, integrate react-native-maps here
        </Text>
        
        {bounds && (
          <View style={styles.boundsInfo}>
            <Text style={styles.boundsTitle}>Route Bounds:</Text>
            <Text style={styles.boundsText}>
              North: {formatCoordinate(bounds.maxLat)}
            </Text>
            <Text style={styles.boundsText}>
              South: {formatCoordinate(bounds.minLat)}
            </Text>
            <Text style={styles.boundsText}>
              East: {formatCoordinate(bounds.maxLon)}
            </Text>
            <Text style={styles.boundsText}>
              West: {formatCoordinate(bounds.minLon)}
            </Text>
          </View>
        )}
      </View>

      {/* Trip Points */}
      <ScrollView style={styles.pointsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.pointsTitle}>Route Points</Text>
        
        {/* Start Point */}
        <View style={[styles.pointItem, styles.startPoint]}>
          <Text style={styles.pointIcon}>🟢</Text>
          <View style={styles.pointInfo}>
            <Text style={styles.pointLabel}>Start Location</Text>
            <Text style={styles.pointCoords}>
              {formatCoordinate(tripData.startLocation?.latitude || 0)}, {formatCoordinate(tripData.startLocation?.longitude || 0)}
            </Text>
            <Text style={styles.pointTime}>
              {formatTime(tripData.startTime)}
            </Text>
          </View>
        </View>

        {/* Halt Points */}
        {tripData.halts.map((halt, index) => (
          <View key={index} style={[styles.pointItem, styles.haltPoint]}>
            <Text style={styles.pointIcon}>🛑</Text>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Halt #{index + 1}</Text>
              <Text style={styles.pointCoords}>
                {formatCoordinate(halt.location?.latitude || 0)}, {formatCoordinate(halt.location?.longitude || 0)}
              </Text>
              <Text style={styles.pointTime}>
                {formatTime(halt.startTime)} - {formatTime(halt.endTime)}
              </Text>
              <Text style={styles.haltDuration}>
                Duration: {Math.floor(halt.duration / 60)}m {Math.floor(halt.duration % 60)}s
              </Text>
            </View>
          </View>
        ))}

        {/* End Point */}
        <View style={[styles.pointItem, styles.endPoint]}>
          <Text style={styles.pointIcon}>🔴</Text>
          <View style={styles.pointInfo}>
            <Text style={styles.pointLabel}>End Location</Text>
            <Text style={styles.pointCoords}>
              {formatCoordinate(tripData.currentLocation?.latitude || 0)}, {formatCoordinate(tripData.currentLocation?.longitude || 0)}
            </Text>
            <Text style={styles.pointTime}>
              {formatTime(tripData.endTime)}
            </Text>
          </View>
        </View>
        
        {/* Route Statistics */}
        <View style={styles.routeStats}>
          <Text style={styles.statsTitle}>Route Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Points Tracked:</Text>
            <Text style={styles.statValue}>{tripData.path?.length || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Average Speed:</Text>
            <Text style={styles.statValue}>
              {tripData.duration > 0 ? 
                ((tripData.distance / (tripData.duration / 3600)).toFixed(1)) : '0'} km/h
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Max Distance Segment:</Text>
            <Text style={styles.statValue}>
              {/* Calculate max segment distance */}
              {tripData.path && tripData.path.length > 1 ? 
                '~50m' : '0m'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: '#E3F2FD',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  boundsInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  boundsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  boundsText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  pointsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  pointItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  startPoint: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  haltPoint: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  endPoint: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  pointIcon: {
    fontSize: 20,
    marginRight: 15,
    alignSelf: 'center',
  },
  pointInfo: {
    flex: 1,
  },
  pointLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pointCoords: {
    fontSize: 11,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginBottom: 2,
  },
  pointTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  haltDuration: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '600',
  },
  routeStats: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default TripMap;