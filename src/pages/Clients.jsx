import React, { useState } from 'react'
import { Search, Filter, UserPlus, Calendar, Phone, Mail } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import DataTable from '../components/ui/DataTable'
import { useSalon } from '../contexts/SalonContext'
import { format } from 'date-fns'

const Clients = () => {
  const { clients } = useSalon()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, active, lapsed

  // Filter clients based on search and filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'lapsed' && client.isLapsed) ||
                         (filter === 'active' && !client.isLapsed)
    
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (isLapsed) => {
    if (isLapsed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Lapsed
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display">Clients</h1>
          <p className="text-body text-muted mt-2">
            Manage your client database and track engagement status.
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Card.Content>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All ({clients.length})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                onClick={() => setFilter('active')}
                size="sm"
              >
                Active ({clients.filter(c => !c.isLapsed).length})
              </Button>
              <Button
                variant={filter === 'lapsed' ? 'default' : 'outline'}
                onClick={() => setFilter('lapsed')}
                size="sm"
              >
                Lapsed ({clients.filter(c => c.isLapsed).length})
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Clients Table */}
      <Card>
        <DataTable>
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head>Client</DataTable.Head>
              <DataTable.Head>Contact</DataTable.Head>
              <DataTable.Head>Last Booking</DataTable.Head>
              <DataTable.Head>Total Bookings</DataTable.Head>
              <DataTable.Head>Status</DataTable.Head>
              <DataTable.Head>Actions</DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            {filteredClients.map((client) => (
              <DataTable.Row key={client.id}>
                <DataTable.Cell>
                  <div>
                    <div className="font-medium">{client.name}</div>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted">
                      <Mail className="h-3 w-3 mr-1" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <Phone className="h-3 w-3 mr-1" />
                      {client.phone}
                    </div>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted" />
                    {format(client.lastBookingDate, 'MMM d, yyyy')}
                  </div>
                </DataTable.Cell>
                <DataTable.Cell>
                  <span className="font-medium">{client.totalBookings}</span>
                </DataTable.Cell>
                <DataTable.Cell>
                  {getStatusBadge(client.isLapsed)}
                </DataTable.Cell>
                <DataTable.Cell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Send Message
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">No clients found</h3>
            <p className="text-muted">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first client.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Clients