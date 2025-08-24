# Booking Integration Troubleshooting Guide

This guide provides solutions for common issues that may arise when working with the booking platform integrations.

## Table of Contents

1. [Authentication Issues](#authentication-issues)
2. [Webhook Issues](#webhook-issues)
3. [API Rate Limiting](#api-rate-limiting)
4. [Data Synchronization Issues](#data-synchronization-issues)
5. [Platform-Specific Issues](#platform-specific-issues)
   - [Vagaro](#vagaro)
   - [Mindbody](#mindbody)
   - [Phorest](#phorest)
6. [Logging and Debugging](#logging-and-debugging)
7. [Common Error Codes](#common-error-codes)

## Authentication Issues

### OAuth Authentication Failures

**Symptoms:**
- "Invalid client" or "unauthorized_client" errors
- Unable to obtain access token
- Authentication flow starts but never completes

**Solutions:**
1. Verify client ID and client secret are correct
2. Ensure redirect URI matches exactly what's registered in the developer portal
3. Check that the OAuth scopes requested match what's needed
4. Verify the platform's OAuth endpoint is accessible

```javascript
// Example of correct OAuth initialization
await bookingService.initialize('vagaro', {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
});
```

### API Key Authentication Failures

**Symptoms:**
- "Invalid API key" or "Unauthorized" errors
- 401 status codes from API calls

**Solutions:**
1. Verify API key is correct and active
2. Check if API key has the necessary permissions
3. Ensure site ID or business ID is correct (for platforms that require it)
4. Verify the API key hasn't expired

```javascript
// Example of correct API key initialization
await bookingService.initialize('mindbody', {
  apiKey: 'your-api-key',
  siteId: 'your-site-id'
});
```

### Token Expiration Issues

**Symptoms:**
- Authentication works initially but fails after some time
- "Token expired" errors

**Solutions:**
1. Implement token refresh logic
2. Store token expiration time and refresh before it expires
3. Handle token refresh errors gracefully

```javascript
// Check if token is expired or about to expire
if (isTokenExpiredOrExpiringSoon()) {
  await bookingService.refreshToken();
}
```

## Webhook Issues

### Webhook Registration Failures

**Symptoms:**
- Webhook registration API calls return errors
- Webhooks are not being registered

**Solutions:**
1. Verify webhook URL is publicly accessible
2. Ensure webhook URL uses HTTPS
3. Check that the webhook URL doesn't have path parameters that the platform doesn't support
4. Verify you have permission to register webhooks

```javascript
// Example of correct webhook registration
await webhookService.registerWebhooks('vagaro', {
  webhookUrl: 'https://app.salonrecovery.com/api/webhooks/vagaro'
});
```

### Webhook Delivery Issues

**Symptoms:**
- Platform reports successful webhook delivery, but your endpoint doesn't receive it
- Webhook events are missing or delayed

**Solutions:**
1. Check server logs for incoming webhook requests
2. Verify firewall or security settings aren't blocking incoming webhooks
3. Ensure webhook endpoint is responding with 200 OK status
4. Check for any network issues between the platform and your server

### Webhook Validation Failures

**Symptoms:**
- Webhooks are being received but failing validation
- "Invalid signature" errors

**Solutions:**
1. Verify webhook secret is correct
2. Ensure signature validation logic matches the platform's documentation
3. Check if the platform has updated their webhook signature format

```javascript
// Example of correct webhook validation
const isValid = await webhookService.validateWebhook('vagaro', payload, headers);
if (!isValid) {
  console.error('Invalid webhook signature');
  return res.status(401).send('Invalid signature');
}
```

## API Rate Limiting

### Rate Limit Exceeded

**Symptoms:**
- "Rate limit exceeded" errors
- 429 status codes from API calls

**Solutions:**
1. Implement exponential backoff and retry logic
2. Batch API requests where possible
3. Cache frequently accessed data
4. Distribute API calls more evenly over time

```javascript
// Example of retry logic with exponential backoff
async function callWithRetry(fn, maxRetries = 3, initialDelay = 1000) {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (error.status !== 429 || retries >= maxRetries) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, retries);
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}
```

### Daily Quota Exceeded

**Symptoms:**
- API calls fail with quota-related errors
- Unable to make any API calls to the platform

**Solutions:**
1. Monitor API usage throughout the day
2. Implement feature flags to disable non-critical features when approaching quota limits
3. Contact the platform provider to discuss quota increases

## Data Synchronization Issues

### Missing or Incomplete Data

**Symptoms:**
- Some appointments, clients, or services are missing
- Data appears incomplete or truncated

**Solutions:**
1. Check API pagination to ensure you're retrieving all pages of data
2. Verify date range filters aren't excluding relevant data
3. Ensure all required API endpoints are being called
4. Check for any data access permissions issues

```javascript
// Example of proper pagination
async function getAllAppointments(startDate, endDate) {
  let page = 1;
  let allAppointments = [];
  let hasMorePages = true;
  
  while (hasMorePages) {
    const response = await bookingService.getAppointments(startDate, endDate, { page });
    allAppointments = [...allAppointments, ...response.appointments];
    hasMorePages = response.pagination.hasMore;
    page++;
  }
  
  return allAppointments;
}
```

### Data Format Inconsistencies

**Symptoms:**
- Data appears in unexpected formats
- Date/time values are incorrect
- Names or other text fields have encoding issues

**Solutions:**
1. Use the adapter's normalizeData method to standardize data formats
2. Implement additional data validation and cleaning
3. Handle timezone conversions properly

```javascript
// Example of data normalization
const normalizedAppointment = adapter.normalizeData(appointmentData, 'appointment');
```

## Platform-Specific Issues

### Vagaro

#### OAuth Redirect Issues

**Symptoms:**
- OAuth flow redirects to error page
- "Invalid redirect URI" errors

**Solutions:**
1. Ensure the redirect URI exactly matches what's registered in the Vagaro developer portal
2. Check for any special characters or encoding issues in the redirect URI

#### Appointment Booking Failures

**Symptoms:**
- Unable to book appointments
- "Service unavailable" or "Provider unavailable" errors

**Solutions:**
1. Verify the service and provider IDs are correct
2. Check if the requested time slot is actually available
3. Ensure all required fields for booking are provided

### Mindbody

#### Site ID Issues

**Symptoms:**
- "Invalid site ID" errors
- Unable to access any data

**Solutions:**
1. Verify the site ID is correct
2. Ensure the API key has access to the specified site
3. Check if the site is active and on a supported Mindbody plan

#### Staff Token Authentication

**Symptoms:**
- Unable to perform certain operations that require staff permissions
- "Insufficient permissions" errors

**Solutions:**
1. Ensure you're using a staff token for operations that require it
2. Verify the staff member has the necessary permissions in Mindbody
3. Check if the staff token has expired and needs to be refreshed

### Phorest

#### Branch ID Issues

**Symptoms:**
- "Invalid branch ID" errors
- Unable to access branch-specific data

**Solutions:**
1. Verify the branch ID is correct
2. Ensure the OAuth token has access to the specified branch
3. Check if multi-branch access is enabled for your integration

#### Webhook Format Changes

**Symptoms:**
- Webhook payloads are not parsing correctly
- Missing fields in webhook data

**Solutions:**
1. Check Phorest's developer documentation for any recent webhook format changes
2. Update webhook parsing logic to handle both old and new formats
3. Contact Phorest support for clarification on webhook format changes

## Logging and Debugging

### Enabling Debug Logging

To enable detailed debug logging for the booking integrations:

```javascript
// Set debug level logging
bookingService.setLogLevel('debug');
```

### Viewing API Request Logs

To view detailed logs of API requests and responses:

1. Check the application logs for entries with the prefix `[BookingService]`
2. Look for request and response details including headers, status codes, and body content
3. Use the request ID to correlate related log entries

### Testing Webhooks Locally

To test webhooks during local development:

1. Use a tool like ngrok to expose your local webhook endpoint to the internet
2. Update the webhook URL in the platform's developer portal to point to your ngrok URL
3. Trigger webhook events in the platform's test environment
4. Check your local logs for incoming webhook requests

## Common Error Codes

### General Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check request parameters for errors |
| 401 | Unauthorized | Verify authentication credentials |
| 403 | Forbidden | Check permissions for the requested operation |
| 404 | Not Found | Verify resource IDs and endpoint URLs |
| 429 | Too Many Requests | Implement rate limiting handling |
| 500 | Internal Server Error | Contact platform support |

### Vagaro-Specific Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 1001 | Invalid Client | Verify client ID and secret |
| 1002 | Invalid Grant | Check authorization code or refresh token |
| 1003 | Invalid Scope | Verify requested OAuth scopes |
| 2001 | Resource Not Found | Check resource IDs |
| 3001 | Booking Conflict | Time slot is no longer available |

### Mindbody-Specific Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 101 | Invalid Site ID | Verify site ID |
| 102 | Invalid API Key | Check API key |
| 103 | Expired API Key | Renew API key |
| 104 | Rate Limit Exceeded | Implement backoff strategy |
| 105 | Daily Quota Exceeded | Contact Mindbody for quota increase |

### Phorest-Specific Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| P1001 | Authentication Failed | Verify OAuth credentials |
| P1002 | Invalid Branch | Check branch ID |
| P1003 | Resource Not Found | Verify resource IDs |
| P1004 | Booking Conflict | Time slot is no longer available |
| P1005 | Rate Limited | Implement backoff strategy |

If you encounter issues not covered in this guide, please contact support or refer to the platform-specific documentation for more detailed troubleshooting steps.

