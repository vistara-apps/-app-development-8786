/**
 * Vagaro Webhook Handler
 * 
 * This module handles incoming webhooks from Vagaro booking platform.
 * It validates, normalizes, and processes Vagaro-specific events.
 */

import { createHmac } from 'crypto';
import bookingService from '../../services/BookingService';
import eventService from '../../services/events/booking';

/**
 * Process incoming webhook from Vagaro
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<Object>} Processing result
 */
async function processWebhook(payload, headers) {
  try {
    console.log('Processing Vagaro webhook...');
    
    // Extract event type
    const eventType = payload.eventType || payload.EventType;
    
    if (!eventType) {
      throw new Error('Missing event type in Vagaro webhook payload');
    }
    
    // Process based on event type
    let processedData;
    
    switch (eventType.toLowerCase()) {
      case 'appointment.created':
        processedData = await processAppointmentCreated(payload);
        break;
        
      case 'appointment.updated':
        processedData = await processAppointmentUpdated(payload);
        break;
        
      case 'appointment.cancelled':
        processedData = await processAppointmentCancelled(payload);
        break;
        
      case 'appointment.completed':
        processedData = await processAppointmentCompleted(payload);
        break;
        
      case 'client.created':
        processedData = await processClientCreated(payload);
        break;
        
      case 'client.updated':
        processedData = await processClientUpdated(payload);
        break;
        
      default:
        console.log(`Unhandled Vagaro event type: ${eventType}`);
        processedData = { message: 'Event type not handled' };
    }
    
    return {
      eventType,
      processedData
    };
  } catch (error) {
    console.error('Error processing Vagaro webhook:', error);
    throw error;
  }
}

/**
 * Validate Vagaro webhook signature
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<boolean>} True if webhook is valid
 */
async function validateWebhook(payload, headers) {
  try {
    // In a real implementation, this would validate the webhook signature
    // For this mock implementation, we'll simulate a successful validation
    
    console.log('Validating Vagaro webhook signature...');
    
    // Check for required headers
    if (!headers['x-vagaro-signature']) {
      console.warn('Missing Vagaro signature header');
      return false;
    }
    
    // In a real implementation, we would verify the signature like this:
    // const signature = headers['x-vagaro-signature'];
    // const secret = process.env.VAGARO_WEBHOOK_SECRET;
    // const hmac = createHmac('sha256', secret);
    // const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    // return signature === digest;
    
    // For this mock implementation, we'll return true
    return true;
  } catch (error) {
    console.error('Error validating Vagaro webhook:', error);
    return false;
  }
}

/**
 * Register webhooks with Vagaro
 * @param {Object} config - Vagaro-specific configuration
 * @returns {Promise<Object>} Registration result
 */
async function registerWebhooks(config) {
  try {
    console.log('Registering Vagaro webhooks...');
    
    // In a real implementation, this would make API calls to register webhooks
    // For this mock implementation, we'll simulate a successful registration
    
    const webhookUrl = config.webhookUrl || 'https://app.salonrecovery.com/api/webhooks/vagaro';
    
    // Mock registration for different event types
    const registeredEvents = [
      'appointment.created',
      'appointment.updated',
      'appointment.cancelled',
      'appointment.completed',
      'client.created',
      'client.updated'
    ];
    
    return {
      success: true,
      webhookUrl,
      registeredEvents
    };
  } catch (error) {
    console.error('Error registering Vagaro webhooks:', error);
    throw error;
  }
}

/**
 * Unregister webhooks with Vagaro
 * @param {Object} config - Vagaro-specific configuration
 * @returns {Promise<Object>} Unregistration result
 */
async function unregisterWebhooks(config) {
  try {
    console.log('Unregistering Vagaro webhooks...');
    
    // In a real implementation, this would make API calls to unregister webhooks
    // For this mock implementation, we'll simulate a successful unregistration
    
    return {
      success: true,
      message: 'Successfully unregistered Vagaro webhooks'
    };
  } catch (error) {
    console.error('Error unregistering Vagaro webhooks:', error);
    throw error;
  }
}

/**
 * Process appointment created event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processAppointmentCreated(payload) {
  try {
    const appointmentData = payload.data || payload.Data;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCreated('vagaro', appointment);
    
    return {
      success: true,
      appointment
    };
  } catch (error) {
    console.error('Error processing appointment created event:', error);
    throw error;
  }
}

/**
 * Process appointment updated event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processAppointmentUpdated(payload) {
  try {
    const appointmentData = payload.data || payload.Data;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentUpdated('vagaro', appointment);
    
    return {
      success: true,
      appointment
    };
  } catch (error) {
    console.error('Error processing appointment updated event:', error);
    throw error;
  }
}

/**
 * Process appointment cancelled event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processAppointmentCancelled(payload) {
  try {
    const appointmentData = payload.data || payload.Data;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCancelled('vagaro', appointment);
    
    return {
      success: true,
      appointment
    };
  } catch (error) {
    console.error('Error processing appointment cancelled event:', error);
    throw error;
  }
}

/**
 * Process appointment completed event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processAppointmentCompleted(payload) {
  try {
    const appointmentData = payload.data || payload.Data;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCompleted('vagaro', appointment);
    
    return {
      success: true,
      appointment
    };
  } catch (error) {
    console.error('Error processing appointment completed event:', error);
    throw error;
  }
}

/**
 * Process client created event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processClientCreated(payload) {
  try {
    const clientData = payload.data || payload.Data;
    
    if (!clientData) {
      throw new Error('Missing client data in payload');
    }
    
    // Normalize client data
    const client = normalizeClientData(clientData);
    
    // Dispatch event to booking event service
    await eventService.handleClientCreated('vagaro', client);
    
    return {
      success: true,
      client
    };
  } catch (error) {
    console.error('Error processing client created event:', error);
    throw error;
  }
}

/**
 * Process client updated event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processClientUpdated(payload) {
  try {
    const clientData = payload.data || payload.Data;
    
    if (!clientData) {
      throw new Error('Missing client data in payload');
    }
    
    // Normalize client data
    const client = normalizeClientData(clientData);
    
    // Dispatch event to booking event service
    await eventService.handleClientUpdated('vagaro', client);
    
    return {
      success: true,
      client
    };
  } catch (error) {
    console.error('Error processing client updated event:', error);
    throw error;
  }
}

/**
 * Normalize Vagaro appointment data to standard format
 * @param {Object} data - Vagaro appointment data
 * @returns {Object} Normalized appointment data
 */
function normalizeAppointmentData(data) {
  return {
    id: data.Id || data.id,
    customerId: data.ClientId || data.clientId,
    serviceId: data.ServiceId || data.serviceId,
    providerId: data.EmployeeId || data.employeeId,
    startTime: data.StartDateTime || data.startDateTime,
    endTime: data.EndDateTime || data.endDateTime,
    status: mapAppointmentStatus(data.Status || data.status),
    notes: data.Notes || data.notes || '',
    price: data.Price || data.price || 0,
    platformData: {
      id: data.Id || data.id,
      platform: 'vagaro',
      confirmationCode: data.ConfirmationCode || data.confirmationCode
    }
  };
}

/**
 * Normalize Vagaro client data to standard format
 * @param {Object} data - Vagaro client data
 * @returns {Object} Normalized client data
 */
function normalizeClientData(data) {
  return {
    id: data.Id || data.id,
    firstName: data.FirstName || data.firstName,
    lastName: data.LastName || data.lastName,
    email: data.Email || data.email,
    phone: data.Phone || data.phone,
    platformData: {
      id: data.Id || data.id,
      platform: 'vagaro',
      memberSince: data.MemberSince || data.memberSince
    }
  };
}

/**
 * Map Vagaro-specific appointment status to standard status
 * @param {string} status - Vagaro-specific status
 * @returns {string} Standard status
 */
function mapAppointmentStatus(status) {
  const statusMap = {
    'Confirmed': 'confirmed',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'No-Show': 'no-show',
    'Pending': 'pending'
  };
  
  return statusMap[status] || status.toLowerCase();
}

export default {
  processWebhook,
  validateWebhook,
  registerWebhooks,
  unregisterWebhooks
};

