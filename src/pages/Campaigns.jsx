import React, { useState } from 'react'
import { Plus, MessageSquare, Users, Clock, Settings, Play, Pause } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Textarea from '../components/ui/Textarea'
import DataTable from '../components/ui/DataTable'
import { useSalon } from '../contexts/SalonContext'

const Campaigns = () => {
  const { campaigns, setCampaigns } = useSalon()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'rebooking',
    messageTemplate: '',
    triggerConditions: ''
  })

  const handleCreateCampaign = () => {
    const campaign = {
      id: (campaigns.length + 1).toString(),
      salonId: '1',
      ...newCampaign,
      status: 'active'
    }
    setCampaigns([...campaigns, campaign])
    setNewCampaign({
      name: '',
      type: 'rebooking',
      messageTemplate: '',
      triggerConditions: ''
    })
    setShowCreateForm(false)
  }

  const toggleCampaignStatus = (campaignId) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ))
  }

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Paused
      </span>
    )
  }

  const getCampaignTypeBadge = (type) => {
    if (type === 'rebooking') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Rebooking
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Reactivation
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display">Campaigns</h1>
          <p className="text-body text-muted mt-2">
            Create and manage automated re-engagement campaigns for your clients.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Active Campaigns</p>
              <p className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Messages Sent Today</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Response Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card>
          <Card.Header>
            <h2 className="text-heading">Create New Campaign</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Weekend Cancellation Recovery"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="campaign-type">Campaign Type</Label>
                <select
                  id="campaign-type"
                  className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm"
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                >
                  <option value="rebooking">Cancellation Rebooking</option>
                  <option value="reactivation">Lapsed Client Reactivation</option>
                </select>
              </div>

              <div>
                <Label htmlFor="trigger-conditions">Trigger Conditions</Label>
                <Input
                  id="trigger-conditions"
                  placeholder="e.g., appointment_cancelled, client_lapsed_60_days"
                  value={newCampaign.triggerConditions}
                  onChange={(e) => setNewCampaign({...newCampaign, triggerConditions: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="message-template">Message Template</Label>
                <Textarea
                  id="message-template"
                  placeholder="Hi {name}! We noticed you had to cancel your appointment. We have some great time slots available - would you like to reschedule?"
                  value={newCampaign.messageTemplate}
                  onChange={(e) => setNewCampaign({...newCampaign, messageTemplate: e.target.value})}
                  variant="medium"
                />
                <p className="text-sm text-muted mt-1">
                  Use {'{name}'}, {'{salon_name}'}, and other variables to personalize messages.
                </p>
              </div>
            </div>
          </Card.Content>
          <Card.Footer>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </div>
          </Card.Footer>
        </Card>
      )}

      {/* Campaigns Table */}
      <Card>
        <Card.Header>
          <h2 className="text-heading">Your Campaigns</h2>
        </Card.Header>
        <DataTable>
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head>Campaign</DataTable.Head>
              <DataTable.Head>Type</DataTable.Head>
              <DataTable.Head>Status</DataTable.Head>
              <DataTable.Head>Trigger</DataTable.Head>
              <DataTable.Head>Actions</DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            {campaigns.map((campaign) => (
              <DataTable.Row key={campaign.id}>
                <DataTable.Cell>
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted truncate max-w-xs">
                      {campaign.messageTemplate}
                    </div>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell>
                  {getCampaignTypeBadge(campaign.type)}
                </DataTable.Cell>
                <DataTable.Cell>
                  {getStatusBadge(campaign.status)}
                </DataTable.Cell>
                <DataTable.Cell>
                  <span className="text-sm">{campaign.triggerConditions}</span>
                </DataTable.Cell>
                <DataTable.Cell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCampaignStatus(campaign.id)}
                    >
                      {campaign.status === 'active' ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">No campaigns yet</h3>
            <p className="text-muted mb-4">
              Create your first campaign to start re-engaging with clients automatically.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Campaigns