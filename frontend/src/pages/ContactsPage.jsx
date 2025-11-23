import React, { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { searchContacts } from '../services/api';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    company_id: '',
    email: '',
    first_name: '',
    last_name: '',
    limit: 20
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const data = await searchContacts(activeFilters);
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContacts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-600 mt-1">Search and view contact information</p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Company ID</label>
              <input
                type="number"
                className="input"
                placeholder="Filter by company ID"
                value={filters.company_id}
                onChange={(e) => setFilters({ ...filters, company_id: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Search by email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
            </div>

            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                className="input"
                placeholder="Search by first name"
                value={filters.first_name}
                onChange={(e) => setFilters({ ...filters, first_name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                className="input"
                placeholder="Search by last name"
                value={filters.last_name}
                onChange={(e) => setFilters({ ...filters, last_name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Limit</label>
              <select
                className="input"
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
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
              onClick={() => setFilters({ company_id: '', email: '', first_name: '', last_name: '', limit: 20 })}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      )}

      {/* Contacts Table */}
      {!loading && !error && contacts.length > 0 && (
        <div className="card">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Found {contacts.length} Contact(s)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      {contact.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.emailAddress || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contact.phone || contact.mobilePhone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contact.companyID}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && contacts.length === 0 && (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
