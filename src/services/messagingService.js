/**
 * Messaging Service
 * Handles automated, personalized messaging workflow for post-appointment follow-ups
 */

// Message templates for different follow-up scenarios
const messageTemplates = {
  followUp: {
    subject: "How was your recent appointment?",
    body: "Hi {client_name},\n\nThank you for visiting {salon_name}! We hope you're enjoying your new look. How was your experience with {stylist_name}?\n\nWe'd love to hear your feedback and see you again soon!\n\nBest regards,\nThe {salon_name} Team"
  },
  reminder: {
    subject: "Time for your next appointment?",
    body: "Hi {client_name},\n\nIt's been about {days_since} days since your last appointment with us. Your {service_name} might be due for a refresh!\n\nWould you like to schedule your next visit? We have some great openings next week.\n\nBest regards,\nThe {salon_name} Team"
  },
  tip: {
    subject: "A tip for maintaining your style",
    body: "Hi {client_name},\n\nWe hope you're enjoying your recent {service_name} from {salon_name}!\n\nHere's a quick tip to help maintain your look: {tip_content}\n\nFeel free to reach out if you have any questions!\n\nBest regards,\nThe {salon_name} Team"
  },
  promotion: {
    subject: "Special offer just for you!",
    body: "Hi {client_name},\n\nAs a valued client at {salon_name}, we'd like to offer you a special promotion: {promotion_details}\n\nThis offer is valid until {expiry_date}. We hope to see you soon!\n\nBest regards,\nThe {salon_name} Team"
  },
  reactivation: {
    subject: "We miss you at {salon_name}!",
    body: "Hi {client_name},\n\nIt's been a while since we've seen you at {salon_name}! We miss having you in our chair and would love to welcome you back.\n\nAs a special thank you for your past business, we'd like to offer you {reactivation_offer} on your next visit.\n\nHope to see you soon!\n\nBest regards,\nThe {salon_name} Team"
  }
};

// Service-specific styling tips
const stylingTips = {
  "Haircut": [
    "Use a heat protectant spray before using any hot styling tools to prevent damage.",
    "For longer-lasting style, try using dry shampoo at the roots on day two or three after your cut.",
    "Remember to trim your hair every 6-8 weeks to maintain the shape and prevent split ends."
  ],
  "Color": [
    "Use color-safe shampoo and conditioner to help your color last longer.",
    "Rinse with cool water to seal the hair cuticle and lock in color.",
    "Limit washing your hair to 2-3 times a week to prevent color fading."
  ],
  "Highlights": [
    "Purple shampoo once a week can help keep your highlights bright and prevent brassiness.",
    "Deep condition weekly to keep your highlighted hair healthy and hydrated.",
    "Wear a hat or use UV protection products when in the sun to prevent highlights from fading."
  ],
  "Blowout": [
    "Sleep on a silk pillowcase to extend the life of your blowout.",
    "Use dry shampoo at the roots before bed to absorb oil and maintain volume.",
    "If your blowout starts to fall, twist sections into loose buns for a few minutes to revive the style."
  ],
  "Treatment": [
    "Wait 48 hours after your treatment before washing your hair to allow the product to fully set.",
    "Use the professional products recommended by your stylist to maintain your treatment results.",
    "Schedule regular maintenance appointments to keep your treatment looking fresh."
  ]
};

/**
 * Get a random styling tip for a specific service
 * @param {string} serviceName - The name of the service
 * @returns {string} A styling tip
 */
const getRandomTip = (serviceName) => {
  // Find the most relevant tip category based on the service name
  const serviceCategory = Object.keys(stylingTips).find(category => 
    serviceName.toLowerCase().includes(category.toLowerCase())
  ) || "Haircut"; // Default to haircut tips if no match
  
  const tips = stylingTips[serviceCategory];
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};

/**
 * Format a message by replacing placeholders with actual values
 * @param {string} template - The message template with placeholders
 * @param {Object} data - The data to replace placeholders with
 * @returns {string} The formatted message
 */
const formatMessage = (template, data) => {
  let formattedMessage = template;
  
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{${key}}`, 'g');
    formattedMessage = formattedMessage.replace(placeholder, data[key]);
  });
  
  return formattedMessage;
};

/**
 * Generate a follow-up message for a completed appointment
 * @param {Object} appointment - The appointment data
 * @param {Object} client - The client data
 * @param {Object} salon - The salon data
 * @returns {Object} The generated message
 */
const generateFollowUpMessage = (appointment, client, salon) => {
  const messageType = 'followUp';
  
  const messageData = {
    client_name: client.name,
    salon_name: salon.name,
    stylist_name: appointment.stylist,
    service_name: appointment.service
  };
  
  return {
    to: client.email,
    phone: client.phone,
    subject: formatMessage(messageTemplates[messageType].subject, messageData),
    body: formatMessage(messageTemplates[messageType].body, messageData),
    type: messageType,
    appointmentId: appointment.id,
    clientId: client.id
  };
};

/**
 * Generate a reminder message for scheduling the next appointment
 * @param {Object} lastAppointment - The client's last appointment data
 * @param {Object} client - The client data
 * @param {Object} salon - The salon data
 * @returns {Object} The generated message
 */
const generateReminderMessage = (lastAppointment, client, salon) => {
  const messageType = 'reminder';
  
  // Calculate days since last appointment
  const lastAppointmentDate = new Date(lastAppointment.datetime);
  const currentDate = new Date();
  const daysSince = Math.floor((currentDate - lastAppointmentDate) / (1000 * 60 * 60 * 24));
  
  const messageData = {
    client_name: client.name,
    salon_name: salon.name,
    service_name: lastAppointment.service,
    days_since: daysSince.toString()
  };
  
  return {
    to: client.email,
    phone: client.phone,
    subject: formatMessage(messageTemplates[messageType].subject, messageData),
    body: formatMessage(messageTemplates[messageType].body, messageData),
    type: messageType,
    appointmentId: lastAppointment.id,
    clientId: client.id
  };
};

/**
 * Generate a styling tip message based on the client's last service
 * @param {Object} lastAppointment - The client's last appointment data
 * @param {Object} client - The client data
 * @param {Object} salon - The salon data
 * @returns {Object} The generated message
 */
const generateTipMessage = (lastAppointment, client, salon) => {
  const messageType = 'tip';
  
  const messageData = {
    client_name: client.name,
    salon_name: salon.name,
    service_name: lastAppointment.service,
    tip_content: getRandomTip(lastAppointment.service)
  };
  
  return {
    to: client.email,
    phone: client.phone,
    subject: formatMessage(messageTemplates[messageType].subject, messageData),
    body: formatMessage(messageTemplates[messageType].body, messageData),
    type: messageType,
    appointmentId: lastAppointment.id,
    clientId: client.id
  };
};

/**
 * Generate a reactivation message for lapsed clients
 * @param {Object} client - The client data
 * @param {Object} salon - The salon data
 * @returns {Object} The generated message
 */
const generateReactivationMessage = (client, salon) => {
  const messageType = 'reactivation';
  
  const messageData = {
    client_name: client.name,
    salon_name: salon.name,
    reactivation_offer: "20% off"
  };
  
  return {
    to: client.email,
    phone: client.phone,
    subject: formatMessage(messageTemplates[messageType].subject, messageData),
    body: formatMessage(messageTemplates[messageType].body, messageData),
    type: messageType,
    clientId: client.id
  };
};

/**
 * Generate a promotional message
 * @param {Object} client - The client data
 * @param {Object} salon - The salon data
 * @param {Object} promotion - The promotion details
 * @returns {Object} The generated message
 */
const generatePromotionMessage = (client, salon, promotion) => {
  const messageType = 'promotion';
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // Default 30 days expiry
  
  const messageData = {
    client_name: client.name,
    salon_name: salon.name,
    promotion_details: promotion.details || "15% off your next visit",
    expiry_date: expiryDate.toLocaleDateString()
  };
  
  return {
    to: client.email,
    phone: client.phone,
    subject: formatMessage(messageTemplates[messageType].subject, messageData),
    body: formatMessage(messageTemplates[messageType].body, messageData),
    type: messageType,
    clientId: client.id
  };
};

/**
 * Send a message (mock implementation)
 * @param {Object} message - The message to send
 * @returns {Promise} A promise that resolves when the message is sent
 */
const sendMessage = async (message) => {
  // In a real application, this would connect to an email or SMS API
  console.log(`Sending message to ${message.to}`);
  console.log(`Subject: ${message.subject}`);
  console.log(`Body: ${message.body}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        messageId: Math.random().toString(36).substring(2, 15),
        sentAt: new Date()
      });
    }, 1000);
  });
};

/**
 * Schedule a message to be sent at a specific time
 * @param {Object} message - The message to send
 * @param {Date} scheduledTime - When to send the message
 * @returns {Object} The scheduled message information
 */
const scheduleMessage = (message, scheduledTime) => {
  // In a real application, this would use a job queue or scheduler
  const scheduledId = Math.random().toString(36).substring(2, 15);
  
  console.log(`Message scheduled for ${scheduledTime.toISOString()}`);
  
  // For demo purposes, we'll just return the scheduled info
  return {
    id: scheduledId,
    message,
    scheduledTime,
    status: 'scheduled'
  };
};

/**
 * Generate and schedule follow-up messages for a completed appointment
 * @param {Object} appointment - The completed appointment
 * @param {Object} client - The client data
 * @param {Object} salon - The salon data
 * @returns {Array} An array of scheduled messages
 */
const scheduleFollowUpSequence = (appointment, client, salon) => {
  // Calculate scheduled times based on appointment date
  const appointmentDate = new Date(appointment.datetime);
  
  // Schedule follow-up message for 1 day after appointment
  const followUpDate = new Date(appointmentDate);
  followUpDate.setDate(followUpDate.getDate() + 1);
  
  // Schedule styling tip message for 3 days after appointment
  const tipDate = new Date(appointmentDate);
  tipDate.setDate(tipDate.getDate() + 3);
  
  // Schedule reminder message for 3 weeks after appointment
  const reminderDate = new Date(appointmentDate);
  reminderDate.setDate(reminderDate.getDate() + 21);
  
  // Generate messages
  const followUpMessage = generateFollowUpMessage(appointment, client, salon);
  const tipMessage = generateTipMessage(appointment, client, salon);
  const reminderMessage = generateReminderMessage(appointment, client, salon);
  
  // Schedule messages
  const scheduledMessages = [
    scheduleMessage(followUpMessage, followUpDate),
    scheduleMessage(tipMessage, tipDate),
    scheduleMessage(reminderMessage, reminderDate)
  ];
  
  return scheduledMessages;
};

/**
 * Get all scheduled messages for a client
 * @param {string} clientId - The client ID
 * @param {Array} scheduledMessages - All scheduled messages
 * @returns {Array} The scheduled messages for the client
 */
const getClientScheduledMessages = (clientId, scheduledMessages) => {
  return scheduledMessages.filter(scheduledMsg => 
    scheduledMsg.message.clientId === clientId
  );
};

/**
 * Cancel a scheduled message
 * @param {string} messageId - The scheduled message ID
 * @param {Array} scheduledMessages - All scheduled messages
 * @returns {Array} Updated scheduled messages
 */
const cancelScheduledMessage = (messageId, scheduledMessages) => {
  return scheduledMessages.map(scheduledMsg => 
    scheduledMsg.id === messageId 
      ? { ...scheduledMsg, status: 'cancelled' }
      : scheduledMsg
  );
};

/**
 * Edit a scheduled message
 * @param {string} messageId - The scheduled message ID
 * @param {Object} updatedMessage - The updated message content
 * @param {Array} scheduledMessages - All scheduled messages
 * @returns {Array} Updated scheduled messages
 */
const editScheduledMessage = (messageId, updatedMessage, scheduledMessages) => {
  return scheduledMessages.map(scheduledMsg => 
    scheduledMsg.id === messageId 
      ? { 
          ...scheduledMsg, 
          message: {
            ...scheduledMsg.message,
            ...updatedMessage
          }
        }
      : scheduledMsg
  );
};

/**
 * Get message templates
 * @returns {Object} All message templates
 */
const getMessageTemplates = () => {
  return messageTemplates;
};

/**
 * Get styling tips
 * @returns {Object} All styling tips
 */
const getStylingTips = () => {
  return stylingTips;
};

export {
  generateFollowUpMessage,
  generateReminderMessage,
  generateTipMessage,
  generateReactivationMessage,
  generatePromotionMessage,
  sendMessage,
  scheduleMessage,
  scheduleFollowUpSequence,
  getClientScheduledMessages,
  cancelScheduledMessage,
  editScheduledMessage,
  getMessageTemplates,
  getStylingTips,
  formatMessage,
  getRandomTip
};

