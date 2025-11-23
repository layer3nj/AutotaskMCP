import React, { useState, useEffect } from 'react';
import { Building2, Search } from 'lucide-react';
import { searchCompanies } from '../services/api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    company_name: '',
    limit: 20
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const data = await searchCompanies(activeFilters);
      setCompanies(data.companies || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <p className="text-gray-600 mt-1">Search and view company information</p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                className="input"
                placeholder="Search by company name"
                value={filters.company_name}
                onChange={(e) => setFilters({ ...filters, company_name: e.target.value })}
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
              onClick={() => setFilters({ company_name: '', limit: 20 })}
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
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      )}

      {/* Companies Table */}
      {!loading && !error && companies.length > 0 && (
        <div className="card">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Found {companies.length} Company(ies)
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
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      {company.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {company.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {company.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {company.city || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {company.state || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && companies.length === 0 && (
        <div className="card text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
