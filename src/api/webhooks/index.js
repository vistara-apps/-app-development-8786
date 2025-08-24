/**
 * Booking Platform Webhooks Handler
 * 
 * This module handles incoming webhooks from various booking platforms.
 * It validates, normalizes, and processes events from different platforms.
 */

import vagaroHandler from './vagaro';
import mindbodyHandler from './mindbody';
import phorestHandler from './phorest';

/**
 * Process incoming webhook from a booking platform
 * @param {string} platform - Platform identifier (vagaro, mindbody, phorest)
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<Object>} Processing result
 */
export async function processWebhook(platform, payload, headers) {
  try {
    console.log(`Processing webhook from ${platform}...`);
    
    // Validate webhook signature/authenticity
    await validateWebhook(platform, payload, headers);
    
    // Route to platform-specific handler
    let result;
    
    switch (platform.toLowerCase()) {
      case 'vagaro':
        result = await vagaroHandler.processWebhook(payload, headers);
        break;
        
      case 'mindbody':
        result = await mindbodyHandler.processWebhook(payload, headers);
        break;
        
      case 'phorest':
        result = await phorestHandler.processWebhook(payload, headers);
        break;
        
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
    
    console.log(`Successfully processed webhook from ${platform}`);
    
    return {
      success: true,
      platform,
      eventType: result.eventType,
      processedData: result.processedData
    };
  } catch (error) {
    console.error(`Error processing webhook from ${platform}:`, error);
    
    return {
      success: false,
      platform,
      error: error.message
    };
  }
}

/**
 * Validate webhook signature/authenticity
 * @param {string} platform - Platform identifier
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Webhook headers
 * @returns {Promise<boolean>} True if webhook is valid
 */
async function validateWebhook(platform, payload, headers) {
  // Platform-specific validation
  switch (platform.toLowerCase()) {
    case 'vagaro':
      return vagaroHandler.validateWebhook(payload, headers);
      
    case 'mindbody':
      return mindbodyHandler.validateWebhook(payload, headers);
      
    case 'phorest':
      return phorestHandler.validateWebhook(payload, headers);
      
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Register webhook endpoints with booking platforms
 * @param {string} platform - Platform identifier
 * @param {Object} config - Platform-specific configuration
 * @returns {Promise<Object>} Registration result
 */
export async function registerWebhooks(platform, config) {
  try {
    console.log(`Registering webhooks for ${platform}...`);
    
    // Platform-specific registration
    switch (platform.toLowerCase()) {
      case 'vagaro':
        return await vagaroHandler.registerWebhooks(config);
        
      case 'mindbody':
        return await mindbodyHandler.registerWebhooks(config);
        
      case 'phorest':
        return await phorestHandler.registerWebhooks(config);
        
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`Error registering webhooks for ${platform}:`, error);
    throw error;
  }
}

/**
 * Unregister webhook endpoints with booking platforms
 * @param {string} platform - Platform identifier
 * @param {Object} config - Platform-specific configuration
 * @returns {Promise<Object>} Unregistration result
 */
export async function unregisterWebhooks(platform, config) {
  try {
    console.log(`Unregistering webhooks for ${platform}...`);
    
    // Platform-specific unregistration
    switch (platform.toLowerCase()) {
      case 'vagaro':
        return await vagaroHandler.unregisterWebhooks(config);
        
      case 'mindbody':
        return await mindbodyHandler.unregisterWebhooks(config);
        
      case 'phorest':
        return await phorestHandler.unregisterWebhooks(config);
        
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`Error unregistering webhooks for ${platform}:`, error);
    throw error;
  }
}

export default {
  processWebhook,
  registerWebhooks,
  unregisterWebhooks
};

