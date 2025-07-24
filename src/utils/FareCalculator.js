// Fare calculation constants from Maharashtra Auto-Rickshaw Tariff Card
export const FARE_CONSTANTS = {
    MIN_FARE: 26.00,
    PER_KM_RATE: 17.14,
    NIGHT_SURCHARGE: 0.25, // 25% additional
    NIGHT_START: 0, // 12:00 midnight
    NIGHT_END: 5, // 05:00 am
    WAITING_CHARGE_PER_MINUTE: 0.1, // 10% of basic fare per km
    LUGGAGE_CHARGE: 6.00, // Rs. 6 per package > 60x40 cms
  };
  
  export class FareCalculator {
    constructor() {
      this.fareTable = this.generateFareTable();
    }
  
    // Generate fare table based on the PDF data
    generateFareTable() {
      const table = {};
      
      // Generate fare table for distances up to 30km
      for (let distance = 1.5; distance <= 30.0; distance += 0.1) {
        const roundedDistance = Math.round(distance * 10) / 10;
        const baseFare = this.calculateBaseFare(roundedDistance);
        const nightFare = Math.round(baseFare * (1 + FARE_CONSTANTS.NIGHT_SURCHARGE));
        
        table[roundedDistance] = {
          normal: baseFare,
          midnight: nightFare,
        };
      }
      
      return table;
    }
  
    // Calculate base fare using the formula from tariff card
    calculateBaseFare(distance) {
      if (distance <= 0) return FARE_CONSTANTS.MIN_FARE;
      
      let fare = distance * FARE_CONSTANTS.PER_KM_RATE;
      
      // Apply minimum fare
      if (fare < FARE_CONSTANTS.MIN_FARE) {
        fare = FARE_CONSTANTS.MIN_FARE;
      }
      
      // Round to nearest rupee (as per tariff card rules)
      return Math.round(fare);
    }
  
    // Calculate fare with all charges
    calculateTotalFare(distance, waitingMinutes = 0, isNight = false, luggageCount = 0) {
      let baseFare = this.calculateBaseFare(distance);
      
      // Add waiting charges
      if (waitingMinutes > 0) {
        const waitingCharge = (FARE_CONSTANTS.PER_KM_RATE * FARE_CONSTANTS.WAITING_CHARGE_PER_MINUTE) * waitingMinutes;
        baseFare += waitingCharge;
      }
      
      // Add luggage charges
      if (luggageCount > 0) {
        baseFare += luggageCount * FARE_CONSTANTS.LUGGAGE_CHARGE;
      }
      
      // Apply night surcharge
      if (isNight) {
        baseFare += baseFare * FARE_CONSTANTS.NIGHT_SURCHARGE;
      }
      
      return Math.round(baseFare);
    }
  
    // Check if current time is night time
    isNightTime() {
      const hour = new Date().getHours();
      return hour >= FARE_CONSTANTS.NIGHT_START || hour < FARE_CONSTANTS.NIGHT_END;
    }
  
    // Get fare from lookup table for exact match
    getFareFromTable(distance, isNight = false) {
      const roundedDistance = Math.round(distance * 10) / 10;
      const fareData = this.fareTable[roundedDistance];
      
      if (fareData) {
        return isNight ? fareData.midnight : fareData.normal;
      }
      
      // Fallback to calculation if not in table
      return this.calculateBaseFare(distance);
    }
  
    // Detect potential fare tampering
    detectTampering(calculatedFare, actualFare, threshold = 0.1) {
      const difference = Math.abs(actualFare - calculatedFare);
      const percentageDiff = difference / calculatedFare;
      
      return {
        isTampered: percentageDiff > threshold,
        difference: difference,
        percentageDiff: percentageDiff * 100,
        overcharged: actualFare > calculatedFare,
      };
    }
  
    // Format fare for display
    formatFare(amount) {
      return `₹${amount.toFixed(0)}`;
    }
  }