import React from 'react';
import { Mail, MessageSquare, Calendar, Clock, Edit2 } from 'lucide-react';
import Button from './Button';

const MessagePreview = ({ message, onEdit, showActions = true }) => {
  const getMessageTypeIcon = () => {
    switch (message.type) {
      case 'followUp':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'tip':
        return <Mail className="h-4 w-4 text-green-500" />;
      case 'reactivation':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'promotion':
        return <Mail className="h-4 w-4 text-pink-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessageTypeLabel = () => {
    switch (message.type) {
      case 'followUp':
        return 'Follow-up';
      case 'reminder':
        return 'Appointment Reminder';
      case 'tip':
        return 'Styling Tip';
      case 'reactivation':
        return 'Reactivation';
      case 'promotion':
        return 'Promotion';
      default:
        return 'Message';
    }
  };

  const getMessageTypeColor = () => {
    switch (message.type) {
      case 'followUp':
        return 'bg-blue-100 text-blue-800';
      case 'reminder':
        return 'bg-purple-100 text-purple-800';
      case 'tip':
        return 'bg-green-100 text-green-800';
      case 'reactivation':
        return 'bg-amber-100 text-amber-800';
      case 'promotion':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatScheduledTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-surface">
      {/* Message Header */}
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getMessageTypeIcon()}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getMessageTypeColor()}`}>
              {getMessageTypeLabel()}
            </span>
            {message.scheduledTime && (
              <div className="flex items-center text-xs text-muted">
                <Clock className="h-3 w-3 mr-1" />
                {formatScheduledTime(message.scheduledTime)}
              </div>
            )}
          </div>
          {showActions && onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(message)}>
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="p-4 bg-gray-50">
        <div className="mb-2">
          <div className="text-sm font-medium">To: {message.to}</div>
          {message.subject && <div className="text-sm font-medium">Subject: {message.subject}</div>}
        </div>
        <div className="bg-white border rounded-md p-3 whitespace-pre-wrap text-sm">
          {message.body}
        </div>
      </div>

      {/* Message Status */}
      {message.status && (
        <div className="px-4 py-2 bg-surface border-t text-xs text-muted">
          Status: <span className="font-medium capitalize">{message.status}</span>
        </div>
      )}
    </div>
  );
};

export default MessagePreview;

