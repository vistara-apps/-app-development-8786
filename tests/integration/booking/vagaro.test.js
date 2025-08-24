/**
 * Vagaro Integration Tests
 * 
 * This file contains integration tests for the Vagaro booking platform adapter.
 * It tests the adapter's ability to authenticate, fetch data, and perform operations.
 */

import VagaroAdapter from '../../../src/integrations/booking/providers/vagaro';

describe('Vagaro Integration', () => {
  let adapter;
  
  beforeEach(() => {
    // Create a new adapter instance for each test
    adapter = new VagaroAdapter();
  });
  
  describe('Authentication', () => {
    test('should initialize with valid configuration', async () => {
      const config = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      };
      
      const result = await adapter.initialize(config);
      
      expect(result).toBe(true);
      expect(adapter.config).toEqual(expect.objectContaining(config));
    });
    
    test('should throw error with invalid configuration', async () => {
      const config = {
        // Missing clientSecret
        clientId: 'test-client-id',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      };
      
      await expect(adapter.initialize(config)).rejects.toThrow();
    });
    
    test('should authenticate successfully', async () => {
      // Initialize with valid config first
      await adapter.initialize({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      });
      
      const token = await adapter.authenticate();
      
      expect(token).toBeTruthy();
      expect(adapter.authToken).toBe(token);
      expect(adapter.isConnected).toBe(true);
    });
    
    test('should test connection successfully', async () => {
      // Initialize and authenticate first
      await adapter.initialize({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      });
      await adapter.authenticate();
      
      const result = await adapter.testConnection();
      
      expect(result).toBe(true);
    });
  });
  
  describe('Availability', () => {
    beforeEach(async () => {
      // Initialize and authenticate before each test
      await adapter.initialize({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      });
      await adapter.authenticate();
    });
    
    test('should get availability for date range', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      const availability = await adapter.getAvailability(startDate, endDate);
      
      expect(Array.isArray(availability)).toBe(true);
      
      if (availability.length > 0) {
        expect(availability[0]).toEqual(expect.objectContaining({
          startTime: expect.any(String),
          endTime: expect.any(String),
          providerId: expect.any(String),
          serviceId: expect.any(String),
          platformData: expect.objectContaining({
            platform: 'vagaro'
          })
        }));
      }
    });
    
    test('should filter availability by service', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      const serviceId = 'vagaro-service-1';
      
      const availability = await adapter.getAvailability(startDate, endDate, {
        serviceId
      });
      
      expect(Array.isArray(availability)).toBe(true);
      
      if (availability.length > 0) {
        // All slots should be for the requested service
        availability.forEach(slot => {
          expect(slot.serviceId).toBe(serviceId);
        });
      }
    });
  });
  
  describe('Appointments', () => {
    beforeEach(async () => {
      // Initialize and authenticate before each test
      await adapter.initialize({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      });
      await adapter.authenticate();
    });
    
    test('should book an appointment', async () => {
      const appointmentDetails = {
        customerId: 'test-customer-id',
        serviceId: 'vagaro-service-1',
        providerId: 'vagaro-provider-1',
        startTime: new Date().toISOString(),
        notes: 'Test appointment'
      };
      
      const confirmation = await adapter.bookAppointment(appointmentDetails);
      
      expect(confirmation).toEqual(expect.objectContaining({
        id: expect.any(String),
        customerId: appointmentDetails.customerId,
        serviceId: appointmentDetails.serviceId,
        providerId: appointmentDetails.providerId,
        startTime: appointmentDetails.startTime,
        status: 'confirmed',
        platformData: expect.objectContaining({
          platform: 'vagaro',
          confirmationCode: expect.any(String)
        })
      }));
    });
    
    test('should get customer appointments', async () => {
      const customerId = 'test-customer-id';
      
      const appointments = await adapter.getCustomerAppointments(customerId);
      
      expect(Array.isArray(appointments)).toBe(true);
      
      if (appointments.length > 0) {
        expect(appointments[0]).toEqual(expect.objectContaining({
          id: expect.any(String),
          customerId,
          serviceId: expect.any(String),
          providerId: expect.any(String),
          startTime: expect.any(String),
          endTime: expect.any(String),
          status: expect.any(String),
          platformData: expect.objectContaining({
            platform: 'vagaro'
          })
        }));
      }
    });
  });
  
  describe('Data Normalization', () => {
    test('should normalize appointment data', () => {
      const rawData = {
        Id: 'appointment-123',
        ClientId: 'client-456',
        ServiceId: 'service-789',
        EmployeeId: 'employee-012',
        StartDateTime: '2023-01-15T14:00:00Z',
        EndDateTime: '2023-01-15T15:00:00Z',
        Status: 'Confirmed',
        Notes: 'Test notes',
        Price: 75,
        ConfirmationCode: 'VAG-1234'
      };
      
      const normalized = adapter.normalizeData(rawData, 'appointment');
      
      expect(normalized).toEqual({
        id: 'appointment-123',
        customerId: 'client-456',
        serviceId: 'service-789',
        providerId: 'employee-012',
        startTime: '2023-01-15T14:00:00Z',
        endTime: '2023-01-15T15:00:00Z',
        status: 'confirmed',
        notes: 'Test notes',
        price: 75,
        platformData: {
          id: 'appointment-123',
          platform: 'vagaro',
          confirmationCode: 'VAG-1234'
        }
      });
    });
    
    test('should normalize client data', () => {
      const rawData = {
        Id: 'client-456',
        FirstName: 'John',
        LastName: 'Doe',
        Email: 'john.doe@example.com',
        Phone: '555-123-4567',
        MemberSince: '2020-01-15'
      };
      
      const normalized = adapter.normalizeData(rawData, 'customer');
      
      expect(normalized).toEqual({
        id: 'client-456',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        platformData: {
          id: 'client-456',
          platform: 'vagaro',
          memberSince: '2020-01-15'
        }
      });
    });
  });
  
  describe('Error Handling', () => {
    test('should handle authentication errors', async () => {
      // Initialize with invalid config
      await adapter.initialize({
        clientId: 'invalid-client-id',
        clientSecret: 'invalid-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      });
      
      // Mock the error response
      const originalAuthenticate = adapter.authenticate;
      adapter.authenticate = jest.fn().mockRejectedValue({
        response: {
          data: {
            ErrorCode: 'InvalidCredentials',
            Message: 'Invalid client credentials'
          }
        }
      });
      
      try {
        await adapter.authenticate();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Invalid Vagaro credentials');
      }
      
      // Restore original method
      adapter.authenticate = originalAuthenticate;
    });
    
    test('should handle rate limit errors', async () => {
      // Initialize and authenticate
      await adapter.initialize({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'https://app.salonrecovery.com/auth/vagaro/callback'
      });
      await adapter.authenticate();
      
      // Mock the error response
      const originalGetAvailability = adapter.getAvailability;
      adapter.getAvailability = jest.fn().mockRejectedValue({
        response: {
          data: {
            ErrorCode: 'RateLimitExceeded',
            Message: 'Rate limit exceeded'
          }
        }
      });
      
      try {
        await adapter.getAvailability(new Date(), new Date());
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Vagaro API rate limit exceeded');
      }
      
      // Restore original method
      adapter.getAvailability = originalGetAvailability;
    });
  });
});

