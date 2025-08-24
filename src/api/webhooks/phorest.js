/**
 * Phorest Webhook Handler
 * 
 * This module handles incoming webhooks from Phorest booking platform.
 * It validates, normalizes, and processes Phorest-specific events.
 */

import { createHmac } from 'crypto';
import bookingService from '../../services/BookingService';
import eventService from '../../services/events/booking';

/**
 * Process incoming webhook from Phorest
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<Object>} Processing result
 */
async function processWebhook(payload, headers) {
  try {
    console.log('Processing Phorest webhook...');
    
    // Extract event type
    const eventType = payload.eventType || payload.type;
    
    if (!eventType) {
      throw new Error('Missing event type in Phorest webhook payload');
    }
    
    // Process based on event type
    let processedData;
    
    switch (eventType.toLowerCase()) {
      case 'appointment_created':
        processedData = await processAppointmentCreated(payload);
        break;
        
      case 'appointment_updated':
        processedData = await processAppointmentUpdated(payload);
        break;
        
      case 'appointment_cancelled':
        processedData = await processAppointmentCancelled(payload);
        break;
        
      case 'appointment_completed':
        processedData = await processAppointmentCompleted(payload);
        break;
        
      case 'client_created':
        processedData = await processClientCreated(payload);
        break;
        
      case 'client_updated':
        processedData = await processClientUpdated(payload);
        break;
        
      default:
        console.log(`Unhandled Phorest event type: ${eventType}`);
        processedData = { message: 'Event type not handled' };
    }
    
    return {
      eventType,
      processedData
    };
  } catch (error) {
    console.error('Error processing Phorest webhook:', error);
    throw error;
  }
}

/**
 * Validate Phorest webhook signature
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<boolean>} True if webhook is valid
 */
async function validateWebhook(payload, headers) {
  try {
    // In a real implementation, this would validate the webhook signature
    // For this mock implementation, we'll simulate a successful validation
    
    console.log('Validating Phorest webhook signature...');
    
    // Check for required headers
    if (!headers['x-phorest-signature']) {
      console.warn('Missing Phorest signature header');
      return false;
    }
    
    // In a real implementation, we would verify the signature like this:
    // const signature = headers['x-phorest-signature'];
    // const secret = process.env.PHOREST_WEBHOOK_SECRET;
    // const hmac = createHmac('sha256', secret);
    // const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    // return signature === digest;
    
    // For this mock implementation, we'll return true
    return true;
  } catch (error) {
    console.error('Error validating Phorest webhook:', error);
    return false;
  }
}

/**
 * Register webhooks with Phorest
 * @param {Object} config - Phorest-specific configuration
 * @returns {Promise<Object>} Registration result
 */
async function registerWebhooks(config) {
  try {
    console.log('Registering Phorest webhooks...');
    
    // In a real implementation, this would make API calls to register webhooks
    // For this mock implementation, we'll simulate a successful registration
    
    const webhookUrl = config.webhookUrl || 'https://app.salonrecovery.com/api/webhooks/phorest';
    const branchId = config.branchId || 'main-branch';
    
    // Mock registration for different event types
    const registeredEvents = [
      'appointment_created',
      'appointment_updated',
      'appointment_cancelled',
      'appointment_completed',
      'client_created',
      'client_updated'
    ];
    
    return {
      success: true,
      webhookUrl,
      branchId,
      registeredEvents
    };
  } catch (error) {
    console.error('Error registering Phorest webhooks:', error);
    throw error;
  }
}

/**
 * Unregister webhooks with Phorest
 * @param {Object} config - Phorest-specific configuration
 * @returns {Promise<Object>} Unregistration result
 */
async function unregisterWebhooks(config) {
  try {
    console.log('Unregistering Phorest webhooks...');
    
    // In a real implementation, this would make API calls to unregister webhooks
    // For this mock implementation, we'll simulate a successful unregistration
    
    return {
      success: true,
      message: 'Successfully unregistered Phorest webhooks'
    };
  } catch (error) {
    console.error('Error unregistering Phorest webhooks:', error);
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
    const appointmentData = payload.data || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCreated('phorest', appointment);
    
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
    const appointmentData = payload.data || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentUpdated('phorest', appointment);
    
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
    const appointmentData = payload.data || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCancelled('phorest', appointment);
    
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
    const appointmentData = payload.data || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCompleted('phorest', appointment);
    
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
    const clientData = payload.data || payload.client;
    
    if (!clientData) {
      throw new Error('Missing client data in payload');
    }
    
    // Normalize client data
    const client = normalizeClientData(clientData);
    
    // Dispatch event to booking event service
    await eventService.handleClientCreated('phorest', client);
    
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
    const clientData = payload.data || payload.client;
    
    if (!clientData) {
      throw new Error('Missing client data in payload');
    }
    
    // Normalize client data
    const client = normalizeClientData(clientData);
    
    // Dispatch event to booking event service
    await eventService.handleClientUpdated('phorest', client);
    
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
 * Normalize Phorest appointment data to standard format
 * @param {Object} data - Phorest appointment data
 * @returns {Object} Normalized appointment data
 */
function normalizeAppointmentData(data) {
  return {
    id: data.id,
    customerId: data.clientId,
    serviceId: data.serviceId,
    providerId: data.staffId,
    startTime: data.startTime,
    endTime: data.endTime,
    status: mapAppointmentStatus(data.status),
    notes: data.notes || '',
    price: data.price || 0,
    platformData: {
      id: data.id,
      platform: 'phorest',
      branchId: data.branchId || 'main-branch',
      confirmationCode: data.confirmationCode
    }
  };
}

/**
 * Normalize Phorest client data to standard format
 * @param {Object} data - Phorest client data
 * @returns {Object} Normalized client data
 */
function normalizeClientData(data) {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.mobile || data.phone,
    platformData: {
      id: data.id,
      platform: 'phorest',
      branchId: data.branchId || 'main-branch',
      memberSince: data.createdAt
    }
  };
}

/**
 * Map Phorest-specific appointment status to standard status
 * @param {string} status - Phorest-specific status
 * @returns {string} Standard status
 */
function mapAppointmentStatus(status) {
  const statusMap = {
    'CONFIRMED': 'confirmed',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
    'NO_SHOW': 'no-show',
    'PENDING': 'pending'
  };
  
  return statusMap[status] || status.toLowerCase();
}

export default {
  processWebhook,
  validateWebhook,
  registerWebhooks,
  unregisterWebhooks
};

