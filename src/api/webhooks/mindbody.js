/**
 * Mindbody Webhook Handler
 * 
 * This module handles incoming webhooks from Mindbody booking platform.
 * It validates, normalizes, and processes Mindbody-specific events.
 */

import { createHmac } from 'crypto';
import bookingService from '../../services/BookingService';
import eventService from '../../services/events/booking';

/**
 * Process incoming webhook from Mindbody
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<Object>} Processing result
 */
async function processWebhook(payload, headers) {
  try {
    console.log('Processing Mindbody webhook...');
    
    // Extract event type
    const eventType = payload.EventType || payload.eventType;
    
    if (!eventType) {
      throw new Error('Missing event type in Mindbody webhook payload');
    }
    
    // Process based on event type
    let processedData;
    
    switch (eventType.toLowerCase()) {
      case 'appointment.added':
        processedData = await processAppointmentAdded(payload);
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
        
      case 'client.added':
        processedData = await processClientAdded(payload);
        break;
        
      case 'client.updated':
        processedData = await processClientUpdated(payload);
        break;
        
      default:
        console.log(`Unhandled Mindbody event type: ${eventType}`);
        processedData = { message: 'Event type not handled' };
    }
    
    return {
      eventType,
      processedData
    };
  } catch (error) {
    console.error('Error processing Mindbody webhook:', error);
    throw error;
  }
}

/**
 * Validate Mindbody webhook signature
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<boolean>} True if webhook is valid
 */
async function validateWebhook(payload, headers) {
  try {
    // In a real implementation, this would validate the webhook signature
    // For this mock implementation, we'll simulate a successful validation
    
    console.log('Validating Mindbody webhook signature...');
    
    // Check for required headers
    if (!headers['x-mindbodyonline-signature']) {
      console.warn('Missing Mindbody signature header');
      return false;
    }
    
    // In a real implementation, we would verify the signature like this:
    // const signature = headers['x-mindbodyonline-signature'];
    // const secret = process.env.MINDBODY_WEBHOOK_SECRET;
    // const hmac = createHmac('sha256', secret);
    // const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    // return signature === digest;
    
    // For this mock implementation, we'll return true
    return true;
  } catch (error) {
    console.error('Error validating Mindbody webhook:', error);
    return false;
  }
}

/**
 * Register webhooks with Mindbody
 * @param {Object} config - Mindbody-specific configuration
 * @returns {Promise<Object>} Registration result
 */
async function registerWebhooks(config) {
  try {
    console.log('Registering Mindbody webhooks...');
    
    // In a real implementation, this would make API calls to register webhooks
    // For this mock implementation, we'll simulate a successful registration
    
    const webhookUrl = config.webhookUrl || 'https://app.salonrecovery.com/api/webhooks/mindbody';
    const siteId = config.siteId;
    
    if (!siteId) {
      throw new Error('Missing siteId in Mindbody webhook configuration');
    }
    
    // Mock registration for different event types
    const registeredEvents = [
      'appointment.added',
      'appointment.updated',
      'appointment.cancelled',
      'appointment.completed',
      'client.added',
      'client.updated'
    ];
    
    return {
      success: true,
      webhookUrl,
      siteId,
      registeredEvents
    };
  } catch (error) {
    console.error('Error registering Mindbody webhooks:', error);
    throw error;
  }
}

/**
 * Unregister webhooks with Mindbody
 * @param {Object} config - Mindbody-specific configuration
 * @returns {Promise<Object>} Unregistration result
 */
async function unregisterWebhooks(config) {
  try {
    console.log('Unregistering Mindbody webhooks...');
    
    // In a real implementation, this would make API calls to unregister webhooks
    // For this mock implementation, we'll simulate a successful unregistration
    
    return {
      success: true,
      message: 'Successfully unregistered Mindbody webhooks'
    };
  } catch (error) {
    console.error('Error unregistering Mindbody webhooks:', error);
    throw error;
  }
}

/**
 * Process appointment added event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processAppointmentAdded(payload) {
  try {
    const appointmentData = payload.Appointment || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCreated('mindbody', appointment);
    
    return {
      success: true,
      appointment
    };
  } catch (error) {
    console.error('Error processing appointment added event:', error);
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
    const appointmentData = payload.Appointment || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentUpdated('mindbody', appointment);
    
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
    const appointmentData = payload.Appointment || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCancelled('mindbody', appointment);
    
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
    const appointmentData = payload.Appointment || payload.appointment;
    
    if (!appointmentData) {
      throw new Error('Missing appointment data in payload');
    }
    
    // Normalize appointment data
    const appointment = normalizeAppointmentData(appointmentData);
    
    // Dispatch event to booking event service
    await eventService.handleAppointmentCompleted('mindbody', appointment);
    
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
 * Process client added event
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} Processing result
 */
async function processClientAdded(payload) {
  try {
    const clientData = payload.Client || payload.client;
    
    if (!clientData) {
      throw new Error('Missing client data in payload');
    }
    
    // Normalize client data
    const client = normalizeClientData(clientData);
    
    // Dispatch event to booking event service
    await eventService.handleClientCreated('mindbody', client);
    
    return {
      success: true,
      client
    };
  } catch (error) {
    console.error('Error processing client added event:', error);
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
    const clientData = payload.Client || payload.client;
    
    if (!clientData) {
      throw new Error('Missing client data in payload');
    }
    
    // Normalize client data
    const client = normalizeClientData(clientData);
    
    // Dispatch event to booking event service
    await eventService.handleClientUpdated('mindbody', client);
    
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
 * Normalize Mindbody appointment data to standard format
 * @param {Object} data - Mindbody appointment data
 * @returns {Object} Normalized appointment data
 */
function normalizeAppointmentData(data) {
  return {
    id: data.Id || data.id,
    customerId: data.ClientId || data.clientId,
    serviceId: data.ServiceId || data.serviceId,
    providerId: data.StaffId || data.staffId,
    startTime: data.StartDateTime || data.startDateTime,
    endTime: data.EndDateTime || data.endDateTime,
    status: mapAppointmentStatus(data.Status || data.status),
    notes: data.Notes || data.notes || '',
    price: data.Price || data.price || 0,
    platformData: {
      id: data.Id || data.id,
      platform: 'mindbody',
      siteId: data.SiteId || data.siteId,
      confirmationCode: data.Reference || data.reference
    }
  };
}

/**
 * Normalize Mindbody client data to standard format
 * @param {Object} data - Mindbody client data
 * @returns {Object} Normalized client data
 */
function normalizeClientData(data) {
  return {
    id: data.Id || data.id,
    firstName: data.FirstName || data.firstName,
    lastName: data.LastName || data.lastName,
    email: data.Email || data.email,
    phone: data.MobilePhone || data.mobilePhone || data.phone,
    platformData: {
      id: data.Id || data.id,
      platform: 'mindbody',
      siteId: data.SiteId || data.siteId,
      memberSince: data.CreationDate || data.creationDate
    }
  };
}

/**
 * Map Mindbody-specific appointment status to standard status
 * @param {string} status - Mindbody-specific status
 * @returns {string} Standard status
 */
function mapAppointmentStatus(status) {
  const statusMap = {
    'Booked': 'confirmed',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'NoShow': 'no-show',
    'Requested': 'pending'
  };
  
  return statusMap[status] || status.toLowerCase();
}

export default {
  processWebhook,
  validateWebhook,
  registerWebhooks,
  unregisterWebhooks
};

