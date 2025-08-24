/**
 * Mindbody Booking Platform Adapter
 * 
 * This adapter implements the BookingPlatformAdapter interface for Mindbody.
 */

import BookingPlatformAdapter from '../base';

class MindbodyAdapter extends BookingPlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.baseUrl = 'https://api.mindbodyonline.com/public/v6';
    this.platformId = 'mindbody';
  }

  /**
   * Initialize the adapter with configuration
   * @param {Object} config - Mindbody-specific configuration
   * @returns {Promise<boolean>} True if initialization is successful
   */
  async initialize(config = {}) {
    await super.initialize(config);
    
    // Validate required configuration
    if (!this.config.apiKey) {
      throw new Error('Mindbody adapter requires apiKey');
    }
    
    if (!this.config.siteId) {
      throw new Error('Mindbody adapter requires siteId');
    }
    
    // Set up API endpoints
    this.endpoints = {
      appointments: '/appointment/appointments',
      availability: '/appointment/availabilities',
      clients: '/client/clients',
      services: '/appointment/services',
      staff: '/staff/staff'
    };
    
    return true;
  }

  /**
   * Authenticate with Mindbody using API key
   * @returns {Promise<string>} Authentication token
   */
  async authenticate() {
    try {
      // In a real implementation, this would make an API call to Mindbody's auth endpoint
      // For this mock implementation, we'll simulate a successful authentication
      
      console.log('Authenticating with Mindbody...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set auth token and connected status
      this.authToken = `mindbody-api-token-${Date.now()}`;
      this.isConnected = true;
      
      console.log('Successfully authenticated with Mindbody');
      
      return this.authToken;
    } catch (error) {
      this.isConnected = false;
      this.authToken = null;
      throw this.handleError(error);
    }
  }

  /**
   * Test the connection to Mindbody
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      // In a real implementation, this would make a simple API call to verify the token
      // For this mock implementation, we'll simulate a successful connection test
      
      console.log('Testing connection to Mindbody...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Successfully connected to Mindbody');
      
      return true;
    } catch (error) {
      this.isConnected = false;
      throw this.handleError(error);
    }
  }

  /**
   * Get available appointment slots from Mindbody
   * @param {Date} startDate - Start date for availability search
   * @param {Date} endDate - End date for availability search
   * @param {Object} filters - Optional filters (service, provider, etc.)
   * @returns {Promise<Array>} Array of available time slots
   */
  async getAvailability(startDate, endDate, filters = {}) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting availability from Mindbody (${startDate.toISOString()} to ${endDate.toISOString()})...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock availability data
      const slots = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        // Generate slots for business hours (9am-5pm)
        for (let hour = 9; hour < 17; hour++) {
          // Skip some slots randomly to simulate unavailability
          if (Math.random() > 0.7) continue;
          
          const slotDate = new Date(currentDate);
          slotDate.setHours(hour, 0, 0, 0);
          
          slots.push({
            startTime: slotDate.toISOString(),
            endTime: new Date(slotDate.getTime() + 60 * 60 * 1000).toISOString(),
            providerId: `mindbody-provider-${Math.floor(Math.random() * 5) + 1}`,
            serviceId: filters.serviceId || `mindbody-service-${Math.floor(Math.random() * 3) + 1}`,
            platformData: {
              id: `mindbody-slot-${slotDate.getTime()}`,
              platform: this.platformId,
              siteId: this.config.siteId
            }
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log(`Found ${slots.length} available slots from Mindbody`);
      
      return slots;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Book an appointment with Mindbody
   * @param {Object} appointmentDetails - Details of the appointment to book
   * @returns {Promise<Object>} Booking confirmation details
   */
  async bookAppointment(appointmentDetails) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Booking appointment with Mindbody...`, appointmentDetails);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock booking confirmation
      const appointmentId = `mindbody-appointment-${Date.now()}`;
      
      const confirmation = {
        id: appointmentId,
        customerId: appointmentDetails.customerId,
        serviceId: appointmentDetails.serviceId,
        providerId: appointmentDetails.providerId,
        startTime: appointmentDetails.startTime,
        endTime: new Date(new Date(appointmentDetails.startTime).getTime() + 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        notes: appointmentDetails.notes || '',
        price: Math.floor(Math.random() * 100) + 50,
        platformData: {
          id: appointmentId,
          platform: this.platformId,
          siteId: this.config.siteId,
          confirmationCode: `MB-${Math.floor(Math.random() * 10000)}`
        }
      };
      
      console.log(`Successfully booked appointment with Mindbody: ${appointmentId}`);
      
      return confirmation;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer appointments from Mindbody
   * @param {string} customerId - Customer ID
   * @param {Object} filters - Optional filters (date range, status, etc.)
   * @returns {Promise<Array>} Array of appointments
   */
  async getCustomerAppointments(customerId, filters = {}) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting appointments for customer ${customerId} from Mindbody...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock appointments
      const appointments = [];
      const startDate = filters.startDate || new Date();
      const endDate = filters.endDate || new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // Generate some past appointments
      const pastDate = new Date(startDate);
      pastDate.setMonth(pastDate.getMonth() - 3);
      
      for (let i = 0; i < 5; i++) {
        const appointmentDate = new Date(pastDate);
        appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30));
        
        appointments.push({
          id: `mindbody-appointment-past-${i}`,
          customerId,
          serviceId: `mindbody-service-${Math.floor(Math.random() * 3) + 1}`,
          providerId: `mindbody-provider-${Math.floor(Math.random() * 5) + 1}`,
          startTime: appointmentDate.toISOString(),
          endTime: new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'completed',
          notes: '',
          price: Math.floor(Math.random() * 100) + 50,
          platformData: {
            id: `mindbody-appointment-past-${i}`,
            platform: this.platformId,
            siteId: this.config.siteId,
            confirmationCode: `MB-${Math.floor(Math.random() * 10000)}`
          }
        });
      }
      
      // Generate some future appointments
      for (let i = 0; i < 2; i++) {
        const appointmentDate = new Date(startDate);
        appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 14) + 1);
        
        appointments.push({
          id: `mindbody-appointment-future-${i}`,
          customerId,
          serviceId: `mindbody-service-${Math.floor(Math.random() * 3) + 1}`,
          providerId: `mindbody-provider-${Math.floor(Math.random() * 5) + 1}`,
          startTime: appointmentDate.toISOString(),
          endTime: new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          notes: '',
          price: Math.floor(Math.random() * 100) + 50,
          platformData: {
            id: `mindbody-appointment-future-${i}`,
            platform: this.platformId,
            siteId: this.config.siteId,
            confirmationCode: `MB-${Math.floor(Math.random() * 10000)}`
          }
        });
      }
      
      console.log(`Found ${appointments.length} appointments for customer ${customerId} from Mindbody`);
      
      return appointments;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer details from Mindbody
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomer(customerId) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting customer ${customerId} from Mindbody...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock customer data
      const customer = {
        id: customerId,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        platformData: {
          id: customerId,
          platform: this.platformId,
          siteId: this.config.siteId,
          memberSince: '2019-05-20'
        }
      };
      
      console.log(`Successfully retrieved customer ${customerId} from Mindbody`);
      
      return customer;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get service details from Mindbody
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Service details
   */
  async getService(serviceId) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting service ${serviceId} from Mindbody...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock service data
      const service = {
        id: serviceId,
        name: `Color & Highlights`,
        description: 'Professional hair coloring and highlighting service',
        duration: 90,
        price: 120,
        platformData: {
          id: serviceId,
          platform: this.platformId,
          siteId: this.config.siteId,
          categoryId: 'color-services'
        }
      };
      
      console.log(`Successfully retrieved service ${serviceId} from Mindbody`);
      
      return service;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get provider details from Mindbody
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Provider details
   */
  async getProvider(providerId) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting provider ${providerId} from Mindbody...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock provider data
      const provider = {
        id: providerId,
        firstName: 'Michael',
        lastName: 'Johnson',
        title: 'Master Colorist',
        bio: 'Specializing in creative color techniques and precision cuts',
        platformData: {
          id: providerId,
          platform: this.platformId,
          siteId: this.config.siteId,
          imageUrl: 'https://example.com/provider-image.jpg'
        }
      };
      
      console.log(`Successfully retrieved provider ${providerId} from Mindbody`);
      
      return provider;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Normalize Mindbody-specific data to a standard format
   * @param {Object} data - Mindbody-specific data
   * @param {string} type - Data type (appointment, customer, service, provider)
   * @returns {Object} Normalized data
   */
  normalizeData(data, type) {
    switch (type) {
      case 'appointment':
        return {
          id: data.Id || data.id,
          customerId: data.ClientId || data.customerId,
          serviceId: data.ServiceId || data.serviceId,
          providerId: data.StaffId || data.providerId,
          startTime: data.StartDateTime || data.startTime,
          endTime: data.EndDateTime || data.endTime,
          status: this.mapAppointmentStatus(data.Status || data.status),
          notes: data.Notes || data.notes || '',
          price: data.Price || data.price || 0,
          platformData: {
            id: data.Id || data.id,
            platform: this.platformId,
            siteId: this.config.siteId,
            confirmationCode: data.ConfirmationCode || data.confirmationCode
          }
        };
        
      case 'customer':
        return {
          id: data.Id || data.id,
          firstName: data.FirstName || data.firstName,
          lastName: data.LastName || data.lastName,
          email: data.Email || data.email,
          phone: data.MobilePhone || data.phone,
          platformData: {
            id: data.Id || data.id,
            platform: this.platformId,
            siteId: this.config.siteId,
            memberSince: data.CreationDate || data.memberSince
          }
        };
        
      case 'service':
        return {
          id: data.Id || data.id,
          name: data.Name || data.name,
          description: data.Description || data.description,
          duration: data.Duration || data.duration,
          price: data.Price || data.price,
          platformData: {
            id: data.Id || data.id,
            platform: this.platformId,
            siteId: this.config.siteId,
            categoryId: data.CategoryId || data.categoryId
          }
        };
        
      case 'provider':
        return {
          id: data.Id || data.id,
          firstName: data.FirstName || data.firstName,
          lastName: data.LastName || data.lastName,
          title: data.Title || data.title,
          bio: data.Bio || data.bio,
          platformData: {
            id: data.Id || data.id,
            platform: this.platformId,
            siteId: this.config.siteId,
            imageUrl: data.ImageUrl || data.imageUrl
          }
        };
        
      default:
        return data;
    }
  }

  /**
   * Map Mindbody-specific appointment status to standard status
   * @param {string} status - Mindbody-specific status
   * @returns {string} Standard status
   */
  mapAppointmentStatus(status) {
    const statusMap = {
      'Booked': 'confirmed',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
      'NoShow': 'no-show',
      'Requested': 'pending'
    };
    
    return statusMap[status] || status.toLowerCase();
  }

  /**
   * Handle Mindbody-specific errors
   * @param {Error} error - Error object
   * @returns {Error} Normalized error
   */
  handleError(error) {
    console.error(`Mindbody adapter error:`, error);
    
    // Check for Mindbody-specific error codes and normalize them
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      if (errorData.Error) {
        switch (errorData.Error.Code) {
          case 'InvalidCredentials':
            return new Error('Invalid Mindbody credentials. Please check your API key and site ID.');
          case 'InvalidParameters':
            return new Error(`Invalid parameters: ${errorData.Error.Message}`);
          case 'Unauthorized':
            this.authToken = null;
            return new Error('Mindbody authentication failed. Please re-authenticate.');
          case 'TooManyRequests':
            return new Error('Mindbody API rate limit exceeded. Please try again later.');
          default:
            return new Error(`Mindbody API error: ${errorData.Error.Message || errorData.Error.Code}`);
        }
      }
    }
    
    return error;
  }
}

export default MindbodyAdapter;

