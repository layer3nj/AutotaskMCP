import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, MessageSquare, Clock } from 'lucide-react';
import { getTicket, addTicketNote } from '../services/api';

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteData, setNoteData] = useState({
    title: '',
    description: '',
    note_type: 1,
    publish: 1
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTicket(id);
      setTicket(data.ticket);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTicketNote(id, noteData);
      setSubmitSuccess(true);
      setShowNoteForm(false);
      setNoteData({
        title: '',
        description: '',
        note_type: 1,
        publish: 1
      });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add note');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link to="/tickets" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tickets
        </Link>
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link to="/tickets" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tickets
        </Link>
        <div className="card text-center py-12">
          <p className="text-gray-600">Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/tickets" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tickets
        </Link>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Note added successfully!</p>
        </div>
      )}

      {/* Ticket Details Card */}
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket #{ticket.ticketNumber}
              </h1>
              {getPriorityBadge(ticket.priority)}
            </div>
            <p className="text-xl text-gray-700">{ticket.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <p className="text-gray-900">Status ID: {ticket.status}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
            <p className="text-gray-900">{getPriorityBadge(ticket.priority)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Company ID</h3>
            <p className="text-gray-900">{ticket.companyID}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contact ID</h3>
            <p className="text-gray-900">{ticket.contactID || 'None'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned Resource ID</h3>
            <p className="text-gray-900">{ticket.assignedResourceID || 'Unassigned'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Queue ID</h3>
            <p className="text-gray-900">{ticket.queueID || 'None'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created Date</h3>
            <p className="text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {new Date(ticket.createDate).toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Last Activity</h3>
            <p className="text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {ticket.lastActivityDate ? new Date(ticket.lastActivityDate).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">
              {ticket.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Add Note Form */}
      {showNoteForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Note</h2>
          <form onSubmit={handleNoteSubmit} className="space-y-4">
            <div>
              <label className="label">Note Title *</label>
              <input
                type="text"
                className="input"
                required
                value={noteData.title}
                onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="label">Note Description *</label>
              <textarea
                className="input"
                required
                rows={6}
                value={noteData.description}
                onChange={(e) => setNoteData({ ...noteData, description: e.target.value })}
                placeholder="Enter note description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Note Type</label>
                <select
                  className="input"
                  value={noteData.note_type}
                  onChange={(e) => setNoteData({ ...noteData, note_type: parseInt(e.target.value) })}
                >
                  <option value="1">General</option>
                  <option value="2">Time Entry</option>
                </select>
              </div>

              <div>
                <label className="label">Publish Level</label>
                <select
                  className="input"
                  value={noteData.publish}
                  onChange={(e) => setNoteData({ ...noteData, publish: parseInt(e.target.value) })}
                >
                  <option value="1">All Autotask Users</option>
                  <option value="2">Internal Only</option>
                  <option value="3">Internal & Co-managed</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Submit Note
              </button>
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;
