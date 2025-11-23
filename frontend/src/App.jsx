import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import CreateTicketPage from './pages/CreateTicketPage';
import CompaniesPage from './pages/CompaniesPage';
import ContactsPage from './pages/ContactsPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
