import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { createTicket } from '../services/api';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    company_name: '',
    priority: 2,
    status: 1,
    contact_email: '',
    contact_name: '',
    assigned_resource_email: '',
    assigned_resource_name: '',
    queue_id: '',
    due_date_time: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least company_id or company_name is provided
    if (!formData.company_id && !formData.company_name) {
      setError('Please provide either Company ID or Company Name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build submission data, excluding empty fields
      const submitData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const result = await createTicket(submitData);

      // Navigate to the created ticket
      if (result.ticket_id) {
        navigate(`/tickets/${result.ticket_id}`);
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/tickets" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tickets
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Ticket</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new ticket</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                className="input"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter ticket title"
              />
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                className="input"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the issue or request"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Priority</label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                >
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                  <option value="4">Critical</option>
                </select>
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => handleChange('status', parseInt(e.target.value))}
                >
                  <option value="1">New</option>
                  <option value="5">In Progress</option>
                  <option value="8">Waiting Customer</option>
                  <option value="13">Waiting Vendor</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
          <p className="text-sm text-gray-600 mb-4">
            Provide either Company ID or Company Name (at least one is required)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Company ID</label>
              <input
                type="number"
                className="input"
                value={formData.company_id}
                onChange={(e) => handleChange('company_id', e.target.value)}
                placeholder="Enter company ID"
              />
            </div>

            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                className="input"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </div>
        </div>

        {/* Contact Information (Optional) */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Contact Email</label>
              <input
                type="email"
                className="input"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="label">Contact Name</label>
              <input
                type="text"
                className="input"
                value={formData.contact_name}
                onChange={(e) => handleChange('contact_name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>
        </div>

        {/* Assignment Information (Optional) */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assignment (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Assigned Resource Email</label>
              <input
                type="email"
                className="input"
                value={formData.assigned_resource_email}
                onChange={(e) => handleChange('assigned_resource_email', e.target.value)}
                placeholder="assignee@example.com"
              />
            </div>

            <div>
              <label className="label">Assigned Resource Name</label>
              <input
                type="text"
                className="input"
                value={formData.assigned_resource_name}
                onChange={(e) => handleChange('assigned_resource_name', e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
          </div>
        </div>

        {/* Additional Information (Optional) */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Queue ID</label>
              <input
                type="number"
                className="input"
                value={formData.queue_id}
                onChange={(e) => handleChange('queue_id', e.target.value)}
                placeholder="Enter queue ID"
              />
            </div>

            <div>
              <label className="label">Due Date/Time</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.due_date_time}
                onChange={(e) => handleChange('due_date_time', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="card">
          <div className="flex space-x-3">
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
            <Link to="/tickets" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketPage;
