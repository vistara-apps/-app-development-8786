import React, { createContext, useContext, useState, useEffect } from 'react'

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
        lapsedClientThreshold: 60
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
        messageTemplate: "Hi {name}! We noticed you had to cancel your appointment. We have some great time slots available - would you like to reschedule?"
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
    setAppointments([
      {
        id: '1',
        clientId: '1',
        salonId: '1',
        datetime: new Date('2024-01-25T14:00:00'),
        service: 'Cut & Color',
        stylist: 'Jennifer',
        status: 'cancelled',
        cancellationReason: 'personal emergency'
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
      }
    ])

    // Mock message logs
    setMessageLogs([
      {
        id: '1',
        campaignId: '1',
        clientId: '1',
        sentAt: new Date('2024-01-25T14:30:00'),
        content: "Hi Sarah! We noticed you had to cancel your appointment. We have some great time slots available - would you like to reschedule?",
        response: "Yes, can I book for tomorrow at 2pm?"
      }
    ])
  }, [])

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
    setMessageLogs
  }

  return (
    <SalonContext.Provider value={value}>
      {children}
    </SalonContext.Provider>
  )
}