import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const SettingsScreen = ({ navigation }) => {
  // Settings state
  const [settings, setSettings] = useState({
    tamperingThreshold: 10, // percentage
    enableSensorTracking: true,
    enableNightMode: true,
    autoDetectNight: true,
    highAccuracyGPS: true,
    enableHapticFeedback: true,
    saveTripsLocally: true,
  });

  // Toggle setting
  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              tamperingThreshold: 10,
              enableSensorTracking: true,
              enableNightMode: true,
              autoDetectNight: true,
              highAccuracyGPS: true,
              enableHapticFeedback: true,
              saveTripsLocally: true,
            });
            Alert.alert('Settings Reset', 'All settings have been reset to default values.');
          },
        },
      ]
    );
  };

  // Show about info
  const showAbout = () => {
    Alert.alert(
      'About RickCheck',
      'RickCheck v1.0\n\n' +
      'Fair Fare Calculator for Auto-Rickshaws in Maharashtra, India.\n\n' +
      'Based on official tariff rates from Maharashtra Motor Vehicle Department (effective 01/02/2025).\n\n' +
      'Features:\n' +
      '• Live GPS tracking\n' +
      '• Motion sensor detection\n' +
      '• Fare tampering detection\n' +
      '• Night rate calculation\n' +
      '• Waiting time tracking\n\n' +
      'Developed to ensure fair pricing and prevent meter tampering.',
      [{ text: 'OK' }]
    );
  };

  // Show fare info
  const showFareInfo = () => {
    Alert.alert(
      'Fare Calculation Info',
      'Current Rates (w.e.f. 01/02/2025):\n\n' +
      '• Minimum Fare: ₹26.00\n' +
      '• Per KM Rate: ₹17.14\n' +
      '• Night Surcharge: 25% (12:00 AM - 5:00 AM)\n' +
      '• Waiting Charges: 10% of basic fare per minute\n' +
      '• Luggage Charges: ₹6 per package (>60x40 cms)\n\n' +
      'Rounding: Up to 49 paise neglected, 50+ paise rounded up to next rupee.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Detection Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Detection Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Tampering Threshold</Text>
              <Text style={styles.settingDescription}>
                Alert when fare differs by more than {settings.tamperingThreshold}%
              </Text>
            </View>
            <TouchableOpacity
              style={styles.thresholdButton}
              onPress={() => {
                Alert.alert(
                  'Set Threshold',
                  'Choose tampering detection sensitivity:',
                  [
                    { text: '5%', onPress: () => setSettings(prev => ({...prev, tamperingThreshold: 5})) },
                    { text: '10%', onPress: () => setSettings(prev => ({...prev, tamperingThreshold: 10})) },
                    { text: '15%', onPress: () => setSettings(prev => ({...prev, tamperingThreshold: 15})) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.thresholdText}>{settings.tamperingThreshold}%</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Motion Sensor Tracking</Text>
              <Text style={styles.settingDescription}>
                Use accelerometer & gyroscope for halt detection
              </Text>
            </View>
            <Switch
              value={settings.enableSensorTracking}
              onValueChange={() => toggleSetting('enableSensorTracking')}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor={settings.enableSensorTracking ? '#2E7D32' : '#999'}
            />
          </View>
        </View>

        {/* GPS Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 GPS Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>High Accuracy GPS</Text>
              <Text style={styles.settingDescription}>
                Better accuracy but higher battery usage
              </Text>
            </View>
            <Switch
              value={settings.highAccuracyGPS}
              onValueChange={() => toggleSetting('highAccuracyGPS')}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor={settings.highAccuracyGPS ? '#2E7D32' : '#999'}
            />
          </View>
        </View>

        {/* Fare Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Fare Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Night Mode</Text>
              <Text style={styles.settingDescription}>
                Automatically apply night rates (12 AM - 5 AM)
              </Text>
            </View>
            <Switch
              value={settings.autoDetectNight}
              onValueChange={() => toggleSetting('autoDetectNight')}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor={settings.autoDetectNight ? '#2E7D32' : '#999'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Night Rates</Text>
              <Text style={styles.settingDescription}>
                Apply 25% surcharge during night hours
              </Text>
            </View>
            <Switch
              value={settings.enableNightMode}
              onValueChange={() => toggleSetting('enableNightMode')}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor={settings.enableNightMode ? '#2E7D32' : '#999'}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ App Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>
                Vibrate on fare changes and alerts
              </Text>
            </View>
            <Switch
              value={settings.enableHapticFeedback}
              onValueChange={() => toggleSetting('enableHapticFeedback')}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor={settings.enableHapticFeedback ? '#2E7D32' : '#999'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Save Trips Locally</Text>
              <Text style={styles.settingDescription}>
                Store trip data on device for history
              </Text>
            </View>
            <Switch
              value={settings.saveTripsLocally}
              onValueChange={() => toggleSetting('saveTripsLocally')}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor={settings.saveTripsLocally ? '#2E7D32' : '#999'}
            />
          </View>
        </View>

        {/* Information Buttons */}
        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.infoButton} onPress={showFareInfo}>
            <Text style={styles.infoButtonText}>📋 Current Fare Rates</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoButton} onPress={showAbout}>
            <Text style={styles.infoButtonText}>ℹ️ About RickCheck</Text>
          </TouchableOpacity>
        </View>

        {/* Reset Button */}
        <View style={styles.resetSection}>
          <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
            <Text style={styles.resetButtonText}>🔄 Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>RickCheck v1.0</Text>
          <Text style={styles.versionSubtext}>
            Maharashtra Auto-Rickshaw Fare Calculator
          </Text>
          <Text style={styles.versionSubtext}>
            Based on official tariff rates (w.e.f. 01/02/2025)
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  thresholdButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  thresholdText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoSection: {
    marginVertical: 10,
  },
  infoButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
  },
  infoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetSection: {
    marginVertical: 10,
  },
  resetButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 10,
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default SettingsScreen;