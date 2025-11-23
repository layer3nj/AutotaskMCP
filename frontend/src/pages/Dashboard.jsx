import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Building2, Users, AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react';
import { checkHealth, searchTickets } from '../services/api';

const DashboardCard = ({ title, value, icon: Icon, color, link }) => (
  <Link to={link} className="block">
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  </Link>
);

const StatusAlert = ({ type, message }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[type]}`}>
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check API health
        const healthData = await checkHealth();
        setHealth(healthData);

        // Fetch recent tickets if API is configured
        if (healthData.configured) {
          const ticketsData = await searchTickets({ limit: 5 });
          setTickets(ticketsData.tickets || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Autotask Portal</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Ticket</span>
        </Link>
      </div>

      {/* API Status */}
      {health && !health.configured && (
        <StatusAlert
          type="warning"
          message="API credentials not configured. Please set environment variables to connect to Autotask."
        />
      )}

      {health && health.configured && health.status === 'healthy' && (
        <StatusAlert
          type="success"
          message="Connected to Autotask API"
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Tickets"
          value={tickets.length}
          icon={Ticket}
          color="bg-blue-500"
          link="/tickets"
        />
        <DashboardCard
          title="Open Tickets"
          value={tickets.filter(t => t.status === 1 || t.status === 5).length}
          icon={Clock}
          color="bg-yellow-500"
          link="/tickets"
        />
        <DashboardCard
          title="Companies"
          value="-"
          icon={Building2}
          color="bg-green-500"
          link="/companies"
        />
        <DashboardCard
          title="Contacts"
          value="-"
          icon={Users}
          color="bg-purple-500"
          link="/contacts"
        />
      </div>

      {/* Recent Tickets */}
      {tickets.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
            <Link to="/tickets" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
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
                    Created
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
                      {new Date(ticket.createDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tickets.length === 0 && health && health.configured && (
        <div className="card text-center py-12">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first ticket</p>
          <Link to="/tickets/new" className="btn btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Ticket</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
