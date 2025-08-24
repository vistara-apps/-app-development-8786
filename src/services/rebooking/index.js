/**
 * Rebooking Service
 * 
 * This service provides functionality for generating rebooking suggestions,
 * analyzing appointment patterns, and managing the rebooking process.
 */

import bookingService from '../BookingService';

class RebookingService {
  constructor() {
    this.bookingService = bookingService;
  }

  /**
   * Generate rebooking suggestions for a customer
   * @param {string} customerId - ID of the customer
   * @param {Object} options - Options for generating suggestions
   * @returns {Promise<Array>} Array of rebooking suggestions
   */
  async generateSuggestions(customerId, options = {}) {
    try {
      // Get customer's appointment history
      const appointments = await this.bookingService.getCustomerAppointments(customerId);
      
      if (appointments.length === 0) {
        console.log(`No appointment history found for customer ${customerId}`);
        return [];
      }
      
      // Analyze appointment patterns
      const patterns = this.analyzeAppointmentPatterns(appointments);
      
      // Get availability for the next few weeks
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (options.daysAhead || 14));
      
      const availability = await this.bookingService.getAvailability(startDate, endDate, {
        serviceId: patterns.mostCommonService,
        providerId: options.preferSameProvider ? patterns.mostCommonProvider : undefined
      });
      
      if (availability.length === 0) {
        console.log(`No availability found for customer ${customerId}`);
        return [];
      }
      
      // Filter and rank availability based on patterns
      const rankedSlots = this.rankAvailabilitySlots(availability, patterns);
      
      // Generate suggestions
      const suggestions = [];
      const maxSuggestions = options.maxSuggestions || 3;
      
      for (let i = 0; i < Math.min(maxSuggestions, rankedSlots.length); i++) {
        const slot = rankedSlots[i];
        
        suggestions.push({
          timeSlot: slot,
          service: {
            id: slot.serviceId,
            name: `Service ${slot.serviceId.split('-')[1]}`,
            duration: 60,
            price: Math.floor(Math.random() * 100) + 50
          },
          provider: {
            id: slot.providerId,
            firstName: `Provider ${slot.providerId.split('-')[1]}`,
            lastName: 'Smith'
          },
          customerId,
          formattedDateTime: new Date(slot.startTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }),
          score: slot.score
        });
      }
      
      return suggestions;
    } catch (error) {
      console.error('Error generating rebooking suggestions:', error);
      throw error;
    }
  }

  /**
   * Analyze appointment patterns from past appointments
   * @param {Array} appointments - Array of past appointments
   * @returns {Object} Appointment patterns
   */
  analyzeAppointmentPatterns(appointments) {
    // Sort appointments by date (oldest first)
    const sortedAppointments = [...appointments].sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
    
    // Initialize patterns object
    const patterns = {
      services: {},
      providers: {},
      frequency: {
        weekly: 0,
        biweekly: 0,
        monthly: 0,
        quarterly: 0,
        irregular: 0
      },
      preferredDays: {
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0  // Saturday
      },
      preferredTimes: {
        morning: 0,   // 6-12
        afternoon: 0, // 12-17
        evening: 0    // 17-22
      },
      intervals: []
    };
    
    // Analyze service preferences
    sortedAppointments.forEach(appointment => {
      // Count service usage
      const serviceId = appointment.serviceId;
      patterns.services[serviceId] = (patterns.services[serviceId] || 0) + 1;
      
      // Count provider usage
      const providerId = appointment.providerId;
      patterns.providers[providerId] = (patterns.providers[providerId] || 0) + 1;
      
      // Count preferred days
      const day = new Date(appointment.startTime).getDay();
      patterns.preferredDays[day] += 1;
      
      // Count preferred times
      const hour = new Date(appointment.startTime).getHours();
      if (hour >= 6 && hour < 12) {
        patterns.preferredTimes.morning += 1;
      } else if (hour >= 12 && hour < 17) {
        patterns.preferredTimes.afternoon += 1;
      } else if (hour >= 17 && hour < 22) {
        patterns.preferredTimes.evening += 1;
      }
    });
    
    // Calculate intervals between appointments
    for (let i = 1; i < sortedAppointments.length; i++) {
      const prevDate = new Date(sortedAppointments[i-1].startTime);
      const currDate = new Date(sortedAppointments[i].startTime);
      const daysDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      patterns.intervals.push(daysDiff);
      
      // Categorize frequency
      if (daysDiff <= 9) {
        patterns.frequency.weekly += 1;
      } else if (daysDiff <= 18) {
        patterns.frequency.biweekly += 1;
      } else if (daysDiff <= 35) {
        patterns.frequency.monthly += 1;
      } else if (daysDiff <= 100) {
        patterns.frequency.quarterly += 1;
      } else {
        patterns.frequency.irregular += 1;
      }
    }
    
    // Calculate average interval
    patterns.averageInterval = patterns.intervals.length > 0
      ? patterns.intervals.reduce((sum, interval) => sum + interval, 0) / patterns.intervals.length
      : 30; // Default to monthly if no intervals
    
    // Find most common patterns
    patterns.mostCommonService = this.findMostCommon(patterns.services);
    patterns.mostCommonProvider = this.findMostCommon(patterns.providers);
    patterns.mostCommonDay = this.findMostCommon(patterns.preferredDays);
    patterns.mostCommonTime = this.findMostCommon(patterns.preferredTimes);
    patterns.mostCommonFrequency = this.findMostCommon(patterns.frequency);
    
    return patterns;
  }

  /**
   * Find the most common item in an object of counts
   * @param {Object} countObj - Object with items as keys and counts as values
   * @returns {string} Most common item
   */
  findMostCommon(countObj) {
    let maxCount = 0;
    let mostCommon = null;
    
    for (const [item, count] of Object.entries(countObj)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    }
    
    return mostCommon;
  }

  /**
   * Rank availability slots based on customer patterns
   * @param {Array} slots - Available time slots
   * @param {Object} patterns - Customer appointment patterns
   * @returns {Array} Ranked slots with scores
   */
  rankAvailabilitySlots(slots, patterns) {
    // Add scores to each slot
    const scoredSlots = slots.map(slot => {
      const slotDate = new Date(slot.startTime);
      const day = slotDate.getDay();
      const hour = slotDate.getHours();
      
      // Initialize score
      let score = 0;
      
      // Score based on preferred day
      const dayPreference = patterns.preferredDays[day] || 0;
      score += (dayPreference / Object.values(patterns.preferredDays).reduce((a, b) => a + b, 1)) * 40;
      
      // Score based on preferred time
      let timeCategory = 'morning';
      if (hour >= 12 && hour < 17) {
        timeCategory = 'afternoon';
      } else if (hour >= 17 && hour < 22) {
        timeCategory = 'evening';
      }
      
      const timePreference = patterns.preferredTimes[timeCategory] || 0;
      score += (timePreference / Object.values(patterns.preferredTimes).reduce((a, b) => a + b, 1)) * 30;
      
      // Score based on preferred provider
      if (slot.providerId === patterns.mostCommonProvider) {
        score += 20;
      }
      
      // Score based on preferred service
      if (slot.serviceId === patterns.mostCommonService) {
        score += 10;
      }
      
      return {
        ...slot,
        score
      };
    });
    
    // Sort by score (highest first)
    return scoredSlots.sort((a, b) => b.score - a.score);
  }

  /**
   * Book a rebooking suggestion
   * @param {Object} suggestion - Rebooking suggestion
   * @returns {Promise<Object>} Booking confirmation
   */
  async bookRebookingSuggestion(suggestion) {
    try {
      // Prepare appointment details
      const appointmentDetails = {
        customerId: suggestion.customerId,
        serviceId: suggestion.service.id,
        providerId: suggestion.provider.id,
        startTime: suggestion.timeSlot.startTime,
        notes: 'Booked via automated rebooking system'
      };
      
      // Book the appointment
      const confirmation = await this.bookingService.bookAppointment(appointmentDetails);
      
      return confirmation;
    } catch (error) {
      console.error('Error booking rebooking suggestion:', error);
      throw error;
    }
  }

  /**
   * Get recommended next appointment date based on service type and customer history
   * @param {string} customerId - Customer ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Date>} Recommended next appointment date
   */
  async getRecommendedNextAppointmentDate(customerId, serviceId) {
    try {
      // Get customer's appointment history
      const appointments = await this.bookingService.getCustomerAppointments(customerId);
      
      // Filter appointments for the specific service
      const serviceAppointments = appointments.filter(
        appointment => appointment.serviceId === serviceId
      );
      
      if (serviceAppointments.length === 0) {
        // No history for this service, use default recommendation
        return this.getDefaultRecommendationForService(serviceId);
      }
      
      // Analyze intervals between appointments for this service
      const intervals = [];
      const sortedAppointments = [...serviceAppointments].sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
      
      for (let i = 1; i < sortedAppointments.length; i++) {
        const prevDate = new Date(sortedAppointments[i-1].startTime);
        const currDate = new Date(sortedAppointments[i].startTime);
        const daysDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
        intervals.push(daysDiff);
      }
      
      // Calculate average interval
      const averageInterval = intervals.length > 0
        ? intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
        : this.getDefaultIntervalForService(serviceId);
      
      // Get the most recent appointment date
      const lastAppointment = sortedAppointments[sortedAppointments.length - 1];
      const lastAppointmentDate = new Date(lastAppointment.startTime);
      
      // Calculate recommended next date
      const nextDate = new Date(lastAppointmentDate);
      nextDate.setDate(nextDate.getDate() + Math.round(averageInterval));
      
      return nextDate;
    } catch (error) {
      console.error('Error getting recommended next appointment date:', error);
      throw error;
    }
  }

  /**
   * Get default recommendation interval for a service type
   * @param {string} serviceId - Service ID
   * @returns {number} Recommended interval in days
   */
  getDefaultIntervalForService(serviceId) {
    // These would be based on service type in a real implementation
    const defaultIntervals = {
      'haircut': 42,        // 6 weeks
      'color': 35,          // 5 weeks
      'highlights': 56,     // 8 weeks
      'facial': 28,         // 4 weeks
      'massage': 21,        // 3 weeks
      'manicure': 14,       // 2 weeks
      'pedicure': 28        // 4 weeks
    };
    
    // Extract service type from ID if possible
    const serviceType = serviceId.toLowerCase().split('-').find(part => 
      defaultIntervals[part] !== undefined
    );
    
    return serviceType ? defaultIntervals[serviceType] : 30; // Default to 30 days
  }

  /**
   * Get default next appointment date for a service
   * @param {string} serviceId - Service ID
   * @returns {Date} Recommended next appointment date
   */
  getDefaultRecommendationForService(serviceId) {
    const interval = this.getDefaultIntervalForService(serviceId);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  }
}

// Create singleton instance
const rebookingService = new RebookingService();
export default rebookingService;

