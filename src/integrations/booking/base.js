/**
 * Base Booking Platform Adapter
 * 
 * This is the base class for all booking platform adapters.
 * It defines the common interface that all platform adapters must implement.
 */

class BookingPlatformAdapter {
  constructor(config = {}) {
    this.config = config;
    this.authToken = null;
    this.isConnected = false;
  }

  /**
   * Initialize the adapter with configuration
   * @param {Object} config - Platform-specific configuration
   * @returns {Promise<boolean>} True if initialization is successful
   */
  async initialize(config = {}) {
    this.config = { ...this.config, ...config };
    return true;
  }

  /**
   * Authenticate with the booking platform
   * @returns {Promise<string>} Authentication token
   */
  async authenticate() {
    throw new Error('Method not implemented: authenticate()');
  }

  /**
   * Test the connection to the booking platform
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    throw new Error('Method not implemented: testConnection()');
  }

  /**
   * Get available appointment slots
   * @param {Date} startDate - Start date for availability search
   * @param {Date} endDate - End date for availability search
   * @param {Object} filters - Optional filters (service, provider, etc.)
   * @returns {Promise<Array>} Array of available time slots
   */
  async getAvailability(startDate, endDate, filters = {}) {
    throw new Error('Method not implemented: getAvailability()');
  }

  /**
   * Book an appointment
   * @param {Object} appointmentDetails - Details of the appointment to book
   * @returns {Promise<Object>} Booking confirmation details
   */
  async bookAppointment(appointmentDetails) {
    throw new Error('Method not implemented: bookAppointment()');
  }

  /**
   * Get customer appointments
   * @param {string} customerId - Customer ID
   * @param {Object} filters - Optional filters (date range, status, etc.)
   * @returns {Promise<Array>} Array of appointments
   */
  async getCustomerAppointments(customerId, filters = {}) {
    throw new Error('Method not implemented: getCustomerAppointments()');
  }

  /**
   * Get customer details
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomer(customerId) {
    throw new Error('Method not implemented: getCustomer()');
  }

  /**
   * Get service details
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} Service details
   */
  async getService(serviceId) {
    throw new Error('Method not implemented: getService()');
  }

  /**
   * Get provider details
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Provider details
   */
  async getProvider(providerId) {
    throw new Error('Method not implemented: getProvider()');
  }

  /**
   * Normalize platform-specific data to a standard format
   * @param {Object} data - Platform-specific data
   * @param {string} type - Data type (appointment, customer, service, provider)
   * @returns {Object} Normalized data
   */
  normalizeData(data, type) {
    throw new Error('Method not implemented: normalizeData()');
  }

  /**
   * Handle platform-specific errors
   * @param {Error} error - Error object
   * @returns {Error} Normalized error
   */
  handleError(error) {
    // Default implementation
    console.error(`Booking platform error:`, error);
    return error;
  }
}

export default BookingPlatformAdapter;

