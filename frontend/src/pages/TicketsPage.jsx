import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Plus, Search, Filter } from 'lucide-react';
import { searchTickets } from '../services/api';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    company_id: '',
    status: '',
    assigned_resource_id: '',
    limit: 20
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filter object, only include non-empty values
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const data = await searchTickets(activeFilters);
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      1: 'badge badge-blue',
      2: 'badge badge-green',
      3: 'badge badge-yellow',
      4: 'badge badge-red',
    };
    const labels = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Critical',
    };
    return <span className={badges[priority] || 'badge badge-gray'}>{labels[priority] || 'Unknown'}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-1">Manage and track support tickets</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Ticket</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Company ID</label>
              <input
                type="number"
                className="input"
                placeholder="Enter company ID"
                value={filters.company_id}
                onChange={(e) => handleFilterChange('company_id', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="1">New</option>
                <option value="5">In Progress</option>
                <option value="8">Waiting Customer</option>
                <option value="13">Waiting Vendor</option>
              </select>
            </div>

            <div>
              <label className="label">Assigned Resource ID</label>
              <input
                type="number"
                className="input"
                placeholder="Enter resource ID"
                value={filters.assigned_resource_id}
                onChange={(e) => handleFilterChange('assigned_resource_id', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Limit</label>
              <select
                className="input"
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setFilters({
                  company_id: '',
                  status: '',
                  assigned_resource_id: '',
                  limit: 20
                });
              }}
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      )}

      {/* Tickets Table */}
      {!loading && !error && tickets.length > 0 && (
        <div className="card">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Found {tickets.length} Ticket(s)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      <Link to={`/tickets/${ticket.id}`}>#{ticket.ticketNumber}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Status: {ticket.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ticket.companyID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(ticket.createDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tickets.length === 0 && (
        <div className="card text-center py-12">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or create a new ticket</p>
          <Link to="/tickets/new" className="btn btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Ticket</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
