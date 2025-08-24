import React, { useState, useEffect } from 'react'
import { 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  Clock,
  Save,
  Plus,
  X
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Alert from '../components/ui/Alert'
import { useSalon } from '../contexts/SalonContext'

const BookingIntegration = () => {
  const { salon, setSalon } = useSalon()
  const [activeTab, setActiveTab] = useState('platforms')
  const [selectedPlatform, setSelectedPlatform] = useState(salon?.bookingSoftwareType || 'Square')
  const [configValues, setConfigValues] = useState({})
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [availablePlatforms, setAvailablePlatforms] = useState([])

  // Initialize available platforms
  useEffect(() => {
    setAvailablePlatforms([
      { 
        id: 'vagaro', 
        name: 'Vagaro', 
        description: 'Popular salon and spa booking platform',
        icon: '💇‍♀️',
        connected: salon?.bookingSoftwareType === 'Vagaro',
        authType: 'oauth'
      },
      { 
        id: 'mindbody', 
        name: 'Mindbody', 
        description: 'Leading wellness business management software',
        icon: '🧘‍♀️',
        connected: salon?.bookingSoftwareType === 'Mindbody',
        authType: 'apikey'
      },
      { 
        id: 'phorest', 
        name: 'Phorest', 
        description: 'Salon software with marketing automation',
        icon: '✂️',
        connected: salon?.bookingSoftwareType === 'Phorest',
        authType: 'oauth'
      },
      { 
        id: 'square', 
        name: 'Square', 
        description: 'Integrated POS and appointment scheduling',
        icon: '🔲',
        connected: salon?.bookingSoftwareType === 'Square',
        authType: 'oauth'
      },
      { 
        id: 'fresha', 
        name: 'Fresha', 
        description: 'Commission-free booking platform',
        icon: '📱',
        connected: salon?.bookingSoftwareType === 'Fresha',
        authType: 'apikey'
      }
    ])
  }, [salon])

  // Initialize config values based on selected platform
  useEffect(() => {
    const platform = availablePlatforms.find(p => p.id === selectedPlatform.toLowerCase())
    
    if (platform) {
      if (platform.authType === 'oauth') {
        setConfigValues({
          clientId: '',
          clientSecret: '',
          redirectUri: `https://app.salonrecovery.com/auth/${platform.id}/callback`
        })
      } else if (platform.authType === 'apikey') {
        setConfigValues({
          apiKey: '',
          siteId: platform.id === 'mindbody' ? '' : undefined
        })
      }
    }
  }, [selectedPlatform, availablePlatforms])

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId)
    const platform = availablePlatforms.find(p => p.id === platformId)
    
    if (platform?.connected) {
      setConnectionStatus('connected')
    } else {
      setConnectionStatus(null)
    }
  }

  const handleConfigChange = (field) => (event) => {
    setConfigValues({
      ...configValues,
      [field]: event.target.value
    })
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    setConnectionStatus(null)
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false)
      setConnectionStatus('connected')
      
      // Update salon booking software type
      const platformName = availablePlatforms.find(p => p.id === selectedPlatform.toLowerCase())?.name || selectedPlatform
      setSalon({
        ...salon,
        bookingSoftwareType: platformName
      })
      
      // Update platform connection status
      setAvailablePlatforms(platforms => 
        platforms.map(p => ({
          ...p,
          connected: p.id === selectedPlatform.toLowerCase()
        }))
      )
      
      // Show success message
      setAlertMessage(`Successfully connected to ${platformName}!`)
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }, 2000)
  }

  const handleTestConnection = () => {
    setIsTestingConnection(true)
    
    // Simulate testing connection
    setTimeout(() => {
      setIsTestingConnection(false)
      setAlertMessage(`Connection to ${selectedPlatform} is working!`)
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }, 1500)
  }

  const handleDisconnect = (platformId) => {
    // Update platform connection status
    setAvailablePlatforms(platforms => 
      platforms.map(p => ({
        ...p,
        connected: p.id === platformId ? false : p.connected
      }))
    )
    
    if (salon?.bookingSoftwareType?.toLowerCase() === platformId) {
      setSalon({
        ...salon,
        bookingSoftwareType: null
      })
    }
    
    setAlertMessage(`Disconnected from ${platformId}!`)
    setAlertType('info')
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const renderPlatformFields = () => {
    const platform = availablePlatforms.find(p => p.id === selectedPlatform.toLowerCase())
    
    if (!platform) return null
    
    if (platform.authType === 'oauth') {
      return (
        <>
          <div>
            <Label htmlFor="client-id">Client ID</Label>
            <Input
              id="client-id"
              value={configValues.clientId || ''}
              onChange={handleConfigChange('clientId')}
              placeholder="Enter your client ID"
            />
          </div>
          
          <div>
            <Label htmlFor="client-secret">Client Secret</Label>
            <Input
              id="client-secret"
              type="password"
              value={configValues.clientSecret || ''}
              onChange={handleConfigChange('clientSecret')}
              placeholder="Enter your client secret"
            />
          </div>
          
          <div>
            <Label htmlFor="redirect-uri">Redirect URI</Label>
            <Input
              id="redirect-uri"
              value={configValues.redirectUri || ''}
              onChange={handleConfigChange('redirectUri')}
              placeholder="https://app.salonrecovery.com/auth/callback"
            />
            <p className="text-sm text-muted mt-1">
              Use this URL in your {platform.name} developer console.
            </p>
          </div>
        </>
      )
    } else if (platform.authType === 'apikey') {
      return (
        <>
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={configValues.apiKey || ''}
              onChange={handleConfigChange('apiKey')}
              placeholder="Enter your API key"
            />
          </div>
          
          {platform.id === 'mindbody' && (
            <div>
              <Label htmlFor="site-id">Site ID</Label>
              <Input
                id="site-id"
                value={configValues.siteId || ''}
                onChange={handleConfigChange('siteId')}
                placeholder="Enter your Mindbody site ID"
              />
            </div>
          )}
        </>
      )
    }
    
    return null
  }

  const renderPlatformsList = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePlatforms.map((platform) => (
          <div 
            key={platform.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedPlatform.toLowerCase() === platform.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePlatformSelect(platform.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="text-2xl mr-3">{platform.icon}</div>
                <div>
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="text-sm text-muted">{platform.description}</p>
                </div>
              </div>
              {platform.connected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderConnectionSettings = () => {
    const platform = availablePlatforms.find(p => p.id === selectedPlatform.toLowerCase())
    
    if (!platform) return null
    
    return (
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <LinkIcon className="h-5 w-5 mr-2" />
            <h2 className="text-heading">Connect to {platform.name}</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {renderPlatformFields()}
            
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || connectionStatus === 'connected'}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : connectionStatus === 'connected' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Connected
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
              
              {connectionStatus === 'connected' && (
                <Button 
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
              )}
              
              {connectionStatus === 'connected' && (
                <Button 
                  variant="destructive"
                  onClick={() => handleDisconnect(platform.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              )}
            </div>
            
            {connectionStatus === 'connected' && (
              <Alert type="success">
                <Check className="h-4 w-4 mr-2" />
                Successfully connected to {platform.name}!
              </Alert>
            )}
            
            {connectionStatus === 'error' && (
              <Alert type="error">
                <AlertCircle className="h-4 w-4 mr-2" />
                Failed to connect. Please check your credentials and try again.
              </Alert>
            )}
          </div>
        </Card.Content>
      </Card>
    )
  }

  const renderRebookingSettings = () => {
    return (
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            <h2 className="text-heading">Rebooking Settings</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rebooking-window">Rebooking Window (hours)</Label>
              <Input
                id="rebooking-window"
                type="number"
                value={salon?.settings?.rebookingWindow || 24}
                placeholder="24"
              />
              <p className="text-sm text-muted mt-1">
                How long after a cancellation should we attempt rebooking?
              </p>
            </div>
            
            <div>
              <Label htmlFor="max-suggestions">Maximum Rebooking Suggestions</Label>
              <Input
                id="max-suggestions"
                type="number"
                value={3}
                placeholder="3"
              />
              <p className="text-sm text-muted mt-1">
                Maximum number of alternative time slots to suggest.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatically suggest rebooking</Label>
                <p className="text-sm text-muted">Send rebooking suggestions automatically</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  const renderSyncSettings = () => {
    return (
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            <h2 className="text-heading">Synchronization Settings</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sync-frequency">Sync Frequency (minutes)</Label>
              <Input
                id="sync-frequency"
                type="number"
                value={15}
                placeholder="15"
              />
              <p className="text-sm text-muted mt-1">
                How often to sync appointment data from your booking software.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable real-time webhooks</Label>
                <p className="text-sm text-muted">Receive instant updates via webhooks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex">
                <Input
                  id="webhook-url"
                  value="https://app.salonrecovery.com/api/webhooks/booking"
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" className="ml-2">
                  Copy
                </Button>
              </div>
              <p className="text-sm text-muted mt-1">
                Use this URL in your booking software webhook settings.
              </p>
            </div>
            
            <div className="mt-4">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  const renderConnectedPlatforms = () => {
    const connectedPlatforms = availablePlatforms.filter(p => p.connected)
    
    if (connectedPlatforms.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4 mr-2" />
          No booking platforms connected. Connect a platform to enable rebooking features.
        </Alert>
      )
    }
    
    return (
      <div className="space-y-4">
        {connectedPlatforms.map(platform => (
          <div 
            key={platform.id}
            className="border rounded-lg p-4 bg-surface"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="text-2xl mr-3">{platform.icon}</div>
                <div>
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="text-sm text-muted">Connected and syncing data</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePlatformSelect(platform.id)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDisconnect(platform.id)}
                >
                  Disconnect
                </Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last synced: 5 minutes ago</span>
              </div>
            </div>
          </div>
        ))}
        
        <Button onClick={() => setActiveTab('platforms')}>
          <Plus className="h-4 w-4 mr-2" />
          Connect Another Platform
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display">Booking Integration</h1>
        <p className="text-body text-muted mt-2">
          Connect your booking software to enable automated rebooking features.
        </p>
      </div>

      {showAlert && (
        <Alert type={alertType}>
          {alertMessage}
        </Alert>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('platforms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'platforms'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text hover:border-gray-300'
            }`}
          >
            Platforms
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connected'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text hover:border-gray-300'
            }`}
          >
            Connected Platforms
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text hover:border-gray-300'
            }`}
          >
            Rebooking Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'platforms' && (
          <>
            <Card>
              <Card.Header>
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  <h2 className="text-heading">Available Booking Platforms</h2>
                </div>
              </Card.Header>
              <Card.Content>
                {renderPlatformsList()}
              </Card.Content>
            </Card>
            
            {renderConnectionSettings()}
          </>
        )}
        
        {activeTab === 'connected' && (
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                <h2 className="text-heading">Connected Platforms</h2>
              </div>
            </Card.Header>
            <Card.Content>
              {renderConnectedPlatforms()}
            </Card.Content>
          </Card>
        )}
        
        {activeTab === 'settings' && (
          <>
            {renderRebookingSettings()}
            {renderSyncSettings()}
            
            {/* Save Button */}
            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BookingIntegration

