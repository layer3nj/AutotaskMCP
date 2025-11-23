import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Ticket API
export const searchTickets = async (filters) => {
  const response = await api.post('/tickets/search', filters);
  return response.data;
};

export const getTicket = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

export const updateTicket = async (ticketId, updateData) => {
  const response = await api.patch(`/tickets/${ticketId}`, updateData);
  return response.data;
};

export const addTicketNote = async (ticketId, noteData) => {
  const response = await api.post(`/tickets/${ticketId}/notes`, noteData);
  return response.data;
};

// Company API
export const searchCompanies = async (filters) => {
  const response = await api.post('/companies/search', filters);
  return response.data;
};

export const getCompany = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

// Contact API
export const searchContacts = async (filters) => {
  const response = await api.post('/contacts/search', filters);
  return response.data;
};

// Resource API
export const searchResources = async (filters) => {
  const response = await api.post('/resources/search', filters);
  return response.data;
};

// Time Entry API
export const createTimeEntry = async (timeEntryData) => {
  const response = await api.post('/time-entries', timeEntryData);
  return response.data;
};

export default api;
