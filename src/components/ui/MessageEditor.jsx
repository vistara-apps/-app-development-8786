import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import Label from './Label';
import { getMessageTemplates } from '../../services/messagingService';

const MessageEditor = ({ message, onSave, onCancel }) => {
  const [editedMessage, setEditedMessage] = useState({
    subject: '',
    body: '',
  });
  const [showTemplateVariables, setShowTemplateVariables] = useState(false);
  
  // Available template variables
  const templateVariables = [
    { name: 'client_name', description: 'Client\'s full name' },
    { name: 'salon_name', description: 'Your salon\'s name' },
    { name: 'stylist_name', description: 'Stylist who performed the service' },
    { name: 'service_name', description: 'Service the client received' },
    { name: 'days_since', description: 'Days since last appointment' },
    { name: 'tip_content', description: 'Styling tip based on service' },
    { name: 'promotion_details', description: 'Details of the promotion' },
    { name: 'expiry_date', description: 'Expiration date for offers' },
    { name: 'reactivation_offer', description: 'Special offer for returning clients' }
  ];

  // Load message templates
  const messageTemplates = getMessageTemplates();
  
  useEffect(() => {
    if (message) {
      setEditedMessage({
        subject: message.subject || '',
        body: message.body || '',
      });
    }
  }, [message]);

  const handleSave = () => {
    onSave({
      ...message,
      subject: editedMessage.subject,
      body: editedMessage.body,
    });
  };

  const insertVariable = (variable) => {
    const textArea = document.getElementById('message-body');
    const cursorPosition = textArea.selectionStart;
    const textBefore = editedMessage.body.substring(0, cursorPosition);
    const textAfter = editedMessage.body.substring(cursorPosition);
    
    setEditedMessage({
      ...editedMessage,
      body: `${textBefore}{${variable}}${textAfter}`
    });
    
    // Focus back on textarea after inserting
    setTimeout(() => {
      textArea.focus();
      const newPosition = cursorPosition + variable.length + 2; // +2 for the braces
      textArea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const loadTemplate = (templateType) => {
    if (messageTemplates[templateType]) {
      setEditedMessage({
        subject: messageTemplates[templateType].subject || '',
        body: messageTemplates[templateType].body || '',
      });
    }
  };

  return (
    <div className="bg-surface border rounded-lg overflow-hidden">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-heading">Edit Message</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {/* Template selector */}
          <div>
            <Label>Load Template</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => loadTemplate('followUp')}
              >
                Follow-up
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => loadTemplate('reminder')}
              >
                Reminder
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => loadTemplate('tip')}
              >
                Styling Tip
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => loadTemplate('reactivation')}
              >
                Reactivation
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => loadTemplate('promotion')}
              >
                Promotion
              </Button>
            </div>
          </div>

          {/* Subject field */}
          <div>
            <Label htmlFor="message-subject">Subject</Label>
            <Input
              id="message-subject"
              value={editedMessage.subject}
              onChange={(e) => setEditedMessage({ ...editedMessage, subject: e.target.value })}
              placeholder="Message subject"
            />
          </div>

          {/* Body field */}
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="message-body">Message</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTemplateVariables(!showTemplateVariables)}
              >
                {showTemplateVariables ? 'Hide Variables' : 'Show Variables'}
              </Button>
            </div>
            <Textarea
              id="message-body"
              value={editedMessage.body}
              onChange={(e) => setEditedMessage({ ...editedMessage, body: e.target.value })}
              placeholder="Message content"
              rows={8}
            />
          </div>

          {/* Template variables */}
          {showTemplateVariables && (
            <div className="border rounded-md p-3 bg-gray-50">
              <Label className="mb-2 block">Template Variables</Label>
              <div className="flex flex-wrap gap-2">
                {templateVariables.map((variable) => (
                  <button
                    key={variable.name}
                    type="button"
                    onClick={() => insertVariable(variable.name)}
                    className="inline-flex items-center px-2 py-1 bg-white border rounded text-xs hover:bg-gray-100"
                    title={variable.description}
                  >
                    {`{${variable.name}}`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                Click a variable to insert it at the cursor position. Variables will be replaced with actual values when the message is sent.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default MessageEditor;

