import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  // Mock analytics data
  const revenueData = [
    { date: 'Jan 1', recovered: 180, potential: 300 },
    { date: 'Jan 2', recovered: 240, potential: 350 },
    { date: 'Jan 3', recovered: 320, potential: 400 },
    { date: 'Jan 4', recovered: 290, potential: 380 },
    { date: 'Jan 5', recovered: 420, potential: 500 },
    { date: 'Jan 6', recovered: 380, potential: 450 },
    { date: 'Jan 7', recovered: 460, potential: 520 }
  ]

  const engagementData = [
    { campaign: 'Cancellation Recovery', sent: 45, responses: 32, rebookings: 24 },
    { campaign: 'Lapsed Client Reactivation', sent: 38, responses: 19, rebookings: 12 },
    { campaign: 'Weekend Reminder', sent: 28, responses: 21, rebookings: 18 }
  ]

  const metrics = [
    {
      title: 'Revenue Recovered',
      value: '$2,840',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      description: 'This week vs last week'
    },
    {
      title: 'Rebooking Rate',
      value: '74%',
      change: '+5%',
      trend: 'up',
      icon: Calendar,
      description: 'Appointments successfully rebooked'
    },
    {
      title: 'Response Rate',
      value: '68%',
      change: '-2%',
      trend: 'down',
      icon: MessageSquare,
      description: 'Clients responding to messages'
    },
    {
      title: 'Client Retention',
      value: '89%',
      change: '+3%',
      trend: 'up',
      icon: Users,
      description: 'Clients returning after engagement'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display">Analytics</h1>
          <p className="text-body text-muted mt-2">
            Track your re-engagement performance and revenue recovery metrics.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === 'up'
          return (
            <Card key={index}>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted">{metric.title}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-accent mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                      )}
                      <span className={`text-sm font-medium ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">{metric.description}</p>
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${isPositive ? 'bg-accent/10' : 'bg-destructive/10'}`}>
                    <Icon className={`h-6 w-6 ${isPositive ? 'text-accent' : 'text-destructive'}`} />
                  </div>
                </div>
              </Card.Content>
            </Card>
          )
        })}
      </div>

      {/* Revenue Recovery Chart */}
      <Card>
        <Card.Header>
          <h2 className="text-heading">Revenue Recovery Trend</h2>
          <p className="text-caption">Track how much revenue you're recovering vs potential losses</p>
        </Card.Header>
        <Card.Content>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="recovered" 
                  stroke="hsl(210, 70%, 50%)" 
                  strokeWidth={2}
                  name="Revenue Recovered"
                />
                <Line 
                  type="monotone" 
                  dataKey="potential" 
                  stroke="hsl(220, 15%, 55%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Potential Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <Card.Header>
          <h2 className="text-heading">Campaign Performance</h2>
          <p className="text-caption">See how your different campaigns are performing</p>
        </Card.Header>
        <Card.Content>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="campaign" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="sent" fill="hsl(220, 15%, 55%)" name="Messages Sent" />
                <Bar dataKey="responses" fill="hsl(210, 70%, 50%)" name="Responses" />
                <Bar dataKey="rebookings" fill="hsl(160, 70%, 45%)" name="Rebookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-subheading">Top Performing Messages</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Weekend availability reminder</p>
                  <p className="text-sm text-muted">Cancellation recovery campaign</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">85% response rate</p>
                  <p className="text-sm text-muted">24 bookings</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Special offer for returning clients</p>
                  <p className="text-sm text-muted">Lapsed client reactivation</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">72% response rate</p>
                  <p className="text-sm text-muted">18 bookings</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Personal follow-up message</p>
                  <p className="text-sm text-muted">Cancellation recovery campaign</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">68% response rate</p>
                  <p className="text-sm text-muted">15 bookings</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-subheading">Client Segments</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Regular Clients (Monthly+)</p>
                  <p className="text-sm text-muted">45% of client base</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">92% retention</p>
                  <p className="text-sm text-accent">+5% this month</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Occasional Clients (Quarterly)</p>
                  <p className="text-sm text-muted">35% of client base</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">76% retention</p>
                  <p className="text-sm text-accent">+8% this month</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Lapsed Clients (90+ days)</p>
                  <p className="text-sm text-muted">20% of client base</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">34% reactivation</p>
                  <p className="text-sm text-destructive">-2% this month</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default Analytics