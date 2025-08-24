import React, { createContext, useContext, useState, useEffect } from 'react'
import { scheduleFollowUpSequence } from '../services/messagingService'

const SalonContext = createContext()

export const useSalon = () => {
  const context = useContext(SalonContext)
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider')
  }
  return context
}

export const SalonProvider = ({ children }) => {
  const [salon, setSalon] = useState(null)
  const [clients, setClients] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [appointments, setAppointments] = useState([])
  const [messageLogs, setMessageLogs] = useState([])
  const [scheduledMessages, setScheduledMessages] = useState([])

  // Mock data initialization
  useEffect(() => {
    // Initialize with mock salon data
    setSalon({
      id: '1',
      name: 'Luxe Hair Studio',
      bookingSoftwareType: 'Square',
      apiKey: '***hidden***',
      settings: {
        autoReply: true,
        rebookingWindow: 24,
        lapsedClientThreshold: 60,
        messagingEnabled: true,
        defaultFollowUpDelay: 24, // hours
        defaultReminderDelay: 21, // days
        defaultTipDelay: 3 // days
      }
    })

    // Mock clients data
    setClients([
      {
        id: '1',
        salonId: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0123',
        lastBookingDate: new Date('2024-01-15'),
        totalBookings: 12,
        isLapsed: false
      },
      {
        id: '2',
        salonId: '1',
        name: 'Emma Davis',
        email: 'emma.d@email.com',
        phone: '+1-555-0124',
        lastBookingDate: new Date('2023-10-20'),
        totalBookings: 8,
        isLapsed: true
      },
      {
        id: '3',
        salonId: '1',
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        phone: '+1-555-0125',
        lastBookingDate: new Date('2024-01-20'),
        totalBookings: 15,
        isLapsed: false
      }
    ])

    // Mock campaigns data
    setCampaigns([
      {
        id: '1',
        salonId: '1',
        name: 'Cancellation Recovery',
        type: 'rebooking',
        status: 'active',
        triggerConditions: 'appointment_cancelled',
        messageTemplate: "Hi {client_name}! We noticed you had to cancel your appointment. We have some great time slots available - would you like to reschedule?"
      },
      {
        id: '2',
        salonId: '1',
        name: 'Lapsed Client Reactivation',
        type: 'reactivation',
        status: 'active',
        triggerConditions: 'client_lapsed_60_days',
        messageTemplate: "We miss you at {salon_name}! Come back and enjoy 20% off your next service. Book now!"
      }
    ])

    // Mock appointments data
    const mockAppointments = [
      {
        id: '1',
        clientId: '1',
        salonId: '1',
        datetime: new Date('2024-01-25T14:00:00'),
        service: 'Cut & Color',
        stylist: 'Jennifer',
        status: 'completed',
        cancellationReason: null
      },
      {
        id: '2',
        clientId: '2',
        salonId: '1',
        datetime: new Date('2024-01-26T10:00:00'),
        service: 'Highlights',
        stylist: 'Maria',
        status: 'scheduled',
        cancellationReason: null
      },
      {
        id: '3',
        clientId: '3',
        salonId: '1',
        datetime: new Date('2024-01-22T15:30:00'),
        service: 'Haircut & Styling',
        stylist: 'Carlos',
        status: 'completed',
        cancellationReason: null
      },
      {
        id: '4',
        clientId: '1',
        salonId: '1',
        datetime: new Date('2023-12-15T11:00:00'),
        service: 'Blowout',
        stylist: 'Jennifer',
        status: 'completed',
        cancellationReason: null
      },
      {
        id: '5',
        clientId: '3',
        salonId: '1',
        datetime: new Date('2024-02-05T13:00:00'),
        service: 'Beard Trim',
        stylist: 'Carlos',
        status: 'cancelled',
        cancellationReason: 'schedule conflict'
      }
    ];
    
    setAppointments(mockAppointments);

    // Mock message logs
    setMessageLogs([
      {
        id: '1',
        campaignId: '1',
        clientId: '1',
        sentAt: new Date('2024-01-25T14:30:00'),
        content: "Hi Sarah! We noticed you had to cancel your appointment. We have some great time slots available - would you like to reschedule?",
        response: "Yes, can I book for tomorrow at 2pm?"
      },
      {
        id: '2',
        campaignId: null,
        clientId: '3',
        sentAt: new Date('2024-01-23T10:15:00'),
        content: "Hi Michael! Thank you for visiting Luxe Hair Studio! We hope you're enjoying your new look. How was your experience with Carlos?",
        response: "It was great! I'll definitely be back."
      }
    ])

    // Generate mock scheduled messages based on completed appointments
    const completedAppointments = mockAppointments.filter(apt => apt.status === 'completed');
    let mockScheduledMessages = [];
    
    completedAppointments.forEach(appointment => {
      const client = clients.find(c => c.id === appointment.clientId);
      if (client) {
        const messages = scheduleFollowUpSequence(appointment, client, {
          id: '1',
          name: 'Luxe Hair Studio'
        });
        mockScheduledMessages = [...mockScheduledMessages, ...messages];
      }
    });
    
    setScheduledMessages(mockScheduledMessages);
  }, [])

  // Function to create a new scheduled message
  const createScheduledMessage = (message, scheduledTime) => {
    const newScheduledMessage = {
      id: Math.random().toString(36).substring(2, 15),
      message,
      scheduledTime,
      status: 'scheduled'
    };
    
    setScheduledMessages([...scheduledMessages, newScheduledMessage]);
    return newScheduledMessage;
  };

  // Function to update a scheduled message
  const updateScheduledMessage = (messageId, updatedMessage) => {
    const updatedMessages = scheduledMessages.map(msg => 
      msg.id === messageId 
        ? { ...msg, message: { ...msg.message, ...updatedMessage } }
        : msg
    );
    
    setScheduledMessages(updatedMessages);
  };

  // Function to cancel a scheduled message
  const cancelScheduledMessage = (messageId) => {
    const updatedMessages = scheduledMessages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'cancelled' }
        : msg
    );
    
    setScheduledMessages(updatedMessages);
  };

  // Function to log a sent message
  const logSentMessage = (message, response = null) => {
    const newMessageLog = {
      id: Math.random().toString(36).substring(2, 15),
      campaignId: message.campaignId || null,
      clientId: message.clientId,
      sentAt: new Date(),
      content: message.body,
      response
    };
    
    setMessageLogs([...messageLogs, newMessageLog]);
    return newMessageLog;
  };

  // Function to create a follow-up sequence for an appointment
  const createFollowUpSequence = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return null;
    
    const client = clients.find(c => c.id === appointment.clientId);
    if (!client) return null;
    
    const messages = scheduleFollowUpSequence(appointment, client, salon);
    setScheduledMessages([...scheduledMessages, ...messages]);
    
    return messages;
  };

  const value = {
    salon,
    setSalon,
    clients,
    setClients,
    campaigns,
    setCampaigns,
    appointments,
    setAppointments,
    messageLogs,
    setMessageLogs,
    scheduledMessages,
    setScheduledMessages,
    createScheduledMessage,
    updateScheduledMessage,
    cancelScheduledMessage,
    logSentMessage,
    createFollowUpSequence
  }

  return (
    <SalonContext.Provider value={value}>
      {children}
    </SalonContext.Provider>
  )
}
