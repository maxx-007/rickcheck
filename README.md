# rickcheck# RickCheck - Auto-Rickshaw Fare Calculator

A React Native mobile application that calculates fair auto-rickshaw fares in Maharashtra, India, using live GPS tracking and motion sensors to detect fare meter tampering.

## Features

### 🔍 **Fare Tampering Detection**
- Real-time fare calculation based on official Maharashtra tariff rates
- GPS-based distance tracking with high accuracy
- Motion sensor integration (accelerometer + gyroscope) for halt detection
- Automatic comparison between calculated and charged fares
- Alert system for potential tampering (>10% difference threshold)

### 📱 **Core Functionality**
- **Live Meter Display**: Real-time fare updates during the ride
- **Trip Tracking**: Distance, duration, halts, and waiting time
- **Night Rate Support**: Automatic 25% surcharge (12 AM - 5 AM)
- **Waiting Charges**: Accurate calculation during stationary periods
- **Trip Summary**: Detailed breakdown with tampering analysis

### 🛰️ **Advanced Tracking**
- High-accuracy GPS with 1-meter precision
- Motion sensor fusion for stationary detection
- Real-time speed monitoring
- Route visualization and trip history

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rickcheck.git
   cd rickcheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   expo start
   ```

4. **Run on device/emulator**
   ```bash
   # For Android
   expo run:android
   
   # For iOS
   expo run:ios
   ```

## Project Structure

```
rickcheck/
├── App.js                          # Main application entry point
├── src/
│   ├── screens/
│   │   ├── RideScreen.js           # Main ride tracking screen
│   │   ├── SummaryScreen.js        # Trip summary and tampering detection
│   │   └── SettingsScreen.js       # App configuration
│   ├── components/
│   │   ├── FareMeter.js            # Live fare display component
│   │   ├── TripStats.js            # Trip statistics display
│   │   ├── SensorIndicator.js      # Motion sensor status
│   │   ├── FareComparisonChart.js  # Visual fare comparison
│   │   └── TripMap.js              # Route visualization
│   ├── services/
│   │   ├── LocationService.js      # GPS tracking service
│   │   └── SensorService.js        # Motion sensor handler
│   └── utils/
│       └── FareCalculator.js       # Fare calculation logic
├── package.json
├── app.json
└── README.md
```

## Fare Calculation

Based on **Maharashtra Motor Vehicle Department** official tariff (effective 01/02/2025):

- **Minimum Fare**: ₹26.00
- **Per KM Rate**: ₹17.14
- **Night Surcharge**: 25% (12:00 AM - 5:00 AM)
- **Waiting Charges**: 10% of basic fare per minute
- **Luggage Charges**: ₹6 per package (>60×40 cms)

### Calculation Formula
```javascript
fare = Math.max(distance * 17.14, 26.00)
if (waitingTime > 0) fare += waitingTime * (17.14 * 0.1)
if (nightTime) fare += fare * 0.25
finalFare = Math.round(fare) // Rounded to nearest rupee
```

## Key Technologies

### **Location Tracking**
- **expo-location**: High-accuracy GPS positioning
- **Haversine Formula**: Precise distance calculation
- **Real-time Updates**: 1-second interval tracking

### **Motion Detection**
- **expo-sensors**: Accelerometer and gyroscope integration
- **Movement Classification**: Stationary, low, moderate, high movement
- **Halt Detection**: Automatic waiting time calculation

### **User Interface**
- **React Navigation**: Smooth screen transitions
- **Animated Components**: Real-time visual feedback
- **Responsive Design**: Optimized for various screen sizes

## Usage Instructions

### Starting a Ride
1. Open RickCheck app
2. Grant location and sensor permissions
3. Tap "Start Ride" button
4. App begins GPS tracking and fare calculation

### During the Ride
- Monitor live fare updates on the meter display
- View real-time trip statistics (distance, duration, halts)
- Observe motion sensor status for halt detection
- Night rate indicator appears automatically after midnight

### Ending a Ride
1. Tap "End Ride" button
2. Review trip summary with fare breakdown
3. Enter the actual fare charged by driver
4. Tap "Check" to compare fares
5. Receive tampering alert if difference >10%

### Tampering Detection
- **Green Alert**: ✅ Fair fare confirmed
- **Red Alert**: ⚠️ Potential tampering detected
- **Report Options**: Save or share trip report as evidence

## Permissions Required

### Android
- `ACCESS_FINE_LOCATION` - GPS tracking
- `ACCESS_COARSE_LOCATION` - Network location
- `ACCESS_BACKGROUND_LOCATION` - Background tracking
- `HIGH_SAMPLING_RATE_SENSORS` - Motion sensors

### iOS
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`
- `NSMotionUsageDescription`

## Configuration

### Settings Available
- **Tampering Threshold**: 5%, 10%, or 15%
- **Motion Sensor Tracking**: Enable/disable sensor fusion
- **High Accuracy GPS**: Balance accuracy vs battery
- **Auto Night Mode**: Automatic night rate detection
- **Haptic Feedback**: Vibration on alerts
- **Local Trip Storage**: Save trip history

## Legal Compliance

This app uses **official fare rates** from the Maharashtra Motor Vehicle Department. All calculations are based on the authentic tariff card (w.e.f. 01/02/2025).

### Disclaimer
RickCheck is designed to help passengers verify fair fares. It should be used as a reference tool and does not replace official meter readings. Always follow local transportation regulations and resolve disputes through proper channels.

## Development Notes

### Testing
- Test GPS accuracy in various environments
- Verify sensor calibration on different devices
- Test night mode transitions at midnight
- Validate fare calculations against official tariff card

### Performance Optimization
- Location updates throttled to 1-second intervals
- Sensor data processed efficiently to prevent battery drain
- Memory management for long trips
- Background processing limitations handled gracefully

### Known Limitations
- Requires active internet for initial GPS lock
- Motion sensors may vary between device manufacturers
- GPS accuracy affected by tall buildings and tunnels
- Battery usage increases during active tracking

## Future Enhancements

### Planned Features
- **Multi-city Support**: Extend to other Indian cities
- **Trip History**: Local storage of past trips
- **Export Reports**: PDF generation for evidence
- **Social Features**: Community reporting of tampering
- **Offline Maps**: Cached map tiles for offline use

### Technical Improvements
- **ML-based Tampering**: Advanced detection algorithms
- **Voice Alerts**: Audio notifications during rides
- **Widget Support**: Home screen fare display
- **Wear OS**: Smartwatch companion app

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

### Coding Standards
- Follow React Native best practices
- Use meaningful variable names
- Add comments for complex logic
- Test on both Android and iOS
- Ensure accessibility compliance

## Troubleshooting

### Common Issues

**GPS Not Working**
- Check location permissions in device settings
- Ensure GPS is enabled
- Try restarting the app
- Move to an open area for better signal

**Sensors Not Responding**
- Restart the app
- Check if device supports required sensors
- Calibrate sensors in settings
- Ensure app has motion permissions

**Fare Calculation Errors**
- Verify GPS accuracy (should be <20 meters)
- Check for correct date/time settings
- Ensure night mode detection is working
- Report persistent issues with trip details

### Debug Mode
Enable debug logging by setting:
```javascript
const DEBUG_MODE = true; // in FareCalculator.js
```

## Support

### Contact Information
- **Email**: support@rickcheck.app
- **GitHub Issues**: https://github.com/yourusername/rickcheck/issues
- **Documentation**: https://rickcheck.app/docs

### Reporting Bugs
Please include:
- Device model and OS version
- App version
- Steps to reproduce the issue
- Screenshots if applicable
- Trip data (if relevant)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Maharashtra Motor Vehicle Department** for official tariff rates
- **Expo Team** for excellent development tools
- **React Native Community** for navigation and sensor libraries
- **OpenStreetMap** contributors for mapping data

---

**Made with ❤️ for fair transportation in India**

*Help us build a more transparent auto-rickshaw ecosystem!*