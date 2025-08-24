import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Edit2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import DataTable from '../components/ui/DataTable';
import MessagePreview from '../components/ui/MessagePreview';
import MessageEditor from '../components/ui/MessageEditor';
import { useSalon } from '../contexts/SalonContext';
import { formatMessage } from '../services/messagingService';

const Messaging = () => {
  const { 
    salon, 
    clients, 
    appointments, 
    scheduledMessages, 
    updateScheduledMessage,
    cancelScheduledMessage,
    createFollowUpSequence
  } = useSalon();
  
  const [activeTab, setActiveTab] = useState('scheduled');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterClient, setFilterClient] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showCreateSequenceModal, setShowCreateSequenceModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filter messages based on current filters
  const filteredMessages = scheduledMessages.filter(scheduledMsg => {
    // Filter by client
    if (filterClient && scheduledMsg.message.clientId !== filterClient) {
      return false;
    }
    
    // Filter by message type
    if (filterType && scheduledMsg.message.type !== filterType) {
      return false;
    }
    
    return true;
  });
  
  // Sort messages by scheduled time
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    return new Date(a.scheduledTime) - new Date(b.scheduledTime);
  });
  
  // Get completed appointments for creating new follow-up sequences
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  
  // Handle message edit
  const handleEditMessage = (message) => {
    setSelectedMessage(message);
    setIsEditing(true);
  };
  
  // Save edited message
  const handleSaveEdit = (updatedMessage) => {
    updateScheduledMessage(selectedMessage.id, updatedMessage);
    setIsEditing(false);
    setSelectedMessage(null);
    setSuccessMessage('Message updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Cancel message edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedMessage(null);
  };
  
  // Create follow-up sequence
  const handleCreateSequence = () => {
    if (!selectedAppointment) return;
    
    const messages = createFollowUpSequence(selectedAppointment);
    setShowCreateSequenceModal(false);
    setSelectedAppointment(null);
    
    if (messages && messages.length > 0) {
      setSuccessMessage('Follow-up sequence created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  // Get client name by ID
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  // Get appointment details
  const getAppointmentDetails = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    return appointment || null;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get message status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display">Messaging</h1>
          <p className="text-body text-muted mt-2">
            Manage automated post-appointment follow-up messages
          </p>
        </div>
        <Button onClick={() => setShowCreateSequenceModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Follow-up Sequence
        </Button>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <CheckCircle className="h-4 w-4 inline-block mr-2" />
          {successMessage}
        </div>
      )}
      
      {/* Messaging Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Scheduled Messages</p>
              <p className="text-2xl font-bold">
                {scheduledMessages.filter(m => m.status === 'scheduled').length}
              </p>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Messages Sent</p>
              <p className="text-2xl font-bold">
                {scheduledMessages.filter(m => m.status === 'sent').length}
              </p>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Follow-up Sequences</p>
              <p className="text-2xl font-bold">
                {Math.floor(scheduledMessages.length / 3)}
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text hover:border-gray-300'
            }`}
          >
            Scheduled Messages
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text hover:border-gray-300'
            }`}
          >
            Message Templates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text hover:border-gray-300'
            }`}
          >
            Messaging Settings
          </button>
        </nav>
      </div>
      
      {/* Scheduled Messages Tab */}
      {activeTab === 'scheduled' && (
        <div>
          {/* Filters */}
          <Card className="mb-6">
            <Card.Content>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="filter-client">Filter by Client</Label>
                  <select
                    id="filter-client"
                    className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm"
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value)}
                  >
                    <option value="">All Clients</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="filter-type">Filter by Type</Label>
                  <select
                    id="filter-type"
                    className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="followUp">Follow-up</option>
                    <option value="reminder">Reminder</option>
                    <option value="tip">Styling Tip</option>
                    <option value="reactivation">Reactivation</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilterClient('');
                      setFilterType('');
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          {/* Message List */}
          {isEditing ? (
            <MessageEditor 
              message={selectedMessage.message}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedMessages.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-surface border rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text mb-2">No messages found</h3>
                  <p className="text-muted mb-4">
                    {filterClient || filterType 
                      ? 'Try adjusting your filters to see more messages.'
                      : 'Create your first follow-up sequence to start engaging with clients.'}
                  </p>
                  {!filterClient && !filterType && (
                    <Button onClick={() => setShowCreateSequenceModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Follow-up Sequence
                    </Button>
                  )}
                </div>
              ) : (
                sortedMessages.map((scheduledMsg) => {
                  const clientName = getClientName(scheduledMsg.message.clientId);
                  const appointment = scheduledMsg.message.appointmentId 
                    ? getAppointmentDetails(scheduledMsg.message.appointmentId)
                    : null;
                    
                  return (
                    <div key={scheduledMsg.id} className="flex flex-col">
                      <div className="bg-surface border rounded-t-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{clientName}</div>
                          {appointment && (
                            <div className="text-xs text-muted">
                              {appointment.service} with {appointment.stylist}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(scheduledMsg.status)}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditMessage(scheduledMsg)}
                            disabled={scheduledMsg.status !== 'scheduled'}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          {scheduledMsg.status === 'scheduled' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                cancelScheduledMessage(scheduledMsg.id);
                                setSuccessMessage('Message cancelled successfully');
                                setTimeout(() => setSuccessMessage(''), 3000);
                              }}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                      <MessagePreview 
                        message={scheduledMsg.message} 
                        showActions={false}
                      />
                      <div className="bg-surface border-t border-x border-b rounded-b-lg p-3 text-xs text-muted">
                        Scheduled for: {formatDate(scheduledMsg.scheduledTime)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h2 className="text-heading">Message Templates</h2>
              <p className="text-sm text-muted">
                These templates are used for automated follow-up messages. You can customize them in the messaging settings.
              </p>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Follow-up Message</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    Hi {'{client_name}'},

                    Thank you for visiting {'{salon_name}'}! We hope you're enjoying your new look. How was your experience with {'{stylist_name}'}?

                    We'd love to hear your feedback and see you again soon!

                    Best regards,
                    The {'{salon_name}'} Team
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Sent 1 day after appointment
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Styling Tip</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    Hi {'{client_name}'},

                    We hope you're enjoying your recent {'{service_name}'} from {'{salon_name}'}!

                    Here's a quick tip to help maintain your look: {'{tip_content}'}

                    Feel free to reach out if you have any questions!

                    Best regards,
                    The {'{salon_name}'} Team
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Sent 3 days after appointment
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Appointment Reminder</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    Hi {'{client_name}'},

                    It's been about {'{days_since}'} days since your last appointment with us. Your {'{service_name}'} might be due for a refresh!

                    Would you like to schedule your next visit? We have some great openings next week.

                    Best regards,
                    The {'{salon_name}'} Team
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Sent 3 weeks after appointment
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Reactivation Message</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    Hi {'{client_name}'},

                    It's been a while since we've seen you at {'{salon_name}'}! We miss having you in our chair and would love to welcome you back.

                    As a special thank you for your past business, we'd like to offer you {'{reactivation_offer}'} on your next visit.

                    Hope to see you soon!

                    Best regards,
                    The {'{salon_name}'} Team
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Sent to clients who haven't visited in 60+ days
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <h2 className="text-heading">Styling Tips Library</h2>
              <p className="text-sm text-muted">
                These tips are automatically selected based on the client's service type.
              </p>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Haircut Tips</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use a heat protectant spray before using any hot styling tools to prevent damage.</li>
                    <li>For longer-lasting style, try using dry shampoo at the roots on day two or three after your cut.</li>
                    <li>Remember to trim your hair every 6-8 weeks to maintain the shape and prevent split ends.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Color Tips</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use color-safe shampoo and conditioner to help your color last longer.</li>
                    <li>Rinse with cool water to seal the hair cuticle and lock in color.</li>
                    <li>Limit washing your hair to 2-3 times a week to prevent color fading.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Highlights Tips</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Purple shampoo once a week can help keep your highlights bright and prevent brassiness.</li>
                    <li>Deep condition weekly to keep your highlighted hair healthy and hydrated.</li>
                    <li>Wear a hat or use UV protection products when in the sun to prevent highlights from fading.</li>
                  </ul>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <Card.Header>
            <h2 className="text-heading">Messaging Settings</h2>
            <p className="text-sm text-muted">
              Configure your automated messaging preferences.
            </p>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Automated Messaging</h3>
                  <p className="text-sm text-muted">
                    Automatically send follow-up messages after appointments
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input
                    type="checkbox"
                    id="toggle-messaging"
                    className="absolute w-0 h-0 opacity-0"
                    checked={salon?.settings?.messagingEnabled}
                    readOnly
                  />
                  <label
                    htmlFor="toggle-messaging"
                    className={`block w-12 h-6 overflow-hidden rounded-full cursor-pointer ${
                      salon?.settings?.messagingEnabled ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                        salon?.settings?.messagingEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="follow-up-delay">Follow-up Message Delay (hours)</Label>
                  <Input
                    id="follow-up-delay"
                    type="number"
                    value={salon?.settings?.defaultFollowUpDelay || 24}
                    readOnly
                  />
                  <p className="text-xs text-muted mt-1">
                    Hours after appointment to send the initial follow-up
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="tip-delay">Styling Tip Delay (days)</Label>
                  <Input
                    id="tip-delay"
                    type="number"
                    value={salon?.settings?.defaultTipDelay || 3}
                    readOnly
                  />
                  <p className="text-xs text-muted mt-1">
                    Days after appointment to send styling tips
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="reminder-delay">Reminder Delay (days)</Label>
                  <Input
                    id="reminder-delay"
                    type="number"
                    value={salon?.settings?.defaultReminderDelay || 21}
                    readOnly
                  />
                  <p className="text-xs text-muted mt-1">
                    Days after appointment to send a reminder for the next booking
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="lapsed-threshold">Lapsed Client Threshold (days)</Label>
                  <Input
                    id="lapsed-threshold"
                    type="number"
                    value={salon?.settings?.lapsedClientThreshold || 60}
                    readOnly
                  />
                  <p className="text-xs text-muted mt-1">
                    Days without a visit to consider a client as lapsed
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline">
                  Edit Settings
                </Button>
                <p className="text-xs text-muted mt-2">
                  Note: In this demo, settings are read-only.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
      
      {/* Create Sequence Modal */}
      {showCreateSequenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b">
              <h3 className="text-heading">Create Follow-up Sequence</h3>
            </div>
            
            <div className="p-4">
              <p className="mb-4">
                Select a completed appointment to create a follow-up message sequence.
              </p>
              
              <Label htmlFor="appointment-select">Select Appointment</Label>
              <select
                id="appointment-select"
                className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm mb-4"
                value={selectedAppointment || ''}
                onChange={(e) => setSelectedAppointment(e.target.value)}
              >
                <option value="">Select an appointment</option>
                {completedAppointments.map(appointment => {
                  const client = clients.find(c => c.id === appointment.clientId);
                  return (
                    <option key={appointment.id} value={appointment.id}>
                      {client?.name} - {appointment.service} ({formatDate(appointment.datetime)})
                    </option>
                  );
                })}
              </select>
              
              <p className="text-sm text-muted mb-4">
                This will create three messages:
                <ul className="list-disc pl-5 mt-2">
                  <li>Follow-up message (1 day after appointment)</li>
                  <li>Styling tip (3 days after appointment)</li>
                  <li>Reminder for next booking (3 weeks after appointment)</li>
                </ul>
              </p>
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateSequenceModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSequence}
                disabled={!selectedAppointment}
              >
                Create Sequence
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messaging;
