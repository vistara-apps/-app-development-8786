/**
 * Booking Integrations Monitoring
 * 
 * This module provides monitoring and health check functionality for booking platform integrations.
 * It tracks API calls, response times, error rates, and overall integration health.
 */

class BookingIntegrationsMonitoring {
  constructor() {
    this.metrics = {
      apiCalls: {
        total: 0,
        success: 0,
        error: 0,
        byPlatform: {}
      },
      webhooks: {
        received: 0,
        processed: 0,
        errors: 0,
        byPlatform: {}
      },
      responseTimes: {
        avg: 0,
        min: Infinity,
        max: 0,
        byPlatform: {}
      },
      rateLimit: {
        remaining: {},
        reset: {}
      },
      lastCheck: {
        timestamp: null,
        status: {}
      }
    };
    
    this.alertThresholds = {
      errorRate: 0.1, // 10% error rate
      responseTime: 2000, // 2 seconds
      rateLimitRemaining: 0.2 // 20% of rate limit remaining
    };
    
    // Initialize platform-specific metrics
    this.initializePlatformMetrics('vagaro');
    this.initializePlatformMetrics('mindbody');
    this.initializePlatformMetrics('phorest');
  }

  /**
   * Initialize metrics for a specific platform
   * @param {string} platform - Platform identifier
   */
  initializePlatformMetrics(platform) {
    this.metrics.apiCalls.byPlatform[platform] = {
      total: 0,
      success: 0,
      error: 0,
      byEndpoint: {}
    };
    
    this.metrics.webhooks.byPlatform[platform] = {
      received: 0,
      processed: 0,
      errors: 0,
      byEventType: {}
    };
    
    this.metrics.responseTimes.byPlatform[platform] = {
      avg: 0,
      min: Infinity,
      max: 0,
      byEndpoint: {}
    };
    
    this.metrics.rateLimit.remaining[platform] = 1.0;
    this.metrics.rateLimit.reset[platform] = null;
    
    this.metrics.lastCheck.status[platform] = {
      connected: false,
      lastSuccess: null,
      lastError: null,
      errorMessage: null
    };
  }

  /**
   * Track an API call
   * @param {string} platform - Platform identifier
   * @param {string} endpoint - API endpoint
   * @param {boolean} success - Whether the call was successful
   * @param {number} responseTime - Response time in milliseconds
   * @param {Object} rateLimitInfo - Rate limit information
   */
  trackApiCall(platform, endpoint, success, responseTime, rateLimitInfo = null) {
    // Update overall metrics
    this.metrics.apiCalls.total++;
    if (success) {
      this.metrics.apiCalls.success++;
    } else {
      this.metrics.apiCalls.error++;
    }
    
    // Update platform-specific metrics
    const platformMetrics = this.metrics.apiCalls.byPlatform[platform];
    if (platformMetrics) {
      platformMetrics.total++;
      if (success) {
        platformMetrics.success++;
      } else {
        platformMetrics.error++;
      }
      
      // Update endpoint-specific metrics
      if (!platformMetrics.byEndpoint[endpoint]) {
        platformMetrics.byEndpoint[endpoint] = {
          total: 0,
          success: 0,
          error: 0
        };
      }
      
      platformMetrics.byEndpoint[endpoint].total++;
      if (success) {
        platformMetrics.byEndpoint[endpoint].success++;
      } else {
        platformMetrics.byEndpoint[endpoint].error++;
      }
    }
    
    // Update response time metrics
    if (responseTime) {
      // Update overall response time metrics
      const totalCalls = this.metrics.apiCalls.success + this.metrics.apiCalls.error;
      this.metrics.responseTimes.avg = 
        (this.metrics.responseTimes.avg * (totalCalls - 1) + responseTime) / totalCalls;
      this.metrics.responseTimes.min = Math.min(this.metrics.responseTimes.min, responseTime);
      this.metrics.responseTimes.max = Math.max(this.metrics.responseTimes.max, responseTime);
      
      // Update platform-specific response time metrics
      const platformResponseMetrics = this.metrics.responseTimes.byPlatform[platform];
      if (platformResponseMetrics) {
        const platformTotalCalls = platformMetrics.success + platformMetrics.error;
        platformResponseMetrics.avg = 
          (platformResponseMetrics.avg * (platformTotalCalls - 1) + responseTime) / platformTotalCalls;
        platformResponseMetrics.min = Math.min(platformResponseMetrics.min, responseTime);
        platformResponseMetrics.max = Math.max(platformResponseMetrics.max, responseTime);
        
        // Update endpoint-specific response time metrics
        if (!platformResponseMetrics.byEndpoint[endpoint]) {
          platformResponseMetrics.byEndpoint[endpoint] = {
            avg: 0,
            min: Infinity,
            max: 0,
            count: 0
          };
        }
        
        const endpointMetrics = platformResponseMetrics.byEndpoint[endpoint];
        endpointMetrics.avg = 
          (endpointMetrics.avg * endpointMetrics.count + responseTime) / (endpointMetrics.count + 1);
        endpointMetrics.min = Math.min(endpointMetrics.min, responseTime);
        endpointMetrics.max = Math.max(endpointMetrics.max, responseTime);
        endpointMetrics.count++;
      }
    }
    
    // Update rate limit metrics
    if (rateLimitInfo) {
      if (rateLimitInfo.remaining !== undefined) {
        this.metrics.rateLimit.remaining[platform] = rateLimitInfo.remaining;
      }
      
      if (rateLimitInfo.reset !== undefined) {
        this.metrics.rateLimit.reset[platform] = rateLimitInfo.reset;
      }
      
      // Check if rate limit is approaching threshold
      if (rateLimitInfo.remaining < this.alertThresholds.rateLimitRemaining) {
        this.triggerAlert('rateLimitApproaching', {
          platform,
          remaining: rateLimitInfo.remaining,
          reset: rateLimitInfo.reset
        });
      }
    }
    
    // Check for high error rate
    const errorRate = platformMetrics.error / platformMetrics.total;
    if (errorRate > this.alertThresholds.errorRate) {
      this.triggerAlert('highErrorRate', {
        platform,
        errorRate,
        threshold: this.alertThresholds.errorRate
      });
    }
    
    // Check for slow response time
    if (responseTime > this.alertThresholds.responseTime) {
      this.triggerAlert('slowResponseTime', {
        platform,
        endpoint,
        responseTime,
        threshold: this.alertThresholds.responseTime
      });
    }
  }

  /**
   * Track a webhook event
   * @param {string} platform - Platform identifier
   * @param {string} eventType - Event type
   * @param {boolean} success - Whether the webhook was processed successfully
   */
  trackWebhook(platform, eventType, success) {
    // Update overall metrics
    this.metrics.webhooks.received++;
    if (success) {
      this.metrics.webhooks.processed++;
    } else {
      this.metrics.webhooks.errors++;
    }
    
    // Update platform-specific metrics
    const platformMetrics = this.metrics.webhooks.byPlatform[platform];
    if (platformMetrics) {
      platformMetrics.received++;
      if (success) {
        platformMetrics.processed++;
      } else {
        platformMetrics.errors++;
      }
      
      // Update event-specific metrics
      if (!platformMetrics.byEventType[eventType]) {
        platformMetrics.byEventType[eventType] = {
          received: 0,
          processed: 0,
          errors: 0
        };
      }
      
      platformMetrics.byEventType[eventType].received++;
      if (success) {
        platformMetrics.byEventType[eventType].processed++;
      } else {
        platformMetrics.byEventType[eventType].errors++;
      }
    }
    
    // Check for high webhook error rate
    const errorRate = platformMetrics.errors / platformMetrics.received;
    if (errorRate > this.alertThresholds.errorRate) {
      this.triggerAlert('highWebhookErrorRate', {
        platform,
        errorRate,
        threshold: this.alertThresholds.errorRate
      });
    }
  }

  /**
   * Update integration health status
   * @param {string} platform - Platform identifier
   * @param {boolean} connected - Whether the integration is connected
   * @param {string} errorMessage - Error message if not connected
   */
  updateHealthStatus(platform, connected, errorMessage = null) {
    const now = new Date();
    this.metrics.lastCheck.timestamp = now;
    
    if (this.metrics.lastCheck.status[platform]) {
      this.metrics.lastCheck.status[platform].connected = connected;
      
      if (connected) {
        this.metrics.lastCheck.status[platform].lastSuccess = now;
        this.metrics.lastCheck.status[platform].errorMessage = null;
      } else {
        this.metrics.lastCheck.status[platform].lastError = now;
        this.metrics.lastCheck.status[platform].errorMessage = errorMessage;
        
        // Trigger alert for integration health issue
        this.triggerAlert('integrationHealthIssue', {
          platform,
          errorMessage
        });
      }
    }
  }

  /**
   * Perform a health check for all integrations
   * @returns {Promise<Object>} Health check results
   */
  async performHealthCheck() {
    console.log('Performing health check for all integrations...');
    
    const results = {
      timestamp: new Date(),
      overall: 'healthy',
      platforms: {}
    };
    
    // Check each platform
    for (const platform of ['vagaro', 'mindbody', 'phorest']) {
      try {
        // In a real implementation, this would make API calls to check the integration
        // For this mock implementation, we'll use the last known status
        
        const status = this.metrics.lastCheck.status[platform];
        const isHealthy = status && status.connected;
        
        results.platforms[platform] = {
          status: isHealthy ? 'healthy' : 'unhealthy',
          lastSuccess: status ? status.lastSuccess : null,
          lastError: status ? status.lastError : null,
          errorMessage: status ? status.errorMessage : null
        };
        
        // Update overall status
        if (!isHealthy) {
          results.overall = 'degraded';
        }
        
        // Update health status
        this.updateHealthStatus(platform, isHealthy);
      } catch (error) {
        console.error(`Error checking health for ${platform}:`, error);
        
        results.platforms[platform] = {
          status: 'error',
          errorMessage: error.message
        };
        
        results.overall = 'degraded';
        
        // Update health status
        this.updateHealthStatus(platform, false, error.message);
      }
    }
    
    console.log('Health check results:', results);
    
    return results;
  }

  /**
   * Get monitoring metrics
   * @returns {Object} Monitoring metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date()
    };
  }

  /**
   * Reset monitoring metrics
   */
  resetMetrics() {
    // Save last check status
    const lastCheckStatus = { ...this.metrics.lastCheck.status };
    
    // Reset metrics
    this.metrics = {
      apiCalls: {
        total: 0,
        success: 0,
        error: 0,
        byPlatform: {}
      },
      webhooks: {
        received: 0,
        processed: 0,
        errors: 0,
        byPlatform: {}
      },
      responseTimes: {
        avg: 0,
        min: Infinity,
        max: 0,
        byPlatform: {}
      },
      rateLimit: {
        remaining: {},
        reset: {}
      },
      lastCheck: {
        timestamp: new Date(),
        status: lastCheckStatus
      }
    };
    
    // Re-initialize platform-specific metrics
    this.initializePlatformMetrics('vagaro');
    this.initializePlatformMetrics('mindbody');
    this.initializePlatformMetrics('phorest');
  }

  /**
   * Set alert thresholds
   * @param {Object} thresholds - Alert thresholds
   */
  setAlertThresholds(thresholds) {
    this.alertThresholds = {
      ...this.alertThresholds,
      ...thresholds
    };
  }

  /**
   * Trigger an alert
   * @param {string} alertType - Alert type
   * @param {Object} alertData - Alert data
   */
  triggerAlert(alertType, alertData) {
    console.warn(`ALERT [${alertType}]:`, alertData);
    
    // In a real implementation, this would send alerts via email, Slack, etc.
    // For this mock implementation, we'll just log the alert
  }
}

// Create singleton instance
const bookingIntegrationsMonitoring = new BookingIntegrationsMonitoring();
export default bookingIntegrationsMonitoring;

