import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Mail
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import AIResponseBubble from '../components/ui/AIResponseBubble'
import { useSalon } from '../contexts/SalonContext'
import { format } from 'date-fns'

const Dashboard = () => {
  const { salon, clients, appointments, messageLogs } = useSalon()

  // Calculate metrics
  const totalClients = clients.length
  const lapsedClients = clients.filter(client => client.isLapsed).length
  const recentCancellations = appointments.filter(apt => apt.status === 'cancelled').length
  const messagesThisWeek = messageLogs.length

  const recentMessages = messageLogs.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display">Dashboard</h1>
        <p className="text-body text-muted mt-2">
          Welcome back to Salon Recovery. Here's what's happening with your client re-engagement.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Total Clients</p>
              <p className="text-2xl font-bold">{totalClients}</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-lg">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Lapsed Clients</p>
              <p className="text-2xl font-bold">{lapsedClients}</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Recent Cancellations</p>
              <p className="text-2xl font-bold">{recentCancellations}</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Messages This Week</p>
              <p className="text-2xl font-bold">{messagesThisWeek}</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* New Feature Highlight */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <Card.Content className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-block bg-primary text-white text-xs font-medium px-2.5 py-1 rounded mb-2">
                NEW FEATURE
              </div>
              <h2 className="text-heading mb-2">Automated Post-Appointment Messaging</h2>
              <p className="text-body mb-4">
                Our new messaging system automatically sends personalized follow-ups, styling tips, and rebooking reminders to your clients after their appointments.
              </p>
            </div>
            <Link to="/messaging">
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Try Messaging
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="text-heading">Quick Actions</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/campaigns">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
            </Link>
            <Link to="/messaging">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Manage Messages
              </Button>
            </Link>
            <Link to="/clients">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View All Clients
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <h2 className="text-heading">Recent AI Conversations</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              {recentMessages.length > 0 ? (
                recentMessages.map((message) => {
                  const client = clients.find(c => c.id === message.clientId)
                  return (
                    <div key={message.id} className="space-y-3">
                      <div className="text-sm text-muted border-b pb-2">
                        Conversation with {client?.name || 'Unknown Client'}
                      </div>
                      <AIResponseBubble variant="agent">
                        {message.content}
                      </AIResponseBubble>
                      {message.response && (
                        <AIResponseBubble variant="user">
                          {message.response}
                        </AIResponseBubble>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-muted text-center py-8">No recent conversations</p>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <Card.Header>
            <h2 className="text-heading">This Week's Performance</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Rebooking Rate</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <div className="flex items-center text-accent">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Revenue Recovered</p>
                  <p className="text-2xl font-bold">$1,240</p>
                </div>
                <div className="flex items-center text-accent">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Response Rate</p>
                  <p className="text-2xl font-bold">65%</p>
                </div>
                <div className="flex items-center text-destructive">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm font-medium">-3%</span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
