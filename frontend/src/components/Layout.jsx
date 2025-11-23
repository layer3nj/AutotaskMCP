import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Ticket,
  Building2,
  Users,
  UserCircle,
  Menu,
  X
} from 'lucide-react';

const Navigation = ({ className = '' }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/companies', icon: Building2, label: 'Companies' },
    { path: '/contacts', icon: Users, label: 'Contacts' },
    { path: '/resources', icon: UserCircle, label: 'Resources' },
  ];

  return (
    <nav className={className}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Ticket className="w-8 h-8 text-primary-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Autotask Portal
              </h1>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <Navigation className="px-4 py-4 space-y-2" />
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden md:block md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <Navigation className="space-y-2" />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
