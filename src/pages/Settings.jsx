import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Bell, 
  MessageSquare, 
  Clock, 
  Users,
  Link as LinkIcon,
  Save
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Textarea from '../components/ui/Textarea'
import Alert from '../components/ui/Alert'
import { useSalon } from '../contexts/SalonContext'

const Settings = () => {
  const { salon, setSalon } = useSalon()
  const [settings, setSettings] = useState(salon?.settings || {})
  const [salonInfo, setSalonInfo] = useState({
    name: salon?.name || '',
    bookingSoftwareType: salon?.bookingSoftwareType || 'Square',
    apiKey: salon?.apiKey || ''
  })
  const [showSaveAlert, setShowSaveAlert] = useState(false)

  const handleSaveSettings = () => {
    setSalon({
      ...salon,
      ...salonInfo,
      settings: settings
    })
    setShowSaveAlert(true)
    setTimeout(() => setShowSaveAlert(false), 3000)
  }

  const integrationOptions = [
    { value: 'Square', label: 'Square Appointments' },
    { value: 'Mindbody', label: 'Mindbody' },
    { value: 'Vagaro', label: 'Vagaro' },
    { value: 'Fresha', label: 'Fresha' },
    { value: 'Other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display">Settings</h1>
        <p className="text-body text-muted mt-2">
          Configure your salon preferences and integration settings.
        </p>
      </div>

      {showSaveAlert && (
        <Alert>
          Settings saved successfully!
        </Alert>
      )}

      {/* Salon Information */}
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            <h2 className="text-heading">Salon Information</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <Label htmlFor="salon-name">Salon Name</Label>
              <Input
                id="salon-name"
                value={salonInfo.name}
                onChange={(e) => setSalonInfo({...salonInfo, name: e.target.value})}
                placeholder="Your salon name"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Integration Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              <h2 className="text-heading">Booking Software Integration</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/booking-integration'}
            >
              Advanced Settings
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <Label htmlFor="booking-software">Booking Software</Label>
              <select
                id="booking-software"
                className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm"
                value={salonInfo.bookingSoftwareType}
                onChange={(e) => setSalonInfo({...salonInfo, bookingSoftwareType: e.target.value})}
              >
                {integrationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={salonInfo.apiKey}
                onChange={(e) => setSalonInfo({...salonInfo, apiKey: e.target.value})}
                placeholder="Enter your API key"
              />
              <p className="text-sm text-muted mt-1">
                This will be used to sync appointment data from your booking software.
              </p>
            </div>

            <Alert>
              <strong>Integration Status:</strong> Connected to {salonInfo.bookingSoftwareType}
            </Alert>
            
            <p className="text-sm text-muted">
              For advanced integration options, including OAuth setup and webhook configuration, 
              visit the <a href="/booking-integration" className="text-primary hover:underline">Booking Integration</a> page.
            </p>
          </div>
        </Card.Content>
      </Card>

      {/* Message Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h2 className="text-heading">Message Settings</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-reply to client messages</Label>
                <p className="text-sm text-muted">Automatically respond to client replies</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoReply || false}
                  onChange={(e) => setSettings({...settings, autoReply: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div>
              <Label htmlFor="rebooking-window">Rebooking Window (hours)</Label>
              <Input
                id="rebooking-window"
                type="number"
                value={settings.rebookingWindow || 24}
                onChange={(e) => setSettings({...settings, rebookingWindow: parseInt(e.target.value)})}
                placeholder="24"
              />
              <p className="text-sm text-muted mt-1">
                How long after a cancellation should we attempt rebooking?
              </p>
            </div>

            <div>
              <Label htmlFor="lapsed-threshold">Lapsed Client Threshold (days)</Label>
              <Input
                id="lapsed-threshold"
                type="number"
                value={settings.lapsedClientThreshold || 60}
                onChange={(e) => setSettings({...settings, lapsedClientThreshold: parseInt(e.target.value)})}
                placeholder="60"
              />
              <p className="text-sm text-muted mt-1">
                Mark clients as lapsed after this many days without booking.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Notification Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <h2 className="text-heading">Notifications</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email notifications for new rebookings</Label>
                <p className="text-sm text-muted">Get notified when clients rebook</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications || true}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Daily summary reports</Label>
                <p className="text-sm text-muted">Receive daily performance summaries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyReports || true}
                  onChange={(e) => setSettings({...settings, dailyReports: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings
