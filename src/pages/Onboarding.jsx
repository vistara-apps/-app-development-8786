import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle, 
  ArrowRight, 
  Scissors, 
  Link as LinkIcon,
  MessageSquare,
  Users
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import { useSalon } from '../contexts/SalonContext'

const Onboarding = () => {
  const navigate = useNavigate()
  const { setSalon } = useSalon()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState({
    salonName: '',
    bookingSoftware: 'Square',
    apiKey: '',
    contactEmail: '',
    phoneNumber: ''
  })

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      setSalon({
        id: '1',
        name: onboardingData.salonName,
        bookingSoftwareType: onboardingData.bookingSoftware,
        apiKey: onboardingData.apiKey,
        settings: {
          autoReply: true,
          rebookingWindow: 24,
          lapsedClientThreshold: 60
        }
      })
      navigate('/')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [
    {
      title: 'Welcome to Salon Recovery',
      description: 'Let\'s get your salon set up to start recovering lost revenue',
      icon: Scissors
    },
    {
      title: 'Salon Information',
      description: 'Tell us about your salon',
      icon: Users
    },
    {
      title: 'Booking Software Integration',
      description: 'Connect your existing booking system',
      icon: LinkIcon
    },
    {
      title: 'Campaign Setup',
      description: 'Configure your first re-engagement campaign',
      icon: MessageSquare
    }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Scissors className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-heading mb-2">Welcome to Salon Recovery</h2>
              <p className="text-body text-muted">
                Your AI-powered assistant for recovering lost revenue and re-engaging clients. 
                Let's set up your salon in just a few steps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border border-gray-200 rounded-lg">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Smart Rebooking</h3>
                <p className="text-sm text-muted">Automatically message cancelled clients with new slots</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Users className="h-8 w-8 text-accent mb-2" />
                <h3 className="font-semibold mb-1">Client Reactivation</h3>
                <p className="text-sm text-muted">Win back lapsed clients with personalized campaigns</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <LinkIcon className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Easy Integration</h3>
                <p className="text-sm text-muted">Works with your existing booking software</p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">Tell us about your salon</h2>
              <p className="text-body text-muted">
                This information helps us personalize your experience.
              </p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="salon-name">Salon Name *</Label>
                <Input
                  id="salon-name"
                  value={onboardingData.salonName}
                  onChange={(e) => setOnboardingData({...onboardingData, salonName: e.target.value})}
                  placeholder="e.g., Luxe Hair Studio"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={onboardingData.contactEmail}
                  onChange={(e) => setOnboardingData({...onboardingData, contactEmail: e.target.value})}
                  placeholder="your.email@salon.com"
                />
              </div>
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  value={onboardingData.phoneNumber}
                  onChange={(e) => setOnboardingData({...onboardingData, phoneNumber: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">Connect your booking software</h2>
              <p className="text-body text-muted">
                We'll sync with your existing system to track appointments and cancellations.
              </p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="booking-software">Booking Software *</Label>
                <select
                  id="booking-software"
                  className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm"
                  value={onboardingData.bookingSoftware}
                  onChange={(e) => setOnboardingData({...onboardingData, bookingSoftware: e.target.value})}
                >
                  <option value="Square">Square Appointments</option>
                  <option value="Mindbody">Mindbody</option>
                  <option value="Vagaro">Vagaro</option>
                  <option value="Fresha">Fresha</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="api-key">API Key *</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={onboardingData.apiKey}
                  onChange={(e) => setOnboardingData({...onboardingData, apiKey: e.target.value})}
                  placeholder="Enter your API key"
                />
                <p className="text-sm text-muted mt-1">
                  Find your API key in your {onboardingData.bookingSoftware} dashboard under integrations.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Need help?</strong> Check our integration guide for step-by-step instructions 
                  on finding your API key.
                </p>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-heading mb-2">You're all set!</h2>
              <p className="text-body text-muted">
                Your salon is now connected and ready to start recovering revenue.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Cancellation Recovery</h3>
                <p className="text-sm text-muted">
                  Automatically enabled - we'll message clients who cancel to offer rebooking.
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Lapsed Client Reactivation</h3>
                <p className="text-sm text-muted">
                  We'll identify clients who haven't booked in 60+ days and send reactivation messages.
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted">
                Ready to start recovering lost revenue? Let's go to your dashboard!
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card>
          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card.Content className="py-12">
            {renderStepContent()}
          </Card.Content>

          {/* Navigation */}
          <Card.Footer>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  )
}

export default Onboarding