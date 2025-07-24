import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const TripStats = ({ distance, duration, waitingTime, halts, isActive }) => {
  
  // Format distance for display
  const formatDistance = (km) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(2)}km`;
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Format waiting time
  const formatWaitingTime = (minutes) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    return `${minutes.toFixed(1)}min`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Statistics</Text>
      
      <View style={styles.statsGrid}>
        
        {/* Distance */}
        <View style={[styles.statItem, styles.distanceStat]}>
          <Text style={styles.statIcon}>📍</Text>
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>

        {/* Duration */}
        <View style={[styles.statItem, styles.durationStat]}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{formatDuration(duration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>

        {/* Waiting Time */}
        <View style={[styles.statItem, styles.waitingStat]}>
          <Text style={styles.statIcon}>⏸️</Text>
          <Text style={styles.statValue}>{formatWaitingTime(waitingTime)}</Text>
          <Text style={styles.statLabel}>Waiting</Text>
        </View>

        {/* Halts */}
        <View style={[styles.statItem, styles.haltsStat]}>
          <Text style={styles.statIcon}>🛑</Text>
          <Text style={styles.statValue}>{halts}</Text>
          <Text style={styles.statLabel}>Halts</Text>
        </View>

      </View>

      {/* Live Update Indicator */}
      {isActive && (
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live Tracking Active</Text>
        </View>
      )}

      {/* Speed and Accuracy Info */}
      {isActive && (
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>
            GPS tracking with motion sensors for accurate fare calculation
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  distanceStat: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  durationStat: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C27B0',
  },
  waitingStat: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  haltsStat: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  additionalInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TripStats;