/**
 * Phorest Booking Platform Adapter
 * 
 * This adapter implements the BookingPlatformAdapter interface for Phorest.
 */

import BookingPlatformAdapter from '../base';

class PhorestAdapter extends BookingPlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.baseUrl = 'https://api.phorest.com/third_party_api/v1';
    this.platformId = 'phorest';
  }

  /**
   * Initialize the adapter with configuration
   * @param {Object} config - Phorest-specific configuration
   * @returns {Promise<boolean>} True if initialization is successful
   */
  async initialize(config = {}) {
    await super.initialize(config);
    
    // Validate required configuration
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('Phorest adapter requires clientId and clientSecret');
    }
    
    // Set up API endpoints
    this.endpoints = {
      appointments: '/appointments',
      availability: '/availability',
      clients: '/clients',
      services: '/services',
      staff: '/staff'
    };
    
    return true;
  }

  /**
   * Authenticate with Phorest using OAuth
   * @returns {Promise<string>} Authentication token
   */
  async authenticate() {
    try {
      // In a real implementation, this would make an API call to Phorest's OAuth endpoint
      // For this mock implementation, we'll simulate a successful authentication
      
      console.log('Authenticating with Phorest...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set auth token and connected status
      this.authToken = `phorest-oauth-token-${Date.now()}`;
      this.isConnected = true;
      
      console.log('Successfully authenticated with Phorest');
      
      return this.authToken;
    } catch (error) {
      this.isConnected = false;
      this.authToken = null;
      throw this.handleError(error);
    }
  }

  /**
   * Test the connection to Phorest
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
      
      console.log('Testing connection to Phorest...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Successfully connected to Phorest');
      
      return true;
    } catch (error) {
      this.isConnected = false;
      throw this.handleError(error);
    }
  }

  /**
   * Get available appointment slots from Phorest
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
      
      console.log(`Getting availability from Phorest (${startDate.toISOString()} to ${endDate.toISOString()})...`);
      
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
            providerId: `phorest-provider-${Math.floor(Math.random() * 5) + 1}`,
            serviceId: filters.serviceId || `phorest-service-${Math.floor(Math.random() * 3) + 1}`,
            platformData: {
              id: `phorest-slot-${slotDate.getTime()}`,
              platform: this.platformId,
              branchId: 'main-branch'
            }
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log(`Found ${slots.length} available slots from Phorest`);
      
      return slots;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Book an appointment with Phorest
   * @param {Object} appointmentDetails - Details of the appointment to book
   * @returns {Promise<Object>} Booking confirmation details
   */
  async bookAppointment(appointmentDetails) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Booking appointment with Phorest...`, appointmentDetails);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock booking confirmation
      const appointmentId = `phorest-appointment-${Date.now()}`;
      
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
          branchId: 'main-branch',
          confirmationCode: `PH-${Math.floor(Math.random() * 10000)}`
        }
      };
      
      console.log(`Successfully booked appointment with Phorest: ${appointmentId}`);
      
      return confirmation;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer appointments from Phorest
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
      
      console.log(`Getting appointments for customer ${customerId} from Phorest...`);
      
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
          id: `phorest-appointment-past-${i}`,
          customerId,
          serviceId: `phorest-service-${Math.floor(Math.random() * 3) + 1}`,
          providerId: `phorest-provider-${Math.floor(Math.random() * 5) + 1}`,
          startTime: appointmentDate.toISOString(),
          endTime: new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'completed',
          notes: '',
          price: Math.floor(Math.random() * 100) + 50,
          platformData: {
            id: `phorest-appointment-past-${i}`,
            platform: this.platformId,
            branchId: 'main-branch',
            confirmationCode: `PH-${Math.floor(Math.random() * 10000)}`
          }
        });
      }
      
      // Generate some future appointments
      for (let i = 0; i < 2; i++) {
        const appointmentDate = new Date(startDate);
        appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 14) + 1);
        
        appointments.push({
          id: `phorest-appointment-future-${i}`,
          customerId,
          serviceId: `phorest-service-${Math.floor(Math.random() * 3) + 1}`,
          providerId: `phorest-provider-${Math.floor(Math.random() * 5) + 1}`,
          startTime: appointmentDate.toISOString(),
          endTime: new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          notes: '',
          price: Math.floor(Math.random() * 100) + 50,
          platformData: {
            id: `phorest-appointment-future-${i}`,
            platform: this.platformId,
            branchId: 'main-branch',
            confirmationCode: `PH-${Math.floor(Math.random() * 10000)}`
          }
        });
      }
      
      console.log(`Found ${appointments.length} appointments for customer ${customerId} from Phorest`);
      
      return appointments;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer details from Phorest
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomer(customerId) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting customer ${customerId} from Phorest...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock customer data
      const customer = {
        id: customerId,
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.johnson@example.com',
        phone: '555-555-5555',
        platformData: {
          id: customerId,
          platform: this.platformId,
          branchId: 'main-branch',
          memberSince: '2021-03-10'
        }
      };
      
      console.log(`Successfully retrieved customer ${customerId} from Phorest`);
      
      return customer;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get service details from Phorest
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Service details
   */
  async getService(serviceId) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting service ${serviceId} from Phorest...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock service data
      const service = {
        id: serviceId,
        name: `Spa Facial Treatment`,
        description: 'Luxurious facial treatment with premium products',
        duration: 75,
        price: 95,
        platformData: {
          id: serviceId,
          platform: this.platformId,
          branchId: 'main-branch',
          categoryId: 'facial-services'
        }
      };
      
      console.log(`Successfully retrieved service ${serviceId} from Phorest`);
      
      return service;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get provider details from Phorest
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Provider details
   */
  async getProvider(providerId) {
    try {
      // Ensure we have an auth token
      if (!this.authToken) {
        await this.authenticate();
      }
      
      console.log(`Getting provider ${providerId} from Phorest...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock provider data
      const provider = {
        id: providerId,
        firstName: 'Jessica',
        lastName: 'Williams',
        title: 'Senior Esthetician',
        bio: 'Specialized in advanced facial treatments and skincare',
        platformData: {
          id: providerId,
          platform: this.platformId,
          branchId: 'main-branch',
          imageUrl: 'https://example.com/provider-image.jpg'
        }
      };
      
      console.log(`Successfully retrieved provider ${providerId} from Phorest`);
      
      return provider;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Normalize Phorest-specific data to a standard format
   * @param {Object} data - Phorest-specific data
   * @param {string} type - Data type (appointment, customer, service, provider)
   * @returns {Object} Normalized data
   */
  normalizeData(data, type) {
    switch (type) {
      case 'appointment':
        return {
          id: data.id || data.Id,
          customerId: data.clientId || data.customerId,
          serviceId: data.serviceId || data.ServiceId,
          providerId: data.staffId || data.providerId,
          startTime: data.startTime || data.StartTime,
          endTime: data.endTime || data.EndTime,
          status: this.mapAppointmentStatus(data.status || data.Status),
          notes: data.notes || data.Notes || '',
          price: data.price || data.Price || 0,
          platformData: {
            id: data.id || data.Id,
            platform: this.platformId,
            branchId: data.branchId || data.BranchId || 'main-branch',
            confirmationCode: data.confirmationCode || data.ConfirmationCode
          }
        };
        
      case 'customer':
        return {
          id: data.id || data.Id,
          firstName: data.firstName || data.FirstName,
          lastName: data.lastName || data.LastName,
          email: data.email || data.Email,
          phone: data.mobile || data.Mobile || data.phone || data.Phone,
          platformData: {
            id: data.id || data.Id,
            platform: this.platformId,
            branchId: data.branchId || data.BranchId || 'main-branch',
            memberSince: data.createdAt || data.CreatedAt || data.memberSince
          }
        };
        
      case 'service':
        return {
          id: data.id || data.Id,
          name: data.name || data.Name,
          description: data.description || data.Description,
          duration: data.duration || data.Duration,
          price: data.price || data.Price,
          platformData: {
            id: data.id || data.Id,
            platform: this.platformId,
            branchId: data.branchId || data.BranchId || 'main-branch',
            categoryId: data.categoryId || data.CategoryId
          }
        };
        
      case 'provider':
        return {
          id: data.id || data.Id,
          firstName: data.firstName || data.FirstName,
          lastName: data.lastName || data.LastName,
          title: data.title || data.Title,
          bio: data.bio || data.Bio,
          platformData: {
            id: data.id || data.Id,
            platform: this.platformId,
            branchId: data.branchId || data.BranchId || 'main-branch',
            imageUrl: data.imageUrl || data.ImageUrl
          }
        };
        
      default:
        return data;
    }
  }

  /**
   * Map Phorest-specific appointment status to standard status
   * @param {string} status - Phorest-specific status
   * @returns {string} Standard status
   */
  mapAppointmentStatus(status) {
    const statusMap = {
      'CONFIRMED': 'confirmed',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'NO_SHOW': 'no-show',
      'PENDING': 'pending'
    };
    
    return statusMap[status] || status.toLowerCase();
  }

  /**
   * Handle Phorest-specific errors
   * @param {Error} error - Error object
   * @returns {Error} Normalized error
   */
  handleError(error) {
    console.error(`Phorest adapter error:`, error);
    
    // Check for Phorest-specific error codes and normalize them
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      if (errorData.error) {
        switch (errorData.error) {
          case 'invalid_client':
            return new Error('Invalid Phorest credentials. Please check your client ID and secret.');
          case 'invalid_grant':
            return new Error('Invalid Phorest authorization grant. Please check your credentials.');
          case 'unauthorized':
            this.authToken = null;
            return new Error('Phorest authentication failed. Please re-authenticate.');
          case 'too_many_requests':
            return new Error('Phorest API rate limit exceeded. Please try again later.');
          default:
            return new Error(`Phorest API error: ${errorData.error_description || errorData.error}`);
        }
      }
    }
    
    return error;
  }
}

export default PhorestAdapter;

